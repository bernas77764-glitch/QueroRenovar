import type { ReactNode } from "react";
import { Progress, type WizardStepId } from "./Progress";

interface WizardShellProps {
  step: WizardStepId;
  title: string;
  intro?: ReactNode;
  /** Shown next to the title, e.g. the room name input. */
  aside?: ReactNode;
  children: ReactNode;
}

export function WizardShell({ step, title, intro, aside, children }: WizardShellProps) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:py-10">
      <Progress current={step} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {aside}
      </div>
      {intro && <div className="mt-2 text-ink-700">{intro}</div>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function WizardLoading({ step }: { step: WizardStepId }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:py-10" aria-busy="true">
      <Progress current={step} />
      <p className="text-ink-500">A carregar o seu projeto…</p>
    </div>
  );
}
