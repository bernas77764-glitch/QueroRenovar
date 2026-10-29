import type { Metadata } from "next";
import { AreasStep } from "@/components/pedido/AreasStep";

export const metadata: Metadata = { title: "Área de cada espaço" };

export default function Page() {
  return <AreasStep />;
}
