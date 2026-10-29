"use client";

import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { URGENCY_LEVELS } from "@/lead/catalog";
import { useLead } from "@/lead/LeadProvider";
import { StepNav } from "./StepNav";
import { StepShell } from "./StepShell";

/** Passo 4 — when the client wants the works to start. */
export function UrgencyStep() {
  const { request, dispatch } = useLead();

  return (
    <StepShell step="urgencia" title="Quando quer começar a obra?">
      <fieldset>
        <legend className="sr-only">Nível de urgência</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {URGENCY_LEVELS.map((level) => (
            <ChoiceCard
              key={level.id}
              type="radio"
              name="urgencia"
              value={level.id}
              checked={request.urgency === level.id}
              onChange={() => dispatch({ type: "setUrgency", urgency: level.id })}
              title={level.label}
              description={level.description}
            />
          ))}
        </div>
      </fieldset>
      <StepNav step="urgencia" />
    </StepShell>
  );
}
