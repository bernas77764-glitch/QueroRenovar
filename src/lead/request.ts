import {
  CUSTOM_SIZE_MAX,
  CUSTOM_SIZE_MIN,
  getSpaceType,
  getWork,
  isQualityId,
  isSizeRangeId,
  isSpaceTypeId,
  isUrgencyId,
  MAX_SPACES_PER_TYPE,
  QUALITY_LEVELS,
  SIZE_RANGES,
  SPACE_TYPES,
  URGENCY_LEVELS,
  type QualityId,
  type SizeRangeId,
  type SpaceTypeId,
  type UrgencyId,
} from "./catalog";

/*
 * The client's request and the pure operations on it. The same validation runs
 * in the browser (to guide the client step by step) and on the server (before
 * a request is stored), so the two can never disagree.
 */

export type SpaceSize = { kind: "range"; rangeId: SizeRangeId } | { kind: "custom"; squareMeters: number | null };

export interface Space {
  id: string;
  type: SpaceTypeId;
  size: SpaceSize | null;
}

export interface SelectedWork {
  workId: string;
  quality: QualityId | null;
  quantity: number | null;
  details: string;
}

export interface LeadRequest {
  schemaVersion: 1;
  id: string;
  createdAt: string;
  updatedAt: string;
  spaces: Space[];
  works: SelectedWork[];
  notes: string;
  urgency: UrgencyId | null;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
  municipality: string;
  acceptedTerms: boolean;
}

export const NOTES_MAX = 1000;
export const DETAILS_MAX = 500;

const newId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

export function createRequest(): LeadRequest {
  const timestamp = now();
  return {
    schemaVersion: 1,
    id: newId(),
    createdAt: timestamp,
    updatedAt: timestamp,
    spaces: [],
    works: [],
    notes: "",
    urgency: null,
  };
}

// ---------------------------------------------------------------------------
// Reading the request

export function countSpacesOfType(request: LeadRequest, type: SpaceTypeId): number {
  return request.spaces.filter((s) => s.type === type).length;
}

/** "Quarto 2" when there are several of the same type, "Quarto" otherwise. */
export function spaceName(request: LeadRequest, space: Space): string {
  const label = getSpaceType(space.type)?.label ?? space.type;
  const sameType = request.spaces.filter((s) => s.type === space.type);
  if (sameType.length === 1) return label;
  return `${label} ${sameType.findIndex((s) => s.id === space.id) + 1}`;
}

export function describeSize(size: SpaceSize | null): string {
  if (size === null) return "Área por indicar";
  if (size.kind === "range") return SIZE_RANGES.find((r) => r.id === size.rangeId)?.label ?? "Área por indicar";
  return size.squareMeters === null ? "Área por indicar" : `${formatNumber(size.squareMeters)} m²`;
}

export function describeWork(work: SelectedWork): string {
  const label = getWork(work.workId)?.label ?? work.workId;
  const parts: string[] = [];
  if (work.quality) parts.push(QUALITY_LEVELS.find((q) => q.id === work.quality)?.label ?? work.quality);
  if (work.quantity !== null) parts.push(`${work.quantity} un.`);
  if (work.details.trim()) parts.push(work.details.trim());
  return parts.length ? `${label} (${parts.join(" · ")})` : label;
}

export function describeUrgency(urgency: UrgencyId | null): string {
  const level = URGENCY_LEVELS.find((u) => u.id === urgency);
  return level ? `${level.label}: ${level.description.toLowerCase()}` : "Por indicar";
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 1 }).format(value);
}

// ---------------------------------------------------------------------------
// Steps and validation

