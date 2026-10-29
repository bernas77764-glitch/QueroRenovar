"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { useLead } from "@/lead/LeadProvider";
import { STEPS, stepIssues, type StepId } from "@/lead/request";

/**
 * Back and Continue for a step. Continue is always enabled: when the step is
 * incomplete it lists what is missing instead of silently doing nothing.
 * `onAttempt` lets the step highlight its own incomplete items.
 */
export function StepNav({ step, onAttempt }: { step: StepId; onAttempt?: () => void }) {
  const { request } = useLead();
  const router = useRouter();
  const [attempted, setAttempted] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const index = STEPS.findIndex((s) => s.id === step);
  const previous = index > 0 ? STEPS[index - 1] : null;
  const next = STEPS[index + 1];
  const issues = stepIssues(request, step);
  const showIssues = attempted && issues.length > 0;

  useEffect(() => {
    if (showIssues) summaryRef.current?.focus();
  }, [showIssues]);

  return (
    <div className="mt-8">
      {showIssues && (
        <div ref={summaryRef} tabIndex={-1} className="mb-4 focus:outline-none">
          <Notice tone="error" title="Falta completar">
            <ul className="list-disc pl-4">
              {issues.map((issue) => (
                <li key={issue.target ?? issue.message}>{issue.message}</li>
              ))}
            </ul>
          </Notice>
        </div>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <LinkButton href={previous?.path ?? "/"} variant="ghost">
          {previous ? "Voltar" : "Voltar ao início"}
        </LinkButton>
        <Button
          className="sm:min-w-44"
          onClick={() => {
            if (issues.length > 0) {
              setAttempted(true);
              onAttempt?.();
              return;
            }
            router.push(next.path);
          }}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
