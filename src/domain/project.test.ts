import { describe, expect, it } from "vitest";
import {
  createProject,
  isRoomComplete,
  projectIssues,
  projectWorkCoverage,
  reduceProject,
  roomDisplayName,
  roomPendingItems,
  roomQuestions,
  roomWorkInclusions,
  type Project,
  type ProjectAction,
} from "./project";

const run = (project: Project, ...actions: ProjectAction[]) => actions.reduce(reduceProject, project);

/** The four-room example from documento-base §14. */
function exampleProject(): Project {
  return run(
    createProject(),
    { type: "setRoomCount", roomType: "cozinha", count: 1 },
    { type: "setRoomCount", roomType: "casa-de-banho", count: 2 },
    { type: "setRoomCount", roomType: "arrecadacao", count: 1 },
  );
}

describe("divisões", () => {
  it("cria uma divisão independente por unidade, com numeração por tipo", () => {
    const project = exampleProject();
    expect(project.rooms).toHaveLength(4);
    expect(project.rooms.map((r) => roomDisplayName(project, r))).toEqual([
      "Cozinha 1",
      "Casa de banho 1",
      "Casa de banho 2",
      "Arrecadação 1",
    ]);
    expect(new Set(project.rooms.map((r) => r.id)).size).toBe(4);
  });

  it("começa sem escolhas presumidas", () => {
    for (const room of exampleProject().rooms) {
      expect(room.area).toBeNull();
      expect(room.works).toEqual([]);
      expect(isRoomComplete(room)).toBe(false);
    }
  });

  it("mantém as duas casas de banho independentes", () => {
    let project = exampleProject();
    const [wc1, wc2] = project.rooms.filter((r) => r.type === "casa-de-banho");
    project = run(
      project,
      { type: "setArea", roomId: wc1.id, area: { kind: "range", rangeId: "4-7" } },
      { type: "setWorkSelected", roomId: wc1.id, workId: "banheira-duche", selected: true },
      { type: "setAnswer", roomId: wc1.id, questionId: "wc-disposicao", answer: { kind: "choice", optionId: "manter" } },
    );
    const after2 = project.rooms.find((r) => r.id === wc2.id)!;
    expect(after2.area).toBeNull();
    expect(after2.works).toEqual([]);
    expect(after2.answers).toEqual({});
  });

  it("reduzir a quantidade remove as últimas divisões desse tipo e preserva as restantes", () => {
    let project = exampleProject();
    const kitchen = project.rooms[0];
    project = run(
      project,
      { type: "setArea", roomId: kitchen.id, area: { kind: "exact", squareMeters: 11 } },
      { type: "setRoomCount", roomType: "casa-de-banho", count: 1 },
    );
    expect(project.rooms.filter((r) => r.type === "casa-de-banho")).toHaveLength(1);
    expect(project.rooms.find((r) => r.id === kitchen.id)?.area).toEqual({ kind: "exact", squareMeters: 11 });
  });

  it("o atalho «casa inteira» acrescenta divisões típicas sem assumir trabalhos", () => {
    const project = run(createProject(), { type: "applyWholeHouse" });
    expect(project.rooms.map((r) => r.type)).toEqual(["cozinha", "casa-de-banho", "quarto", "sala", "hall"]);
    expect(project.rooms.every((r) => r.works.length === 0)).toBe(true);
    // Applying it again does not duplicate anything.
    expect(reduceProject(project, { type: "applyWholeHouse" })).toBe(project);
  });
});

