import type { AreaRange, RoomType } from "./types";

/*
 * Area ranges are proposals for the first prototype (documento-base §6, Etapa 2).
 * Ranges must not overlap: each `min` is exclusive and each `max` inclusive, so
 * "Até 4" is (0, 4] and "Mais de 4 até 7" is (4, 7].
 */

const BATHROOM_RANGES: AreaRange[] = [
  { id: "ate-4", min: 0, max: 4 },
  { id: "4-7", min: 4, max: 7 },
  { id: "7-10", min: 7, max: 10 },
  { id: "mais-10", min: 10, max: null },
];

const KITCHEN_RANGES: AreaRange[] = [
  { id: "ate-8", min: 0, max: 8 },
  { id: "8-12", min: 8, max: 12 },
  { id: "12-20", min: 12, max: 20 },
  { id: "mais-20", min: 20, max: null },
];

const DEFAULT_RANGES: AreaRange[] = [
  { id: "ate-10", min: 0, max: 10 },
  { id: "10-20", min: 10, max: 20 },
  { id: "20-30", min: 20, max: 30 },
  { id: "mais-30", min: 30, max: null },
];

const LIVING_ROOM_WORKS: RoomType["works"] = [
  { workId: "pavimento" },
  { workId: "pintura", label: "Pintar paredes e tetos" },
  { workId: "reparar-superficies" },
  { workId: "teto-falso" },
  { workId: "eletricidade", label: "Alterar iluminação e tomadas" },
  { workId: "portas-rodapes" },
  { workId: "roupeiro-movel-fixo" },
];

export const ROOM_TYPES: RoomType[] = [
  {
    id: "cozinha",
    label: "Cozinha",
    plural: "Cozinhas",
    description: "Móveis, bancada, pavimento, água, eletricidade e eletrodomésticos.",
    areaRanges: KITCHEN_RANGES,
    works: [
      { workId: "pavimento" },
      { workId: "revestimentos-parede", label: "Renovar revestimentos de parede" },
      { workId: "pintura" },
      { workId: "moveis-cozinha" },
      { workId: "bancada" },
      { workId: "lava-loica-torneira" },
      { workId: "canalizacao", label: "Alterar canalização" },
      { workId: "eletricidade", label: "Alterar tomadas e iluminação" },
      { workId: "eletrodomesticos" },
      { workId: "teto-renovar" },
    ],
  },
  {
    id: "casa-de-banho",
    label: "Casa de banho",
    plural: "Casas de banho",
    description: "Loiças, duche ou banheira, revestimentos, canalização e ventilação.",
    areaRanges: BATHROOM_RANGES,
    works: [
      { workId: "pavimento" },
      { workId: "revestimentos-parede", label: "Trocar revestimentos de parede" },
      { workId: "sanitarios" },
      { workId: "movel-wc", label: "Substituir móvel" },
      { workId: "banheira-duche" },
      { workId: "base-resguardo" },
      { workId: "torneiras" },
      { workId: "canalizacao", label: "Renovar canalização" },
      { workId: "eletricidade", label: "Renovar eletricidade e iluminação" },
      { workId: "ventilacao" },
      { workId: "impermeabilizacao" },
      { workId: "pintura", label: "Renovar teto ou pintura" },
    ],
  },
  {
    id: "quarto",
    label: "Quarto",
    plural: "Quartos",
    description: "Pavimento, pintura, tetos, iluminação, portas e roupeiros.",
    areaRanges: DEFAULT_RANGES,
    works: LIVING_ROOM_WORKS,
  },
  {
    id: "sala",
    label: "Sala",
    plural: "Salas",
    description: "Pavimento, pintura, tetos, iluminação, portas e móveis fixos.",
    areaRanges: DEFAULT_RANGES,
    works: LIVING_ROOM_WORKS,
  },
  {
    id: "hall",
    label: "Hall ou corredor",
    plural: "Halls ou corredores",
    description: "Pavimento, pintura, iluminação, portas e arrumação.",
    areaRanges: DEFAULT_RANGES,
    works: [
      { workId: "pavimento" },
      { workId: "pintura" },
      { workId: "eletricidade", label: "Renovar iluminação" },
      { workId: "portas-rodapes" },
      { workId: "arrumacao" },
    ],
  },
  {
    id: "arrecadacao",
    label: "Arrecadação",
    plural: "Arrecadações",
    description: "Pavimento, paredes, iluminação, arrumação e humidade.",
    areaRanges: DEFAULT_RANGES,
    works: [
      { workId: "pavimento", label: "Renovar pavimento" },
      { workId: "pintura", label: "Reparar ou pintar paredes e teto" },
      { workId: "eletricidade", label: "Melhorar iluminação e tomadas" },
      { workId: "arrumacao" },
      { workId: "humidade-avaliar" },
    ],
  },
  {
    id: "lavandaria",
    label: "Lavandaria",
    plural: "Lavandarias",
    description: "Pavimento e paredes, móveis, pontos de água, tomadas e ventilação.",
    areaRanges: DEFAULT_RANGES,
    works: [
      { workId: "pavimento", label: "Renovar pavimento e paredes" },
      { workId: "moveis-bancada-lavandaria" },
      { workId: "canalizacao", label: "Alterar pontos de água e esgoto" },
      { workId: "eletricidade", label: "Alterar tomadas" },
      { workId: "ventilacao" },
    ],
  },
  {
    id: "outro",
    label: "Outro espaço interior",
    plural: "Outros espaços interiores",
    description: "Escritório, despensa, varanda fechada ou outro espaço. Descreve-o e escolhe trabalhos comuns.",
    areaRanges: DEFAULT_RANGES,
    requiresDescription: true,
    works: [
      { workId: "pavimento" },
      { workId: "pintura", label: "Pintar paredes e tetos" },
      { workId: "eletricidade", label: "Alterar iluminação e tomadas" },
      { workId: "portas-rodapes" },
      { workId: "teto-falso" },
    ],
  },
];

/** Room types pre-filled by the "Uma casa inteira" shortcut. The client still confirms every quantity. */
export const WHOLE_HOUSE_ROOM_TYPES: RoomType["id"][] = ["cozinha", "casa-de-banho", "quarto", "sala", "hall"];
