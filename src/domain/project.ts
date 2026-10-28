import {
  getAreaRange,
  getProjectWork,
  getQuestion,
  getRoomType,
  getWork,
  areaRangeLabel,
  workLabelInRoom,
  worksForRoomType,
  WHOLE_HOUSE_ROOM_TYPES,
  type Question,
  type RoomTypeId,
} from "../catalog";

/*
 * Project state and the pure operations on it (documento-base §12 and §13).
 *
 * Each room has its own identifier: two bathrooms are two independent spaces.
 * Contacts are not part of this state; they are only collected when the client
 * decides to request proposals (a later step).
 */

export type AreaAnswer =
  | { kind: "range"; rangeId: string }
  | { kind: "exact"; squareMeters: number | null }
  | { kind: "unknown" };

export type Answer = { kind: "choice"; optionId: string } | { kind: "number"; value: number } | { kind: "unknown" };

export interface SelectedWork {
  workId: string;
  /** Free text for works that ask the client to describe them. */
  details: string;
}

export interface Room {
  id: string;
  type: RoomTypeId;
  /** Optional name given by the client, e.g. "Casa de banho da suite". */
  name: string;
  /** Description of the space, required for "Outro espaço interior". */
  description: string;
  area: AreaAnswer | null;
  works: SelectedWork[];
  /** Answers to complementary questions, keyed by question id. */
  answers: Record<string, Answer>;
  notes: string;
}

export type PropertyType = "" | "apartamento" | "moradia" | "outro";
export type Occupied = "" | "sim" | "nao" | "nao-sei";
export type Timeline = "" | "urgente" | "3-meses" | "6-meses" | "mais-tarde" | "explorar";

export interface ProjectContext {
  /** Locality or postal code of the works; the full address is not collected. */
  location: string;
  propertyType: PropertyType;
  occupied: Occupied;
  timeline: Timeline;
  access: string;
}

export interface Project {
  schemaVersion: 1;
  id: string;
  createdAt: string;
  updatedAt: string;
  rooms: Room[];
  /** Works common to the whole house, with their own scope. */
  projectWorks: SelectedWork[];
  context: ProjectContext;
}

export const PROPERTY_TYPE_OPTIONS: { id: Exclude<PropertyType, "">; label: string }[] = [
  { id: "apartamento", label: "Apartamento" },
  { id: "moradia", label: "Moradia" },
  { id: "outro", label: "Outro" },
];

export const OCCUPIED_OPTIONS: { id: Exclude<Occupied, "">; label: string }[] = [
  { id: "sim", label: "Sim, está habitada" },
  { id: "nao", label: "Não" },
  { id: "nao-sei", label: "Ainda não sei" },
];

export const TIMELINE_OPTIONS: { id: Exclude<Timeline, "">; label: string }[] = [
  { id: "urgente", label: "O mais depressa possível" },
  { id: "3-meses", label: "Nos próximos 3 meses" },
  { id: "6-meses", label: "Nos próximos 6 meses" },
  { id: "mais-tarde", label: "Mais tarde" },
  { id: "explorar", label: "Ainda estou a explorar" },
];

const newId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

export function createProject(): Project {
  const timestamp = now();
  return {
    schemaVersion: 1,
    id: newId(),
    createdAt: timestamp,
    updatedAt: timestamp,
    rooms: [],
    projectWorks: [],
    context: { location: "", propertyType: "", occupied: "", timeline: "", access: "" },
  };
}

export function createRoom(type: RoomTypeId): Room {
  return { id: newId(), type, name: "", description: "", area: null, works: [], answers: {}, notes: "" };
}

// ---------------------------------------------------------------------------
// Reading the project

export function countRoomsOfType(project: Project, type: RoomTypeId): number {
  return project.rooms.filter((r) => r.type === type).length;
}

/** 1-based position among rooms of the same type, in project order. */
export function roomOrdinal(project: Project, room: Room): number {
  return project.rooms.filter((r) => r.type === room.type).findIndex((r) => r.id === room.id) + 1;
}

/** "Casa de banho 2", or the client's own name when given. */
export function roomDisplayName(project: Project, room: Room): string {
  const name = room.name.trim();
  if (name) return name;
  return `${getRoomType(room.type).label} ${roomOrdinal(project, room)}`;
}

