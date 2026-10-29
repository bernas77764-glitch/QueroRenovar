import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

const control =
  "w-full rounded-xl border border-ink-300 bg-white px-3.5 py-2.5 text-base text-ink-900 placeholder:text-ink-500/80 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30";

interface FieldLabelProps {
  htmlFor: string;
  label: string;
  hint?: string;
  optional?: boolean;
}

export function FieldLabel({ htmlFor, label, hint, optional }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block">
      <span className="font-medium">
        {label}
        {optional && <span className="ml-1 text-sm font-normal text-ink-500">(opcional)</span>}
      </span>
      {hint && (
        <span id={`${htmlFor}-hint`} className="mt-0.5 block text-sm text-ink-500">
          {hint}
        </span>
      )}
    </label>
  );
}

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  suffix?: ReactNode;
  /** Validation message; marks the input invalid and is read with it. */
  error?: string;
}

export function TextField({ id, label, hint, optional, suffix, error, className = "", ...props }: TextFieldProps) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} label={label} hint={hint} optional={optional} />
      <div className="flex items-center gap-2">
        <input
          id={id}
          className={`${control} ${error ? "border-red-400" : ""}`}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {suffix && <span className="shrink-0 text-ink-700">{suffix}</span>}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
}

export function TextAreaField({ id, label, hint, optional, className = "", rows = 3, ...props }: TextAreaFieldProps) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} label={label} hint={hint} optional={optional} />
      <textarea id={id} rows={rows} className={control} aria-describedby={hint ? `${id}-hint` : undefined} {...props} />
    </div>
  );
}

interface FieldsetProps {
  legend: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Fieldset({ legend, hint, children, className = "" }: FieldsetProps) {
  return (
    <fieldset className={className}>
      <legend className="font-medium">{legend}</legend>
      {hint && <p className="mt-0.5 text-sm text-ink-500">{hint}</p>}
      <div className="mt-3 grid gap-2">{children}</div>
    </fieldset>
  );
}
