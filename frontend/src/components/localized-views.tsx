"use client";

import { ArrowLeft, ArrowUpRight, CheckCircle2, Download, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";
import { ImplementationInsight } from "@/components/implementation-insight";
import { SectionHeading } from "@/components/section-heading";
import { SkillIcon } from "@/components/skill-icon";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/language-context";
import type { Experience, Profile, Project, Skill } from "@/types/portfolio";

export function AboutView({ profile }: { profile: Profile }) {
  const { language, t } = useI18n();
  return <section className="container page"><SectionHeading eyebrow={t("about.eyebrow")} title={t("about.title")} description={t("about.description")} />
    <article className="panel prose-panel"><h2>{profile.name}</h2><p>{profile.role} — Backend • Full Stack • APIs • {language === "pt-BR" ? "Arquitetura" : "Architecture"}</p><p>{t("home.summary")}</p><h2>{t("about.communication")}</h2><p>{t("about.communicationText")}</p><h2>{t("about.focus")}</h2><p>{t("about.focusText")}</p></article>
  </section>;
}

export function ExperienceView({ experiences }: { experiences: Experience[] }) {
  const { language, t } = useI18n();
  return <section className="container page"><SectionHeading eyebrow={t("experience.eyebrow")} title={t("experience.title")} description={t("experience.description")} />
    <div className="career-flow" aria-label={t("experience.flow")}>{t("experience.flow")}</div>
    <div className="timeline">{experiences.map((experience, index) => {
      const role = language === "pt-BR" ? experience.role : experience.roleEn;
      const description = language === "pt-BR" ? experience.description : experience.descriptionEn;
      const highlights = language === "pt-BR" ? experience.highlights : experience.highlightsEn;
      return <article className="panel timeline-item" key={experience.id}><div className="timeline-date">{experience.startYear} — {experience.endYear ?? t("experience.present")}</div><div><h2>{role}</h2><h3>{experience.company}</h3><p>{description}</p><div className="tags technology-tags">{experience.technologies.map((item) => <span key={item}><SkillIcon name={item} size={14} />{item}</span>)}</div><ul>{highlights.map((item) => <li key={item}>{item}</li>)}</ul></div></article>;
    })}</div>
  </section>;
}

export function SkillsView({ skills }: { skills: Skill[] }) {
  const { language, t } = useI18n();
  const groups = skills.reduce((result, skill) => result.set(skill.category, [...(result.get(skill.category) ?? []), skill]), new Map<string, Skill[]>());
  const categoryLabel = (category: string) => language === "pt-BR" ? ({ Backend: "Backend", Frontend: "Frontend", Database: "Banco de dados", "Architecture / Integration": "Arquitetura / Integração", "DevOps / Tools": "DevOps / Ferramentas", "Project technologies": "Tecnologias de projetos" }[category] ?? category) : category;
  return <section className="container page"><SectionHeading eyebrow={t("skills.eyebrow")} title={t("skills.title")} description={t("skills.description")} />
    <div className="skills-groups">{Array.from(groups.entries()).map(([category, items]) => <article className="panel skill-group" key={category}><h2>{categoryLabel(category)}</h2><div className="skill-list">{items.map((skill) => <span className="skill-chip" key={skill.id}><SkillIcon name={skill.name} />{skill.name}</span>)}</div></article>)}</div>
    <ImplementationInsight><p>API /api/skills → agrupamento por categoria → mapa centralizado de ícones → componentes acessíveis.</p></ImplementationInsight>
  </section>;
}

export function ProjectDetailsView({ project }: { project: Project }) {
  const { language, t } = useI18n();
  const localized = language === "pt-BR";
  const highlights = localized ? project.highlights : project.highlightsEn;
  const isCaraoque = project.slug === "caraoque";
  const isVidaPlus = project.slug === "vidaplus";
  const isNexo = project.slug === "nexo-financeiro" || project.slug === "nexo";
  const hasDetailedCase = isCaraoque || isVidaPlus || isNexo;
  const caraoqueModules = localized ? [
    ["Sessões", "Criação e controle da sala, status do evento e participantes ativos."],
    ["Fila", "Organização da ordem de apresentação com fluxo previsível para o usuário."],
    ["Músicas", "Busca integrada ao YouTube Data API e seleção de repertório."],
    ["Pontuação", "Avaliação vocal, cálculo de score e ranking da sessão."],
    ["Pagamentos", "Integração com Mercado Pago para recursos comerciais."],
    ["Produção", "Deploy público com domínio, Cloudflare e banco PostgreSQL na Neon."],
  ] : [
    ["Sessions", "Room creation, event status, and active participant management."],
    ["Queue", "Predictable singing order and user flow during the event."],
    ["Songs", "YouTube Data API search and repertoire selection."],
    ["Scoring", "Vocal assessment, score calculation, and session ranking."],
    ["Payments", "Mercado Pago integration for commercial features."],
    ["Production", "Public deployment with domain, Cloudflare, and PostgreSQL on Neon."],
  ];
  const caraoqueDecisions = localized ? [
    "Separação clara entre experiência React, API Express e persistência PostgreSQL.",
    "Fluxos críticos tratados como estados de sessão para evitar inconsistência na fila.",
    "Integrações externas isoladas para reduzir acoplamento com YouTube, pagamentos e infraestrutura.",
    "Validações, rate limiting, cache e tratamento centralizado de erros no backend.",
  ] : [
    "Clear separation between the React experience, Express API, and PostgreSQL persistence.",
    "Critical flows modeled as session states to prevent queue inconsistency.",
    "External integrations isolated to reduce coupling with YouTube, payments, and infrastructure.",
    "Validation, rate limiting, caching, and centralized error handling on the backend.",
  ];
  const caraoqueFlow = localized ? ["Entrar na sessão", "Escolher música", "Entrar na fila", "Cantar", "Gerar pontuação", "Atualizar ranking"] : ["Join session", "Choose song", "Enter queue", "Sing", "Generate score", "Update ranking"];
  const vidaPlusModules = localized ? [
    ["Perfis e acesso", "Fluxos específicos para pacientes, profissionais de saúde e administradores."],
    ["Pacientes", "Cadastro, consulta e organização das informações utilizadas no atendimento."],
    ["Agendamentos", "Controle de consultas, disponibilidade e acompanhamento da agenda hospitalar."],
    ["Prescrições", "Registro e visualização de prescrições vinculadas ao fluxo do paciente."],
    ["Operação hospitalar", "Gestão demonstrativa de leitos, estoque, profissionais e relatórios."],
    ["Persistência local", "Uso de sql.js e localStorage para simular dados estruturados diretamente no navegador."],
  ] : [
    ["Roles and access", "Dedicated workflows for patients, healthcare professionals, and administrators."],
    ["Patients", "Registration, lookup, and organization of information used during care."],
    ["Appointments", "Consultation scheduling, availability, and hospital calendar monitoring."],
    ["Prescriptions", "Prescription registration and visualization linked to the patient workflow."],
    ["Hospital operations", "Demonstrative management of beds, inventory, professionals, and reports."],
    ["Local persistence", "sql.js and localStorage simulate structured data directly in the browser."],
  ];
  const vidaPlusDecisions = localized ? [
    "Organização do front-end por domínios funcionais para separar pacientes, agenda, prescrições e operação.",
    "Modelagem relacional executada no navegador com sql.js para demonstrar consultas e persistência estruturada.",
    "Uso de localStorage para preservar a experiência entre sessões sem depender de um backend externo.",
    "Fluxos por perfil, auditoria e conceitos de privacidade pensados a partir do contexto hospitalar e da LGPD.",
  ] : [
    "Frontend organized by functional domains to separate patients, scheduling, prescriptions, and operations.",
    "Relational modeling executed in the browser with sql.js to demonstrate querying and structured persistence.",
    "localStorage preserves the experience across sessions without depending on an external backend.",
    "Role-based flows, auditing, and privacy concepts shaped by the hospital context and data protection principles.",
  ];
  const vidaPlusFlow = localized ? ["Selecionar perfil", "Cadastrar paciente", "Agendar atendimento", "Registrar prescrição", "Gerenciar operação", "Consultar relatórios"] : ["Select role", "Register patient", "Schedule care", "Record prescription", "Manage operations", "Review reports"];
  const nexoModules = localized ? [
    ["Autenticação", "Acesso e identificação do usuário integrados aos serviços do Supabase."],
    ["Dashboard", "Visão consolidada de receitas, despesas, saldo e comportamento financeiro."],
    ["Receitas", "Registro e acompanhamento das entradas que compõem a renda do usuário."],
    ["Despesas", "Cadastro, edição e organização dos gastos por período e finalidade."],
    ["Categorias", "Classificação das movimentações para facilitar leitura, filtros e análises."],
    ["Experiência PWA", "Interface responsiva e instalável, preparada para uma rotina financeira recorrente."],
  ] : [
    ["Authentication", "User access and identity integrated with Supabase services."],
    ["Dashboard", "Consolidated view of income, expenses, balance, and financial behavior."],
    ["Income", "Registration and monitoring of the entries that make up the user's income."],
    ["Expenses", "Creation, editing, and organization of spending by period and purpose."],
    ["Categories", "Transaction classification supporting clearer reading, filtering, and analysis."],
    ["PWA experience", "Responsive and installable interface designed for a recurring financial routine."],
  ];
  const nexoDecisions = localized ? [
    "Interface componentizada com React e Vite para manter os fluxos financeiros reutilizáveis e fáceis de evoluir.",
    "Supabase concentrando autenticação e persistência para reduzir complexidade operacional no estágio atual.",
    "Recharts utilizado para transformar movimentações em indicadores e visualizações de leitura rápida.",
    "Tailwind CSS e suporte PWA aplicados para uma experiência consistente, responsiva e instalável.",
  ] : [
    "Component-based React and Vite interface keeping financial workflows reusable and easy to evolve.",
    "Supabase centralizes authentication and persistence to reduce operational complexity at the current stage.",
    "Recharts turns transactions into indicators and quickly readable visualizations.",
    "Tailwind CSS and PWA support provide a consistent, responsive, and installable experience.",
  ];
  const nexoFlow = localized ? ["Acessar conta", "Registrar renda", "Cadastrar despesa", "Organizar categorias", "Acompanhar dashboard", "Analisar indicadores"] : ["Access account", "Record income", "Add expense", "Organize categories", "Track dashboard", "Analyze indicators"];
  const technicalModules = isVidaPlus ? vidaPlusModules : isNexo ? nexoModules : caraoqueModules;
  const technicalDecisions = isVidaPlus ? vidaPlusDecisions : isNexo ? nexoDecisions : caraoqueDecisions;
  const technicalFlow = isVidaPlus ? vidaPlusFlow : isNexo ? nexoFlow : caraoqueFlow;
  return <section className={`container page case-study ${isCaraoque ? "caraoque-case" : ""} ${isVidaPlus ? "vidaplus-case" : ""} ${isNexo ? "nexo-case" : ""}`}><Link href="/?destination=projects" className="back-link"><ArrowLeft size={15} aria-hidden /> {t("project.all")}</Link>
    <SectionHeading eyebrow={t("project.case")} title={project.name} description={localized ? project.shortDescription : project.shortDescriptionEn} />
    <div className="case-layout"><article className="panel prose-panel"><h2>{t("project.overview")}</h2><p>{localized ? project.description : project.descriptionEn}</p>
      {hasDetailedCase && <section className="case-featured-technical">
        <div className="case-flow"><span>{localized ? "Fluxo principal" : "Main flow"}</span>{technicalFlow.map((step, index) => <div key={step}><strong>{String(index + 1).padStart(2, "0")}</strong><p>{step}</p></div>)}</div>
        <div className="case-modules">{technicalModules.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className="case-decisions"><h2>{localized ? "Decisões técnicas aplicadas" : "Applied technical decisions"}</h2><ul>{technicalDecisions.map((item) => <li key={item}><CheckCircle2 size={15} />{item}</li>)}</ul></div>
      </section>}
      {project.architectureDescription && <section id="project-architecture"><h2>{t("project.architecture")}</h2><p>{localized ? project.architectureDescription : project.architectureDescriptionEn}</p></section>}
      {highlights.length > 0 && <section id="project-decisions"><h2>{t("project.decisions")}</h2><ul>{highlights.map((item) => <li key={item}>{item}</li>)}</ul></section>}
    </article><aside className="panel case-aside"><span className="eyebrow">{localized ? project.status : project.statusEn}</span><h2>{t("project.technologies")}</h2><div className="tags technology-tags">{project.technologies.map((item) => <span key={item}><SkillIcon name={item} size={15} />{item}</span>)}</div>
      {hasDetailedCase && <div className="case-aside-note"><strong>{isCaraoque ? (localized ? "Case em produção" : "Production case") : isNexo ? (localized ? "Case em desenvolvimento" : "Case in development") : (localized ? "Case acadêmico" : "Academic case")}</strong><p>{isCaraoque ? (localized ? "Projeto real com domínio público, integrações externas e fluxo completo de uso." : "Real project with a public domain, external integrations, and a complete usage flow.") : isNexo ? (localized ? "Produto financeiro em evolução, com autenticação, persistência integrada, dashboards e experiência PWA." : "Evolving financial product with authentication, integrated persistence, dashboards, and a PWA experience.") : (localized ? "Protótipo funcional de gestão hospitalar com múltiplos perfis, persistência local e fluxos integrados." : "Functional hospital management prototype with multiple roles, local persistence, and integrated workflows.")}</p></div>}
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
  const [showAllSkills, setShowAllSkills] = useState(false);
  const orderedProjects = [
    { slug: "caraoque", name: "Caraôque?", pt: "Karaokê Full Stack com pontuação e sessões.", en: "Full-stack karaoke with scoring and sessions.", image: "/models/logokaraoke.png" },
    { slug: "nexo-financeiro", name: "Nexo Financeiro", pt: "Controle financeiro pessoal.", en: "Personal finance control.", image: "/models/logonexo.png" },
    { slug: "vidaplus", name: "VidaPlus", pt: "Sistema de gestão hospitalar.", en: "Hospital management system.", image: "/models/logovidaplus.png" },
  ].map((fallback) => {
    const project = projects.find((item) => item.slug === fallback.slug || item.slug.includes(fallback.slug.split("-")[0]));
    return { id: project?.id ?? fallback.slug, slug: project?.slug ?? fallback.slug, name: project?.name ?? fallback.name, description: project ? (language === "pt-BR" ? project.shortDescription : project.shortDescriptionEn) : (language === "pt-BR" ? fallback.pt : fallback.en), image: fallback.image };
  });
  const recruiterYears = [2022, 2023, 2025];
  const displayExperiences = experiences.length ? experiences.map((experience, index) => ({ id: experience.id, year: recruiterYears[index] ?? experience.startYear, role: language === "pt-BR" ? experience.role : experience.roleEn, company: experience.company })) : [
    { id: "2022", year: 2022, role: language === "pt-BR" ? "Analista de Tráfego Pleno" : "Mid-level Traffic Analyst", company: "PLANSUL" },
    { id: "2023", year: 2023, role: language === "pt-BR" ? "Desenvolvimento Júnior / Git Master" : "Junior Developer / Git Master", company: "PLANSUL" },
    { id: "2025", year: 2025, role: language === "pt-BR" ? "Desenvolvimento Pleno" : "Mid-level Developer", company: "PLANSUL" },
  ];
  const stackGroups = [
    { name: "Backend", items: ["Java", "Spring Boot", "C#", "PHP", "Laravel", "Node.js"] },
    { name: "Frontend", items: ["React", "TypeScript"] },
    { name: "Data", items: ["PostgreSQL", "SQL Server", "MongoDB"] },
    { name: "Engineering", items: ["Kafka", "Docker", "Git", "GitLab CI/CD", "OpenAPI"] },
  ];
  const extraSkills = skills.filter((skill) => !stackGroups.some((group) => group.items.includes(skill.name))).slice(0, 14);
  return <section className="recruiter-page executive-profile"><div className="recruiter-shell">
    <header className="recruiter-hero"><div><span className="eyebrow">{t("recruiter.scan")}</span><h1><span>Alan</span> Christofer</h1><h2>Software Developer</h2><strong>Backend · Full Stack · APIs · {language === "pt-BR" ? "Integrações" : "Integrations"}</strong><p>{t("home.summary")}</p></div><div className="recruiter-actions"><a className="primary" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"><Linkedin /> LinkedIn</a><a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"><Github /> GitHub</a>{profile.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"><Download /> {t("recruiter.resume")}</a>}</div></header>
    <div className="recruiter-metrics"><div><strong>5+</strong><span>{language === "pt-BR" ? "anos de experiência" : "years of experience"}</span></div><div><strong>{orderedProjects.length}</strong><span>{language === "pt-BR" ? "projetos principais" : "main projects"}</span></div><div><strong>10+</strong><span>{language === "pt-BR" ? "tecnologias" : "technologies"}</span></div></div>
    <section className="recruiter-block recruiter-experience"><span className="eyebrow">{t("recruiter.experience")}</span><div>{displayExperiences.map((experience) => <article key={experience.id}><time>{experience.year}</time><i /><strong>{experience.role}</strong><small>{experience.company}</small></article>)}</div></section>
    <section className="recruiter-block recruiter-stack"><div className="recruiter-block-heading"><span className="eyebrow">{language === "pt-BR" ? "Principais tecnologias" : "Core technologies"}</span><button type="button" onClick={() => setShowAllSkills((value) => !value)}>{showAllSkills ? (language === "pt-BR" ? "Ver principais" : "Show core") : (language === "pt-BR" ? "Ver todas as tecnologias" : "View all technologies")} →</button></div><div className="recruiter-stack-groups">{stackGroups.map((group) => <div key={group.name}><h3>{group.name}</h3><div>{group.items.map((name) => <span key={name}><SkillIcon name={name} size={22} />{name === "PHP" ? "PHP / Laravel" : name}</span>)}</div></div>)}</div>{showAllSkills && <div className="recruiter-extra-skills">{extraSkills.map((skill) => <span key={skill.id}><SkillIcon name={skill.name} size={18} />{skill.name}</span>)}</div>}</section>
    <section className="recruiter-block"><span className="eyebrow">{t("recruiter.projects")}</span><div className="recruiter-projects">{orderedProjects.map((project, index) => <Link className={index === 0 ? "featured" : ""} href={`/projects/${project.slug}`} key={project.id}><div className={`recruiter-project-art recruiter-project-art-${project.slug}`}><img src={project.image} alt={`${project.name} logo`} /></div><div><strong>{project.name}</strong><p>{project.description}</p><small>{index === 0 ? (language === "pt-BR" ? "Em produção" : "In production") : index === 1 ? (language === "pt-BR" ? "Em desenvolvimento" : "In development") : (language === "pt-BR" ? "Acadêmico" : "Academic")}</small></div><ArrowUpRight aria-hidden /></Link>)}</div></section>
    <section className="recruiter-block recruiter-portfolio"><div><span className="eyebrow">{language === "pt-BR" ? "Este portfólio também é um projeto técnico" : "This portfolio is also a technical project"}</span><p>{language === "pt-BR" ? "O próprio sistema que você está utilizando também faz parte da minha evolução no ecossistema Java." : "The system you are using is also part of my growth in the Java ecosystem."}</p></div><div className="recruiter-portfolio-stack">{["Java 21", "Spring Boot", "Next.js", "MongoDB", "Three.js", "Docker"].map((name) => <span key={name}><SkillIcon name={name.replace(" 21", "")} size={18} />{name}</span>)}</div><nav><Link className="primary-action" href="/architecture">{t("recruiter.inspect")}</Link><a className="secondary-action" href="/swagger" target="_blank" rel="noopener noreferrer">Swagger</a><Link className="secondary-action" href="/lab">Developer Lab</Link></nav></section>
    <footer className="recruiter-contact"><span>{language === "pt-BR" ? "Vamos conversar" : "Let's talk"}</span><a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"><Linkedin /> LinkedIn</a><a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"><Github /> GitHub</a></footer>
  </div>
  </section>;
}