/** The generic label, useful next to a custom name: "Casa de banho 2". */
export function roomGenericName(project: Project, room: Room): string {
  return `${getRoomType(room.type).label} ${roomOrdinal(project, room)}`;
}

/** True when the client already answered anything for the room. */
export function isRoomConfigured(room: Room): boolean {
  return (
    room.area !== null ||
    room.works.length > 0 ||
    room.name.trim() !== "" ||
    room.description.trim() !== "" ||
    room.notes.trim() !== ""
  );
}

export interface RoomIssue {
  id: "area" | "works" | "description";
  message: string;
}

/** What still blocks the room from being reviewed. "Não sei" answers are valid; empty ones are not. */
export function roomIssues(room: Room): RoomIssue[] {
  const issues: RoomIssue[] = [];
  const type = getRoomType(room.type);
  if (type.requiresDescription && room.description.trim() === "") {
    issues.push({ id: "description", message: "Descreva o espaço." });
  }
  if (room.area === null || (room.area.kind === "exact" && room.area.squareMeters === null)) {
    issues.push({ id: "area", message: "Indique a área aproximada ou escolha «Não sei a área»." });
  }
  if (room.works.length === 0) {
    issues.push({ id: "works", message: "Escolha pelo menos um trabalho." });
  }
  return issues;
}

export const isRoomComplete = (room: Room): boolean => roomIssues(room).length === 0;

export function hasWork(room: Pick<Room, "works">, workId: string): boolean {
  return room.works.some((w) => w.workId === workId);
}

/** Complementary questions for the room's selected works, each once, in catalog order. */
export function roomQuestions(room: Room): Question[] {
  const ids: string[] = [];
  for (const { workId } of room.works) {
    for (const q of getWork(workId).questions) if (!ids.includes(q)) ids.push(q);
  }
  return ids.map(getQuestion);
}

export function describeArea(room: Room): string {
  const area = room.area;
  if (area === null) return "Área por indicar";
  if (area.kind === "unknown") return "Área desconhecida";
  if (area.kind === "exact") {
    return area.squareMeters === null ? "Área exata por indicar" : `${formatNumber(area.squareMeters)} m²`;
  }
  const range = getAreaRange(room.type, area.rangeId);
  return range ? areaRangeLabel(range) : "Área por indicar";
}

/** True for an open range ("mais de X") where no maximum can be assumed. */
export function isOpenRange(room: Room): boolean {
  if (room.area?.kind !== "range") return false;
  return getAreaRange(room.type, room.area.rangeId)?.max === null;
}

export function describeAnswer(question: Question, answer: Answer | undefined): string | null {
  if (!answer) return null;
  if (answer.kind === "unknown") return question.kind === "number" ? question.unknownLabel : "Ainda não sei";
  if (answer.kind === "number") return `${formatNumber(answer.value)} ${question.kind === "number" ? question.unit : ""}`.trim();
  if (question.kind === "single") return question.options.find((o) => o.id === answer.optionId)?.label ?? null;
  return null;
}

export interface PendingItem {
  /** Short description of what still needs confirmation or a professional's assessment. */
  message: string;
  kind: "unknown" | "assessment";
}

/** Items that cannot be estimated from the client's answers: doubts and works pending assessment. */
export function roomPendingItems(room: Room): PendingItem[] {
  const items: PendingItem[] = [];
  if (room.area?.kind === "unknown") items.push({ kind: "unknown", message: "Área da divisão por confirmar." });
  if (isOpenRange(room)) {
    items.push({ kind: "unknown", message: "Área aberta: a parte que depende da medida exata fica por confirmar." });
  }
  for (const question of roomQuestions(room)) {
    const answer = room.answers[question.id];
    const unknown =
      answer?.kind === "unknown" ||
      (answer?.kind === "choice" &&
        question.kind === "single" &&
        question.options.find((o) => o.id === answer.optionId)?.unknown === true);
    if (unknown) items.push({ kind: "unknown", message: `${question.text} — por confirmar.` });
  }
  for (const { workId } of room.works) {
    if (getWork(workId).requiresAssessment) {
      items.push({ kind: "assessment", message: `${workLabelInRoom(room.type, workId)} — sujeito a avaliação.` });
    }
  }
  return items;
}

