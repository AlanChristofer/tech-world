"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { Activity, BookOpen, Cloud, Database, ExternalLink, Monitor, RadioTower, Server, UserRound, Workflow } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useI18n } from "@/i18n/language-context";
import styles from "./production-architecture.module.css";

type Tone = "blue" | "cyan" | "green" | "pink" | "violet";

type Service = {
  name: string;
  role: string;
  description: string;
  icon: ComponentType<{ "aria-hidden"?: boolean }>;
  tone: Tone;
  href?: string;
  linkLabel?: string;
};

const urls = {
  frontend: "https://tech-world-opal.vercel.app",
  api: "https://tech-world-api-kr5w.onrender.com",
  swagger: "https://tech-world-api-kr5w.onrender.com/swagger-ui/index.html",
  actions: "https://github.com/AlanChristofer/tech-world/actions",
};

export function ProductionArchitecture({ embedded = false }: { embedded?: boolean }) {
  const { language } = useI18n();
  const pt = language === "pt-BR";

  const services: Service[] = [
    {
      name: "Vercel",
      role: "Frontend",
      description: pt ? "Hospeda a experiência web em Next.js, React, TypeScript e Tailwind." : "Hosts the web experience built with Next.js, React, TypeScript, and Tailwind.",
      icon: Monitor,
      tone: "blue",
      href: urls.frontend,
      linkLabel: "tech-world-opal.vercel.app",
    },
    {
      name: "Render",
      role: "Backend",
      description: pt ? "Executa a API Spring Boot com Java 21 e integrações MongoDB e Kafka." : "Runs the Java 21 Spring Boot API and its MongoDB and Kafka integrations.",
      icon: Server,
      tone: "cyan",
      href: urls.api,
      linkLabel: "tech-world-api-kr5w.onrender.com",
    },
    {
      name: "MongoDB Atlas",
      role: "Database",
      description: pt ? "Mantém na nuvem os dados, traces e pedidos temporários da aplicação." : "Stores application data, traces, and temporary orders in the cloud.",
      icon: Database,
      tone: "green",
    },
    {
      name: "Aiven Kafka",
      role: "Messaging",
      description: pt ? "Transporta eventos assíncronos de pedidos e do heartbeat de produção." : "Transports asynchronous order and production heartbeat events.",
      icon: RadioTower,
      tone: "pink",
    },
    {
      name: "GitHub Actions",
      role: "CI + Heartbeat",
      description: pt ? "Executa CI e aciona o heartbeat que valida o pipeline em produção." : "Runs CI and triggers the heartbeat that validates the production pipeline.",
      icon: FaGithub,
      tone: "violet",
      href: urls.actions,
      linkLabel: pt ? "Ver automações" : "View workflows",
    },
  ];

  const statuses = [
    { label: "Frontend", provider: "Vercel", icon: Monitor, tone: "blue" as const, href: urls.frontend },
    { label: "API", provider: "Render", icon: Cloud, tone: "cyan" as const, href: urls.api },
    { label: "Database", provider: "MongoDB Atlas", icon: Database, tone: "green" as const },
    { label: "Messaging", provider: "Aiven Kafka", icon: RadioTower, tone: "pink" as const },
    { label: "CI / Heartbeat", provider: "GitHub Actions", icon: FaGithub, tone: "violet" as const, href: urls.actions },
    { label: "API Docs", provider: "Swagger", icon: BookOpen, tone: "green" as const, href: urls.swagger },
  ];
  return <section className={`${styles.page} ${embedded ? styles.embedded : ""}`}>
    <div className={styles.shell}>
      <header className={styles.hero}>
        <div className={styles.heading}>
          <span>{pt ? "Infraestrutura" : "Infrastructure"}</span>
          <h1>{pt ? <>Arquitetura em <em>Produção</em></> : <>Production <em>Architecture</em></>}</h1>
          <p>{pt
            ? "O Tech World é uma aplicação Full Stack publicada na nuvem, com frontend, backend, banco de dados, mensageria, CI e monitoramento."
            : "Tech World is a cloud-deployed Full Stack application with frontend, backend, database, messaging, CI, and monitoring."}</p>
        </div>
        <div className={styles.systemStatus} aria-label={pt ? "Sistema online" : "System online"}>
          <i aria-hidden />
          <span><strong>{pt ? "Sistema Online" : "System Online"}</strong><small>{pt ? "Todos os serviços em funcionamento" : "All services operational"}</small></span>
          <Activity aria-hidden />
        </div>
      </header>

      <div className={styles.workspace}>
        <section className={styles.diagram} aria-label={pt ? "Diagrama da arquitetura em produção" : "Production architecture diagram"}>
          <div className={styles.earth} aria-hidden />
          <svg className={styles.diagramConnections} viewBox="0 0 1000 550" preserveAspectRatio="none" aria-hidden>
            <defs>
              <marker id="production-arrow-primary" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,4 L0,8 Z" fill="var(--blue)" /></marker>
              <marker id="production-arrow-green" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,4 L0,8 Z" fill="var(--green)" /></marker>
              <marker id="production-arrow-pink" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,4 L0,8 Z" fill="var(--pink)" /></marker>
              <marker id="production-arrow-violet" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,4 L0,8 Z" fill="var(--violet)" /></marker>
            </defs>
            <path className={styles.connectionPrimary} d="M440 50 L440 150" markerEnd="url(#production-arrow-primary)" />
            <path className={styles.connectionPrimary} d="M440 150 L440 310" markerEnd="url(#production-arrow-primary)" />
            <path className={styles.connectionTrunk} d="M440 310 L440 383" />
            <path className={`${styles.connectionBranch} ${styles.mongoConnection}`} d="M440 383 L200 383 L200 460" markerEnd="url(#production-arrow-green)" />
            <path className={`${styles.connectionBranch} ${styles.kafkaConnection}`} d="M440 383 L620 383 L620 460" markerEnd="url(#production-arrow-pink)" />
            <path className={styles.connectionDeployFrontend} d="M860 260 C700 260 690 150 440 150" markerEnd="url(#production-arrow-green)" />
            <path className={styles.connectionDeployBackend} d="M860 260 C700 260 690 310 440 310" markerEnd="url(#production-arrow-violet)" />
            <path className={styles.connectionHeartbeat} d="M860 260 C860 365 710 370 620 460" markerEnd="url(#production-arrow-pink)" />
            <text className={styles.connectionLabel} x="650" y="182">{pt ? "deploy frontend" : "frontend deploy"}</text>
            <text className={`${styles.connectionLabel} ${styles.backendLabel}`} x="655" y="300">{pt ? "deploy backend" : "backend deploy"}</text>
            <text className={`${styles.connectionLabel} ${styles.heartbeatLabel}`} x="704" y="392">heartbeat</text>
          </svg>
          <div className={`${styles.node} ${styles.userNode}`}>
            <span className={styles.nodeIcon}><UserRound aria-hidden /></span>
            <span><strong>{pt ? "Usuário" : "User"}</strong><small>{pt ? "Acesso pelo navegador" : "Browser access"}</small></span>
          </div>

          <a className={`${styles.node} ${styles.vercelNode} ${styles.blue}`} href={urls.frontend} target="_blank" rel="noopener noreferrer">
            <span className={styles.number}>1</span>
            <span className={styles.vercelMark} aria-hidden />
            <span><strong>Vercel</strong><small>Next.js + React</small><em>Frontend <ExternalLink aria-hidden /></em></span>
          </a>

          <span className={styles.protocolLabel} aria-hidden>HTTPS / REST</span>

          <a className={`${styles.node} ${styles.renderNode} ${styles.cyan}`} href={urls.api} target="_blank" rel="noopener noreferrer">
            <span className={styles.number}>2</span>
            <span className={styles.nodeIcon}><Server aria-hidden /></span>
            <span><strong>Render</strong><small>Java 21 + Spring Boot</small><em>API <ExternalLink aria-hidden /></em></span>
          </a>

          <div className={`${styles.node} ${styles.mongoNode} ${styles.green}`}>
            <span className={styles.number}>3</span>
            <span className={styles.nodeIcon}><Database aria-hidden /></span>
            <span><strong>MongoDB Atlas</strong><small>{pt ? "Banco de dados" : "Database"}</small><em>{pt ? "Persistência de dados" : "Data persistence"}</em></span>
          </div>

          <div className={`${styles.node} ${styles.kafkaNode} ${styles.pink}`}>
            <span className={styles.number}>4</span>
            <span className={styles.nodeIcon}><RadioTower aria-hidden /></span>
            <span><strong>Aiven Kafka</strong><small>{pt ? "Mensageria" : "Messaging"}</small><em>{pt ? "Eventos assíncronos" : "Async events"}</em></span>
          </div>

          <a className={`${styles.node} ${styles.actionsNode} ${styles.violet}`} href={urls.actions} target="_blank" rel="noopener noreferrer">
            <span className={styles.number}>5</span>
            <span className={styles.nodeIcon}><FaGithub aria-hidden /></span>
            <span><strong>GitHub Actions</strong><small>CI + Heartbeat</small><em>{pt ? "Build e monitoramento" : "Build and monitoring"}</em></span>
          </a>

        </section>

        <aside className={styles.servicePanel} aria-label={pt ? "Componentes da infraestrutura" : "Infrastructure components"}>
          {services.map((service, index) => {
            const Icon = service.icon;
            const content = <>
              <span className={`${styles.serviceNumber} ${styles[service.tone]}`}>{index + 1}</span>
              <span className={`${styles.serviceIcon} ${styles[service.tone]}`}><Icon aria-hidden /></span>
              <span className={styles.serviceCopy}>
                <strong>{service.name} <small>({service.role})</small></strong>
                <p>{service.description}</p>
                {service.linkLabel && <em>{service.linkLabel} <ExternalLink aria-hidden /></em>}
              </span>
            </>;
            return service.href
              ? <a key={service.name} href={service.href} target="_blank" rel="noopener noreferrer">{content}</a>
              : <div key={service.name}>{content}</div>;
          })}
        </aside>
      </div>

      <section className={styles.statusSection} aria-labelledby="production-status-title">
        <h2 id="production-status-title">{pt ? "Status dos serviços" : "Service status"}</h2>
        <div className={styles.statusGrid}>
          {statuses.map((status) => {
            const Icon = status.icon;
            const content = <>
              <span className={`${styles.statusIcon} ${styles[status.tone]}`}><Icon aria-hidden /></span>
              <span><strong>{status.label}</strong><small>{status.provider}</small><em><i aria-hidden />{pt ? "Online" : "Online"}</em></span>
              {status.href && <ExternalLink className={styles.externalIcon} aria-hidden />}
            </>;
            return status.href
              ? <a key={status.label} href={status.href} target="_blank" rel="noopener noreferrer">{content}</a>
              : <div key={status.label}>{content}</div>;
          })}
        </div>
      </section>

      {!embedded && <nav className={styles.pageActions} aria-label={pt ? "Navegação da produção" : "Production navigation"}>
        <Link href="/">← {pt ? "Voltar ao globo" : "Back to globe"}</Link>
        <a href={urls.swagger} target="_blank" rel="noopener noreferrer">Swagger <ExternalLink aria-hidden /></a>
      </nav>}
    </div>
  </section>;
}
