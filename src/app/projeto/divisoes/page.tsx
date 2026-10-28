import type { Metadata } from "next";
import { RoomSelector } from "@/components/wizard/RoomSelector";

export const metadata: Metadata = { title: "O que quer renovar?" };

export default function DivisoesPage() {
  return <RoomSelector />;
}
