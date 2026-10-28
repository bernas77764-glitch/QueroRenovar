/**
 * Catalog types.
 *
 * The catalog (room types, works, complementary questions, project-wide works
 * and specialties) is data the team edits without touching the screens — see
 * docs/documento-base.md §18. Nothing in here carries prices: pricing rules
 * belong to the estimator, which is a later iteration.
 */

export type RoomTypeId =
  | "cozinha"
  | "casa-de-banho"
  | "quarto"
  | "sala"
  | "hall"
  | "arrecadacao"
  | "lavandaria"
  | "outro";

export interface AreaRange {
  id: string;
  /** Lower bound in m², exclusive. 0 for the first range. */
  min: number;
  /** Upper bound in m², inclusive. `null` for an open range ("mais de X m²"). */
  max: number | null;
}

export interface RoomWorkRef {
  workId: string;
  /** Room-specific wording when the generic label does not fit. */
  label?: string;
}

export interface RoomType {
  id: RoomTypeId;
  label: string;
  plural: string;
  description: string;
  areaRanges: AreaRange[];
  /** Works offered for this room type, in display order. */
  works: RoomWorkRef[];
  /** The client describes the space before choosing works ("Outro espaço interior"). */
  requiresDescription?: boolean;
}

/** Unit the estimator will use. "avaliacao" means there is no rule: a professional has to assess it. */
export type Unit = "m2" | "ml" | "un" | "conjunto" | "avaliacao";

export interface Work {
  id: string;
  label: string;
  help?: string;
  unit: Unit;
  /** No pricing rule can apply; the work is always flagged "sujeito a avaliação". */
  requiresAssessment?: boolean;
  /** Shows a free-text field for the client to describe the work. */
  freeText?: boolean;
  /** Complementary questions, asked once per room even when several works share them. */
  questions: string[];
  /** Works this one normally includes. Shown to the client; the estimator counts them once. */
  implies?: string[];
  specialties: string[];
}

export interface ProjectWork {
  id: string;
  label: string;
  help?: string;
  requiresAssessment?: boolean;
  freeText?: boolean;
  /** Room-level works this project-wide work replaces, so they are not counted twice. */
  covers: string[];
  specialties: string[];
}

export interface QuestionOption {
  id: string;
  label: string;
  /** The answer means "I don't know" and leaves the item pending confirmation. */
  unknown?: boolean;
}

interface QuestionBase {
  id: string;
  text: string;
  help?: string;
}

export interface SingleChoiceQuestion extends QuestionBase {
  kind: "single";
  options: QuestionOption[];
}

export interface NumberQuestion extends QuestionBase {
  kind: "number";
  unit: "m" | "m2";
  unknownLabel: string;
  min: number;
  max: number;
}

export type Question = SingleChoiceQuestion | NumberQuestion;

export interface Specialty {
  id: string;
  label: string;
  description: string;
}
