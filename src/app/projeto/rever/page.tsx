import type { Metadata } from "next";
import { ProjectReview } from "@/components/wizard/ProjectReview";

export const metadata: Metadata = { title: "Rever o projeto" };

export default function ReverPage() {
  return <ProjectReview />;
}
