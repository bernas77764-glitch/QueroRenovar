export const WIZARD_STEPS = [
  { id: "divisoes", label: "Divisões" },
  { id: "configurar", label: "Configurar" },
  { id: "rever", label: "Rever" },
  { id: "estimativa", label: "Estimativa" },
  { id: "pedido", label: "Pedido" },
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number]["id"];

export function Progress({ current }: { current: WizardStepId }) {
  const index = WIZARD_STEPS.findIndex((s) => s.id === current);
  return (
    <nav aria-label="Progresso" className="mb-6">
      <p className="text-sm text-ink-500">
        Passo {index + 1} de {WIZARD_STEPS.length}
        <span className="text-ink-900"> · {WIZARD_STEPS[index].label}</span>
      </p>
      <ol className="mt-2 flex gap-1.5">
        {WIZARD_STEPS.map((step, i) => (
          <li
            key={step.id}
            aria-current={i === index ? "step" : undefined}
            className={`h-1.5 flex-1 rounded-full ${i <= index ? "bg-brand-600" : "bg-ink-200"}`}
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
