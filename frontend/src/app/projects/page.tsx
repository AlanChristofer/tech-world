import { redirect } from "next/navigation";

export const metadata = { title: "Projetos / Projects" };

export default function ProjectsPage() {
  redirect("/?destination=projects");
}
