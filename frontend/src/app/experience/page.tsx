import { redirect } from "next/navigation";

export const metadata = { title: "Experiência / Experience" };

export default function ExperiencePage() {
  redirect("/?destination=career");
}
