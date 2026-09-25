"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, Box, BriefcaseBusiness, CheckCircle2, Church, Code2, Compass, Copy, Database, Folder, Gamepad2, GraduationCap, Heart, Layers3, Leaf, ListChecks, Minus, Music2, Plane, Plug, Radio, Route, Sparkles, Square, Target, TrendingUp, Users, X } from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";
import { SkillIcon } from "@/components/skill-icon";
import { useI18n } from "@/i18n/language-context";
import { worldCopy } from "@/i18n/world-messages";
import type { Experience, PortfolioData, Project } from "@/types/portfolio";
import { isDestinationId, type DestinationId } from "./destinations";
import { useGlobeTravel } from "./globe-travel";

const GlobeScene = dynamic(() => import("./globe-scene"), {
  ssr: false,
  loading: () => <div className="globe-loading"><span /><p>Carregando visão global...</p></div>,
});

const fallbackCareer: Experience[] = [
  { id: "career-1", company: "PLANSUL", role: "Analista de Tráfego Pleno", roleEn: "Mid-level Traffic Analyst", description: "O desenvolvimento de soluções para problemas reais da operação contribuiu diretamente para minha transição para Desenvolvimento.", descriptionEn: "Developing solutions for real operational problems directly contributed to my transition into Software Development.", startYear: 2022, endYear: 2023, technologies: ["Contact center", "Indicadores", "Produtividade", "TMA", "SLA", "Painéis", "Ferramentas internas"], highlights: [], highlightsEn: [], order: 1 },
  { id: "career-2", company: "PLANSUL", role: "Analista de Desenvolvimento de Sistemas Júnior · Git Master", roleEn: "Junior Systems Development Analyst · Git Master", description: "Desenvolvimento de sistemas, automações e evolução do processo de entrega.", descriptionEn: "Systems development, automation, and evolution of the delivery process.", startYear: 2023, endYear: 2025, technologies: ["PHP", "Laravel", "JavaScript", "React", "Node.js", "NestJS", "SQL Server", "PostgreSQL", "Python", "GitFlow", "Jenkins"], highlights: [], highlightsEn: [], order: 2 },
  { id: "career-3", company: "PLANSUL", role: "Analista de Desenvolvimento de Sistemas Pleno", roleEn: "Mid-level Systems Development Analyst", description: "Desenvolvimento de APIs e sistemas corporativos com Java 21, Spring Boot, integrações, sustentação e evolução de soluções.", descriptionEn: "Development of corporate APIs and systems with Java 21, Spring Boot, integrations, support, and solution evolution.", startYear: 2025, endYear: null, technologies: ["Java", "Spring Boot", "REST API", "C#", ".NET", "PHP", "Laravel", "Node.js", "React", "Kafka", "OpenAPI", "Swagger", "PostgreSQL", "SQL Server", "Python"], highlights: [], highlightsEn: [], order: 3 },
];

const officialProjects = {
  caraoque: { name: "Caraôque?", url: "https://clubkaraoke.uk/", tech: ["React", "Vite", "Node.js", "Express", "PostgreSQL", "Neon", "YouTube Data API", "Mercado Pago", "Cloudflare"] },
  nexo: { name: "Nexo Financeiro", url: "https://nexo-financeiro.netlify.app/", tech: ["React", "Vite", "Supabase", "TailwindCSS", "PWA", "Recharts"] },
  vida: { name: "VidaPlus", url: "https://alanchristofer.github.io/VidaPlus/", tech: ["JavaScript", "HTML", "CSS", "sql.js", "localStorage"] },
} as const;

function findProject(projects: Project[], keys: string[]) {
  return projects.find((project) => keys.some((key) => project.slug.toLowerCase().includes(key) || project.name.toLowerCase().includes(key)));
}

function WorldHero({ data, select }: { data: PortfolioData; select: (id: DestinationId) => void }) {
  const { language } = useI18n();
  const copy = worldCopy[language];
  const years = Math.max(new Date().getFullYear() - 2021, 5);
  return <section className="world-hero" aria-labelledby="world-title">
    <span className="panel-kicker">{copy.global.kicker}</span>
    <h1 id="world-title">Alan <span>Christofer</span></h1>
    <h2>{copy.global.role}</h2>
    <p className="specialties">{copy.global.specialties}</p>
    <p>{copy.global.summary}</p>
    <div className="panel-actions"><button className="primary-action" type="button" onClick={() => select("career")}>{copy.global.start} <ArrowRight size={16} /></button></div>
    <div className="world-stats"><div><strong>{years}+</strong><span>{copy.global.years}</span></div><div><strong>{Math.max(data.projects.length, 3)}</strong><span>{copy.global.projects}</span></div><div><strong>10+</strong><span>{copy.global.technologies}</span></div></div>
    <blockquote className="hero-quote">“{copy.global.quote}”<cite>— Alan Christofer</cite></blockquote>
  </section>;
}

