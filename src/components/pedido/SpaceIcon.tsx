import type { SpaceTypeId } from "@/lead/catalog";

/** Line icons for each space type, drawn on a 24×24 grid with the current text colour. */
const PATHS: Record<SpaceTypeId, string[]> = {
  corredores: ["M4 3v18", "M20 3v18", "M4 3l5 5v8l-5 5", "M20 3l-5 5v8l5 5", "M9 8h6", "M9 16h6"],
  sala: [
    "M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3",
    "M3 12a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z",
    "M5 17v2",
    "M19 17v2",
  ],
  cozinha: ["M4 3h16v18H4z", "M4 8h16", "M8 5.5h.01", "M12 5.5h.01", "M8 12h8v5H8z"],
  quarto: ["M3 6v13", "M21 19v-6a2 2 0 0 0-2-2h-9v4", "M3 15h18", "M6.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"],
  "casa-de-banho": [
    "M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z",
    "M6 12V6a2 2 0 0 1 3.6-1.2",
    "M7 19l-1 2",
    "M17 19l1 2",
  ],
  escritorio: ["M3 20h18", "M5 20v-6h14v6", "M8 10h8V4H8z", "M12 10v4"],
  closet: ["M5 3h14v17H5z", "M12 3v17", "M10 11v2", "M14 11v2", "M6 20v1.5", "M18 20v1.5"],
  garagem: ["M3 10l9-6 9 6v11H3z", "M7 21v-8h10v8", "M7 16h10", "M7 18.5h10"],
};

export function SpaceIcon({ type, className = "size-8" }: { type: SpaceTypeId; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[type].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
