import type { ComponentType } from "react";
import { Braces, Cloud, Code2, Database, GitBranch, Network, Server, Wrench } from "lucide-react";
import { FaJava } from "react-icons/fa";
import { SiApachekafka, SiDocker, SiDotnet, SiGit, SiGitlab, SiHtml5, SiJenkins, SiKubernetes, SiLaravel, SiMongodb, SiNestjs, SiNextdotjs, SiNodedotjs, SiPhp, SiPostgresql, SiPython, SiReact, SiSpringboot, SiSwagger, SiTailwindcss, SiTypescript, SiVite, SiJavascript } from "react-icons/si";

type TechnologyIcon = ComponentType<{ size?: number; className?: string }>;

const skillIconMap: Record<string, TechnologyIcon> = {
  Java: FaJava, "Spring Boot": SiSpringboot, "C#": Code2, ".NET": SiDotnet, PHP: SiPhp, Laravel: SiLaravel,
  "Node.js": SiNodedotjs, NestJS: SiNestjs, Python: SiPython, JavaScript: SiJavascript, TypeScript: SiTypescript,
  React: SiReact, "Next.js": SiNextdotjs, HTML: SiHtml5, HTML5: SiHtml5, CSS: Braces, CSS3: Braces, TailwindCSS: SiTailwindcss, Vite: SiVite,
  "SQL Server": Database, PostgreSQL: SiPostgresql, MongoDB: SiMongodb, "REST API": Network, Kafka: SiApachekafka,
  OpenAPI: Braces, Swagger: SiSwagger, Git: SiGit, GitFlow: GitBranch, Jenkins: SiJenkins, Docker: SiDocker,
  Kubernetes: SiKubernetes, "GitLab CI/CD": SiGitlab, Cloudflare: Cloud, Neon: SiPostgresql, Supabase: Database,
  Express: Server, "YouTube Data API": Network, "Mercado Pago": Network, "React Router": Network,
  Recharts: Braces, PWA: Cloud, "sql.js": Database, localStorage: Database, "CI/CD": GitBranch,
  "REST APIs": Network, "C# / .NET": Code2, "PHP / Laravel": SiLaravel, "OpenAPI / Swagger": SiSwagger,
  "Contact center": Network, Indicadores: Braces, Produtividade: Wrench, TMA: Wrench, SLA: Network,
  "Painéis": Braces, "Ferramentas internas": Wrench,
};

const skillColorMap: Record<string, string> = {
  Java: "#f89820", "Spring Boot": "#6db33f", "C#": "#9b4f96", ".NET": "#512bd4",
  PHP: "#777bb4", Laravel: "#ff2d20", "Node.js": "#5fa04e", NestJS: "#e0234e", Python: "#ffd43b",
  JavaScript: "#f7df1e", TypeScript: "#3178c6", React: "#61dafb", "Next.js": "#f4f4f4",
  HTML: "#e34f26", HTML5: "#e34f26", CSS: "#1572b6", CSS3: "#1572b6", TailwindCSS: "#06b6d4", Vite: "#a56bff",
  "SQL Server": "#e4473a", PostgreSQL: "#4169e1", MongoDB: "#47a248", "REST API": "#55f6cf",
  Kafka: "#f2f2f2", OpenAPI: "#6ba539", Swagger: "#85ea2d", Git: "#f05032", GitFlow: "#f05032",
  Jenkins: "#d24939", Docker: "#2496ed", Kubernetes: "#326ce5", "GitLab CI/CD": "#fc6d26",
  Cloudflare: "#f38020", Neon: "#00e699", Supabase: "#3ecf8e", Express: "#f2f2f2",
  "YouTube Data API": "#ff0033", "Mercado Pago": "#009ee3", "React Router": "#ca4245",
  Recharts: "#8884d8", PWA: "#5a0fc8", "sql.js": "#d8b742", localStorage: "#f7df1e", "CI/CD": "#fc6d26",
  "REST APIs": "#55f6cf", "C# / .NET": "#9b4f96", "PHP / Laravel": "#ff2d20", "OpenAPI / Swagger": "#85ea2d",
  "Contact center": "#22d3ee", Indicadores: "#fbbf24", Produtividade: "#4ade80", TMA: "#fb7185",
  SLA: "#60a5fa", "Painéis": "#a78bfa", "Ferramentas internas": "#2dd4bf",
};

export function SkillIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = skillIconMap[name] ?? Code2;
  return <span className="skill-icon" style={{ color: skillColorMap[name] }} role="img" aria-label={name} title={name}><Icon size={size} /></span>;
}