function ProjectsPanel({ projects }: { projects: Project[] }) {
  const { language } = useI18n();
  const copy = worldCopy[language];
  const caraoque = findProject(projects, ["caraoque", "karaoke"]);
  const nexo = findProject(projects, ["nexo"]);
  const vida = findProject(projects, ["vida"]);
  return <div className="destination-content projects-destination">
    <div className="destination-title"><span className="destination-symbol"><Sparkles /></span><div><span className="panel-kicker">{copy.projects.kicker}</span><h2>{copy.projects.title}</h2><p>{copy.projects.intro}</p></div><b>3<small>{copy.projects.count}</small></b></div>
    <article className="featured-project">
      <div className="project-visual microphone-visual"><img src="/models/logokaraoke.png" alt="Logo do projeto Caraôque" /><i><span /> {copy.projects.status}</i></div>
      <div className="featured-copy"><h3>{officialProjects.caraoque.name}</h3><p>{copy.projects.featuredDescription}</p><span className="featured-label">{language === "pt-BR" ? "Destaques" : "Highlights"}</span><ul>{copy.projects.features.map((feature) => <li key={feature}><CheckCircle2 size={15} />{feature}</li>)}</ul></div>
      <div className="project-stack"><span className="featured-label">{language === "pt-BR" ? "Stack principal" : "Core stack"}</span><div className="project-tech">{["React", "Node.js", "PostgreSQL", "YouTube Data API", "Mercado Pago", "Cloudflare"].map((tech) => <span key={tech}><SkillIcon name={tech} size={14} />{tech}</span>)}</div></div>
      <div className="project-actions"><a className="primary-action" href={officialProjects.caraoque.url} target="_blank" rel="noopener noreferrer">{copy.projects.access} <ArrowUpRight size={15} /></a><Link className="secondary-action" href={`/projects/${caraoque?.slug ?? "caraoque"}`}>{copy.projects.case}</Link></div>
    </article>
    <div className="equal-projects">
      <ProjectFeature title={officialProjects.nexo.name} description={copy.projects.nexo} status={copy.projects.nexoStatus} url={officialProjects.nexo.url} detail={nexo?.slug ?? "nexo-financeiro"} tech={officialProjects.nexo.tech} variant="nexo" features={language === "pt-BR" ? ["Autenticação e dados integrados ao Supabase", "Dashboard para receitas, despesas e indicadores", "Experiência responsiva com suporte PWA"] : ["Authentication and data integrated with Supabase", "Dashboard for income, expenses, and indicators", "Responsive experience with PWA support"]} />
      <ProjectFeature title={officialProjects.vida.name} description={copy.projects.vida} status={copy.projects.vidaStatus} url={officialProjects.vida.url} detail={vida?.slug ?? "vidaplus"} tech={officialProjects.vida.tech} variant="vida" features={language === "pt-BR" ? ["Fluxos para pacientes e profissionais de saúde", "Gestão de agenda, prescrições, leitos e estoque", "Persistência local com sql.js e localStorage"] : ["Workflows for patients and healthcare professionals", "Scheduling, prescriptions, beds, and inventory management", "Local persistence with sql.js and localStorage"]} />
    </div>
  </div>;
}

function ProjectFeature({ title, description, status, url, detail, tech, features, variant }: { title: string; description: string; status: string; url: string; detail: string; tech: readonly string[]; features: string[]; variant: "nexo" | "vida" }) {
  const { language } = useI18n();
  const copy = worldCopy[language];
  const image = variant === "nexo" ? "/models/logonexo.png" : "/models/logovidaplus.png";
  return <article className={`featured-project equal-project-card project-${variant}`}>
    <div className={`project-visual project-system-visual ${variant}-visual`}><img src={image} alt={`Logo do projeto ${title}`} /><i><span /> {status}</i></div>
    <div className="featured-copy"><h3>{title}</h3><p>{description}</p><span className="featured-label">{language === "pt-BR" ? "Destaques" : "Highlights"}</span><ul>{features.map((feature) => <li key={feature}><CheckCircle2 size={15} />{feature}</li>)}</ul></div>
    <div className="project-stack"><span className="featured-label">{language === "pt-BR" ? "Stack principal" : "Core stack"}</span><div className="project-tech">{tech.map((item) => <span key={item}><SkillIcon name={item} size={14} />{item}</span>)}</div></div>
    <div className="project-actions"><a className="primary-action" href={url} target="_blank" rel="noopener noreferrer">{copy.projects.access} <ArrowUpRight size={15} /></a><Link className="secondary-action" href={`/projects/${detail}`}>{copy.projects.case}</Link></div>
  </article>;
}

function SkillsPanel() {
  const { language } = useI18n();
  const copy = worldCopy[language];
  const descriptions = language === "pt-BR"
    ? ["APIs, regras de negócio e integrações.", "Interfaces e experiências web.", "Persistência, consultas e modelagem.", "Contratos, mensageria e integração.", "Automação, infraestrutura e qualidade."]
    : ["APIs, business rules, and integrations.", "Web interfaces and experiences.", "Persistence, querying, and modeling.", "Contracts, messaging, and integration.", "Automation, infrastructure, and quality."];
  return <div className="destination-content"><PanelHeading kicker={copy.skills.kicker} title={copy.skills.title} intro={copy.skills.intro} />
    <div className="skill-districts">{copy.skills.categories.map((category, categoryIndex) => <section key={category.name}><h3>{category.name}</h3><p>{descriptions[categoryIndex]}</p><div>{category.items.map((item, itemIndex) => <span className={itemIndex < 4 ? "primary-skill" : ""} key={item}><SkillIcon name={item} size={itemIndex < 4 ? 26 : 20} />{item}</span>)}</div></section>)}</div>
  </div>;
}

