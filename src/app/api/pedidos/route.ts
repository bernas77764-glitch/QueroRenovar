import { getCloudflareContext } from "@opennextjs/cloudflare";
import { referenceFor, saveLead, type PedidosStore } from "@/lead/store";

const MAX_BODY_BYTES = 32_000;

/** Receives a completed request with the client's contacts and stores it as a lead. */
export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return Response.json({ errors: ["Pedido demasiado grande."] }, { status: 413 });

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ errors: ["Pedido inválido."] }, { status: 400 });
  }

  // Honeypot filled in: answer as if it worked, store nothing.
  const fields = (typeof body === "object" && body !== null ? body : {}) as { website?: unknown; request?: { id?: unknown } };
  if (typeof fields.website === "string" && fields.website.trim() !== "") {
    const id = typeof fields.request?.id === "string" ? fields.request.id : crypto.randomUUID();
    return Response.json({ reference: referenceFor(id) });
  }

  const store = (getCloudflareContext().env as { PEDIDOS?: PedidosStore }).PEDIDOS;
  if (!store) {
    console.error("Binding PEDIDOS em falta: o pedido não foi guardado.");
    return Response.json({ errors: ["Serviço temporariamente indisponível. Tente mais tarde."] }, { status: 503 });
  }

  try {
    const result = await saveLead(store, body);
    if (!result.ok) return Response.json({ errors: result.errors }, { status: result.status });
    return Response.json({ reference: result.reference }, { status: 201 });
  } catch (error) {
    console.error("Erro ao guardar o pedido", error);
    return Response.json({ errors: ["Não foi possível guardar o pedido. Tente novamente."] }, { status: 500 });
  }
}
