"use client";

import { Activity, ArrowDown, Check, CircleDot, Code2, Database, ExternalLink, GitBranch, LoaderCircle, Play, Radio, Server, TestTube2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/i18n/language-context";

export type TraceStepName =
  | "REQUEST_RECEIVED"
  | "VALIDATION_COMPLETED"
  | "USE_CASE_STARTED"
  | "ORDER_PERSISTED"
  | "ORDER_CREATED_EVENT"
  | "EVENT_PUBLISHED"
  | "EVENT_CONSUMED"
  | "ORDER_PROCESSED";

type TraceStep = { name: TraceStepName; timestamp: string; durationMs: number | null; status: string; detail: string };
type TraceResponse = { traceId: string; orderId: string; steps: TraceStep[] };
type OrderResponse = { id: string; traceId: string; customerName: string; status: string; total: number; createdAt: string };
type HealthResponse = {
  components: Record<string, string>;
  metrics: { requests: number; created: number; processed: number; failed: number; averageLatencyMs: number };
  checkedAt: string;
};

const repository = "https://github.com/AlanChristofer/tech-world/blob/main/";
const steps = [
  { id: "REQUEST_RECEIVED", pt: "Request recebida", en: "Request received", layer: "REST ADAPTER", file: "src/main/java/com/alanchristofer/portfolio/infrastructure/adapter/input/rest/LabTraceFilter.java", responsibility: "Captura a requisição real, gera o correlation ID e inicia o trace.", responsibilityEn: "Captures the real request, generates the correlation ID, and starts the trace.", depends: ["OrderTracePort", "LabMetricsPort"], concepts: ["Correlation ID", "MDC", "Servlet Filter"] },
  { id: "VALIDATION_COMPLETED", pt: "Bean Validation", en: "Bean Validation", layer: "INPUT CONTRACT", file: "src/main/java/com/alanchristofer/portfolio/infrastructure/adapter/input/rest/dto/OrderLabRequests.java", responsibility: "Valida o contrato antes de permitir a entrada no caso de uso.", responsibilityEn: "Validates the contract before it reaches the use case.", depends: ["Jakarta Validation"], concepts: ["Validation", "Fail Fast", "DTO"] },
  { id: "USE_CASE_STARTED", pt: "CreateOrderUseCase", en: "CreateOrderUseCase", layer: "APPLICATION LAYER", file: "src/main/java/com/alanchristofer/portfolio/application/usecase/OrderLabService.java", test: "src/test/java/com/alanchristofer/portfolio/application/usecase/OrderLabServiceTest.java", responsibility: "Orquestra a criação do pedido sem depender de HTTP, MongoDB ou Kafka.", responsibilityEn: "Orchestrates order creation without depending on HTTP, MongoDB, or Kafka.", depends: ["OrderRepositoryPort", "EventPublisherPort", "OrderTracePort"], concepts: ["Dependency Inversion", "Constructor Injection", "Use Case"] },
  { id: "ORDER_PERSISTED", pt: "MongoDB Adapter", en: "MongoDB Adapter", layer: "PERSISTENCE ADAPTER", file: "src/main/java/com/alanchristofer/portfolio/infrastructure/adapter/output/persistence/OrderMongoAdapter.java", responsibility: "Traduz a entidade de domínio e persiste o pedido atrás de uma porta.", responsibilityEn: "Translates the domain entity and persists the order behind a port.", depends: ["OrderMongoRepository"], concepts: ["Adapter", "Repository Port", "TTL"] },
  { id: "ORDER_CREATED_EVENT", pt: "OrderCreatedEvent", en: "OrderCreatedEvent", layer: "DOMAIN EVENT", file: "src/main/java/com/alanchristofer/portfolio/domain/event/OrderCreatedEvent.java", responsibility: "Representa o fato imutável criado pelo caso de uso antes da publicação.", responsibilityEn: "Represents the immutable fact created by the use case before publication.", depends: ["Order domain"], concepts: ["Domain Event", "Immutability", "Trace propagation"] },
  { id: "EVENT_PUBLISHED", pt: "Kafka Producer", en: "Kafka Producer", layer: "MESSAGING ADAPTER", file: "src/main/java/com/alanchristofer/portfolio/infrastructure/adapter/output/messaging/KafkaOrderEventPublisher.java", responsibility: "Publica OrderCreatedEvent e aguarda o acknowledgement real do broker.", responsibilityEn: "Publishes OrderCreatedEvent and waits for the broker's real acknowledgement.", depends: ["KafkaTemplate"], concepts: ["Event-driven", "Producer", "Broker acknowledgement"] },
  { id: "EVENT_CONSUMED", pt: "Kafka Consumer", en: "Kafka Consumer", layer: "ASYNC INPUT ADAPTER", file: "src/main/java/com/alanchristofer/portfolio/infrastructure/adapter/input/messaging/OrderCreatedConsumer.java", test: "src/test/java/com/alanchristofer/portfolio/infrastructure/OrderLabIntegrationTest.java", responsibility: "Consome o evento preservando traceId e orderId no processamento assíncrono.", responsibilityEn: "Consumes the event while preserving traceId and orderId during asynchronous processing.", depends: ["OrderRepositoryPort", "OrderTracePort"], concepts: ["Consumer", "Asynchronous flow", "Trace propagation"] },
  { id: "ORDER_PROCESSED", pt: "Pedido processado", en: "Order processed", layer: "DOMAIN STATE", file: "src/main/java/com/alanchristofer/portfolio/domain/model/Order.java", responsibility: "Aplica a transição real de CREATED para PROCESSED no domínio.", responsibilityEn: "Applies the real CREATED to PROCESSED domain transition.", depends: ["OrderStatus"], concepts: ["Domain behavior", "State transition", "Immutability"] },
] as const;

const architecture = [
  { label: "Request", step: "REQUEST_RECEIVED" },
  { label: "REST Adapter", step: "REQUEST_RECEIVED" },
  { label: "CreateOrderUseCase", step: "USE_CASE_STARTED" },
  { label: "Domain", step: "ORDER_PROCESSED" },
  { label: "Repository + Event Ports", step: "ORDER_CREATED_EVENT" },
  { label: "MongoDB + Kafka Adapters", step: "EVENT_PUBLISHED" },
  { label: "MongoDB + Kafka", step: "EVENT_PUBLISHED" },
  { label: "Consumer", step: "EVENT_CONSUMED" },
] as const;

export function JavaEngineeringLab() {
  const { language } = useI18n();
  const pt = language === "pt-BR";
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [trace, setTrace] = useState<TraceResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [selected, setSelected] = useState<TraceStepName>(steps[2].id);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedMeta = steps.find((step) => step.id === selected) ?? steps[0];
  const actualSteps = useMemo(() => new Map(trace?.steps.map((step) => [step.name, step]) ?? []), [trace]);

  async function loadHealth() {
    try {
      const response = await fetch("/api/lab/system-health", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message ?? "Health unavailable");
      setHealth(body);
    } catch {
      setHealth(null);
    }
  }

  useEffect(() => { void loadHealth(); }, []);

  async function pollTrace(orderId: string) {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const response = await fetch(`/api/lab/orders/${orderId}/trace`, { cache: "no-store" });
      if (response.ok) {
        const body = await response.json() as TraceResponse;
        setTrace(body);
        const finished = body.steps.some((step) => step.name === "ORDER_PROCESSED" || step.status === "FAILED");
        if (finished) return;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 500));
    }
  }

  async function execute() {
    setRunning(true);
    setError(null);
    setOrder(null);
    setTrace(null);
    try {
      const response = await fetch("/api/lab/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: "Engineering Lab", items: [{ name: "Java Architecture Demo", quantity: 1, unitPrice: 199.90 }] }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message ?? `HTTP ${response.status}`);
      const created = body as OrderResponse;
      setOrder(created);
      await pollTrace(created.id);
      await loadHealth();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Engineering Lab request failed");
    } finally {
      setRunning(false);
    }
  }

  function visualState(id: TraceStepName, index: number) {
    const actual = actualSteps.get(id);
    if (actual?.status === "FAILED") return "failed";
    if (actual) return "success";
    if (trace?.steps.some((step) => step.status === "FAILED")) return "waiting";
    const completed = steps.slice(0, index).every((step) => actualSteps.has(step.id));
    return running && completed ? "running" : "waiting";
  }

  return <div className="destination-content java-lab-panel">
    <header className="java-lab-header">
      <div><span className="panel-kicker">Java Engineering Lab</span><h2>{pt ? "Backend em execução" : "Backend in action"}</h2><p>{pt ? "Execute um fluxo real construído com Java e Spring Boot e acompanhe cada etapa da requisição até o processamento assíncrono." : "Run a real Java and Spring Boot flow and follow every stage from the request to asynchronous processing."}</p></div>
      <div className="java-lab-actions"><button type="button" onClick={execute} disabled={running}>{running ? <LoaderCircle className="spin" /> : <Play />}{running ? (pt ? "Processando" : "Processing") : (pt ? "Executar fluxo" : "Run flow")}</button><a href="/swagger" target="_blank" rel="noopener noreferrer">{pt ? "Abrir Swagger" : "Open Swagger"}<ExternalLink /></a></div>
    </header>

    <section className="java-lab-runtime">
      <div className="java-lab-runtime-title"><span><Radio />{order ? `${actualSteps.has("ORDER_PROCESSED") ? (pt ? "PEDIDO PROCESSADO" : "ORDER PROCESSED") : (pt ? "PROCESSANDO PEDIDO" : "PROCESSING ORDER")} #${order.id.slice(0, 8).toUpperCase()}` : (pt ? "FLUXO PRONTO PARA EXECUÇÃO" : "FLOW READY TO RUN")}</span>{trace && <code>{trace.traceId}</code>}</div>
      {error && <div className="java-lab-error"><X /> <strong>FAILED</strong><span>{error}</span></div>}
      <div className="java-lab-steps">{steps.map((step, index) => {
        const state = visualState(step.id, index);
        const actual = actualSteps.get(step.id);
        return <button type="button" key={step.id} className={`${state} ${selected === step.id ? "active" : ""}`} onClick={() => setSelected(step.id)}><i>{state === "success" ? <Check /> : state === "failed" ? <X /> : state === "running" ? <LoaderCircle className="spin" /> : <CircleDot />}</i><span><strong>{pt ? step.pt : step.en}</strong><small>{actual?.detail ?? step.layer}</small></span>{actual?.durationMs != null && <time>{actual.durationMs} ms</time>}</button>;
      })}</div>
    </section>

    <div className="java-lab-grid">
      <section className="java-lab-inspector"><header><span>{selectedMeta.layer}</span><strong>{selectedMeta.file.split("/").at(-1)}</strong></header><p>{pt ? selectedMeta.responsibility : selectedMeta.responsibilityEn}</p><div><small>DEPENDS ON</small>{selectedMeta.depends.map((item) => <code key={item}>{item}</code>)}</div><div><small>CONCEPTS</small>{selectedMeta.concepts.map((item) => <code key={item}>{item}</code>)}</div><footer><a href={`${repository}${selectedMeta.file}`} target="_blank" rel="noopener noreferrer"><Code2 />{pt ? "Ver código" : "View code"}</a>{"test" in selectedMeta && selectedMeta.test && <a href={`${repository}${selectedMeta.test}`} target="_blank" rel="noopener noreferrer"><TestTube2 />{pt ? "Ver teste" : "View test"}</a>}</footer></section>
      <section className="java-lab-health"><header><Activity /><span>System health</span><time>{health ? new Date(health.checkedAt).toLocaleTimeString() : "—"}</time></header><div>{[["springBootApi", "Spring Boot API"], ["mongodb", "MongoDB"], ["kafka", "Kafka"]].map(([key, label]) => { const status = health?.components[key] ?? "UNKNOWN"; return <article key={key} className={status.toLowerCase()}><i /><span>{label}</span><strong>{status}</strong></article>; })}</div><dl><div><dt>Requests</dt><dd>{health ? health.metrics.requests : "—"}</dd></div><div><dt>{pt ? "Pedidos" : "Orders"}</dt><dd>{health ? health.metrics.created : "—"}</dd></div><div><dt>{pt ? "Processados" : "Processed"}</dt><dd>{health ? health.metrics.processed : "—"}</dd></div><div><dt>{pt ? "Falhas" : "Failures"}</dt><dd>{health ? health.metrics.failed : "—"}</dd></div><div><dt>{pt ? "Latência média" : "Average latency"}</dt><dd>{health ? `${health.metrics.averageLatencyMs.toFixed(1)}ms` : "—"}</dd></div></dl></section>
    </div>

    <section className="java-lab-architecture"><header><GitBranch /><div><span>{pt ? "Arquitetura executada" : "Executed architecture"}</span><p>{pt ? "Cada nó aponta para uma etapa real do fluxo." : "Every node maps to a real flow stage."}</p></div></header><div>{architecture.map((node, index) => <div key={node.label}><button type="button" onClick={() => setSelected(node.step)}><span>{String(index + 1).padStart(2, "0")}</span>{index === 0 ? <Server /> : index === 3 ? <Code2 /> : index >= 5 ? <Database /> : <GitBranch />}<strong>{node.label}</strong></button>{index < architecture.length - 1 && <ArrowDown />}</div>)}</div></section>
  </div>;
}
