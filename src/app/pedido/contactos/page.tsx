import type { Metadata } from "next";
import { ContactStep } from "@/components/pedido/ContactStep";

export const metadata: Metadata = { title: "Receber propostas" };

export default function Page() {
  return <ContactStep />;
}
