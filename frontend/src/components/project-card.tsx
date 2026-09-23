"use client";

import { ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { SkillIcon } from "@/components/skill-icon";
import { useI18n } from "@/i18n/language-context";
import type { Project } from "@/types/portfolio";

export function ProjectCard({ project }: { project: Project }) {
  const { language, t } = useI18n();
  const status = language === "pt-BR" ? project.status : project.statusEn;
  const summary = language === "pt-BR" ? project.shortDescription : project.shortDescriptionEn;
  return <article className={`project-card panel${project.featured ? " featured-project" : ""}`}>
    <div className="card-topline"><span>{project.featured ? t("project.featured") : t("projects.eyebrow")}</span><span className="status-dot">{status}</span></div>
    <h2>{project.name}</h2><p>{summary}</p>
    <div className="tags technology-tags">{project.technologies.map((technology) => <span key={technology}><SkillIcon name={technology} size={15} />{technology}</span>)}</div>
    <div className="card-links">
      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">{t("project.view")} <ExternalLink size={15} aria-hidden /></a>}
      <Link href={`/projects/${project.slug}`}>{t("project.details")} <ArrowUpRight size={15} aria-hidden /></Link>
    </div>
  </article>;
}