export const STEPS = [
  { id: "espacos", label: "Espaços", path: "/pedido/espacos" },
  { id: "areas", label: "Áreas", path: "/pedido/areas" },
  { id: "trabalhos", label: "Trabalhos", path: "/pedido/trabalhos" },
  { id: "urgencia", label: "Urgência", path: "/pedido/urgencia" },
  { id: "contactos", label: "Contactos", path: "/pedido/contactos" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

export interface Issue {
  /** Id of the space or work the issue is about, when there is one. */
  target?: string;
  message: string;
}

export function sizeIssue(size: SpaceSize | null): string | null {
  if (size === null) return "Escolha a área aproximada.";
  if (size.kind === "custom") {
    const m2 = size.squareMeters;
    if (m2 === null || !Number.isFinite(m2)) return "Indique a área em m².";
    if (m2 < CUSTOM_SIZE_MIN || m2 > CUSTOM_SIZE_MAX) {
      return `Indique uma área entre ${CUSTOM_SIZE_MIN} e ${formatNumber(CUSTOM_SIZE_MAX)} m².`;
    }
  }
  return null;
}

export function workIssue(work: SelectedWork): string | null {
  const def = getWork(work.workId);
  if (!def) return "Trabalho desconhecido.";
  if (def.quality && work.quality === null) return "Escolha o nível de qualidade.";
  if (def.quantity) {
    const q = work.quantity;
    if (q === null || !Number.isInteger(q) || q < 1 || q > def.quantity.max) {
      return `Indique uma quantidade entre 1 e ${def.quantity.max}.`;
    }
  }
  if (def.details && work.details.trim() === "") return "Descreva o trabalho.";
  return null;
}

/** What still blocks a step. Only the step's own answers are checked. */
export function stepIssues(request: LeadRequest, step: StepId): Issue[] {
  switch (step) {
    case "espacos":
      return request.spaces.length === 0 ? [{ message: "Escolha pelo menos um espaço." }] : [];
    case "areas":
      return request.spaces.flatMap((space) => {
        const message = sizeIssue(space.size);
        return message ? [{ target: space.id, message: `${spaceName(request, space)}: ${message}` }] : [];
      });
    case "trabalhos": {
      if (request.works.length === 0) return [{ message: "Escolha pelo menos um trabalho." }];
      return request.works.flatMap((work) => {
        const message = workIssue(work);
        return message ? [{ target: work.workId, message: `${getWork(work.workId)?.label}: ${message}` }] : [];
      });
    }
    case "urgencia":
      return request.urgency === null ? [{ message: "Escolha o nível de urgência." }] : [];
    case "contactos":
      return [];
  }
}

/** The first step with issues before `step`, so a step is never shown before the ones it depends on. */
export function firstIncompleteStepBefore(request: LeadRequest, step: StepId): (typeof STEPS)[number] | null {
  for (const s of STEPS) {
    if (s.id === step) return null;
    if (stepIssues(request, s.id).length > 0) return s;
  }
  return null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Portuguese numbers (9 digits starting with 2, 3 or 9, optionally +351) or any international +number. */
export function normalizePhone(phone: string): string {
  return phone.replace(/[\s().-]/g, "").replace(/^00/, "+");
}

export function isValidPhone(phone: string): boolean {
  const p = normalizePhone(phone);
  return /^(\+351)?[239]\d{8}$/.test(p) || /^\+(?!351)\d{8,15}$/.test(p);
}

export type ContactField = keyof Contact;

export function contactIssues(contact: Contact): Partial<Record<ContactField, string>> {
  const issues: Partial<Record<ContactField, string>> = {};
  const name = contact.name.trim();
  if (name.length < 2) issues.name = "Indique o seu nome.";
  else if (name.length > 100) issues.name = "O nome é demasiado longo.";
  if (!EMAIL_PATTERN.test(contact.email.trim()) || contact.email.length > 200) issues.email = "Indique um email válido.";
  if (!isValidPhone(contact.phone)) issues.phone = "Indique um número de telefone válido, por exemplo 912 345 678.";
  const municipality = contact.municipality.trim();
  if (municipality.length < 2) issues.municipality = "Indique o concelho onde será feita a obra.";
  else if (municipality.length > 80) issues.municipality = "O concelho é demasiado longo.";
  if (!contact.acceptedTerms) issues.acceptedTerms = "Para receber propostas tem de aceitar os Termos e Condições.";
  return issues;
}

// ---------------------------------------------------------------------------
// Changing the request

export type RequestAction =
  | { type: "setSpaceCount"; spaceType: SpaceTypeId; count: number }
  | { type: "setSize"; spaceId: string; size: SpaceSize | null }
  | { type: "setWorkSelected"; workId: string; selected: boolean }
  | { type: "updateWork"; workId: string; patch: Partial<Omit<SelectedWork, "workId">> }
  | { type: "setNotes"; notes: string }
  | { type: "setUrgency"; urgency: UrgencyId }
  | { type: "reset" };

export function reduceRequest(request: LeadRequest, action: RequestAction): LeadRequest {
  const next = apply(request, action);
  return next === request ? request : { ...next, updatedAt: now() };
}

function apply(request: LeadRequest, action: RequestAction): LeadRequest {
  switch (action.type) {
    case "setSpaceCount": {
      const count = Math.max(0, Math.min(MAX_SPACES_PER_TYPE, Math.trunc(action.count)));
      const current = countSpacesOfType(request, action.spaceType);
      if (count === current) return request;
      if (count > current) {
        const added = Array.from({ length: count - current }, () => ({
          id: newId(),
          type: action.spaceType,
          size: null,
        }));
        // Keep spaces grouped by type, in catalog order, so "Quarto 1, Quarto 2" read together.
        const spaces = [...request.spaces, ...added];
        const order = SPACE_TYPES.map((t) => t.id);
        spaces.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
        return { ...request, spaces };
      }
      // Remove the last spaces of that type.
      let toRemove = current - count;
      const spaces = [...request.spaces];
      for (let i = spaces.length - 1; i >= 0 && toRemove > 0; i--) {
        if (spaces[i].type === action.spaceType) {
          spaces.splice(i, 1);
          toRemove--;
        }
      }
      return { ...request, spaces };
    }
    case "setSize": {
      const index = request.spaces.findIndex((s) => s.id === action.spaceId);
      if (index === -1) return request;
      const spaces = [...request.spaces];
      spaces[index] = { ...spaces[index], size: action.size };
      return { ...request, spaces };
    }
    case "setWorkSelected": {
      const has = request.works.some((w) => w.workId === action.workId);
      if (action.selected === has || !getWork(action.workId)) return request;
      const works = action.selected
        ? [...request.works, { workId: action.workId, quality: null, quantity: null, details: "" }]
        : request.works.filter((w) => w.workId !== action.workId);
      return { ...request, works };
    }
    case "updateWork": {
      if (!request.works.some((w) => w.workId === action.workId)) return request;
      return {
        ...request,
        works: request.works.map((w) => (w.workId === action.workId ? { ...w, ...action.patch } : w)),
      };
    }
    case "setNotes":
      return { ...request, notes: action.notes };
    case "setUrgency":
      return request.urgency === action.urgency ? request : { ...request, urgency: action.urgency };
    case "reset":
      return createRequest();
  }
}

// ---------------------------------------------------------------------------
// Submission

export interface Submission {
  request: LeadRequest;
  contact: Contact;
}

export type ParseResult = { ok: true; submission: Submission } | { ok: false; errors: string[] };

const str = (value: unknown, max: number): string => (typeof value === "string" ? value.slice(0, max) : "");
const num = (value: unknown): number | null => (typeof value === "number" && Number.isFinite(value) ? value : null);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Rebuilds a submission from untrusted JSON, keeping only known fields, then
 * validates it with the same rules the browser uses.
 */
export function parseSubmission(body: unknown): ParseResult {
  const root = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const r = (typeof root.request === "object" && root.request !== null ? root.request : {}) as Record<string, unknown>;
  const c = (typeof root.contact === "object" && root.contact !== null ? root.contact : {}) as Record<string, unknown>;
  const errors: string[] = [];

  const id = str(r.id, 64);
  if (!UUID_PATTERN.test(id)) errors.push("Identificador do pedido inválido.");

  const spaces: Space[] = [];
  for (const raw of Array.isArray(r.spaces) ? r.spaces.slice(0, SPACE_TYPES.length * MAX_SPACES_PER_TYPE) : []) {
    const s = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
    if (!isSpaceTypeId(s.type)) {
      errors.push("Espaço desconhecido.");
      continue;
    }
    const sz = (typeof s.size === "object" && s.size !== null ? s.size : null) as Record<string, unknown> | null;
    let size: SpaceSize | null = null;
    if (sz?.kind === "range" && isSizeRangeId(sz.rangeId)) size = { kind: "range", rangeId: sz.rangeId };
    else if (sz?.kind === "custom") size = { kind: "custom", squareMeters: num(sz.squareMeters) };
    spaces.push({ id: str(s.id, 64) || newId(), type: s.type, size });
  }
  for (const t of SPACE_TYPES) {
    if (spaces.filter((s) => s.type === t.id).length > MAX_SPACES_PER_TYPE) errors.push(`Demasiados espaços: ${t.label}.`);
  }

  const works: SelectedWork[] = [];
  for (const raw of Array.isArray(r.works) ? r.works.slice(0, 50) : []) {
    const w = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
    const workId = str(w.workId, 64);
    if (!getWork(workId)) {
      errors.push("Trabalho desconhecido.");
      continue;
    }
    if (works.some((x) => x.workId === workId)) continue;
    works.push({
      workId,
      quality: isQualityId(w.quality) ? w.quality : null,
      quantity: num(w.quantity),
      details: str(w.details, DETAILS_MAX),
    });
  }

  const request: LeadRequest = {
    schemaVersion: 1,
    id,
    createdAt: str(r.createdAt, 40),
    updatedAt: str(r.updatedAt, 40),
    spaces,
    works,
    notes: str(r.notes, NOTES_MAX),
    urgency: isUrgencyId(r.urgency) ? r.urgency : null,
  };
  const contact: Contact = {
    name: str(c.name, 200),
    email: str(c.email, 300),
    phone: str(c.phone, 40),
    municipality: str(c.municipality, 200),
    acceptedTerms: c.acceptedTerms === true,
  };

  for (const step of STEPS) for (const issue of stepIssues(request, step.id)) errors.push(issue.message);
  errors.push(...Object.values(contactIssues(contact)));

  return errors.length ? { ok: false, errors } : { ok: true, submission: { request, contact } };
}

/** Plain-text summary stored with each request, readable without the app. */
export function summarize({ request, contact }: Submission): string {
  const lines = [
    `Nome: ${contact.name.trim()}`,
    `Email: ${contact.email.trim()}`,
    `Telefone: ${contact.phone.trim()}`,
    `Concelho: ${contact.municipality.trim()}`,
    `Urgência: ${describeUrgency(request.urgency)}`,
    "",
    "Espaços:",
    ...request.spaces.map((s) => `- ${spaceName(request, s)}: ${describeSize(s.size)}`),
    "",
    "Trabalhos:",
    ...request.works.map((w) => `- ${describeWork(w)}`),
  ];
  if (request.notes.trim()) lines.push("", `Observações: ${request.notes.trim()}`);
  return lines.join("\n");
}
