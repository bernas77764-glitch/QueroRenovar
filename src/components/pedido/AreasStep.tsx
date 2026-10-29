"use client";

import { useState } from "react";
import { CUSTOM_SIZE_MAX, CUSTOM_SIZE_MIN, SIZE_RANGES } from "@/lead/catalog";
import { useLead } from "@/lead/LeadProvider";
import { sizeIssue, spaceName, type Space, type SpaceSize } from "@/lead/request";
import { SpaceIcon } from "./SpaceIcon";
import { StepNav } from "./StepNav";
import { StepShell } from "./StepShell";

const pill =
  "flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-3 text-center text-sm font-medium transition has-checked:border-brand-600 has-checked:bg-brand-50 has-checked:text-brand-800 has-focus-visible:ring-2 has-focus-visible:ring-brand-600 has-focus-visible:ring-offset-2 border-ink-200 bg-white hover:border-ink-500";

function SpaceSizeCard({ space, name, showIssue }: { space: Space; name: string; showIssue: boolean }) {
  const { dispatch } = useLead();
  const setSize = (size: SpaceSize | null) => dispatch({ type: "setSize", spaceId: space.id, size });
  const size = space.size;
  const issue = showIssue ? sizeIssue(size) : null;
  const group = `size-${space.id}`;
  const inputId = `custom-${space.id}`;

  return (
    <fieldset
      className={`rounded-2xl border bg-white p-4 ${issue ? "border-red-300" : "border-ink-200"}`}
      aria-describedby={issue ? `${group}-issue` : undefined}
    >
      <legend className="sr-only">Área de {name}</legend>
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <SpaceIcon type={space.type} className="size-6" />
        </span>
        <span className="font-semibold">{name}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SIZE_RANGES.map((range) => (
          <label key={range.id} className={pill}>
            <input
              type="radio"
              name={group}
              className="sr-only"
              checked={size?.kind === "range" && size.rangeId === range.id}
              onChange={() => setSize({ kind: "range", rangeId: range.id })}
            />
            {range.label}
          </label>
        ))}
        <label className={pill}>
          <input
            type="radio"
            name={group}
            className="sr-only"
            checked={size?.kind === "custom"}
            onChange={() => setSize({ kind: "custom", squareMeters: null })}
          />
          Personalizado
        </label>
      </div>
      {size?.kind === "custom" && (
        <div className="mt-3 flex items-center gap-2">
          <label htmlFor={inputId} className="text-sm font-medium">
            Área exata
          </label>
          <input
            id={inputId}
            type="number"
            inputMode="decimal"
            min={CUSTOM_SIZE_MIN}
            max={CUSTOM_SIZE_MAX}
            step="0.5"
            autoFocus
            value={size.squareMeters ?? ""}
            onChange={(event) => {
              const value = event.target.valueAsNumber;
              setSize({ kind: "custom", squareMeters: Number.isFinite(value) ? value : null });
            }}
            className="w-28 rounded-xl border border-ink-300 bg-white px-3 py-2 text-base focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30"
          />
          <span className="text-ink-700">m²</span>
        </div>
      )}
      {issue && (
        <p id={`${group}-issue`} className="mt-2 text-sm text-red-700">
          {issue}
        </p>
      )}
    </fieldset>
  );
}

/** Passo 2 — approximate area of each space. */
export function AreasStep() {
  const { request } = useLead();
  const [attempted, setAttempted] = useState(false);

  return (
    <StepShell
      step="areas"
      title="Qual é a área de cada espaço?"
      intro={<p>Uma estimativa chega. Se souber a medida exata, escolha «Personalizado».</p>}
    >
      <div className="grid gap-3">
        {request.spaces.map((space) => (
          <SpaceSizeCard key={space.id} space={space} name={spaceName(request, space)} showIssue={attempted} />
        ))}
      </div>
      <StepNav step="areas" onAttempt={() => setAttempted(true)} />
    </StepShell>
  );
}