function AboutPanel() {
  const { language } = useI18n();
  const copy = worldCopy[language];
  const portuguese = language === "pt-BR";
  const identity = portuguese ? [
    "Sou Alan Christofer, tenho 28 anos, sou casado há quase 7 anos e estou vivendo uma das fases mais especiais da minha vida: minha primeira filha chega em novembro.",
    "Gosto do simples bem feito e procuro levar transparência para a forma como vivo, trabalho e me relaciono com as pessoas. Não sou muito ligado a redes sociais; prefiro aproveitar meu tempo com aquilo que realmente importa para mim: minha família, meus amigos e as coisas que gosto de fazer.",
    "Sou cristão e sirvo a Deus na Assembleia de Deus. A música também faz parte de quem eu sou — além de gostar muito de música, sou músico.",
    "No tempo livre, gosto de jogar videogame, assistir filmes, séries e animes, viajar sempre que possível e jogar futebol com os amigos.",
  ] : [
    "I'm Alan Christofer, 28 years old, married for almost seven years, and living through one of the most special chapters of my life: my first daughter arrives in November.",
    "I value simple things done well and try to bring transparency to how I live, work, and relate to people. I'm not very active on social media; I prefer spending time on what truly matters to me: family, friends, and the things I enjoy.",
    "I'm a Christian and serve God at the Assembly of God church. Music is also part of who I am — besides deeply enjoying it, I am a musician.",
    "In my free time, I enjoy video games, movies, series and anime, traveling whenever possible, and playing football with friends.",
  ];
  const journey = portuguese ? [
    { period: "Formação", title: "Tecnólogo em Análise e Desenvolvimento de Sistemas", text: "Graduação completa e base formal para minha evolução em engenharia de software.", icon: GraduationCap },
    { period: "2022 — 2023", title: "Analista de Tráfego Pleno — Plansul", text: "Contato direto com problemas reais da operação, criação de ferramentas, dashboards e soluções internas.", icon: Compass },
    { period: "2023 — 2025", title: "Analista de Desenvolvimento de Sistemas Júnior & Git Master — Plansul", text: "Transição oficial para desenvolvimento, atuação Full Stack, APIs, automações, bancos de dados, GitFlow, Jenkins e CI/CD.", icon: Code2 },
    { period: "2025 — Hoje", title: "Analista de Desenvolvimento de Sistemas Pleno — Plansul", text: "Maior autonomia técnica, APIs, integrações, mensageria, sustentação, Java, Spring Boot, C#/.NET e OpenAPI/Swagger.", icon: BriefcaseBusiness },
    { period: "Hoje", title: "Evolução contínua", text: "Continuo evoluindo em Java, Spring Boot, arquitetura de software e inglês profissional.", icon: TrendingUp },
  ] : [
    { period: "Education", title: "Technology degree in Systems Analysis and Development", text: "Completed degree and a formal foundation for my growth in software engineering.", icon: GraduationCap },
    { period: "2022 — 2023", title: "Mid-level Traffic Analyst — Plansul", text: "Direct contact with real operational problems, creating tools, dashboards, and internal solutions.", icon: Compass },
    { period: "2023 — 2025", title: "Junior Systems Developer & Git Master — Plansul", text: "Official transition into development, working with full-stack applications, APIs, automation, databases, GitFlow, Jenkins, and CI/CD.", icon: Code2 },
    { period: "2025 — Today", title: "Mid-level Systems Developer — Plansul", text: "Greater technical autonomy across APIs, integrations, messaging, support, Java, Spring Boot, C#/.NET, and OpenAPI/Swagger.", icon: BriefcaseBusiness },
    { period: "Today", title: "Continuous growth", text: "I continue developing my Java, Spring Boot, software architecture, and professional English skills.", icon: TrendingUp },
  ];
  const nextSteps = portuguese ? ["Pós-graduação em Engenharia de Software.", "Especialização em uma área da tecnologia com maior identificação.", "Evolução para posições de maior responsabilidade técnica, especialmente Pleno/Sênior.", "Inglês profissional para atuar também em ambientes internacionais."] : ["A postgraduate degree in Software Engineering.", "Specialization in the technology field I identify with most.", "Growth into roles with greater technical responsibility, especially mid-level/senior positions.", "Professional English for working confidently in international environments."];
  const projects = portuguese ? [
    { title: "Caraôque?", status: "Em produção", description: "Projeto Full Stack de karaokê com sessões, fila de participantes, busca de músicas, avaliação vocal, pontuação, ranking e integrações externas.", url: "https://clubkaraoke.uk/", image: "/models/logokaraoke.png", tone: "production" },
    { title: "Nexo Financeiro", status: "Em desenvolvimento", description: "Aplicação de controle financeiro pessoal, criada para explorar uma experiência moderna de gestão financeira e evolução técnica no frontend.", url: "https://nexo-financeiro.netlify.app/", image: "/models/logonexo.png", tone: "development" },
    { title: "VidaPlus", status: "Projeto acadêmico", description: "Sistema de Gestão Hospitalar desenvolvido como projeto acadêmico, com foco em diferentes perfis de acesso e funcionalidades de gestão em saúde.", url: "https://alanchristofer.github.io/VidaPlus/", image: "/models/logovidaplus.png", tone: "academic" },
    { title: "Este portfólio", status: "Projeto técnico", description: "Portfólio interativo que apresenta minha trajetória e demonstra minha evolução com Java, Spring Boot, Next.js, arquitetura e integração entre frontend e backend.", url: "/?destination=architecture", image: "", tone: "technical" },
  ] : [
    { title: "Caraôque?", status: "In production", description: "Full-stack karaoke project with sessions, participant queues, song search, vocal assessment, scoring, rankings, and external integrations.", url: "https://clubkaraoke.uk/", image: "/models/logokaraoke.png", tone: "production" },
    { title: "Nexo Financeiro", status: "In development", description: "Personal finance application created to explore a modern management experience and continued frontend growth.", url: "https://nexo-financeiro.netlify.app/", image: "/models/logonexo.png", tone: "development" },
    { title: "VidaPlus", status: "Academic project", description: "Hospital Management System developed as an academic project, focused on multiple access roles and healthcare management features.", url: "https://alanchristofer.github.io/VidaPlus/", image: "/models/logovidaplus.png", tone: "academic" },
    { title: "This portfolio", status: "Technical project", description: "An interactive portfolio presenting my journey and demonstrating my growth with Java, Spring Boot, Next.js, architecture, and frontend/backend integration.", url: "/?destination=architecture", image: "", tone: "technical" },
  ];
  return <div className="destination-content about-globe-panel">
    <PanelHeading kicker={copy.about.kicker} title={copy.about.title} intro={copy.about.intro} />
    <section className="about-identity">
      <div className="about-section-heading"><span>01</span><div><small>{portuguese ? "Quem sou" : "Who I am"}</small><h3>{portuguese ? "Quem é o Alan?" : "Who is Alan?"}</h3></div></div>
      <div className="about-identity-grid"><div className="about-story">{identity.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="about-personal-signals"><article><Users /><strong>{portuguese ? "Família" : "Family"}</strong><small>{portuguese ? "Meu propósito diário" : "My daily purpose"}</small></article><article><Church /><strong>{portuguese ? "Fé" : "Faith"}</strong><small>{portuguese ? "Direção e valores" : "Direction and values"}</small></article><article><Music2 /><strong>{portuguese ? "Música" : "Music"}</strong><small>{portuguese ? "Também sou músico" : "I'm also a musician"}</small></article><article><Gamepad2 /><strong>{portuguese ? "Tempo livre" : "Free time"}</strong><small>{portuguese ? "Jogos, filmes e futebol" : "Games, movies, and football"}</small></article></div></div>
    </section>
    <section className="about-purpose">
      <div className="about-section-heading"><span>02</span><div><small>{portuguese ? "Valores" : "Values"}</small><h3>{portuguese ? "O que me move" : "What drives me"}</h3></div></div>
      <div className="about-purpose-grid"><Target /><div><p>{portuguese ? "Meu principal objetivo é construir uma vida digna para minha família usando da melhor maneira as capacidades e oportunidades que Deus me deu." : "My main goal is to build a dignified life for my family by making the best use of the abilities and opportunities God has given me."}</p><p>{portuguese ? "Evolução profissional não significa apenas alcançar um cargo ou salário maior. Significa aumentar minha capacidade de resolver problemas, assumir responsabilidades e proporcionar mais segurança e qualidade de vida para quem está ao meu lado." : "Professional growth is not only about reaching a higher role or salary. It means expanding my ability to solve problems, take responsibility, and provide greater security and quality of life for those beside me."}</p></div><blockquote>“{portuguese ? "Viver um dia de cada vez, buscando ser melhor do que fui ontem." : "Live one day at a time, striving to be better than I was yesterday."}”</blockquote></div>
    </section>
    <section className="about-journey">
      <div className="about-section-heading"><span>03</span><div><small>{portuguese ? "Caminho" : "Path"}</small><h3>{portuguese ? "Minha jornada" : "My journey"}</h3></div></div>
      <div className="about-life-timeline">{journey.map(({ period, title, text, icon: Icon }) => <article key={`${period}-${title}`}><i><Icon /></i><time>{period}</time><h4>{title}</h4><p>{text}</p></article>)}</div>
      <div className="about-next-steps"><BookOpen /><div><strong>{portuguese ? "Próximos passos" : "Next steps"}</strong><ul>{nextSteps.map((step) => <li key={step}>{step}</li>)}</ul></div></div>
    </section>
    <section className="about-projects">
      <div className="about-section-heading"><span>04</span><div><small>{portuguese ? "Construção" : "Building"}</small><h3>{portuguese ? "Projetos que representam minha evolução" : "Projects that represent my growth"}</h3></div></div>
      <div className="about-project-grid">{projects.map((project) => <article className={`about-project-card ${project.tone}`} key={project.title}><div className="about-project-art">{project.image ? <img src={project.image} alt="" /> : <Code2 />}</div><div><span>{project.status}</span><h4>{project.title}</h4><p>{project.description}</p><a href={project.url} target={project.url.startsWith("http") ? "_blank" : undefined} rel={project.url.startsWith("http") ? "noopener noreferrer" : undefined}>{portuguese ? "Explorar" : "Explore"}<ArrowUpRight /></a></div></article>)}</div>
    </section>
    <section className="about-destination">
      <div className="about-section-heading"><span>05</span><div><small>{portuguese ? "Futuro" : "Future"}</small><h3>{portuguese ? "Onde quero chegar" : "Where I want to go"}</h3></div></div>
      <div className="about-destination-copy"><Plane /><div><p>{portuguese ? "Tenho quase cinco anos de trajetória profissional ligada à tecnologia e desenvolvimento, trabalhando com diferentes linguagens, sistemas corporativos, APIs, integrações, bancos de dados e aplicações Full Stack." : "I have almost five years of professional experience connected to technology and development, working with different languages, corporate systems, APIs, integrations, databases, and full-stack applications."}</p><p>{portuguese ? "Meu próximo objetivo é continuar avançando para posições de maior responsabilidade técnica, ampliando meus conhecimentos em arquitetura, backend e engenharia de software." : "My next goal is to continue progressing into positions with greater technical responsibility, expanding my knowledge of architecture, backend development, and software engineering."}</p><p>{portuguese ? "Também quero alcançar um nível de inglês que me permita trabalhar com tranquilidade em ambientes internacionais e aproveitar novas oportunidades." : "I also want to reach an English level that allows me to work confidently in international environments and embrace new opportunities."}</p></div></div>
    </section>
    <blockquote className="about-final-quote"><Heart /><p>“{portuguese ? "Família me dá propósito. Fé me dá direção. Tecnologia é a ferramenta que escolhi para construir o caminho." : "Family gives me purpose. Faith gives me direction. Technology is the tool I chose to build the path."}”</p><cite>Alan Christofer</cite></blockquote>
  </div>;
}

function CareerPanel({ experiences }: { experiences: Experience[] }) {
  const { language } = useI18n();
  const copy = worldCopy[language];
  const periodOverrides = [{ startYear: 2022, endYear: 2023 }, { startYear: 2023, endYear: 2025 }, { startYear: 2025, endYear: null }];
  const timeline = (experiences.length ? experiences : fallbackCareer).map((experience, index) => ({
    ...experience,
    ...(periodOverrides[index] ?? {}),
  }));
  const [active, setActive] = useState(timeline.length - 1);
  const selected = timeline[active] ?? timeline[0];
  const sourceSkills = selected.technologies.length ? selected.technologies : fallbackCareer[0].technologies;
  const stageSkills = active === 2 ? Array.from(new Set(["Java", "Spring Boot", ...sourceSkills])) : sourceSkills;
  const primaryStack = stageSkills.slice(0, 9);
  const complementaryStack = stageSkills.slice(9, 17);
  const responsibilities = language === "pt-BR"
    ? active === 0
      ? ["Acompanhamento de indicadores operacionais", "Monitoramento de atendimento, pausas e produtividade", "Construção de painéis internos", "Automação de rotinas", "Análise de TMA, SLA e nível de atendimento", "Soluções para problemas reais da operação"]
      : active === 1
        ? ["Desenvolvimento e manutenção de aplicações Full Stack", "Criação de APIs e integrações", "Dashboards e automações internas", "Git Master e organização do GitFlow", "Pipelines de CI/CD com Jenkins", "Sustentação e implantação de sistemas"]
        : ["Desenvolvimento de APIs com Java 21 e Spring Boot", "Criação e manutenção de APIs e gateways", "Sustentação de sistemas corporativos", "Evolução de soluções legadas", "Correção de incidentes e melhorias contínuas", "Participação em soluções estratégicas"]
    : active === 0
      ? ["Operational indicator monitoring", "Service, break, and productivity tracking", "Internal dashboard development", "Routine automation", "AHT, SLA, and service-level analysis", "Solutions for real operational problems"]
      : active === 1
        ? ["Full-stack application development and maintenance", "API and integration development", "Internal dashboards and automations", "Git Master and GitFlow organization", "CI/CD pipelines with Jenkins", "System support and deployment"]
        : ["API development with Java 21 and Spring Boot", "API and gateway creation and maintenance", "Corporate system support", "Legacy solution evolution", "Incident resolution and continuous improvements", "Participation in strategic solutions"];
  const evolution = language === "pt-BR"
    ? active === 0 ? "Foi resolvendo problemas reais da operação que minha transição para desenvolvimento começou." : active === 1 ? "A prática diária consolidou fundamentos de desenvolvimento, colaboração e entrega contínua." : "Mais autonomia técnica, participação em projetos reais e atuação full stack."
    : active === 0 ? "Solving real operational problems is where my transition into software development began." : active === 1 ? "Daily practice consolidated development, collaboration, and continuous delivery fundamentals." : "Greater technical autonomy, participation in real projects, and full-stack work.";
  return <div className="destination-content"><PanelHeading kicker={copy.career.kicker} title={copy.career.title} intro={copy.career.intro} />
    <div className={`career-experience career-step-${active}`}>
      <div className="career-route-meta"><span>{language === "pt-BR" ? "Linha do tempo profissional" : "Professional timeline"}</span><strong>{timeline[0].startYear} — {copy.career.present}</strong></div>
      <div className="world-timeline" role="tablist">{timeline.map((experience, index) => <button type="button" role="tab" aria-selected={active === index} className={active === index ? "active" : ""} key={experience.id} onClick={() => setActive(index)}><time>{experience.startYear} — {experience.endYear ?? copy.career.present}</time><i>{String(index + 1).padStart(2, "0")}</i><span>{language === "pt-BR" ? experience.role : experience.roleEn}</span><small>{index === 0 ? (language === "pt-BR" ? "Início da trajetória" : "Career beginning") : index === timeline.length - 1 ? (language === "pt-BR" ? "Posição atual" : "Current position") : (language === "pt-BR" ? "Transição para desenvolvimento" : "Transition into development")}</small></button>)}</div>
      <article className="career-detail career-showcase" role="tabpanel" key={selected.id}>
        <header>
          <span className="career-role-icon"><BriefcaseBusiness /></span>
          <div className="career-heading-copy">
            <time>{selected.startYear} — {selected.endYear ?? copy.career.present}</time>
            <h3>{language === "pt-BR" ? selected.role : selected.roleEn}</h3>
            <strong>{selected.company}</strong>
            <p>{language === "pt-BR" ? selected.description : selected.descriptionEn}</p>
          </div>
          <div className="career-workspace-visual" aria-hidden>
            <span className="career-monitor monitor-back"><i /><i /><i /><i /><i /></span>
            <span className="career-monitor monitor-main"><i /><i /><i /><i /><i /><i /></span>
            <span className="career-monitor monitor-side"><i /><i /><i /><i /></span>
            <b className="career-desk" />
          </div>
          <span className="career-sequence">{String(active + 1).padStart(2, "0")}<small>/ {String(timeline.length).padStart(2, "0")}</small></span>
        </header>
        <div className={`career-detail-grid ${complementaryStack.length ? "has-secondary" : "without-secondary"}`}>
          <section className="career-responsibilities"><h4><ListChecks />{language === "pt-BR" ? "Principais responsabilidades" : "Core responsibilities"}</h4><ul>{responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section className="career-primary-stack"><h4><Layers3 />{active === 0 ? (language === "pt-BR" ? "Competências principais" : "Core skills") : (language === "pt-BR" ? "Stack principal" : "Core stack")}</h4><div className="career-tech primary">{primaryStack.map((item) => <span key={item}><SkillIcon name={item} size={18} />{item}</span>)}</div></section>
          {complementaryStack.length > 0 && <section className="career-secondary-stack"><h4><Sparkles />{language === "pt-BR" ? "Outras tecnologias" : "Other technologies"}</h4><div className="career-tech secondary">{complementaryStack.map((item) => <span key={item}><SkillIcon name={item} size={17} />{item}</span>)}</div></section>}
          <section className="career-evolution"><TrendingUp /><div><h4>{language === "pt-BR" ? "Evolução" : "Growth"}</h4><blockquote>“{evolution}”</blockquote></div></section>
        </div>
      </article>
    </div>
  </div>;
}

function ArchitecturePanel() {
  const { language } = useI18n();
  const copy = worldCopy[language];
  const [active, setActive] = useState(0);
  const details = language === "pt-BR"
    ? [
      ["Frontend Experience", "Entrega a interface, navegação e renderização da experiência.", "Separa apresentação das regras do sistema."],
      ["Contrato HTTP", "Expõe recursos e conecta o frontend à aplicação.", "Mantém uma fronteira clara entre cliente e servidor."],
      ["Application Core", "Recebe requisições e sustenta a aplicação Java 21.", "Centraliza configuração, segurança e orquestração."],
      ["Use Cases", "Coordena regras e operações da aplicação.", "Equivalente aproximado no Laravel: Service / Application Service."],
      ["Ports", "Define contratos estáveis para dependências externas.", "Evita acoplamento do domínio com infraestrutura."],
      ["Adapters", "Implementa integrações, persistência e entradas do sistema.", "Equivalente aproximado no Laravel: Repository / Provider."],
      ["Persistência", "Armazena os documentos usados pela aplicação.", "MongoDB mantém flexibilidade sem vazar detalhes para o domínio."],
    ] : [
      ["Frontend Experience", "Delivers the interface, navigation, and experience rendering.", "Separates presentation from system rules."],
      ["HTTP Contract", "Exposes resources and connects the frontend to the application.", "Keeps a clear client-server boundary."],
      ["Application Core", "Receives requests and supports the Java 21 application.", "Centralizes configuration, security, and orchestration."],
      ["Use Cases", "Coordinates application rules and operations.", "Approximate Laravel equivalent: Service / Application Service."],
      ["Ports", "Defines stable contracts for external dependencies.", "Prevents domain coupling with infrastructure."],
      ["Adapters", "Implements integrations, persistence, and system inputs.", "Approximate Laravel equivalent: Repository / Provider."],
      ["Persistence", "Stores the documents used by the application.", "MongoDB remains flexible without leaking details into the domain."],
    ];
  return <div className="destination-content"><PanelHeading kicker={copy.architecture.kicker} title={copy.architecture.title} intro={copy.architecture.intro} />
    <div className="architecture-experience"><div className="architecture-route"><button type="button" className={active === 0 ? "active" : ""} onClick={() => setActive(0)}><span>Frontend</span><strong>Next.js</strong><small>Frontend Experience</small></button><i>↓</i><button type="button" className={active === 1 ? "active" : ""} onClick={() => setActive(1)}><span>API</span><strong>REST API</strong><small>Comunicação e contratos</small></button><i>↓</i><section className="architecture-core"><span>Application Core</span><button type="button" className={active === 2 ? "active" : ""} onClick={() => setActive(2)}><strong>Java 21 + Spring Boot</strong></button><div><button type="button" className={active === 3 ? "active" : ""} onClick={() => setActive(3)}>Use Cases</button><button type="button" className={active === 4 ? "active" : ""} onClick={() => setActive(4)}>Ports</button></div></section><i>↓</i><section className="architecture-infrastructure"><span>Infrastructure</span><button type="button" className={active === 5 ? "active" : ""} onClick={() => setActive(5)}>Adapters</button><button type="button" className={active === 6 ? "active" : ""} onClick={() => setActive(6)}>MongoDB</button></section></div><aside className="architecture-detail"><span>{String(active + 1).padStart(2, "0")}</span><h3>{copy.architecture.flow[active]}</h3><strong>{details[active][0]}</strong><p>{details[active][1]}</p><small>{details[active][2]}</small></aside></div>
    <p className="system-active"><Radio size={14} /> {copy.architecture.active}</p>
    <div className="architecture-actions"><span>{language === "pt-BR" ? "Explore a implementação" : "Explore the implementation"}</span><div><a className="primary-action" href="/swagger" target="_blank" rel="noopener noreferrer">{copy.architecture.swagger}</a><Link className="secondary-action" href="/lab">{copy.architecture.lab}</Link><Link className="secondary-action" href="/architecture">{language === "pt-BR" ? "Como foi construído?" : "How was it built?"}</Link></div></div>
  </div>;
}

function ArchitectureGlobePanel() {
  const { language } = useI18n();
  const copy = worldCopy[language];
  const [active, setActive] = useState(0);
  const nodes = language === "pt-BR" ? [
    { layer: "Frontend", title: "Next.js", subtitle: "Interface e experiência web", description: "Entrega a interface, a navegação e a renderização da experiência do portfólio.", note: "Mantém a apresentação separada das regras do sistema.", icon: Folder, tech: ["Next.js", "TypeScript", "React"] },
    { layer: "API", title: "REST API", subtitle: "Comunicação e contratos", description: "Expõe recursos e conecta o frontend à aplicação por contratos HTTP previsíveis.", note: "Preserva uma fronteira clara entre cliente e servidor.", icon: Code2, tech: ["REST API", "OpenAPI", "Swagger"] },
    { layer: "Application", title: "Spring Boot", subtitle: "Configuração e orquestração", description: "Recebe as requisições e sustenta a aplicação Java 21.", note: "Centraliza segurança, configuração e composição de dependências.", icon: Leaf, tech: ["Java", "Spring Boot", "OpenAPI"] },
    { layer: "Application Core", title: "Use Cases", subtitle: "Regras da aplicação", description: "Coordena operações e regras sem depender de detalhes externos.", note: "Equivalente aproximado no Laravel: Service / Application Service.", icon: Box, tech: ["Java", "Use Cases", "Clean Architecture"] },
    { layer: "Domain", title: "Domain", subtitle: "Modelo e regras centrais", description: "Representa os conceitos mais estáveis do sistema e suas regras.", note: "O domínio permanece independente de banco, HTTP e framework.", icon: Layers3, tech: ["Java", "Domain Model", "Records"] },
    { layer: "Boundaries", title: "Ports", subtitle: "Contratos de entrada e saída", description: "Define interfaces estáveis para todas as dependências externas.", note: "Aplica inversão de dependência e reduz o acoplamento.", icon: Plug, tech: ["Interfaces", "Ports", "Dependency Inversion"] },
    { layer: "Infrastructure", title: "MongoDB Adapter", subtitle: "Persistência e integrações", description: "Implementa persistência e traduz modelos para documentos do MongoDB.", note: "A infraestrutura pode evoluir sem contaminar o núcleo da aplicação.", icon: Database, tech: ["MongoDB", "Spring Data", "Docker"] },
  ] : [
    { layer: "Frontend", title: "Next.js", subtitle: "Interface and web experience", description: "Delivers the interface, navigation, and rendering of the portfolio experience.", note: "Keeps presentation separate from system rules.", icon: Folder, tech: ["Next.js", "TypeScript", "React"] },
    { layer: "API", title: "REST API", subtitle: "Communication and contracts", description: "Exposes resources and connects the frontend to the application through predictable HTTP contracts.", note: "Preserves a clear boundary between client and server.", icon: Code2, tech: ["REST API", "OpenAPI", "Swagger"] },
    { layer: "Application", title: "Spring Boot", subtitle: "Configuration and orchestration", description: "Receives requests and supports the Java 21 application.", note: "Centralizes security, configuration, and dependency composition.", icon: Leaf, tech: ["Java", "Spring Boot", "OpenAPI"] },
    { layer: "Application Core", title: "Use Cases", subtitle: "Application rules", description: "Coordinates operations and rules without depending on external details.", note: "Approximate Laravel equivalent: Service / Application Service.", icon: Box, tech: ["Java", "Use Cases", "Clean Architecture"] },
    { layer: "Domain", title: "Domain", subtitle: "Core model and rules", description: "Represents the system's most stable concepts and rules.", note: "The domain remains independent from database, HTTP, and framework.", icon: Layers3, tech: ["Java", "Domain Model", "Records"] },
    { layer: "Boundaries", title: "Ports", subtitle: "Input and output contracts", description: "Defines stable interfaces for every external dependency.", note: "Applies dependency inversion and reduces coupling.", icon: Plug, tech: ["Interfaces", "Ports", "Dependency Inversion"] },
    { layer: "Infrastructure", title: "MongoDB Adapter", subtitle: "Persistence and integrations", description: "Implements persistence and translates models into MongoDB documents.", note: "Infrastructure can evolve without contaminating the application core.", icon: Database, tech: ["MongoDB", "Spring Data", "Docker"] },
  ];
  const selected = nodes[active];
  const SelectedIcon = selected.icon;

  return <div className="destination-content architecture-globe-panel">
    <PanelHeading kicker={copy.architecture.kicker} title={copy.architecture.title} intro={copy.architecture.intro} />
    <div className="architecture-panel-status"><span><Radio size={13} />{language === "pt-BR" ? "Sistema em operação" : "System online"}</span><strong>07 {language === "pt-BR" ? "camadas mapeadas" : "mapped layers"}</strong></div>
    <div className="architecture-panel-map">
      <div className="architecture-panel-nodes" role="tablist" aria-label={language === "pt-BR" ? "Componentes da arquitetura" : "Architecture components"}>
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return <button key={node.title} type="button" role="tab" aria-selected={active === index} className={active === index ? "active" : ""} onClick={() => setActive(index)}>
            <span className="architecture-panel-index">{String(index + 1).padStart(2, "0")}</span>
            <Icon size={22} />
            <span className="architecture-panel-node-copy"><small>{node.layer}</small><strong>{node.title}</strong><em>{node.subtitle}</em></span>
            <ArrowRight size={16} />
          </button>;
        })}
      </div>
      <aside className="architecture-panel-detail" role="tabpanel" key={selected.title}>
        <header><span>{String(active + 1).padStart(2, "0")} / {selected.layer}</span><SelectedIcon size={28} /></header>
        <h3>{selected.title}</h3>
        <strong>{selected.subtitle}</strong>
        <p>{selected.description}</p>
        <blockquote>{selected.note}</blockquote>
        <section><span>{language === "pt-BR" ? "Tecnologias da camada" : "Layer technologies"}</span><div>{selected.tech.map((item) => <small key={item}><SkillIcon name={item} size={17} />{item}</small>)}</div></section>
      </aside>
    </div>
    <div className="architecture-panel-actions"><nav><a className="primary-action" href="/swagger" target="_blank" rel="noopener noreferrer">{copy.architecture.swagger}</a><Link className="secondary-action" href="/lab">{copy.architecture.lab}</Link><Link className="secondary-action" href="/architecture">{language === "pt-BR" ? "Explorar arquitetura" : "Explore architecture"}</Link></nav></div>
  </div>;
}

