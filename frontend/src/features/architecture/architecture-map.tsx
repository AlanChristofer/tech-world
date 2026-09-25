"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Box, Code2, Database, ExternalLink, Folder, Layers3, Leaf, Plane, Plug, ServerCog } from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";
import { SkillIcon } from "@/components/skill-icon";
import { useI18n } from "@/i18n/language-context";
import type { Architecture } from "@/types/portfolio";

const nodes = [
  {
    id: "frontend",
    title: "Next.js",
    layer: "Frontend",
    subtitle: "Interface e renderização da experiência",
    description: "Camada responsável pela interface do portfólio, construída com Next.js e TypeScript. Consome a REST API e orquestra a experiência de navegação entre os módulos.",
    icon: Folder,
    tech: ["Next.js", "TypeScript", "React", "TailwindCSS"],
    responsibilities: ["Renderização da interface web", "Consumo da API REST", "Gerenciamento de estado e rotas", "Experiência interativa do globo 3D"],
    path: [["/frontend", ""], ["app", "Rotas e páginas"], ["components", "Componentes reutilizáveis"], ["services", "Integração com a API"], ["hooks", "Regras de estado"], ["lib", "Configurações e utilitários"], ["styles", "Estilização"]],
  },
  {
    id: "api",
    title: "REST API",
    layer: "HTTP Contract",
    subtitle: "Comunicação e contratos HTTP",
    description: "Contrato público entre interface e backend. Expõe recursos, normaliza respostas e mantém a fronteira clara entre cliente, aplicação e infraestrutura.",
    icon: Code2,
    tech: ["REST API", "OpenAPI", "Swagger", "Java"],
    responsibilities: ["Endpoints de leitura", "Serialização de respostas", "Contrato HTTP previsível", "Documentação técnica"],
    path: [["/src/main/java", ""], ["controller", "Entrada HTTP"], ["dto", "Objetos de transferência"], ["config", "Documentação e segurança"]],
  },
  {
    id: "spring",
    title: "Spring Boot",
    layer: "Application",
    subtitle: "Aplicação, regras de negócio e orquestração",
    description: "Camada de entrada da aplicação Java. Composição de dependências, segurança, configuração e execução dos casos de uso do sistema.",
    icon: Leaf,
    tech: ["Java", "Spring Boot", "OpenAPI", "Swagger"],
    responsibilities: ["Inicialização da aplicação", "Injeção de dependências", "Configuração de segurança", "Orquestração dos módulos"],
    path: [["/src/main/java", ""], ["application", "Casos de uso"], ["infrastructure", "Configuração e adapters"], ["domain", "Modelo de domínio"]],
  },
  {
    id: "use-cases",
    title: "Application / Use Cases",
    layer: "Application Core",
    subtitle: "Casos de uso e regras da aplicação",
    description: "Núcleo que coordena operações sem depender diretamente de HTTP, banco ou framework. Mantém a intenção da aplicação isolada dos detalhes externos.",
    icon: Box,
    tech: ["Java", "Clean Architecture", "Ports", "Use Cases"],
    responsibilities: ["Coordenação das operações", "Regras de aplicação", "Fluxo entre domínio e portas", "Separação de responsabilidades"],
    path: [["/application", ""], ["usecase", "Operações do sistema"], ["port/input", "Entradas da aplicação"], ["port/output", "Contratos externos"]],
  },
  {
    id: "domain",
    title: "Domain",
    layer: "Domain",
    subtitle: "Entidades, regras e modelo de domínio",
    description: "Representa os conceitos centrais do portfólio sem depender de infraestrutura. É a parte mais estável do sistema.",
    icon: Database,
    tech: ["Java", "Records", "Domain Model"],
    responsibilities: ["Modelos centrais", "Regras independentes", "Tipos do domínio", "Baixo acoplamento"],
    path: [["/domain", ""], ["model", "Entidades e records"], ["exception", "Erros de domínio"]],
  },
  {
    id: "ports",
    title: "Ports",
    layer: "Boundaries",
    subtitle: "Contratos e interfaces de saída/entrada",
    description: "Define contratos estáveis para que a aplicação dependa de abstrações, não de detalhes de banco, API externa ou framework.",
    icon: Plug,
    tech: ["Java", "Interfaces", "Dependency Inversion"],
    responsibilities: ["Inversão de dependência", "Contratos testáveis", "Isolamento de infraestrutura", "Flexibilidade para adapters"],
    path: [["/application/port", ""], ["input", "Casos expostos"], ["output", "Dependências externas"]],
  },
  {
    id: "adapter",
    title: "MongoDB Adapter",
    layer: "Infrastructure",
    subtitle: "Implementação de persistência (adapter)",
    description: "Implementa as portas de persistência, traduzindo modelos da aplicação para documentos armazenados no MongoDB.",
    icon: Database,
    tech: ["MongoDB", "Spring Data", "Docker"],
    responsibilities: ["Persistência de conteúdo", "Mapeamento para documentos", "Implementação das portas", "Configuração local com Docker"],
    path: [["/infrastructure", ""], ["adapter", "Implementações"], ["repository", "Acesso ao MongoDB"], ["document", "Modelos persistidos"]],
  },
];

