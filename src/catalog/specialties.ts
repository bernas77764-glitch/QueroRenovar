import type { Specialty } from "./types";

/*
 * Specialties a project may require (documento-base §8). The mapping from works
 * to specialties lives on each work. A company can cover several of these.
 */
export const SPECIALTIES: Specialty[] = [
  {
    id: "remodelacao-geral",
    label: "Empresa de remodelações ou empreiteiro",
    description: "Coordena projetos com várias especialidades.",
  },
  { id: "carpintaria", label: "Carpinteiro ou empresa de mobiliário", description: "Móveis, roupeiros, portas e rodapés." },
  { id: "bancadas", label: "Fornecedor ou instalador de bancadas", description: "Conforme o material escolhido." },
  { id: "canalizacao", label: "Canalizador", description: "Água, esgotos, torneiras e peças sanitárias." },
  { id: "eletricidade", label: "Eletricista", description: "Tomadas, circuitos e iluminação." },
  {
    id: "pavimentos-revestimentos",
    label: "Aplicador de pavimentos ou revestimentos",
    description: "Pavimentos, azulejos e outros revestimentos.",
  },
  { id: "pintura", label: "Pintor", description: "Pintura e preparação de superfícies." },
  { id: "gesso-cartonado", label: "Aplicador de gesso cartonado", description: "Tetos falsos e divisórias." },
  { id: "impermeabilizacao", label: "Profissional de impermeabilização", description: "Proteção de zonas de água." },
  {
    id: "ventilacao",
    label: "Profissional de ventilação",
    description: "Ventilação e extração; pode exigir articulação com outras especialidades.",
  },
];
