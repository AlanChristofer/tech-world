"use client";

import { useState } from "react";
import { ImplementationInsight } from "@/components/implementation-insight";
import { LazyAvatarGuide } from "@/components/lazy-avatar-guide";
import type { AvatarState } from "@/components/avatar-scene";
import { useI18n } from "@/i18n/language-context";
import type { Architecture } from "@/types/portfolio";

const descriptions = {
  "Next.js": { pt: "App Router, Server Components e TanStack Query compõem a experiência web.", en: "App Router, Server Components, and TanStack Query compose the web experience." },
  "REST API": { pt: "Contrato HTTP em /api, documentado com OpenAPI.", en: "HTTP contract under /api, documented with OpenAPI." },
  "Spring Boot": { pt: "Framework de entrada, composição de dependências, segurança e observabilidade.", en: "Entry framework for dependency composition, security, and observability." },
  "Application / Use Cases": { pt: "Orquestra consultas, escritas e autenticação sem conhecer MongoDB ou HTTP.", en: "Orchestrates queries, writes, and authentication without depending on MongoDB or HTTP." },
  Domain: { pt: "Records e exceções em Java puro, sem anotações de framework.", en: "Records and exceptions in plain Java, without framework annotations." },
  Ports: { pt: "Interfaces que invertem a dependência entre regras e infraestrutura.", en: "Interfaces that invert dependencies between business rules and infrastructure." },
  "MongoDB Adapter": { pt: "Traduz entidades para documentos e implementa as portas de persistência.", en: "Maps entities to documents and implements persistence ports." },
} as const;

export function ArchitectureMap({ architecture }: { architecture: Architecture }) {
  const [selected, setSelected] = useState(architecture.flow[0]);
  const [avatarState, setAvatarState] = useState<AvatarState>("explaining");
  const { language, t } = useI18n();
  const detail = descriptions[selected as keyof typeof descriptions];
  return <>
    <LazyAvatarGuide state={avatarState} message={t("architecture.message")} />
    <div className="architecture-layout"><div className="architecture-flow panel" aria-label={t("architecture.title")}>
      {architecture.flow.map((node, index) => <div key={node} className="flow-step"><button className={selected === node ? "selected" : ""} onClick={() => { setSelected(node); setAvatarState(index % 2 === 0 ? "pointRight" : "pointLeft"); }} onMouseLeave={() => setAvatarState("explaining")}><span>{String(index + 1).padStart(2, "0")}</span>{node}</button>{index < architecture.flow.length - 1 && <div className="flow-arrow" aria-hidden>↓</div>}</div>)}
    </div><aside className="panel architecture-detail"><span className="eyebrow">{t("architecture.selected")}</span><h2>{selected}</h2><p>{detail ? detail[language === "pt-BR" ? "pt" : "en"] : selected}</p><div className="architecture-meta"><span>{t("architecture.style")}</span><strong>{architecture.style}</strong></div><div className="architecture-meta"><span>{t("architecture.principles")}</span><strong>{architecture.principles.join(" · ")}</strong></div></aside></div>
    <ImplementationInsight><p>Next.js → REST → Spring Controller → Use Case → Port → Adapter → MongoDB</p></ImplementationInsight>
  </>;
}
