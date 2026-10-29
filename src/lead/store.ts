import { parseSubmission, summarize, type Submission } from "./request";

/*
 * Submitted requests live in the Cloudflare KV namespace bound as PEDIDOS
 * (wrangler.jsonc), one key per request: "pedido:<request id>". The value is
 * the full submission plus a plain-text summary; the key metadata carries the
 * fields needed to scan the list in the Cloudflare dashboard.
 */

/** The subset of the KV API used here; satisfied by the real binding. */
export interface PedidosStore {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { metadata?: unknown }): Promise<void>;
}

/** Bump when the terms the client accepts change, so each request records which version was accepted. */
export const TERMS_VERSION = "2026-10-29";

export interface StoredLead extends Submission {
  reference: string;
  receivedAt: string;
  termsVersion: string;
  summary: string;
}

/** Short reference shown to the client, derived from the request id so a retry gets the same one. */
export const referenceFor = (id: string) => `QR-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

export type SaveResult = { ok: true; reference: string } | { ok: false; status: number; errors: string[] };

export async function saveLead(store: PedidosStore, body: unknown, receivedAt = new Date()): Promise<SaveResult> {
  const parsed = parseSubmission(body);
  if (!parsed.ok) return { ok: false, status: 400, errors: parsed.errors };

  const { request, contact } = parsed.submission;
  const key = `pedido:${request.id}`;
  const reference = referenceFor(request.id);
  // A retried submission (double click, lost response) must not create a second lead.
  if ((await store.get(key)) !== null) return { ok: true, reference };

  const lead: StoredLead = {
    ...parsed.submission,
    reference,
    receivedAt: receivedAt.toISOString(),
    termsVersion: TERMS_VERSION,
    summary: summarize(parsed.submission),
  };
  await store.put(key, JSON.stringify(lead), {
    metadata: {
      reference,
      receivedAt: lead.receivedAt,
      name: contact.name.trim().slice(0, 100),
      municipality: contact.municipality.trim().slice(0, 80),
      urgency: request.urgency,
    },
  });
  return { ok: true, reference };
}
