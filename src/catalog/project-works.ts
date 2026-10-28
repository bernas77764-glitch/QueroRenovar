import type { ProjectWork } from "./types";

/*
 * Works common to the whole house (documento-base §6, Etapa 3). They have their
 * own scope so they are not counted again in each room: `covers` lists the
 * room-level works they replace.
 */
export const PROJECT_WORKS: ProjectWork[] = [
  {
    id: "eletricidade-global",
    label: "Renovação global da instalação elétrica",
    help: "Quadro, circuitos e pontos de luz e tomadas em toda a casa.",
    covers: ["eletricidade"],
    specialties: ["eletricidade"],
  },
  {
    id: "canalizacao-global",
    label: "Renovação global da canalização",
    help: "Redes de água e esgoto de toda a casa.",
    covers: ["canalizacao"],
    specialties: ["canalizacao"],
  },
  {
    id: "portas-global",
    label: "Substituição de todas as portas interiores",
    covers: ["portas-rodapes"],
    specialties: ["carpintaria"],
  },
  {
    id: "pintura-global",
    label: "Pintura geral da casa",
    help: "Paredes e tetos de todas as divisões.",
    covers: ["pintura"],
    specialties: ["pintura"],
  },
  {
    id: "outro-global",
    label: "Outro trabalho comum à casa",
    help: "Descreva o que pretende. Será avaliado por um profissional.",
    requiresAssessment: true,
    freeText: true,
    covers: [],
    specialties: [],
  },
];
