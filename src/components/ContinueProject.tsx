"use client";

import { useSyncExternalStore } from "react";
import { LinkButton } from "@/components/ui/Button";
import { loadProject } from "@/domain/storage";

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};
const getSnapshot = () => loadProject()?.rooms.length ?? 0;
const getServerSnapshot = () => 0;

/** Offers to resume a project saved in this browser. Renders nothing on the server and when there is no project. */
export function ContinueProject() {
  const rooms = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (rooms === 0) return null;
  return (
    <LinkButton href="/projeto/rever" variant="secondary">
      Continuar o meu projeto ({rooms} {rooms === 1 ? "divisão" : "divisões"})
    </LinkButton>
  );
}
