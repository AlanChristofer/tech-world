import { notFound } from "next/navigation";
import { ProjectDetailsView } from "@/components/localized-views";
import { getProject } from "@/services/api";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const project = await getProject(slug); if (!project) notFound(); return <ProjectDetailsView project={project} />; }
