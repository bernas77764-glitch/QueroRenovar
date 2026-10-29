"use client";

import { useState } from "react";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { TextAreaField } from "@/components/ui/Field";
import { QUALITY_LEVELS, WORKS, type Work } from "@/lead/catalog";
import { useLead } from "@/lead/LeadProvider";
import { DETAILS_MAX, NOTES_MAX, workIssue, type SelectedWork } from "@/lead/request";
import { StepNav } from "./StepNav";
import { StepShell } from "./StepShell";

const pill =
  "flex min-h-11 cursor-pointer flex-col items-center justify-center rounded-xl border border-ink-200 bg-white px-2 py-1.5 text-center transition hover:border-ink-500 has-checked:border-brand-600 has-checked:bg-brand-50 has-checked:text-brand-800 has-focus-visible:ring-2 has-focus-visible:ring-brand-600 has-focus-visible:ring-offset-2";

function WorkOptions({ work, selected, showIssue }: { work: Work; selected: SelectedWork; showIssue: boolean }) {
  const { dispatch } = useLead();
  const update = (patch: Partial<Omit<SelectedWork, "workId">>) =>
    dispatch({ type: "updateWork", workId: work.id, patch });
  const issue = showIssue ? workIssue(selected) : null;
  const issueId = `issue-${work.id}`;

  return (
    <div className="border-t border-brand-200 px-4 pb-4 pt-3">
      {work.quality && (
        <fieldset aria-describedby={issue ? issueId : undefined}>
          <legend className="text-sm font-medium">Nível de qualidade</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {QUALITY_LEVELS.map((level) => (
              <label key={level.id} className={pill}>
                <input
                  type="radio"
                  name={`quality-${work.id}`}
                  className="sr-only"
                  checked={selected.quality === level.id}
                  onChange={() => update({ quality: level.id })}
                />
                <span className="text-sm font-medium">{level.label}</span>
                <span className="hidden text-xs text-ink-500 sm:block">{level.description}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {work.quantity && (
        <div className="flex items-center gap-3">
          <label htmlFor={`quantity-${work.id}`} className="text-sm font-medium">
            {work.quantity.label}
          </label>
          <input
            id={`quantity-${work.id}`}
            type="number"
            inputMode="numeric"
            min={1}
            max={work.quantity.max}
            step={1}
            value={selected.quantity ?? ""}
            aria-describedby={issue ? issueId : undefined}
            onChange={(event) => {
              const value = event.target.valueAsNumber;
              update({ quantity: Number.isFinite(value) ? Math.trunc(value) : null });
            }}
            className="w-24 rounded-xl border border-ink-300 bg-white px-3 py-2 text-base focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30"
          />
        </div>
      )}
      {work.details && (
        <TextAreaField
          id={`details-${work.id}`}
          label="Que trabalho pretende?"
          rows={2}
          maxLength={DETAILS_MAX}
          value={selected.details}
          aria-describedby={issue ? issueId : undefined}
          onChange={(event) => update({ details: event.target.value })}
        />
      )}
      {issue && (
        <p id={issueId} className="mt-2 text-sm text-red-700">
          {issue}
        </p>
      )}
    </div>
  );
}

/** Passo 3 — which works, with quality level, quantity or a description where needed. */
export function WorksStep() {
  const { request, dispatch } = useLead();
  const [attempted, setAttempted] = useState(false);

  return (
    <StepShell
      step="trabalhos"
      title="Que trabalhos pretende?"
      intro={<p>Escolha todos os que se aplicam. Em alguns, indique o nível de qualidade ou a quantidade.</p>}
    >
      <div className="grid gap-2">
        {WORKS.map((work) => {
          const selected = request.works.find((w) => w.workId === work.id);
          const hasOptions = work.quality || work.quantity || work.details;
          const issue = attempted && selected ? workIssue(selected) : null;
          return (
            <div
              key={work.id}
              className={`overflow-hidden rounded-xl ${
                selected && hasOptions ? `border bg-brand-50 ${issue ? "border-red-400" : "border-brand-600"}` : ""
              }`}
            >
              <ChoiceCard
                type="checkbox"
                name="trabalhos"
                value={work.id}
                checked={selected !== undefined}
                onChange={(checked) => dispatch({ type: "setWorkSelected", workId: work.id, selected: checked })}
                title={work.label}
                description={work.description}
                flat={selected !== undefined && Boolean(hasOptions)}
              />
              {selected && hasOptions && <WorkOptions work={work} selected={selected} showIssue={attempted} />}
            </div>
          );
        })}
      </div>

      <TextAreaField
        id="notes"
        className="mt-6"
        label="Quer acrescentar algum detalhe?"
        hint="Por exemplo: o estado atual da casa, materiais que já tem ou restrições de horário."
        optional
        rows={3}
        maxLength={NOTES_MAX}
        value={request.notes}
        onChange={(event) => dispatch({ type: "setNotes", notes: event.target.value })}
      />

      <StepNav step="trabalhos" onAttempt={() => setAttempted(true)} />
    </StepShell>
  );
}
