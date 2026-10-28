import type { Project } from "./project";

/*
 * Progress is kept in this browser only (localStorage). Recovery between
 * devices is not promised in the interface until it exists — documento-base §13.
 */

const STORAGE_KEY = "querrenovar.projeto.v1";

export function loadProject(): Project | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return looksLikeProject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveProject(project: Project): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch {
    // Private mode or full storage: the session still works, it just will not survive a reload.
  }
}

export function clearProject(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do.
  }
}

function looksLikeProject(value: unknown): value is Project {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Partial<Project>;
  return (
    p.schemaVersion === 1 &&
    typeof p.id === "string" &&
    Array.isArray(p.rooms) &&
    Array.isArray(p.projectWorks) &&
    typeof p.context === "object" &&
    p.context !== null
  );
}
