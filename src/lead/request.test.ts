import { describe, expect, it } from "vitest";
import { SPACE_TYPES, WORKS } from "./catalog";
import { CONCELHOS } from "./concelhos";
import {
  contactIssues,
  createRequest,
  firstIncompleteStepBefore,
  isValidPhone,
  parseSubmission,
  reduceRequest,
  spaceName,
  stepIssues,
  summarize,
  type Contact,
  type LeadRequest,
  type RequestAction,
} from "./request";

const run = (actions: RequestAction[], start: LeadRequest = createRequest()) => actions.reduce(reduceRequest, start);

const validContact: Contact = {
  name: "Ana Silva",
  email: "ana@example.pt",
  phone: "912 345 678",
  municipality: "Lisboa",
  acceptedTerms: true,
};

function completeRequest(): LeadRequest {
  let request = run([
    { type: "setSpaceCount", spaceType: "quarto", count: 2 },
    { type: "setSpaceCount", spaceType: "cozinha", count: 1 },
    { type: "setWorkSelected", workId: "pavimento", selected: true },
    { type: "updateWork", workId: "pavimento", patch: { quality: "medio" } },
    { type: "setWorkSelected", workId: "janelas", selected: true },
    { type: "updateWork", workId: "janelas", patch: { quantity: 3 } },
    { type: "setUrgency", urgency: "medio" },
  ]);
  // Spaces are kept in catalog order: cozinha, quarto 1, quarto 2.
  const [cozinha, quarto1, quarto2] = request.spaces;
  request = run(
    [
      { type: "setSize", spaceId: cozinha.id, size: { kind: "range", rangeId: "ate-10" } },
      { type: "setSize", spaceId: quarto1.id, size: { kind: "custom", squareMeters: 14.5 } },
      { type: "setSize", spaceId: quarto2.id, size: { kind: "range", rangeId: "10-20" } },
    ],
    request,
  );
  return request;
}

describe("catalog", () => {
  it("has unique ids", () => {
    expect(new Set(SPACE_TYPES.map((s) => s.id)).size).toBe(SPACE_TYPES.length);
    expect(new Set(WORKS.map((w) => w.id)).size).toBe(WORKS.length);
  });

  it("lists the 308 municipalities once each", () => {
    expect(CONCELHOS).toHaveLength(308);
    expect(new Set(CONCELHOS).size).toBe(308);
  });
});

describe("spaces", () => {
  it("adds and removes spaces of a type, keeping them grouped in catalog order", () => {
    const request = run([
      { type: "setSpaceCount", spaceType: "quarto", count: 1 },
      { type: "setSpaceCount", spaceType: "sala", count: 1 },
      { type: "setSpaceCount", spaceType: "quarto", count: 3 },
    ]);
    expect(request.spaces.map((s) => s.type)).toEqual(["sala", "quarto", "quarto", "quarto"]);
    expect(request.spaces.map((s) => spaceName(request, s))).toEqual(["Sala", "Quarto 1", "Quarto 2", "Quarto 3"]);

    const fewer = run([{ type: "setSpaceCount", spaceType: "quarto", count: 1 }], request);
    expect(fewer.spaces.map((s) => s.id)).toEqual(request.spaces.slice(0, 2).map((s) => s.id));
  });

  it("caps the count per type", () => {
    const request = run([{ type: "setSpaceCount", spaceType: "quarto", count: 50 }]);
    expect(request.spaces).toHaveLength(9);
  });
});

describe("steps", () => {
  it("requires a size for every space and a valid custom area", () => {
    let request = run([{ type: "setSpaceCount", spaceType: "sala", count: 1 }]);
    expect(stepIssues(request, "areas")).toHaveLength(1);
    const id = request.spaces[0].id;
    request = run([{ type: "setSize", spaceId: id, size: { kind: "custom", squareMeters: null } }], request);
    expect(stepIssues(request, "areas")[0].message).toMatch(/m²/);
    request = run([{ type: "setSize", spaceId: id, size: { kind: "custom", squareMeters: 0 } }], request);
    expect(stepIssues(request, "areas")).toHaveLength(1);
    request = run([{ type: "setSize", spaceId: id, size: { kind: "custom", squareMeters: 32 } }], request);
    expect(stepIssues(request, "areas")).toEqual([]);
  });

  it("requires quality, quantity or details where the work asks for them", () => {
    let request = run([
      { type: "setWorkSelected", workId: "bancada", selected: true },
      { type: "setWorkSelected", workId: "janelas", selected: true },
      { type: "setWorkSelected", workId: "outro", selected: true },
      { type: "setWorkSelected", workId: "eletricidade", selected: true },
    ]);
    expect(stepIssues(request, "trabalhos").map((i) => i.target)).toEqual(["bancada", "janelas", "outro"]);
    request = run(
      [
        { type: "updateWork", workId: "bancada", patch: { quality: "premium" } },
        { type: "updateWork", workId: "janelas", patch: { quantity: 4 } },
        { type: "updateWork", workId: "outro", patch: { details: "Varanda fechada" } },
      ],
      request,
    );
    expect(stepIssues(request, "trabalhos")).toEqual([]);
  });

  it("points to the first earlier step that is incomplete", () => {
    const empty = createRequest();
    expect(firstIncompleteStepBefore(empty, "espacos")).toBeNull();
    expect(firstIncompleteStepBefore(empty, "trabalhos")?.id).toBe("espacos");
    expect(firstIncompleteStepBefore(completeRequest(), "contactos")).toBeNull();
  });
});

describe("contact", () => {
  it("accepts Portuguese and international phone numbers", () => {
    expect(isValidPhone("912 345 678")).toBe(true);
    expect(isValidPhone("+351 212 345 678")).toBe(true);
    expect(isValidPhone("00351912345678")).toBe(true);
    expect(isValidPhone("+44 20 7946 0958")).toBe(true);
    expect(isValidPhone("812345678")).toBe(false);
    expect(isValidPhone("91234567")).toBe(false);
  });

  it("requires every field and the terms", () => {
    expect(contactIssues(validContact)).toEqual({});
    const issues = contactIssues({ name: "", email: "x", phone: "1", municipality: "", acceptedTerms: false });
    expect(Object.keys(issues).sort()).toEqual(["acceptedTerms", "email", "municipality", "name", "phone"]);
  });
});

describe("parseSubmission", () => {
  it("accepts a complete submission and keeps only known fields", () => {
    const request = completeRequest();
    const body = JSON.parse(JSON.stringify({ request: { ...request, extra: "x" }, contact: validContact }));
    const result = parseSubmission(body);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.submission.request).toEqual(request);
    expect(summarize(result.submission)).toContain("Pavimento (Médio)");
    expect(summarize(result.submission)).toContain("Quarto 1: 14,5 m²");
  });

  it("rejects incomplete or malformed submissions", () => {
    expect(parseSubmission(null).ok).toBe(false);
    expect(parseSubmission({ request: createRequest(), contact: validContact }).ok).toBe(false);
    const request = completeRequest();
    expect(parseSubmission({ request, contact: { ...validContact, acceptedTerms: "yes" } }).ok).toBe(false);
    expect(parseSubmission({ request: { ...request, id: "not-a-uuid" }, contact: validContact }).ok).toBe(false);
    const unknownWork = { ...request, works: [{ workId: "piscina", quality: null, quantity: null, details: "" }] };
    expect(parseSubmission({ request: unknownWork, contact: validContact }).ok).toBe(false);
  });
});
