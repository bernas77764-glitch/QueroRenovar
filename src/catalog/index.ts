import { PROJECT_WORKS } from "./project-works";
import { QUESTIONS } from "./questions";
import { ROOM_TYPES } from "./rooms";
import { SPECIALTIES } from "./specialties";
import type { AreaRange, ProjectWork, Question, RoomType, RoomTypeId, Specialty, Work } from "./types";
import { EXTRA_WORK_IDS, WORKS } from "./works";

export * from "./types";
export { PROJECT_WORKS, QUESTIONS, ROOM_TYPES, SPECIALTIES, WORKS, EXTRA_WORK_IDS };
export { WHOLE_HOUSE_ROOM_TYPES } from "./rooms";

/** Bump when the catalog changes in a way that affects stored estimates. */
export const CATALOG_VERSION = "2026-10-28.1";

const roomTypes = new Map(ROOM_TYPES.map((r) => [r.id, r]));
const works = new Map(WORKS.map((w) => [w.id, w]));
const questions = new Map(QUESTIONS.map((q) => [q.id, q]));
const projectWorks = new Map(PROJECT_WORKS.map((w) => [w.id, w]));
const specialties = new Map(SPECIALTIES.map((s) => [s.id, s]));

function required<T>(map: Map<string, T>, id: string, kind: string): T {
  const value = map.get(id);
  if (!value) throw new Error(`Catálogo: ${kind} desconhecido "${id}"`);
  return value;
}

export const getRoomType = (id: RoomTypeId): RoomType => required(roomTypes, id, "tipo de divisão");
export const getWork = (id: string): Work => required(works, id, "trabalho");
export const getQuestion = (id: string): Question => required(questions, id, "pergunta");
export const getProjectWork = (id: string): ProjectWork => required(projectWorks, id, "trabalho comum");
export const getSpecialty = (id: string): Specialty => required(specialties, id, "especialidade");

export interface RoomWorkOption {
  work: Work;
  /** Label to show in this room type (room override or the work's own label). */
  label: string;
}

/** Works offered in a room type, in display order, followed by the generic extras. */
export function worksForRoomType(type: RoomTypeId): RoomWorkOption[] {
  const roomType = getRoomType(type);
  const own = roomType.works.map(({ workId, label }) => {
    const work = getWork(workId);
    return { work, label: label ?? work.label };
  });
  const extras = EXTRA_WORK_IDS.map((id) => {
    const work = getWork(id);
    return { work, label: work.label };
  });
  return [...own, ...extras];
}

export function workLabelInRoom(type: RoomTypeId, workId: string): string {
  const override = getRoomType(type).works.find((w) => w.workId === workId)?.label;
  return override ?? getWork(workId).label;
}

export function areaRangeLabel(range: AreaRange): string {
  if (range.max === null) return `Mais de ${range.min} m²`;
  if (range.min === 0) return `Até ${range.max} m²`;
  return `Mais de ${range.min} até ${range.max} m²`;
}

export function getAreaRange(type: RoomTypeId, rangeId: string): AreaRange | undefined {
  return getRoomType(type).areaRanges.find((r) => r.id === rangeId);
}

/**
 * Checks referential integrity and the area-range rules. Returns a list of
 * problems; empty when the catalog is consistent. Runs in development on load
 * and in the test suite so a broken catalog fails loudly.
 */
export function validateCatalog(): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  const duplicate = (kind: string, id: string) => {
    const key = `${kind}:${id}`;
    if (seen.has(key)) problems.push(`${kind} duplicado: "${id}"`);
    seen.add(key);
  };

  for (const w of WORKS) {
    duplicate("trabalho", w.id);
    for (const q of w.questions) if (!questions.has(q)) problems.push(`Trabalho "${w.id}": pergunta desconhecida "${q}"`);
    for (const s of w.specialties) if (!specialties.has(s)) problems.push(`Trabalho "${w.id}": especialidade desconhecida "${s}"`);
    for (const i of w.implies ?? []) {
      if (!works.has(i)) problems.push(`Trabalho "${w.id}": dependência desconhecida "${i}"`);
      if (i === w.id) problems.push(`Trabalho "${w.id}" implica-se a si próprio`);
    }
    if (w.unit === "avaliacao" && !w.requiresAssessment) {
      problems.push(`Trabalho "${w.id}": unidade "avaliacao" exige requiresAssessment`);
    }
  }
  for (const q of QUESTIONS) {
    duplicate("pergunta", q.id);
    if (q.kind === "single") {
      if (q.options.length < 2) problems.push(`Pergunta "${q.id}": precisa de pelo menos duas opções`);
      const ids = new Set<string>();
      for (const o of q.options) {
        if (ids.has(o.id)) problems.push(`Pergunta "${q.id}": opção duplicada "${o.id}"`);
        ids.add(o.id);
      }
    } else if (!(q.min < q.max)) {
      problems.push(`Pergunta "${q.id}": min deve ser inferior a max`);
    }
  }
  for (const pw of PROJECT_WORKS) {
    duplicate("trabalho comum", pw.id);
    for (const c of pw.covers) if (!works.has(c)) problems.push(`Trabalho comum "${pw.id}": cobre trabalho desconhecido "${c}"`);
    for (const s of pw.specialties) if (!specialties.has(s)) problems.push(`Trabalho comum "${pw.id}": especialidade desconhecida "${s}"`);
  }
  for (const s of SPECIALTIES) duplicate("especialidade", s.id);
  for (const id of EXTRA_WORK_IDS) if (!works.has(id)) problems.push(`Trabalho extra desconhecido "${id}"`);

  for (const r of ROOM_TYPES) {
    duplicate("tipo de divisão", r.id);
    const workIds = new Set<string>();
    for (const ref of r.works) {
      if (!works.has(ref.workId)) problems.push(`Divisão "${r.id}": trabalho desconhecido "${ref.workId}"`);
      if (workIds.has(ref.workId)) problems.push(`Divisão "${r.id}": trabalho repetido "${ref.workId}"`);
      workIds.add(ref.workId);
    }
    // Ranges must be contiguous, non-overlapping, start at 0 and end open.
    const ranges = r.areaRanges;
    if (ranges.length === 0) problems.push(`Divisão "${r.id}": sem intervalos de área`);
    ranges.forEach((range, i) => {
      const expectedMin = i === 0 ? 0 : ranges[i - 1].max;
      if (range.min !== expectedMin) {
        problems.push(`Divisão "${r.id}": intervalo "${range.id}" começa em ${range.min}, esperado ${expectedMin}`);
      }
      if (range.max !== null && range.max <= range.min) {
        problems.push(`Divisão "${r.id}": intervalo "${range.id}" tem max <= min`);
      }
      if (range.max === null && i !== ranges.length - 1) {
        problems.push(`Divisão "${r.id}": só o último intervalo pode ser aberto`);
      }
    });
    if (ranges.length && ranges[ranges.length - 1].max !== null) {
      problems.push(`Divisão "${r.id}": o último intervalo deve ser aberto ("mais de")`);
    }
  }
  return problems;
}

if (process.env.NODE_ENV !== "production") {
  const problems = validateCatalog();
  if (problems.length) throw new Error(`Catálogo inválido:\n- ${problems.join("\n- ")}`);
}
