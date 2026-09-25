import { redirect } from "next/navigation";

export const metadata = { title: "Habilidades / Skills" };

export default function SkillsPage() {
  redirect("/?destination=skills");
}
