import { describe, expect, it } from "vitest";
import { ROOM_TYPES, areaRangeLabel, validateCatalog, worksForRoomType } from "./index";

describe("catálogo", () => {
  it("é consistente", () => {
    expect(validateCatalog()).toEqual([]);
  });

  it("tem intervalos de área contíguos, sem sobreposição e com o último aberto", () => {
    for (const room of ROOM_TYPES) {
      const ranges = room.areaRanges;
      expect(ranges[0].min).toBe(0);
      for (let i = 1; i < ranges.length; i++) {
        expect(ranges[i].min).toBe(ranges[i - 1].max);
      }
      expect(ranges[ranges.length - 1].max).toBeNull();
    }
  });

  it("escreve os limites dos intervalos de forma inequívoca", () => {
    expect(areaRangeLabel({ id: "a", min: 0, max: 4 })).toBe("Até 4 m²");
    expect(areaRangeLabel({ id: "b", min: 4, max: 7 })).toBe("Mais de 4 até 7 m²");
    expect(areaRangeLabel({ id: "c", min: 10, max: null })).toBe("Mais de 10 m²");
  });

  it("oferece «Outro trabalho» e «Preciso de ajuda a decidir» em todas as divisões", () => {
    for (const room of ROOM_TYPES) {
      const ids = worksForRoomType(room.id).map((o) => o.work.id);
      expect(ids).toContain("outro-trabalho");
      expect(ids).toContain("ajuda-decidir");
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("usa a designação própria da divisão quando existe", () => {
    const bathroom = worksForRoomType("casa-de-banho").find((o) => o.work.id === "revestimentos-parede");
    expect(bathroom?.label).toBe("Trocar revestimentos de parede");
    const kitchen = worksForRoomType("cozinha").find((o) => o.work.id === "revestimentos-parede");
    expect(kitchen?.label).toBe("Renovar revestimentos de parede");
  });
});