function ContactPanel({ data }: { data: PortfolioData }) {
  const { language } = useI18n();
  const portuguese = language === "pt-BR";
  return <div className="destination-content contact-globe-panel">
    <div className="contact-module-grid">
      <section className="contact-module-main">
        <span className="contact-module-kicker">{portuguese ? "Contato" : "Contact"}</span>
        <h2>{portuguese ? "Entre em contato" : "Get in touch"} <em>via:</em></h2>
        <p>{portuguese ? "Escolha o canal mais adequado para conversar sobre oportunidades, projetos, tecnologia ou colaboração profissional." : "Choose the best channel to discuss opportunities, projects, technology, or professional collaboration."}</p>
      </section>
      <div className="contact-social-list">
        <a className="linkedin" href={data.profile.linkedinUrl} target="_blank" rel="noopener noreferrer"><span className="contact-social-icon"><Linkedin /></span><span><strong>LinkedIn</strong><small>{portuguese ? "Para oportunidades, networking e conversas profissionais." : "For opportunities, networking, and professional conversations."}</small></span><ArrowUpRight /></a>
        <a href={data.profile.githubUrl} target="_blank" rel="noopener noreferrer"><span className="contact-social-icon"><Github /></span><span><strong>GitHub</strong><small>{portuguese ? "Para conhecer projetos, repositórios e contribuições." : "To explore projects, repositories, and contributions."}</small></span><ArrowUpRight /></a>
        <a href="https://github.com/AlanChristofer/tech-world/issues" target="_blank" rel="noopener noreferrer"><span className="contact-social-icon"><Code2 /></span><span><strong>{portuguese ? "Contato técnico" : "Technical contact"}</strong><small>{portuguese ? "Para sugestões e conversas sobre este portfólio." : "For suggestions and conversations about this portfolio."}</small></span><ArrowUpRight /></a>
      </div>
    </div>
    <footer className="contact-module-footer"><span className="contact-monogram">AC</span><span className="contact-footer-identity"><strong>Alan Christofer</strong><small>Software Developer</small></span><span className="contact-availability"><i />{portuguese ? "Aberto a novas conexões e oportunidades" : "Open to new connections and opportunities"}</span></footer>
  </div>;
}

