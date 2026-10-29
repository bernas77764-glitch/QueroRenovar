import { describe, expect, it } from "vitest";
import { createRequest, reduceRequest, type Contact } from "./request";
import { referenceFor, saveLead, type PedidosStore } from "./store";

function memoryStore() {
  const data = new Map<string, { value: string; metadata?: unknown }>();
  const store: PedidosStore = {
    get: async (key) => data.get(key)?.value ?? null,
    put: async (key, value, options) => void data.set(key, { value, metadata: options?.metadata }),
  };
  return { store, data };
}

const contact: Contact = {
  name: "Rui Costa",
  email: "rui@example.pt",
  phone: "+351 963 000 111",
  district: "Porto",
  municipality: "Porto",
  acceptedTerms: true,
};

function completeRequest() {
  let request = reduceRequest(createRequest(), { type: "setSpaceCount", spaceType: "casa-de-banho", count: 1 });
  request = reduceRequest(request, {
    type: "setSize",
    spaceId: request.spaces[0].id,
    size: { kind: "range", rangeId: "ate-10" },
  });
  request = reduceRequest(request, { type: "setWorkSelected", workId: "canalizacao", selected: true });
  return reduceRequest(request, { type: "setUrgency", urgency: "imediato" });
}

describe("saveLead", () => {
  it("stores a valid submission once, with a stable reference", async () => {
    const { store, data } = memoryStore();
    const request = completeRequest();
    const first = await saveLead(store, { request, contact }, new Date("2026-10-29T10:00:00Z"));
    expect(first).toEqual({ ok: true, reference: referenceFor(request.id) });
    expect(data.size).toBe(1);

    const stored = data.get(`pedido:${request.id}`)!;
    const lead = JSON.parse(stored.value);
    expect(lead.receivedAt).toBe("2026-10-29T10:00:00.000Z");
    expect(lead.contact.acceptedTerms).toBe(true);
    expect(lead.summary).toContain("Concelho: Porto");
    expect(stored.metadata).toMatchObject({ name: "Rui Costa", district: "Porto", municipality: "Porto", urgency: "imediato" });

    const retry = await saveLead(store, { request, contact }, new Date("2026-10-29T10:05:00Z"));
    expect(retry).toEqual(first);
    expect(JSON.parse(data.get(`pedido:${request.id}`)!.value).receivedAt).toBe("2026-10-29T10:00:00.000Z");
  });

  it("rejects an invalid submission without storing it", async () => {
    const { store, data } = memoryStore();
    const result = await saveLead(store, { request: completeRequest(), contact: { ...contact, acceptedTerms: false } });
    expect(result.ok).toBe(false);
    expect(data.size).toBe(0);
  });
});