export interface WorkInclusion {
  workId: string;
  /** Selected works in the room that already include this one. */
  includedBy: string[];
}

/**
 * Dependencies between the room's works (e.g. "trocar banheira por duche" includes
 * canalização, impermeabilização and revestimentos). Returned for every implied
 * work, selected or not, so the UI can show what is covered and the estimator
 * can count it once.
 */
export function roomWorkInclusions(room: Room): WorkInclusion[] {
  const map = new Map<string, string[]>();
  for (const { workId } of room.works) {
    for (const implied of getWork(workId).implies ?? []) {
      map.set(implied, [...(map.get(implied) ?? []), workId]);
    }
  }
  return [...map].map(([workId, includedBy]) => ({ workId, includedBy }));
}

export interface ProjectWorkCoverage {
  projectWorkId: string;
  /** Rooms whose selected works are replaced by the project-wide work, with the covered work ids. */
  rooms: { room: Room; workIds: string[] }[];
}

/** Room-level works replaced by the selected project-wide works, so they are not counted twice. */
export function projectWorkCoverage(project: Project): ProjectWorkCoverage[] {
  return project.projectWorks.map(({ workId }) => {
    const covers = getProjectWork(workId).covers;
    const rooms = project.rooms
      .map((room) => ({ room, workIds: room.works.map((w) => w.workId).filter((id) => covers.includes(id)) }))
      .filter((entry) => entry.workIds.length > 0);
    return { projectWorkId: workId, rooms };
  });
}

export interface ProjectIssue {
  roomId?: string;
  message: string;
}

/** What still blocks moving from the review to the estimate. */
export function projectIssues(project: Project): ProjectIssue[] {
  const issues: ProjectIssue[] = [];
  if (project.rooms.length === 0) issues.push({ message: "Escolha pelo menos uma divisão." });
  for (const room of project.rooms) {
    for (const issue of roomIssues(room)) {
      issues.push({ roomId: room.id, message: `${roomDisplayName(project, room)}: ${issue.message}` });
    }
  }
  if (project.context.location.trim() === "") {
    issues.push({ message: "Indique a localidade ou o código postal da obra." });
  }
  return issues;
}

/** Specialties required by the selected works, each once, with the works that need them. */
export function projectSpecialties(project: Project): { specialtyId: string; reasons: string[] }[] {
  const map = new Map<string, Set<string>>();
  const add = (specialtyId: string, reason: string) => {
    map.set(specialtyId, (map.get(specialtyId) ?? new Set()).add(reason));
  };
  for (const room of project.rooms) {
    for (const { workId } of room.works) {
      for (const s of getWork(workId).specialties) add(s, workLabelInRoom(room.type, workId));
    }
  }
  for (const { workId } of project.projectWorks) {
    const pw = getProjectWork(workId);
    for (const s of pw.specialties) add(s, pw.label);
  }
  return [...map].map(([specialtyId, reasons]) => ({ specialtyId, reasons: [...reasons] }));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 1 }).format(value);
}

// ---------------------------------------------------------------------------
// Changing the project

export type ProjectAction =
  | { type: "setRoomCount"; roomType: RoomTypeId; count: number }
  | { type: "applyWholeHouse" }
  | { type: "removeRoom"; roomId: string }
  | { type: "renameRoom"; roomId: string; name: string }
  | { type: "setRoomDescription"; roomId: string; description: string }
  | { type: "setArea"; roomId: string; area: AreaAnswer | null }
  | { type: "setWorkSelected"; roomId: string; workId: string; selected: boolean }
  | { type: "setWorkDetails"; roomId: string; workId: string; details: string }
  | { type: "setAnswer"; roomId: string; questionId: string; answer: Answer | null }
  | { type: "setNotes"; roomId: string; notes: string }
  | { type: "setProjectWorkSelected"; workId: string; selected: boolean }
  | { type: "setProjectWorkDetails"; workId: string; details: string }
  | { type: "setContext"; patch: Partial<ProjectContext> }
  | { type: "reset" };

export const MAX_ROOMS_PER_TYPE = 9;

export function reduceProject(project: Project, action: ProjectAction): Project {
  const next = apply(project, action);
  return next === project ? project : { ...next, updatedAt: now() };
}