function PanelHeading({ kicker, title, intro }: { kicker: string; title: string; intro: string }) {
  return <div className="destination-heading"><span className="panel-kicker">{kicker}</span><h2>{title}</h2><p>{intro}</p></div>;
}

type PanelMode = "normal" | "expanded" | "minimized" | "closed";

function DestinationPanel({ selected, data, select, mode, onMinimize, onToggleExpanded, onClose }: { selected: Exclude<DestinationId, "global">; data: PortfolioData; select: (id: DestinationId) => void; mode: Exclude<PanelMode, "closed">; onMinimize: () => void; onToggleExpanded: () => void; onClose: () => void }) {
  const { language } = useI18n();
  const copy = worldCopy[language];
  const expanded = mode === "expanded";
  const minimized = mode === "minimized";
  const minimizeLabel = language === "pt-BR" ? "Minimizar painel" : "Minimize panel";
  const expandLabel = expanded ? (language === "pt-BR" ? "Recolher painel" : "Collapse panel") : (language === "pt-BR" ? "Expandir painel" : "Expand panel");
  const closeLabel = language === "pt-BR" ? "Fechar painel" : "Close panel";
  return <aside className={`destination-experience panel-${selected} ${expanded ? "expanded" : ""} ${minimized ? "minimized" : ""}`} aria-live="polite">
    <div className="destination-panel-toolbar">
      <button className="back-global" type="button" onClick={() => select("global")}>← {copy.back}</button>
      <div className="panel-window-controls" aria-label={language === "pt-BR" ? "Controles do painel" : "Panel controls"}>
        <button className="panel-window-button panel-minimize" type="button" onClick={onMinimize} aria-pressed={minimized} aria-label={minimizeLabel} title={minimizeLabel}><Minus size={15} /></button>
        <button className="panel-window-button panel-expand" type="button" onClick={onToggleExpanded} aria-pressed={expanded} aria-label={expandLabel} title={expandLabel}>{expanded ? <Copy size={14} /> : <Square size={14} />}</button>
        <button className="panel-window-button panel-close" type="button" onClick={onClose} aria-label={closeLabel} title={closeLabel}><X size={16} /></button>
      </div>
    </div>
    {selected === "about" && <AboutPanel />}
    {selected === "projects" && <ProjectsPanel projects={data.projects} />}
    {selected === "skills" && <SkillsPanel />}
    {selected === "career" && <CareerPanel experiences={data.experiences} />}
    {selected === "architecture" && <ArchitectureGlobePanel />}
    {selected === "contact" && <ContactPanel data={data} />}
  </aside>;
}

