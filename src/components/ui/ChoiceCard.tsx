"use client";

import type { ReactNode } from "react";

interface ChoiceCardProps {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description?: ReactNode;
  /** Small badge shown next to the title, e.g. "Sujeito a avaliação". */
  badge?: string;
  compact?: boolean;
}

/**
 * A selectable card backed by a native radio or checkbox, so keyboard,
 * screen readers and form semantics work as usual. Selection is shown by
 * border, background and a check mark — never by colour alone.
 */
export function ChoiceCard({ type, name, value, checked, onChange, title, description, badge, compact }: ChoiceCardProps) {
  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-xl border bg-white transition has-checked:border-brand-600 has-checked:bg-brand-50 has-focus-visible:ring-2 has-focus-visible:ring-brand-600 has-focus-visible:ring-offset-2 ${
        checked ? "border-brand-600" : "border-ink-200 hover:border-ink-500"
      } ${compact ? "px-3 py-2.5" : "p-4"}`}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center border border-ink-300 bg-white text-white peer-checked:border-brand-600 peer-checked:bg-brand-600 ${
          type === "radio" ? "rounded-full" : "rounded-md"
        }`}
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m3.5 8.5 3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className={compact ? "text-sm font-medium sm:text-base" : "font-medium"}>{title}</span>
          {badge && (
            <span className="rounded-full bg-pending-100 px-2 py-0.5 text-xs font-medium text-pending-700">{badge}</span>
          )}
        </span>
        {description && <span className="mt-0.5 block text-sm text-ink-500">{description}</span>}
      </span>
    </label>
  );
}