export function ArchitectureMap({ architecture }: { architecture: Architecture }) {
  const { language } = useI18n();
  const [active, setActive] = useState(0);
  const selected = nodes[active];
  const ActiveIcon = selected.icon;
  const flow = useMemo(() => nodes.map((node, index) => ({ ...node, index })), []);
  const backLabel = language === "pt-BR" ? "Voltar à Arquitetura" : "Back to Architecture";
  const githubLabel = language === "pt-BR" ? "Ver no GitHub" : "View on GitHub";
  const folderLabel = language === "pt-BR" ? "Abrir pasta" : "Open folder";

  return <section className="architecture-lab-page">
    <div className="architecture-orbit-bg" aria-hidden><Plane /></div>
    <div className="architecture-lab-shell">
      <Link className="architecture-back-button" href="/?destination=architecture"><ArrowLeft size={18} />{backLabel}</Link>
      <div className="architecture-hero-copy">
        <span className="panel-kicker">Laboratório de Arquitetura</span>
        <h1>O mapa corresponde <span>ao código.</span></h1>
        <p>Selecione um componente para entender sua responsabilidade e acompanhar o fluxo real até a persistência.</p>
      </div>
      <div className="architecture-lab-grid">
        <div className="architecture-node-list" role="tablist" aria-label="Componentes da arquitetura">
          {flow.map(({ id, title, subtitle, icon: Icon, index }) => <button key={id} type="button" role="tab" aria-selected={active === index} className={active === index ? "active" : ""} onClick={() => setActive(index)}>
            <span className="architecture-step-index"><strong>{String(index + 1).padStart(2, "0")}</strong><small>{String(index + 1).padStart(2, "0")}</small></span>
            <Icon className="architecture-step-icon" size={34} />
            <span className="architecture-step-copy"><strong>{title}</strong><small>{subtitle}</small></span>
            <ArrowRight className="architecture-step-arrow" size={22} />
          </button>)}
        </div>
        <aside className="architecture-component-panel" role="tabpanel">
          <header>
            <span><strong>{String(active + 1).padStart(2, "0")}</strong> / {selected.layer}</span>
            <a href="https://github.com/AlanChristofer/tech-world" target="_blank" rel="noopener noreferrer"><Github size={20} />{githubLabel}<ExternalLink size={15} /></a>
            <h2>{selected.title}</h2>
            <p>{selected.subtitle}</p>
            <small>{selected.description}</small>
          </header>
          <div className="architecture-info-grid">
            <section>
              <h3><Layers3 size={14} />Principais responsabilidades</h3>
              <ul>{selected.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section>
              <h3><ServerCog size={14} />Tecnologias</h3>
              <div className="architecture-tech-stack">{selected.tech.map((item) => <span key={item}><SkillIcon name={item} size={34} />{item}</span>)}</div>
            </section>
          </div>
          <section className="architecture-code-flow">
            <div><h3><Folder size={15} />Fluxo no código</h3><a href="https://github.com/AlanChristofer/tech-world" target="_blank" rel="noopener noreferrer"><Folder size={16} />{folderLabel}<ExternalLink size={14} /></a></div>
            <div className="architecture-file-tree">{selected.path.map(([name, note], index) => <p key={`${name}-${index}`} className={index === 0 ? "root" : ""}><Folder size={18} /><code>{name}</code>{note && <span># {note}</span>}</p>)}</div>
          </section>
        </aside>
      </div>
      <p className="architecture-style-note">{architecture.style} · {architecture.principles.join(" · ")}</p>
    </div>
  </section>;
}
