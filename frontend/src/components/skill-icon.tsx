import type { ComponentType } from "react";
import { Braces, Cloud, Code2, Database, GitBranch, Network, Server, Wrench } from "lucide-react";
import { SiDocker, SiGit, SiJavascript, SiMongodb, SiNodedotjs, SiPostgresql, SiPython, SiReact, SiSpringboot, SiTypescript } from "react-icons/si";

type TechnologyIcon = ComponentType<{ size?: number; className?: string }>;

const skillIconMap: Record<string, TechnologyIcon> = {
  Java: Code2, "Spring Boot": SiSpringboot, "C#": Code2, ".NET": Braces, PHP: Code2, Laravel: Server,
  "Node.js": SiNodedotjs, NestJS: Server, Python: SiPython, JavaScript: SiJavascript, TypeScript: SiTypescript,
  React: SiReact, "Next.js": SiReact, HTML5: Code2, CSS3: Braces, TailwindCSS: Braces, Vite: Wrench,
  "SQL Server": Database, PostgreSQL: SiPostgresql, MongoDB: SiMongodb, "REST API": Network, Kafka: Network,
  OpenAPI: Braces, Swagger: Braces, Git: SiGit, GitFlow: GitBranch, Jenkins: Wrench, Docker: SiDocker,
  Kubernetes: Cloud, "GitLab CI/CD": Wrench, Cloudflare: Cloud, Neon: SiPostgresql, Supabase: Database,
  Express: Server, "YouTube Data API": Network, "Mercado Pago": Network, "React Router": Network,
  Recharts: Braces, PWA: Cloud, "sql.js": Database, localStorage: Database,
};

export function SkillIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = skillIconMap[name] ?? Code2;
  return <span className="skill-icon" role="img" aria-label={name} title={name}><Icon size={size} /></span>;
}
