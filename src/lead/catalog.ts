/*
 * What the client can choose in the request journey: spaces, sizes, works,
 * quality levels and urgency. Labels are what the client reads; ids are what
 * gets stored with each request, so never rename an id once requests exist.
 */

export type SpaceTypeId =
  | "corredores"
  | "sala"
  | "cozinha"
  | "quarto"
  | "casa-de-banho"
  | "escritorio"
  | "closet"
  | "garagem";

export interface SpaceType {
  id: SpaceTypeId;
  label: string;
}

export const SPACE_TYPES: SpaceType[] = [
  { id: "corredores", label: "Corredores / Circulações" },
  { id: "sala", label: "Sala" },
  { id: "cozinha", label: "Cozinha" },
  { id: "quarto", label: "Quarto" },
  { id: "casa-de-banho", label: "Casa de banho" },
  { id: "escritorio", label: "Escritório" },
  { id: "closet", label: "Closet" },
  { id: "garagem", label: "Garagem / Arrecadação" },
];

export const MAX_SPACES_PER_TYPE = 9;

export type SizeRangeId = "ate-10" | "10-20" | "mais-20";

export const SIZE_RANGES: { id: SizeRangeId; label: string }[] = [
  { id: "ate-10", label: "Até 10 m²" },
  { id: "10-20", label: "10 a 20 m²" },
  { id: "mais-20", label: "Mais de 20 m²" },
];

/** Bounds for a custom size, in m². */
export const CUSTOM_SIZE_MIN = 1;
export const CUSTOM_SIZE_MAX = 2000;

export type QualityId = "economico" | "medio" | "premium";

export const QUALITY_LEVELS: { id: QualityId; label: string; description: string }[] = [
  { id: "economico", label: "Económico", description: "Materiais simples e duráveis" },
  { id: "medio", label: "Médio", description: "Bom equilíbrio entre preço e acabamento" },
  { id: "premium", label: "Premium", description: "Materiais e acabamentos de gama alta" },
];

export interface Work {
  id: string;
  label: string;
  description: string;
  /** The client picks a quality level for this work. */
  quality?: boolean;
  /** The client says how many units (e.g. windows). */
  quantity?: { label: string; max: number };
  /** The client describes the work in free text. */
  details?: boolean;
}

export const WORKS: Work[] = [
  {
    id: "remodelacao-total",
    label: "Remodelação total",
    description: "Renovar por completo os espaços escolhidos.",
    quality: true,
  },
  { id: "pavimento", label: "Pavimento", description: "Trocar ou aplicar chão novo.", quality: true },
  { id: "bancada", label: "Bancada", description: "Bancada de cozinha ou de casa de banho.", quality: true },
  { id: "armarios", label: "Armários", description: "Móveis de cozinha, roupeiros ou arrumação.", quality: true },
  {
    id: "janelas",
    label: "Janelas",
    description: "Substituir ou instalar janelas.",
    quantity: { label: "Quantas janelas?", max: 50 },
  },
  {
    id: "portas",
    label: "Portas",
    description: "Portas interiores ou de entrada.",
    quantity: { label: "Quantas portas?", max: 50 },
  },
  { id: "canalizacao", label: "Canalização", description: "Pontos de água, esgotos e torneiras." },
  { id: "eletricidade", label: "Eletricidade", description: "Tomadas, iluminação e quadro elétrico." },
  { id: "paredes", label: "Paredes", description: "Demolir, construir ou mover paredes." },
  { id: "pintura", label: "Pintura", description: "Pintar paredes e tetos." },
  {
    id: "revestimentos",
    label: "Azulejos e revestimentos",
    description: "Revestimento de paredes, por exemplo em cozinhas e casas de banho.",
    quality: true,
  },
  {
    id: "loucas-sanitarias",
    label: "Louças sanitárias e duche",
    description: "Sanita, lavatório, base de duche ou banheira.",
    quality: true,
  },
  { id: "tetos", label: "Tetos falsos", description: "Tetos em pladur, com ou sem iluminação embutida." },
  { id: "climatizacao", label: "Climatização", description: "Ar condicionado, aquecimento ou ventilação." },
  { id: "isolamento", label: "Isolamento", description: "Isolamento térmico, acústico ou contra humidade." },
  { id: "outro", label: "Outro trabalho", description: "Descreva o que precisa.", details: true },
];

export type UrgencyId = "imediato" | "medio" | "longo" | "sem-urgencia";

export const URGENCY_LEVELS: { id: UrgencyId; label: string; description: string }[] = [
  { id: "imediato", label: "Imediato", description: "Começar a obra em até 10 dias" },
  { id: "medio", label: "Médio prazo", description: "Começar a obra em até 30 dias" },
  { id: "longo", label: "Longo prazo", description: "Começar a obra em até 3 meses" },
  { id: "sem-urgencia", label: "Sem urgência", description: "Ainda sem data definida" },
];

const spaceTypes = new Map(SPACE_TYPES.map((t) => [t.id, t]));
const works = new Map(WORKS.map((w) => [w.id, w]));

export const getSpaceType = (id: SpaceTypeId): SpaceType | undefined => spaceTypes.get(id);
export const getWork = (id: string): Work | undefined => works.get(id);
export const isSpaceTypeId = (id: unknown): id is SpaceTypeId => typeof id === "string" && spaceTypes.has(id as SpaceTypeId);
export const isSizeRangeId = (id: unknown): id is SizeRangeId => SIZE_RANGES.some((r) => r.id === id);
export const isQualityId = (id: unknown): id is QualityId => QUALITY_LEVELS.some((q) => q.id === id);
export const isUrgencyId = (id: unknown): id is UrgencyId => URGENCY_LEVELS.some((u) => u.id === id);