export function TechWorld({ data }: { data: PortfolioData }) {
  const params = useSearchParams();
  const { language } = useI18n();
  const copy = worldCopy[language];
  const initial = isDestinationId(params.get("destination")) ? params.get("destination") as DestinationId : "global";
  const { selected, navigation, select, reportOriginVisibility, locked, travelling, destinationOpen, destinationLayout, reducedMotion } = useGlobeTravel(initial);
  const panelClosing = navigation.phase === "returning" && selected !== "global";
  const [panelMode, setPanelMode] = useState<PanelMode>("normal");

  useEffect(() => {
    setPanelMode("normal");
  }, [selected]);

  const panelExpanded = panelMode === "expanded";
  const panelMinimized = panelMode === "minimized";
  const panelClosed = panelMode === "closed";
  const closePanel = () => {
    setPanelMode("closed");
    select("global");
  };

  return <section className={`tech-world travel-${navigation.phase} ${destinationLayout ? "destination-layout" : ""} ${destinationOpen ? "destination-open" : ""} ${panelExpanded ? "panel-expanded" : ""} ${panelMinimized ? "panel-minimized" : ""} ${panelClosed ? "panel-closed" : ""} ${panelClosing ? "panel-closing" : ""} ${travelling ? "is-travelling" : ""}`}>
    <div className="world-stage">
      <WorldHero data={data} select={select} />
      <div className="globe-zone">
        <GlobeScene selected={selected} navigation={navigation} copy={copy} onSelect={select} onOriginVisibility={reportOriginVisibility} reducedMotion={reducedMotion} locked={locked} />
        <div className="globe-guidebar" aria-label={language === "pt-BR" ? "Controles do globo" : "Globe controls"}>
          <span className="globe-guidebar-item"><Route size={15} /><span><strong>{language === "pt-BR" ? "Gire o planeta" : "Rotate the planet"}</strong><small>{language === "pt-BR" ? "Arraste em qualquer direção" : "Drag in any direction"}</small></span></span>
          <i aria-hidden />
          <span className="globe-guidebar-item"><Compass size={15} /><span><strong>{language === "pt-BR" ? "Escolha um destino" : "Choose a destination"}</strong><small>{language === "pt-BR" ? "Clique em um ponto para viajar" : "Select a point to travel"}</small></span></span>
          <span className="globe-guidebar-zoom"><kbd>SCROLL</kbd><small>{language === "pt-BR" ? "Zoom" : "Zoom"}</small></span>
        </div>
      </div>
      {(destinationOpen || panelClosing) && selected !== "global" && !panelClosed && <DestinationPanel selected={selected} data={data} select={select} mode={panelMode === "closed" ? "normal" : panelMode} onMinimize={() => setPanelMode("minimized")} onToggleExpanded={() => setPanelMode((current) => current === "expanded" ? "normal" : "expanded")} onClose={closePanel} />}
    </div>
  </section>;
}
