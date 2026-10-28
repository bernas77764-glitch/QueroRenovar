import type { Question, QuestionOption } from "./types";

/*
 * Complementary questions (documento-base §6, Etapa 2). Only the questions
 * attached to the works the client selected are shown, and each question is
 * asked once per room even if several selected works share it.
 *
 * Every question that may need a measurement or advice offers an "I don't
 * know" answer; it is never converted into zero or into an assumed choice.
 */

const DONT_KNOW: QuestionOption = { id: "nao-sei", label: "Ainda não sei", unknown: true };

export const QUESTIONS: Question[] = [
  {
    id: "pavimento-ambito",
    kind: "single",
    text: "Pretende substituir o pavimento todo ou apenas parte?",
    options: [
      { id: "tudo", label: "Todo o pavimento" },
      { id: "parte", label: "Apenas parte" },
      DONT_KNOW,
    ],
  },
  {
    id: "pavimento-remocao",
    kind: "single",
    text: "É necessário remover o pavimento existente?",
    help: "Em alguns casos o novo pavimento pode ser aplicado sobre o atual.",
    options: [
      { id: "sim", label: "Sim, remover o existente" },
      { id: "nao", label: "Não, pode ficar por baixo" },
      DONT_KNOW,
    ],
  },
  {
    id: "revestimentos-ambito",
    kind: "single",
    text: "Pretende renovar os revestimentos de todas as paredes ou apenas de parte?",
    options: [
      { id: "tudo", label: "Todas as paredes" },
      { id: "parte", label: "Apenas parte" },
      DONT_KNOW,
    ],
  },
  {
    id: "moveis-cozinha-opcao",
    kind: "single",
    text: "O que pretende fazer aos móveis de cozinha?",
    options: [
      { id: "conservar", label: "Conservar os móveis atuais" },
      { id: "frentes", label: "Renovar apenas as frentes" },
      { id: "substituir", label: "Substituir os móveis" },
      DONT_KNOW,
    ],
  },
  {
    id: "moveis-cozinha-comprimento",
    kind: "number",
    text: "Sabe o comprimento aproximado dos móveis?",
    help: "Medido ao longo da parede, em metros.",
    unit: "m",
    unknownLabel: "Não sei o comprimento",
    min: 0.5,
    max: 30,
  },
  {
    id: "bancada-comprimento",
    kind: "number",
    text: "Sabe o comprimento aproximado da bancada?",
    unit: "m",
    unknownLabel: "Não sei o comprimento",
    min: 0.5,
    max: 20,
  },
  {
    id: "bancada-material",
    kind: "single",
    text: "Que tipo de material pretende para a bancada?",
    options: [
      { id: "pedra-natural", label: "Pedra natural (granito, mármore)" },
      { id: "compacto", label: "Pedra compacta (quartzo, cerâmica)" },
      { id: "laminado", label: "Laminado ou madeira" },
      { id: "outro", label: "Outro material" },
      { id: "nao-decidi", label: "Ainda não decidi", unknown: true },
    ],
  },
  {
    id: "wc-disposicao",
    kind: "single",
    text: "Pretende manter as peças no mesmo sítio ou mudar a disposição?",
    help: "Mudar a disposição implica normalmente mais trabalhos de canalização.",
    options: [
      { id: "manter", label: "Manter no mesmo sítio" },
      { id: "mudar", label: "Mudar a disposição" },
      DONT_KNOW,
    ],
  },
  {
    id: "pintura-ambito",
    kind: "single",
    text: "A pintura inclui paredes, teto ou ambos?",
    options: [
      { id: "paredes", label: "Paredes" },
      { id: "teto", label: "Teto" },
      { id: "ambos", label: "Paredes e teto" },
    ],
  },
  {
    id: "pintura-superficies",
    kind: "single",
    text: "Existem superfícies degradadas, com fissuras ou humidade?",
    options: [
      { id: "sim", label: "Sim" },
      { id: "nao", label: "Não" },
      { id: "nao-sei", label: "Não sei", unknown: true },
    ],
  },
  {
    id: "eletricidade-ambito",
    kind: "single",
    text: "São alterações pontuais ou uma renovação mais abrangente?",
    options: [
      { id: "pontuais", label: "Alterações pontuais (alguns pontos de luz ou tomadas)" },
      { id: "abrangente", label: "Renovação mais abrangente" },
      DONT_KNOW,
    ],
  },
  {
    id: "materiais-fornecimento",
    kind: "single",
    text: "Pretende fornecimento e instalação dos materiais e equipamentos, ou já tem alguns?",
    options: [
      { id: "fornecimento", label: "Fornecimento e instalação" },
      { id: "alguns", label: "Já tenho alguns materiais" },
      { id: "todos", label: "Já tenho todos os materiais" },
      DONT_KNOW,
    ],
  },
];
