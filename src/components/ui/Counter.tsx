"use client";

interface CounterProps {
  id: string;
  label: string;
  description?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

const stepButton =
  "flex size-11 shrink-0 items-center justify-center rounded-full border border-ink-300 bg-white text-xl leading-none text-ink-900 transition hover:border-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink-300 disabled:hover:text-ink-900";

export function Counter({ id, label, description, value, min = 0, max = 9, onChange }: CounterProps) {
  const labelId = `${id}-label`;
  const selected = value > 0;
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border bg-white p-4 ${
        selected ? "border-brand-600" : "border-ink-200"
      }`}
    >
      <div className="min-w-0">
        <span id={labelId} className="block font-medium">
          {label}
        </span>
        {description && <span className="mt-0.5 block text-sm text-ink-500">{description}</span>}
      </div>
      <div className="flex items-center gap-2" role="group" aria-labelledby={labelId}>
        <button
          type="button"
          className={stepButton}
          aria-label={`Menos uma: ${label}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          −
        </button>
        <output aria-live="polite" aria-labelledby={labelId} className="w-8 text-center text-lg font-semibold tabular-nums">
          {value}
        </output>
        <button
          type="button"
          className={stepButton}
          aria-label={`Mais uma: ${label}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
