"use client";

import type { ReactNode } from "react";
import { LinkButton } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { useLead } from "@/lead/LeadProvider";
import { firstIncompleteStepBefore, STEPS, type StepId } from "@/lead/request";

function Progress({ current }: { current: StepId }) {
  const index = STEPS.findIndex((s) => s.id === current);
  return (
    <nav aria-label="Progresso" className="mb-6">
      <p className="text-sm text-ink-500">
        Passo {index + 1} de {STEPS.length}
        <span className="text-ink-900"> · {STEPS[index].label}</span>
      </p>
      <ol className="mt-2 flex gap-1.5">
        {STEPS.map((step, i) => (
          <li
            key={step.id}
            aria-current={i === index ? "step" : undefined}
            className={`h-1.5 flex-1 rounded-full ${i <= index ? "bg-brand-500" : "bg-ink-200"}`}
          >
            <span className="sr-only">
              {step.label}
              {i < index ? " (concluído)" : i === index ? " (atual)" : ""}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface StepShellProps {
  step: StepId;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}

/**
 * Layout of every step. Waits for the stored request, and sends the client back
 * when an earlier step is still incomplete (e.g. opening a later step directly).
 */
export function StepShell({ step, title, intro, children }: StepShellProps) {
  const { request, ready } = useLead();
  const missing = ready ? firstIncompleteStepBefore(request, step) : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <Progress current={step} />
      {!ready ? (
        <p className="text-ink-500" aria-busy="true">
          A carregar o seu pedido…
        </p>
      ) : missing ? (
        <Notice tone="pending" title="Falta completar um passo anterior">
          <p>Antes deste passo, complete o passo «{missing.label}».</p>
          <LinkButton href={missing.path} className="mt-3">
            Ir para «{missing.label}»
          </LinkButton>
        </Notice>
      ) : (
        <>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {intro && <div className="mt-2 text-ink-700">{intro}</div>}
          <div className="mt-6">{children}</div>
        </>
      )}
    </div>
  );
}