describe("trabalhos e perguntas", () => {
  it("pergunta cada questão uma vez, mesmo partilhada por vários trabalhos", () => {
    let project = exampleProject();
    const wc = project.rooms[1];
    project = run(
      project,
      { type: "setWorkSelected", roomId: wc.id, workId: "banheira-duche", selected: true },
      { type: "setWorkSelected", roomId: wc.id, workId: "sanitarios", selected: true },
    );
    const ids = roomQuestions(project.rooms[1]).map((q) => q.id);
    expect(ids.filter((id) => id === "wc-disposicao")).toHaveLength(1);
    expect(ids.filter((id) => id === "materiais-fornecimento")).toHaveLength(1);
  });

  it("ao retirar um trabalho, apaga as respostas que só lhe pertenciam", () => {
    let project = exampleProject();
    const kitchen = project.rooms[0];
    project = run(
      project,
      { type: "setWorkSelected", roomId: kitchen.id, workId: "bancada", selected: true },
      { type: "setWorkSelected", roomId: kitchen.id, workId: "pavimento", selected: true },
      { type: "setAnswer", roomId: kitchen.id, questionId: "bancada-material", answer: { kind: "choice", optionId: "compacto" } },
      { type: "setAnswer", roomId: kitchen.id, questionId: "materiais-fornecimento", answer: { kind: "choice", optionId: "fornecimento" } },
      { type: "setWorkSelected", roomId: kitchen.id, workId: "bancada", selected: false },
    );
    const answers = project.rooms[0].answers;
    expect(answers["bancada-material"]).toBeUndefined();
    // Shared with "pavimento", so it stays.
    expect(answers["materiais-fornecimento"]).toEqual({ kind: "choice", optionId: "fornecimento" });
  });

  it("identifica os trabalhos incluídos por outro (sem contar duas vezes)", () => {
    let project = exampleProject();
    const wc = project.rooms[1];
    project = run(
      project,
      { type: "setWorkSelected", roomId: wc.id, workId: "banheira-duche", selected: true },
      { type: "setWorkSelected", roomId: wc.id, workId: "impermeabilizacao", selected: true },
    );
    const inclusions = roomWorkInclusions(project.rooms[1]);
    expect(inclusions).toContainEqual({ workId: "impermeabilizacao", includedBy: ["banheira-duche"] });
    expect(inclusions).toContainEqual({ workId: "canalizacao", includedBy: ["banheira-duche"] });
  });
});

describe("pendentes", () => {
  it("nunca converte «não sei» em zero: fica por confirmar", () => {
    let project = exampleProject();
    const storage = project.rooms[3];
    project = run(
      project,
      { type: "setArea", roomId: storage.id, area: { kind: "unknown" } },
      { type: "setWorkSelected", roomId: storage.id, workId: "pintura", selected: true },
      { type: "setAnswer", roomId: storage.id, questionId: "pintura-superficies", answer: { kind: "choice", optionId: "nao-sei" } },
      { type: "setWorkSelected", roomId: storage.id, workId: "humidade-avaliar", selected: true },
    );
    const items = roomPendingItems(project.rooms[3]);
    expect(items.map((i) => i.kind)).toEqual(["unknown", "unknown", "assessment"]);
    expect(isRoomComplete(project.rooms[3])).toBe(true);
  });

  it("um intervalo aberto não assume uma área máxima", () => {
    let project = exampleProject();
    const kitchen = project.rooms[0];
    project = run(project, { type: "setArea", roomId: kitchen.id, area: { kind: "range", rangeId: "mais-20" } });
    expect(roomPendingItems(project.rooms[0])[0].message).toMatch(/Área aberta/);
  });
});

describe("projeto", () => {
  it("os trabalhos comuns à casa cobrem os trabalhos por divisão", () => {
    let project = exampleProject();
    const [kitchen, wc1] = project.rooms;
    project = run(
      project,
      { type: "setWorkSelected", roomId: kitchen.id, workId: "eletricidade", selected: true },
      { type: "setWorkSelected", roomId: wc1.id, workId: "eletricidade", selected: true },
      { type: "setProjectWorkSelected", workId: "eletricidade-global", selected: true },
    );
    const [coverage] = projectWorkCoverage(project);
    expect(coverage.projectWorkId).toBe("eletricidade-global");
    expect(coverage.rooms.map((r) => r.room.id)).toEqual([kitchen.id, wc1.id]);
  });

  it("só avança para a estimativa com divisões completas e localização", () => {
    let project = exampleProject();
    expect(projectIssues(project).length).toBeGreaterThan(0);
    for (const room of project.rooms) {
      project = run(
        project,
        { type: "setArea", roomId: room.id, area: { kind: "unknown" } },
        { type: "setWorkSelected", roomId: room.id, workId: "pintura", selected: true },
      );
    }
    expect(projectIssues(project)).toEqual([{ message: "Indique a localidade ou o código postal da obra." }]);
    project = run(project, { type: "setContext", patch: { location: "4000" } });
    expect(projectIssues(project)).toEqual([]);
  });

  it("não altera o estado quando a ação não muda nada", () => {
    const project = exampleProject();
    expect(reduceProject(project, { type: "setRoomCount", roomType: "cozinha", count: 1 })).toBe(project);
    expect(reduceProject(project, { type: "removeRoom", roomId: "inexistente" })).toBe(project);
  });
});
