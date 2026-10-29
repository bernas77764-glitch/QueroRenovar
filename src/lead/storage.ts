import type { LeadRequest } from "./request";

/*
 * The request in progress is kept in this browser only (localStorage) until the
 * client submits it. Contact details are never stored here.
 */

const STORAGE_KEY = "querorenovar.pedido.v1";

export function loadRequest(): LeadRequest | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return looksLikeRequest(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveRequest(request: LeadRequest): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(request));
  } catch {
    // Private mode or full storage: the session still works, it just will not survive a reload.
  }
}

function looksLikeRequest(value: unknown): value is LeadRequest {
  if (typeof value !== "object" || value === null) return false;
  const r = value as Partial<LeadRequest>;
  return r.schemaVersion === 1 && typeof r.id === "string" && Array.isArray(r.spaces) && Array.isArray(r.works);
}
