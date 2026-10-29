"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { concelhosOf, DISTRITOS } from "@/lead/concelhos";
import { useLead } from "@/lead/LeadProvider";
import {
  contactIssues,
  describeSize,
  describeUrgency,
  describeWork,
  spaceName,
  type Contact,
  type ContactField,
} from "@/lead/request";
import { StepShell } from "./StepShell";

const EMPTY_CONTACT: Contact = { name: "", email: "", phone: "", district: "", municipality: "", acceptedTerms: false };

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "error"; message: string } | { kind: "sent"; reference: string };

function RequestSummary() {
  const { request } = useLead();
  return (
    <details className="rounded-2xl border border-ink-200 bg-white p-4">
      <summary className="cursor-pointer font-medium">Rever o meu pedido</summary>
      <dl className="mt-3 grid gap-3 text-sm">
        <div>
          <dt className="font-medium">Espaços</dt>
          <dd className="text-ink-700">
            {request.spaces.map((s) => `${spaceName(request, s)} (${describeSize(s.size)})`).join(", ")}
          </dd>
        </div>
        <div>
          <dt className="font-medium">Trabalhos</dt>
          <dd className="text-ink-700">{request.works.map(describeWork).join(", ")}</dd>
        </div>
        <div>
          <dt className="font-medium">Urgência</dt>
          <dd className="text-ink-700">{describeUrgency(request.urgency)}</dd>
        </div>
        {request.notes.trim() && (
          <div>
            <dt className="font-medium">Observações</dt>
            <dd className="whitespace-pre-line text-ink-700">{request.notes.trim()}</dd>
          </div>
        )}
      </dl>
      <Link href="/pedido/espacos" className="mt-3 inline-block text-sm font-medium text-brand-700 underline">
        Alterar o pedido
      </Link>
    </details>
  );
}

function Sent({ reference }: { reference: string }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-10 pt-8 sm:px-4 sm:pb-16 sm:pt-14">
      <div className="rounded-3xl border border-ink-200 bg-white p-5 shadow-xl shadow-ink-900/10 sm:p-8">
        <Notice tone="ok" title="Pedido enviado">
          <p>
            Referência do pedido: <strong>{reference}</strong>
          </p>
        </Notice>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">Obrigado! Já recebemos o seu pedido.</h1>
        <p className="mt-3 text-ink-700">
          Vamos analisá-lo e encaminhá-lo para profissionais da sua zona. Será contactado em breve, por telefone ou email,
          com propostas para a sua remodelação.
        </p>
        <LinkButton href="/" variant="secondary" className="mt-8">
          Voltar ao início
        </LinkButton>
      </div>
    </div>
  );
}

/** Passo 5 — thank-you page that collects the contact details and submits the request. */
export function ContactStep() {
  const { request, dispatch } = useLead();
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [website, setWebsite] = useState("");

  // Shown before the shell: once sent, the stored request is reset and the earlier steps are empty again.
  if (status.kind === "sent") return <Sent reference={status.reference} />;

  const issues = contactIssues(contact);
  const visible = (field: ContactField) => (attempted ? issues[field] : undefined);
  const set = (patch: Partial<Contact>) => setContact((c) => ({ ...c, ...patch }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    const first = (Object.keys(issues) as ContactField[])[0];
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ request, contact, website }),
      });
      const data = (await response.json().catch(() => null)) as { reference?: string; errors?: string[] } | null;
      if (!response.ok || !data?.reference) {
        setStatus({
          kind: "error",
          message: data?.errors?.join(" ") || "Não foi possível enviar o pedido. Tente novamente dentro de momentos.",
        });
        return;
      }
      setStatus({ kind: "sent", reference: data.reference });
      dispatch({ type: "reset" });
      window.scrollTo({ top: 0 });
    } catch {
      setStatus({ kind: "error", message: "Sem ligação à internet. Verifique a ligação e tente novamente." });
    }
  };

  return (
    <StepShell
      step="contactos"
      title="Obrigado! Falta só um passo."
      intro={
        <p>
          Deixe os seus contactos para receber propostas de profissionais para a sua remodelação. Não tem qualquer
          custo nem compromisso.
        </p>
      }
    >
      <RequestSummary />

      <form noValidate onSubmit={submit} className="mt-6 grid gap-4">
        <TextField
          id="contact-name"
          label="Nome"
          autoComplete="name"
          maxLength={100}
          value={contact.name}
          onChange={(e) => set({ name: e.target.value })}
          error={visible("name")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="contact-email"
            label="Email"
            type="email"
            autoComplete="email"
            maxLength={200}
            value={contact.email}
            onChange={(e) => set({ email: e.target.value })}
            error={visible("email")}
          />
          <TextField
            id="contact-phone"
            label="Telefone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={25}
            placeholder="912 345 678"
            value={contact.phone}
            onChange={(e) => set({ phone: e.target.value })}
            error={visible("phone")}
          />
        </div>
        <fieldset>
          <legend className="font-medium">Local da obra</legend>
          <p className="mt-0.5 text-sm text-ink-500">Onde vai ser feita a remodelação.</p>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <SelectField
              id="contact-district"
              label="Distrito"
              placeholder="Escolha o distrito"
              options={DISTRITOS.map((d) => d.nome)}
              value={contact.district}
              onChange={(e) => set({ district: e.target.value, municipality: "" })}
              error={visible("district")}
            />
            <SelectField
              id="contact-municipality"
              label="Concelho"
              placeholder={contact.district ? "Escolha o concelho" : "Escolha primeiro o distrito"}
              options={concelhosOf(contact.district)}
              disabled={!contact.district}
              value={contact.municipality}
              onChange={(e) => set({ municipality: e.target.value })}
              error={visible("municipality")}
            />
          </div>
        </fieldset>

        {/* Honeypot: hidden from people, filled in by bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              id="contact-acceptedTerms"
              type="checkbox"
              checked={contact.acceptedTerms}
              onChange={(e) => set({ acceptedTerms: e.target.checked })}
              aria-invalid={visible("acceptedTerms") ? true : undefined}
              aria-describedby={visible("acceptedTerms") ? "contact-acceptedTerms-error" : undefined}
              className="mt-1 size-5 shrink-0 accent-brand-600"
            />
            <span className="text-sm text-ink-700">
              Li e aceito os{" "}
              <Link href="/termos" target="_blank" className="font-medium text-brand-700 underline">
                Termos e Condições e a Política de Privacidade
              </Link>
              , incluindo a partilha dos meus dados com profissionais parceiros para receber propostas.
            </span>
          </label>
          {visible("acceptedTerms") && (
            <p id="contact-acceptedTerms-error" className="mt-1.5 text-sm text-red-700">
              {visible("acceptedTerms")}
            </p>
          )}
        </div>

        {status.kind === "error" && <Notice tone="error">{status.message}</Notice>}

        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <LinkButton href="/pedido/urgencia" variant="ghost">
            Voltar
          </LinkButton>
          <Button type="submit" disabled={status.kind === "sending"} className="sm:min-w-56">
            {status.kind === "sending" ? "A enviar…" : "Enviar e receber propostas"}
          </Button>
        </div>
      </form>
    </StepShell>
  );
}
