"use client";

import { MAX_SPACES_PER_TYPE, SPACE_TYPES } from "@/lead/catalog";
import { useLead } from "@/lead/LeadProvider";
import { countSpacesOfType } from "@/lead/request";
import { SpaceIcon } from "./SpaceIcon";
import { StepNav } from "./StepNav";
import { StepShell } from "./StepShell";

const stepButton =
  "flex size-9 items-center justify-center rounded-full border border-brand-600 bg-white text-lg leading-none text-brand-700 transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40";

/** Passo 1 — which spaces to renovate. A selected card shows − and + to say how many. */
export function SpacesStep() {
  const { request, dispatch } = useLead();

  return (
    <StepShell
      step="espacos"
      title="Que espaços quer remodelar?"
      intro={<p>Escolha um ou mais espaços. Se for mais do que um do mesmo tipo, use o + para indicar quantos.</p>}
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SPACE_TYPES.map((type) => {
          const count = countSpacesOfType(request, type.id);
          const selected = count > 0;
          const setCount = (value: number) => dispatch({ type: "setSpaceCount", spaceType: type.id, count: value });
          return (
            <li key={type.id} className="relative">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => setCount(selected ? 0 : 1)}
                className={`flex h-full min-h-36 w-full flex-col items-center justify-start gap-2 rounded-2xl border-2 px-3 pt-5 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
                  selected
                    ? "border-brand-600 bg-brand-50 pb-16 text-brand-800"
                    : "border-ink-200 bg-white pb-5 text-ink-900 hover:border-ink-500"
                }`}
              >
                <SpaceIcon type={type.id} className="size-9" />
                <span className="font-medium leading-tight">{type.label}</span>
                {selected && (
                  <span
                    aria-hidden="true"
                    className="absolute right-2.5 top-2.5 flex size-6 items-center justify-center rounded-full bg-brand-600 text-white"
                  >
                    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m3.5 8.5 3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </button>
              {selected && (
                <div
                  role="group"
                  aria-label={`Quantidade: ${type.label}`}
                  className="absolute inset-x-3 bottom-3 flex items-center justify-between"
                >
                  <button
                    type="button"
                    className={stepButton}
                    aria-label={`Menos um: ${type.label}`}
                    onClick={() => setCount(count - 1)}
                  >
                    −
                  </button>
                  <output aria-live="polite" className="text-lg font-semibold tabular-nums text-brand-800">
                    {count}
                  </output>
                  <button
                    type="button"
                    className={stepButton}
                    aria-label={`Mais um: ${type.label}`}
                    disabled={count >= MAX_SPACES_PER_TYPE}
                    onClick={() => setCount(count + 1)}
                  >
                    +
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm text-ink-500" aria-live="polite">
        {request.spaces.length === 0
          ? "Nenhum espaço escolhido."
          : request.spaces.length === 1
            ? "1 espaço escolhido."
            : `${request.spaces.length} espaços escolhidos.`}
      </p>
      <StepNav step="espacos" />
    </StepShell>
  );
}
