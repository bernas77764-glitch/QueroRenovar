import type { Metadata } from "next";
import { WorksStep } from "@/components/pedido/WorksStep";

export const metadata: Metadata = { title: "Que trabalhos pretende?" };

export default function Page() {
  return <WorksStep />;
}
