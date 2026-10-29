import type { ReactNode } from "react";
import { LeadProvider } from "@/lead/LeadProvider";

export default function PedidoLayout({ children }: { children: ReactNode }) {
  return <LeadProvider>{children}</LeadProvider>;
}
