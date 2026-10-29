import type { Metadata } from "next";
import { SpacesStep } from "@/components/pedido/SpacesStep";

export const metadata: Metadata = { title: "Que espaços quer remodelar?" };

export default function Page() {
  return <SpacesStep />;
}
