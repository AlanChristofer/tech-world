import { redirect } from "next/navigation";

export const metadata = { title: "Sobre / About" };

export default function AboutPage() {
  redirect("/?destination=about");
}
