import type { Metadata } from "next";
import { UrgencyStep } from "@/components/pedido/UrgencyStep";

export const metadata: Metadata = { title: "Quando quer começar a obra?" };

export default function Page() {
  return <UrgencyStep />;
}
