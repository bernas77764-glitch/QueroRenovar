import type { ReactNode } from "react";
import { ProjectProvider } from "@/domain/ProjectProvider";

export default function ProjetoLayout({ children }: { children: ReactNode }) {
  return <ProjectProvider>{children}</ProjectProvider>;
}
