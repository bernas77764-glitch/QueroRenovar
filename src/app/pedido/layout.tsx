import type { ReactNode } from "react";
import { LeadProvider } from "@/lead/LeadProvider";

export default function PedidoLayout({ children }: { children: ReactNode }) {
  return (
    <LeadProvider>
      <div className="relative isolate flex flex-1 flex-col">
        {/* Photo band behind the top of the step card, fading into the page background. */}
        <div aria-hidden="true" className="hero-photo absolute inset-x-0 top-0 -z-10 h-48 sm:h-64">
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/55 via-ink-900/30 to-surface" />
        </div>
        {children}
      </div>
    </LeadProvider>
  );
}
