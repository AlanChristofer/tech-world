import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { TranslatedAvatarGuide } from "@/components/translated-avatar-guide";
import { T } from "@/i18n/language-context";
import { getPortfolioData } from "@/services/api";

export const metadata = { title: "Projetos / Projects" };
export default async function ProjectsPage() { const { projects } = await getPortfolioData(); return <section className="container page"><SectionHeading eyebrow={<T id="projects.eyebrow" />} title={<T id="projects.title" />} description={<T id="projects.description" />} /><TranslatedAvatarGuide state="explaining" message="avatar.projects.intro" /><div className="project-grid">{projects.map((project) => <ProjectCard project={project} key={project.id} />)}</div></section>; }
