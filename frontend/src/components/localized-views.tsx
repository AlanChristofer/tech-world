"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, Braces, BriefcaseBusiness, Code2, Database, Download, ExternalLink, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";
import { ImplementationInsight } from "@/components/implementation-insight";
import { LazyAvatarGuide } from "@/components/lazy-avatar-guide";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { SkillIcon } from "@/components/skill-icon";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/language-context";
import type { AvatarState } from "./avatar-scene";
import type { Experience, Profile, Project, Skill } from "@/types/portfolio";

export function HomeView({ profile, projects }: { profile: Profile; projects: Project[] }) {
  const { language, t } = useI18n();
  return <>
    <section className="container hero hero-home"><div className="hero-copy">
      <div className="command-line">~/portfolio $ whoami</div><h1>Alan <span>Christofer</span></h1><div className="hero-role">Software Developer</div>
      <p className="hero-summary">Backend • Full Stack • APIs • {language === "pt-BR" ? "Arquitetura" : "Architecture"}. {t("home.summary")}</p>
      <div className="hero-actions">
        <Button asChild><Link href="/projects">{t("home.explore")} <ArrowRight size={16} aria-hidden /></Link></Button>
        <Button asChild variant="secondary"><Link href="/recruiter">{t("nav.recruiter")}</Link></Button>
      </div><div className="signal-row"><span>API REST</span><span>Clean + Hexagonal</span><span>JWT</span><span>Java 21</span><span>Spring Boot</span></div>
    </div></section>
    <section className="container page home-system"><SectionHeading eyebrow={t("home.selected")} title={t("home.title")} description={t("home.description")} />
      <div className="project-grid">{projects.slice(0, 2).map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      <div className="system-strip"><div><Braces aria-hidden /><span>{t("home.typed")}</span><small>Next.js · TypeScript</small></div><div><ShieldCheck aria-hidden /><span>{t("home.secure")}</span><small>Spring Security · JWT</small></div><div><Database aria-hidden /><span>{t("home.adapters")}</span><small>Domain · MongoDB</small></div></div>
    </section>
  </>;
}

export function AboutView({ profile }: { profile: Profile }) {
  const { language, t } = useI18n();
  return <section className="container page"><SectionHeading eyebrow={t("about.eyebrow")} title={t("about.title")} description={t("about.description")} />
    <article className="panel prose-panel"><h2>{profile.name}</h2><p>{profile.role} — Backend • Full Stack • APIs • {language === "pt-BR" ? "Arquitetura" : "Architecture"}</p><p>{t("home.summary")}</p><h2>{t("about.communication")}</h2><p>{t("about.communicationText")}</p><h2>{t("about.focus")}</h2><p>{t("about.focusText")}</p></article>
    <article id="avatar-guide" className="panel prose-panel avatar-guide-about"><span className="eyebrow">AvatarGuide</span><h2>{t("avatar.guide.howTitle")}</h2><p>{t("avatar.guide.howText")}</p><p className="avatar-flow">{t("avatar.flow")}</p></article>
  </section>;
}

export function ExperienceView({ experiences }: { experiences: Experience[] }) {
  const { language, t } = useI18n();
  const [avatarState, setAvatarState] = useState<AvatarState>("explaining");
  return <section className="container page"><SectionHeading eyebrow={t("experience.eyebrow")} title={t("experience.title")} description={t("experience.description")} />
    <LazyAvatarGuide state={avatarState} message={t("avatar.experience.intro")} />
    <div className="career-flow" aria-label={t("experience.flow")}>{t("experience.flow")}</div>
    <div className="timeline">{experiences.map((experience, index) => {
      const role = language === "pt-BR" ? experience.role : experience.roleEn;
      const description = language === "pt-BR" ? experience.description : experience.descriptionEn;
      const highlights = language === "pt-BR" ? experience.highlights : experience.highlightsEn;
      const reaction: AvatarState = index === experiences.length - 1 ? "success" : index % 2 === 0 ? "pointRight" : "thinking";
      return <article className="panel timeline-item" key={experience.id} tabIndex={0} onMouseEnter={() => setAvatarState(reaction)} onMouseLeave={() => setAvatarState("explaining")} onFocus={() => setAvatarState(reaction)} onBlur={() => setAvatarState("explaining")}><div className="timeline-date">{experience.startYear} — {experience.endYear ?? t("experience.present")}</div><div><h2>{role}</h2><h3>{experience.company}</h3><p>{description}</p><div className="tags technology-tags">{experience.technologies.map((item) => <span key={item}><SkillIcon name={item} size={14} />{item}</span>)}</div><ul>{highlights.map((item) => <li key={item}>{item}</li>)}</ul></div></article>;
    })}</div>
  </section>;
}

export function SkillsView({ skills }: { skills: Skill[] }) {
  const { language, t } = useI18n();
  const groups = skills.reduce((result, skill) => result.set(skill.category, [...(result.get(skill.category) ?? []), skill]), new Map<string, Skill[]>());
  const categoryLabel = (category: string) => language === "pt-BR" ? ({ Backend: "Backend", Frontend: "Frontend", Database: "Banco de dados", "Architecture / Integration": "Arquitetura / Integração", "DevOps / Tools": "DevOps / Ferramentas", "Project technologies": "Tecnologias de projetos" }[category] ?? category) : category;
  return <section className="container page"><SectionHeading eyebrow={t("skills.eyebrow")} title={t("skills.title")} description={t("skills.description")} />
    <LazyAvatarGuide state="explaining" message={t("skills.message")} />
    <div className="skills-groups">{Array.from(groups.entries()).map(([category, items]) => <article className="panel skill-group" key={category}><h2>{categoryLabel(category)}</h2><div className="skill-list">{items.map((skill) => <span className="skill-chip" key={skill.id}><SkillIcon name={skill.name} />{skill.name}</span>)}</div></article>)}</div>
    <ImplementationInsight><p>API /api/skills → agrupamento por categoria → mapa centralizado de ícones → componentes acessíveis.</p></ImplementationInsight>
  </section>;
}

export function ProjectDetailsView({ project }: { project: Project }) {
  const { language, t } = useI18n();
  const [avatarState, setAvatarState] = useState<AvatarState>("explaining");
  const localized = language === "pt-BR";
  const highlights = localized ? project.highlights : project.highlightsEn;
  return <section className="container page case-study"><Link href="/projects" className="back-link"><ArrowLeft size={15} aria-hidden /> {t("project.all")}</Link>
    <SectionHeading eyebrow={t("project.case")} title={project.name} description={localized ? project.shortDescription : project.shortDescriptionEn} />
    <LazyAvatarGuide state={avatarState} message={t(project.slug === "caraoque" ? "project.avatar" : "project.avatarDefault")} />
    <div className="avatar-context-actions">
      {project.architectureDescription && <Button asChild variant="secondary"><a href="#project-architecture" onMouseEnter={() => setAvatarState("pointLeft")} onMouseLeave={() => setAvatarState("explaining")} onFocus={() => setAvatarState("pointLeft")} onBlur={() => setAvatarState("explaining")}>{t("project.viewArchitecture")}</a></Button>}
      {highlights.length > 0 && <Button asChild variant="secondary"><a href="#project-decisions" onMouseEnter={() => setAvatarState("pointLeft")} onMouseLeave={() => setAvatarState("explaining")} onFocus={() => setAvatarState("pointLeft")} onBlur={() => setAvatarState("explaining")}>{t("project.viewDecisions")}</a></Button>}
    </div>
    <div className="case-layout"><article className="panel prose-panel"><h2>{t("project.overview")}</h2><p>{localized ? project.description : project.descriptionEn}</p>
      {project.architectureDescription && <section id="project-architecture"><h2>{t("project.architecture")}</h2><p>{localized ? project.architectureDescription : project.architectureDescriptionEn}</p></section>}
      {highlights.length > 0 && <section id="project-decisions"><h2>{t("project.decisions")}</h2><ul>{highlights.map((item) => <li key={item}>{item}</li>)}</ul></section>}
    </article><aside className="panel case-aside"><span className="eyebrow">{localized ? project.status : project.statusEn}</span><h2>{t("project.technologies")}</h2><div className="tags technology-tags">{project.technologies.map((item) => <span key={item}><SkillIcon name={item} size={15} />{item}</span>)}</div>
      {project.repositoryUrl && <Button asChild variant="secondary"><a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer"><Github size={15} aria-hidden /> {t("project.repository")}</a></Button>}{project.liveUrl && <Button asChild><a href={project.liveUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} aria-hidden /> {t("project.view")}</a></Button>}
    </aside></div>
  </section>;
}

export function ContactView({ profile }: { profile: Profile }) {
  const { t } = useI18n();
  const channels = [{ label: "GitHub", url: profile.githubUrl, icon: Github }, { label: "LinkedIn", url: profile.linkedinUrl, icon: Linkedin }];
  return <section className="container page"><SectionHeading eyebrow={t("contact.eyebrow")} title={t("contact.title")} description={t("contact.description")} />
    <div className="contact-grid">{channels.map(({ label, url, icon: Icon }) => <a className="panel contact-card" href={url} target="_blank" rel="noopener noreferrer" key={label}><Icon aria-hidden /><span>{label}</span><small>{t("contact.open")} ↗</small></a>)}{profile.location && <div className="panel contact-card"><MapPin aria-hidden /><span>{t("contact.location")}</span><small>{profile.location}</small></div>}</div>
  </section>;
}

export function RecruiterView({ profile, skills, experiences, projects }: { profile: Profile; skills: Skill[]; experiences: Experience[]; projects: Project[] }) {
  const { language, t } = useI18n();
  const orderedProjects = ["caraoque", "nexo-financeiro", "vidaplus"].map((slug) => projects.find((project) => project.slug === slug)).filter((project): project is Project => Boolean(project));
  return <section className="container recruiter-page"><div className="recruiter-intro"><div><span className="eyebrow">{t("recruiter.scan")}</span><h1>{profile.name}</h1><h2>{profile.role}</h2><p>{t("home.summary")}</p></div></div>
    <div className="recruiter-grid">
      <article className="panel recruiter-section wide"><span className="eyebrow">{t("recruiter.summary")}</span><p>{t("home.summary")}</p></article>
      <article className="panel recruiter-section wide"><span className="eyebrow">{t("recruiter.experience")}</span>{experiences.map((experience) => <div className="compact-experience" key={experience.id}><strong>{language === "pt-BR" ? experience.role : experience.roleEn} · {experience.company}</strong><span>{experience.startYear} — {experience.endYear ?? t("experience.present")}</span></div>)}</article>
      <article className="panel recruiter-section"><span className="eyebrow">{t("recruiter.technologies")}</span><div className="compact-skills">{skills.slice(0, 18).map((skill) => <span key={skill.id}><SkillIcon name={skill.name} size={14} />{skill.name}</span>)}</div></article>
      <article className="panel recruiter-section wide"><span className="eyebrow">{t("recruiter.projects")}</span><div className="recruiter-projects">{orderedProjects.map((project) => <Link href={`/projects/${project.slug}`} key={project.id}><div><strong>{project.name}</strong><p>{language === "pt-BR" ? project.shortDescription : project.shortDescriptionEn}</p></div><ArrowUpRight size={18} aria-hidden /></Link>)}</div></article>
      <article className="panel recruiter-section"><span className="eyebrow">{t("recruiter.architecture")}</span><h3>{t("recruiter.technical")}</h3><div className="compact-skills">{["Java 21", "Spring Boot", "Next.js", "MongoDB", "Docker"].map((name) => <span key={name}><SkillIcon name={name.replace(" 21", "")} size={14} />{name}</span>)}</div><Link href="/architecture">{t("recruiter.inspect")} <ArrowUpRight size={14} aria-hidden /></Link></article>
      <article className="panel recruiter-section wide"><span className="eyebrow">{t("recruiter.contact")}</span><div className="recruiter-actions"><a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"><Code2 size={16} aria-hidden /> GitHub</a><a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"><BriefcaseBusiness size={16} aria-hidden /> LinkedIn</a>{profile.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"><Download size={16} aria-hidden /> {t("recruiter.resume")}</a>}</div></article>
    </div>
  </section>;
}