function apply(project: Project, action: ProjectAction): Project {
  switch (action.type) {
    case "setRoomCount": {
      const count = Math.max(0, Math.min(MAX_ROOMS_PER_TYPE, Math.trunc(action.count)));
      const current = countRoomsOfType(project, action.roomType);
      if (count === current) return project;
      if (count > current) {
        const added = Array.from({ length: count - current }, () => createRoom(action.roomType));
        return { ...project, rooms: [...project.rooms, ...added] };
      }
      // Remove the last rooms of that type; the UI confirms first when they hold answers.
      let toRemove = current - count;
      const rooms = [...project.rooms];
      for (let i = rooms.length - 1; i >= 0 && toRemove > 0; i--) {
        if (rooms[i].type === action.roomType) {
          rooms.splice(i, 1);
          toRemove--;
        }
      }
      return { ...project, rooms };
    }
    case "applyWholeHouse": {
      // Shortcut only: adds one of each typical room where there is none. Nothing is assumed about works.
      const missing = WHOLE_HOUSE_ROOM_TYPES.filter((type) => countRoomsOfType(project, type) === 0);
      if (missing.length === 0) return project;
      return { ...project, rooms: [...project.rooms, ...missing.map(createRoom)] };
    }
    case "removeRoom": {
      if (!project.rooms.some((r) => r.id === action.roomId)) return project;
      return { ...project, rooms: project.rooms.filter((r) => r.id !== action.roomId) };
    }
    case "renameRoom":
      return updateRoom(project, action.roomId, (room) => ({ ...room, name: action.name }));
    case "setRoomDescription":
      return updateRoom(project, action.roomId, (room) => ({ ...room, description: action.description }));
    case "setArea":
      return updateRoom(project, action.roomId, (room) => ({ ...room, area: action.area }));
    case "setWorkSelected":
      return updateRoom(project, action.roomId, (room) => {
        const has = hasWork(room, action.workId);
        if (action.selected === has) return room;
        const works = action.selected
          ? [...room.works, { workId: action.workId, details: "" }]
          : room.works.filter((w) => w.workId !== action.workId);
        return { ...room, works, answers: pruneAnswers({ ...room, works }) };
      });
    case "setWorkDetails":
      return updateRoom(project, action.roomId, (room) => ({
        ...room,
        works: room.works.map((w) => (w.workId === action.workId ? { ...w, details: action.details } : w)),
      }));
    case "setAnswer":
      return updateRoom(project, action.roomId, (room) => {
        const answers = { ...room.answers };
        if (action.answer === null) delete answers[action.questionId];
        else answers[action.questionId] = action.answer;
        return { ...room, answers };
      });
    case "setNotes":
      return updateRoom(project, action.roomId, (room) => ({ ...room, notes: action.notes }));
    case "setProjectWorkSelected": {
      const has = hasWork({ works: project.projectWorks }, action.workId);
      if (action.selected === has) return project;
      const projectWorks = action.selected
        ? [...project.projectWorks, { workId: action.workId, details: "" }]
        : project.projectWorks.filter((w) => w.workId !== action.workId);
      return { ...project, projectWorks };
    }
    case "setProjectWorkDetails":
      return {
        ...project,
        projectWorks: project.projectWorks.map((w) =>
          w.workId === action.workId ? { ...w, details: action.details } : w,
        ),
      };
    case "setContext":
      return { ...project, context: { ...project.context, ...action.patch } };
    case "reset":
      return createProject();
  }
}

function updateRoom(project: Project, roomId: string, update: (room: Room) => Room): Project {
  const index = project.rooms.findIndex((r) => r.id === roomId);
  if (index === -1) return project;
  const updated = update(project.rooms[index]);
  if (updated === project.rooms[index]) return project;
  const rooms = [...project.rooms];
  rooms[index] = updated;
  return { ...project, rooms };
}

/** Drops answers to questions no selected work asks any more, so removed works stop influencing the project. */
function pruneAnswers(room: Room): Record<string, Answer> {
  const asked = new Set(roomQuestions(room).map((q) => q.id));
  return Object.fromEntries(Object.entries(room.answers).filter(([id]) => asked.has(id)));
}

/** Works available in the room, with their room-specific labels. */
export const roomWorkOptions = (room: Room) => worksForRoomType(room.type);
