import type { ReactNode } from "react";

type Tone = "info" | "pending" | "ok" | "error";

const tones: Record<Tone, { box: string; icon: string; label: string }> = {
  info: { box: "border-ink-200 bg-white text-ink-700", icon: "i", label: "Informação" },
  pending: { box: "border-pending-700/30 bg-pending-100 text-pending-700", icon: "?", label: "Por confirmar" },
  ok: { box: "border-ok-700/30 bg-ok-100 text-ok-700", icon: "✓", label: "Completo" },
  error: { box: "border-red-300 bg-red-50 text-red-800", icon: "!", label: "Atenção" },
};

interface NoticeProps {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Notice({ tone = "info", title, children, className = "" }: NoticeProps) {
  const style = tones[tone];
  return (
    <div role={tone === "error" ? "alert" : undefined} className={`flex gap-3 rounded-xl border p-4 text-sm ${style.box} ${className}`}>
      <span
        aria-label={style.label}
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold"
      >
        {style.icon}
      </span>
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? "mt-1" : ""}>{children}</div>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  tone: "pending" | "ok" | "muted";
  children: ReactNode;
}

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  const style = {
    pending: "bg-pending-100 text-pending-700",
    ok: "bg-ok-100 text-ok-700",
    muted: "bg-ink-100 text-ink-700",
  }[tone];
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>{children}</span>;
}
