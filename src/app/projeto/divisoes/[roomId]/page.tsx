import type { Metadata } from "next";
import { Suspense } from "react";
import { RoomConfigurator } from "@/components/wizard/RoomConfigurator";
import { WizardLoading } from "@/components/wizard/WizardShell";

export const metadata: Metadata = { title: "Configurar divisão" };

/*
 * The room id is only known at request time and the room itself lives in the
 * browser, so the page is a static shell: the client component reads the id
 * with useParams inside a Suspense boundary.
 */
export default function ConfigurarDivisaoPage() {
  return (
    <Suspense fallback={<WizardLoading step="configurar" />}>
      <RoomConfigurator />
    </Suspense>
  );
}
