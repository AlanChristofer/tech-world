"use client";

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDot,
  Clipboard,
  Code2,
  Copy,
  Database,
  ExternalLink,
  FileCode2,
  GitBranch,
  Layers3,
  LoaderCircle,
  Network,
  Play,
  Radio,
  Server,
  ShieldCheck,
  TestTube2,
  TriangleAlert,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { SkillIcon } from "@/components/skill-icon";
import { useTheme } from "@/components/theme-context";
import { useI18n } from "@/i18n/language-context";
import styles from "./java-engineering-lab.module.css";

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
type ApiError = { timestamp: string; status: number; error: string; message: string; path: string; validationErrors: Record<string, string> };
type InspectorTab = "overview" | "code" | "test" | "logs";
type StepState = "success" | "failed" | "running" | "waiting";
type StepTone = "input" | "validation" | "application" | "persistence" | "domain" | "messaging" | "completion";

type StepDefinition = {
  id: TraceStepName;
  pt: string;
  en: string;
  short: string;
  layer: string;
  file: string;
  test?: string;
  responsibility: string;
  responsibilityEn: string;
  depends: readonly string[];
  concepts: readonly string[];
  code: string;
};

const repository = "https://github.com/AlanChristofer/tech-world/blob/main/";

const steps: readonly StepDefinition[] = [
  {
    id: "REQUEST_RECEIVED", pt: "Request recebida", en: "Request received", short: "REST", layer: "REST ADAPTER",
    file: "src/main/java/com/alanchristofer/portfolio/infrastructure/adapter/input/rest/LabTraceFilter.java",
    responsibility: "Captura a requisição real, gera o correlation ID e inicia o trace.",
    responsibilityEn: "Captures the real request, generates the correlation ID, and starts the trace.",
    depends: ["OrderTracePort", "LabMetricsPort"], concepts: ["Correlation ID", "MDC", "Servlet Filter"],
    code: `@Component
public class LabTraceFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain
    ) throws ServletException, IOException {
        String traceId = UUID.randomUUID().toString();
        request.setAttribute(TRACE_ID_ATTRIBUTE, traceId);
        response.setHeader("X-Trace-Id", traceId);
        traces.start(traceId, clock.instant().plus(Duration.ofHours(24)));
        chain.doFilter(request, response);
    }
}`,
  },
  {
    id: "VALIDATION_COMPLETED", pt: "Bean Validation", en: "Bean Validation", short: "VALIDATION", layer: "INPUT CONTRACT",
    file: "src/main/java/com/alanchristofer/portfolio/infrastructure/adapter/input/rest/dto/OrderLabRequests.java",
    responsibility: "Valida o contrato antes de permitir a entrada no caso de uso.",
    responsibilityEn: "Validates the contract before it reaches the use case.",
    depends: ["Jakarta Validation"], concepts: ["Validation", "Fail Fast", "DTO"],
    code: `public record CreateOrderRequest(
    @NotBlank @Size(max = 80)
    String customerName,

    @NotEmpty @Size(max = 10)
    List<@NotNull @Valid OrderItemRequest> items
) { }`,
  },
  {
    id: "USE_CASE_STARTED", pt: "CreateOrderUseCase", en: "CreateOrderUseCase", short: "USE CASE", layer: "APPLICATION LAYER",
    file: "src/main/java/com/alanchristofer/portfolio/application/usecase/OrderLabService.java",
    test: "src/test/java/com/alanchristofer/portfolio/application/usecase/OrderLabServiceTest.java",
    responsibility: "Orquestra a criação do pedido sem depender de HTTP, MongoDB ou Kafka.",
    responsibilityEn: "Orchestrates order creation without depending on HTTP, MongoDB, or Kafka.",
    depends: ["OrderRepositoryPort", "EventPublisherPort", "OrderTracePort"], concepts: ["Dependency Inversion", "Constructor Injection", "Use Case"],
    code: `@Override
public Order create(
    String traceId,
    String customerName,
    List<OrderItem> items
) {
    traces.append(traceId, step(
        "USE_CASE_STARTED", null, "SUCCESS",
        "CreateOrderUseCase started"
    ));
    Order order = Order.create(
        UUID.randomUUID().toString(), traceId,
        customerName, items, clock.instant(), expiresAt
    );
    order = orders.save(order);
    events.publish(new OrderCreatedEvent(
        order.id(), traceId, order.total(), clock.instant()
    ));
    return order;
}`,
  },
  {
    id: "ORDER_PERSISTED", pt: "MongoDB Adapter", en: "MongoDB Adapter", short: "MONGODB", layer: "PERSISTENCE ADAPTER",
    file: "src/main/java/com/alanchristofer/portfolio/infrastructure/adapter/output/persistence/OrderMongoAdapter.java",
    responsibility: "Traduz a entidade de domínio e persiste o pedido atrás de uma porta.",
    responsibilityEn: "Translates the domain entity and persists the order behind a port.",
    depends: ["OrderMongoRepository"], concepts: ["Ports & Adapters", "Dependency Inversion", "Spring Data", "MongoDB"],
    code: `@Component
public class OrderMongoAdapter implements OrderRepositoryPort {
    private final OrderMongoRepository repository;

    public OrderMongoAdapter(OrderMongoRepository repository) {
        this.repository = repository;
    }

    @Override
    public Order save(Order order) {
        return toDomain(repository.save(toDocument(order)));
    }

    @Override
    public Optional<Order> findById(String id) {
        return repository.findById(id).map(this::toDomain);
    }
}`,
  },
  {
    id: "ORDER_CREATED_EVENT", pt: "OrderCreatedEvent", en: "OrderCreatedEvent", short: "EVENT", layer: "DOMAIN EVENT",
    file: "src/main/java/com/alanchristofer/portfolio/domain/event/OrderCreatedEvent.java",
    responsibility: "Representa o fato imutável criado pelo caso de uso antes da publicação.",
    responsibilityEn: "Represents the immutable fact created by the use case before publication.",
    depends: ["Order domain"], concepts: ["Domain Event", "Immutability", "Trace propagation"],
    code: `public record OrderCreatedEvent(
    String orderId,
    String traceId,
    BigDecimal total,
    Instant occurredAt
) { }`,
  },
  {
    id: "EVENT_PUBLISHED", pt: "Kafka Producer", en: "Kafka Producer", short: "PRODUCER", layer: "MESSAGING ADAPTER",
    file: "src/main/java/com/alanchristofer/portfolio/infrastructure/adapter/output/messaging/KafkaOrderEventPublisher.java",
    responsibility: "Publica OrderCreatedEvent e aguarda o acknowledgement real do broker.",
    responsibilityEn: "Publishes OrderCreatedEvent and waits for the broker's real acknowledgement.",
    depends: ["KafkaTemplate<String, String>"], concepts: ["Event-driven", "Producer", "Broker acknowledgement"],
    code: `@Override
public void publish(OrderCreatedEvent event) {
    try {
        kafka.send(topic, event.orderId(), encode(event))
            .get(5, TimeUnit.SECONDS);
    } catch (InterruptedException exception) {
        Thread.currentThread().interrupt();
        throw new IllegalStateException(
            "Kafka did not acknowledge OrderCreatedEvent", exception
        );
    }
}`,
  },
  {
    id: "EVENT_CONSUMED", pt: "Kafka Consumer", en: "Kafka Consumer", short: "CONSUMER", layer: "ASYNC INPUT ADAPTER",
    file: "src/main/java/com/alanchristofer/portfolio/infrastructure/adapter/input/messaging/OrderCreatedConsumer.java",
    test: "src/test/java/com/alanchristofer/portfolio/infrastructure/OrderLabIntegrationTest.java",
    responsibility: "Consome o evento preservando traceId e orderId no processamento assíncrono.",
    responsibilityEn: "Consumes the event while preserving traceId and orderId during asynchronous processing.",
    depends: ["OrderRepositoryPort", "OrderTracePort"], concepts: ["Consumer", "Asynchronous flow", "Trace propagation"],
    code: `@KafkaListener(
    topics = "\${portfolio.lab.kafka.topic}",
    groupId = "\${spring.kafka.consumer.group-id}"
)
public void consume(String payload) {
    OrderCreatedEvent event = decode(payload);
    MDC.put("traceId", event.traceId());
    Order order = orders.findById(event.orderId())
        .orElseThrow();
    orders.save(order.markProcessed());
    metrics.recordProcessed();
}`,
  },
  {
    id: "ORDER_PROCESSED", pt: "Pedido processado", en: "Order processed", short: "PROCESSED", layer: "DOMAIN STATE",
    file: "src/main/java/com/alanchristofer/portfolio/domain/model/Order.java",
    responsibility: "Aplica a transição real de CREATED para PROCESSED no domínio.",
    responsibilityEn: "Applies the real CREATED to PROCESSED domain transition.",
    depends: ["OrderStatus"], concepts: ["Domain behavior", "State transition", "Immutability"],
    code: `public Order markProcessed() {
    return new Order(
        id,
        traceId,
        customerName,
        items,
        total,
        OrderStatus.PROCESSED,
        createdAt,
        expiresAt
    );
}`,
  },
];

const outputPortCode = `public interface OrderRepositoryPort {
    Order save(Order order);
    Optional<Order> findById(String id);
    List<Order> findAll();
}`;

const architecture = [
  { label: "HTTP", detail: "POST /api/lab/orders", step: "REQUEST_RECEIVED" as TraceStepName, icon: Server },
  { label: "REST Adapter", detail: "OrderController", step: "VALIDATION_COMPLETED" as TraceStepName, icon: Network },
  { label: "CreateOrderUseCase", detail: "Application", step: "USE_CASE_STARTED" as TraceStepName, icon: Layers3 },
  { label: "Domain", detail: "Order", step: "ORDER_CREATED_EVENT" as TraceStepName, icon: ShieldCheck },
] as const;

const architectureOutputs = [
  { label: "MongoDB Adapter", detail: "MongoDB", step: "ORDER_PERSISTED" as TraceStepName, icon: Database },
  { label: "Kafka Producer", detail: "order-created", step: "EVENT_PUBLISHED" as TraceStepName, icon: Radio },
  { label: "Kafka Consumer", detail: "OrderCreatedConsumer", step: "EVENT_CONSUMED" as TraceStepName, icon: GitBranch },
  { label: "Processamento", detail: "Status: PROCESSED", step: "ORDER_PROCESSED" as TraceStepName, icon: Check },
] as const;

const techChips = ["Java", "Spring Boot", "Clean Architecture", "MongoDB", "Kafka", "JUnit", "Observabilidade"];
const stepTones: Record<TraceStepName, StepTone> = {
  REQUEST_RECEIVED: "input",
  VALIDATION_COMPLETED: "validation",
  USE_CASE_STARTED: "application",
  ORDER_PERSISTED: "persistence",
  ORDER_CREATED_EVENT: "domain",
  EVENT_PUBLISHED: "messaging",
  EVENT_CONSUMED: "messaging",
  ORDER_PROCESSED: "completion",
};
const STEP_REVEAL_INTERVAL_MS = 430;

function formatTime(value: string, withDate = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    ...(withDate ? { day: "2-digit", month: "2-digit", year: "numeric" } : {}),
    hour: "2-digit", minute: "2-digit", second: "2-digit", fractionalSecondDigits: 3,
  }).format(date);
}

function codeTokens(line: string) {
  const pattern = /(@\w+|"[^"\n]*"|\/\/.*$|\b(?:public|private|protected|final|return|new|class|record|interface|implements|extends|try|catch|void|String|long|boolean|if|throw|null)\b)/g;
  return line.split(pattern).map((token, index) => {
    let className = "";
    if (token.startsWith("@")) className = styles.annotation;
    else if (token.startsWith('"')) className = styles.string;
    else if (token.startsWith("//")) className = styles.comment;
    else if (/^(public|private|protected|final|return|new|class|record|interface|implements|extends|try|catch|void|String|long|boolean|if|throw|null)$/.test(token)) className = styles.keyword;
    return <span className={className} key={`${token}-${index}`}>{token}</span>;
  });
}

function CodeViewer({ code }: { code: string }) {
  return <pre className={styles.codeViewer}>{code.split("\n").map((line, index) => <span className={styles.codeLine} key={`${line}-${index}`}><i>{index + 1}</i><code>{codeTokens(line)}</code></span>)}</pre>;
}

export function JavaEngineeringLab() {
  const { language } = useI18n();
  const { theme } = useTheme();
  const pt = language === "pt-BR";
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [trace, setTrace] = useState<TraceResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [failure, setFailure] = useState<ApiError | null>(null);
  const [failureTraceId, setFailureTraceId] = useState<string | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [selected, setSelected] = useState<TraceStepName>("USE_CASE_STARTED");
  const [tab, setTab] = useState<InspectorTab>("overview");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visibleStepCount, setVisibleStepCount] = useState(0);
  const presentationId = useRef(0);
  const visibleStepCountRef = useRef(0);

  const selectedMeta = steps.find((step) => step.id === selected) ?? steps[0];
  const visibleSteps = useMemo(() => trace?.steps.slice(0, visibleStepCount) ?? [], [trace, visibleStepCount]);
  const actualSteps = useMemo(() => new Map(visibleSteps.map((step) => [step.name, step])), [visibleSteps]);
  const selectedActual = actualSteps.get(selected);
  const completed = actualSteps.has("ORDER_PROCESSED");
  const traceFailed = visibleSteps.some((step) => step.status === "FAILED");
  const traceId = trace?.traceId ?? order?.traceId ?? failureTraceId;
  const totalLatency = useMemo(() => {
    if (!visibleSteps.length) return null;
    const first = new Date(visibleSteps[0].timestamp).getTime();
    const lastStep = visibleSteps.at(-1)!;
    const last = new Date(lastStep.timestamp).getTime();
    if (Number.isFinite(first) && Number.isFinite(last)) return Math.max(0, last - first) + (lastStep.durationMs ?? 0);
    return visibleSteps.reduce((total, step) => total + (step.durationMs ?? 0), 0);
  }, [visibleSteps]);

  async function loadHealth() {
    try {
      const response = await fetch("/api/lab/system-health", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message ?? "Health unavailable");
      setHealth(body as HealthResponse);
    } catch { setHealth(null); }
  }

  useEffect(() => {
    void loadHealth();
    return () => { presentationId.current += 1; };
  }, []);

  async function revealTrace(nextTrace: TraceResponse, currentPresentationId: number) {
    if (currentPresentationId !== presentationId.current) return false;
    setTrace(nextTrace);
    const revealDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : STEP_REVEAL_INTERVAL_MS;

    while (visibleStepCountRef.current < nextTrace.steps.length) {
      if (visibleStepCountRef.current > 0 && revealDelay > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, revealDelay));
      }
      if (currentPresentationId !== presentationId.current) return false;

      const nextCount = visibleStepCountRef.current + 1;
      visibleStepCountRef.current = nextCount;
      setVisibleStepCount(nextCount);
      setSelected(nextTrace.steps[nextCount - 1].name);
    }
    return true;
  }

  async function pollTrace(orderId: string, currentPresentationId: number) {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      if (currentPresentationId !== presentationId.current) return;
      const [traceResponse, orderResponse] = await Promise.all([
        fetch(`/api/lab/orders/${orderId}/trace`, { cache: "no-store" }),
        fetch(`/api/lab/orders/${orderId}`, { cache: "no-store" }),
      ]);
      if (orderResponse.ok && currentPresentationId === presentationId.current) setOrder(await orderResponse.json() as OrderResponse);
      if (traceResponse.ok) {
        const body = await traceResponse.json() as TraceResponse;
        if (!await revealTrace(body, currentPresentationId)) return;
        if (body.steps.some((step) => step.name === "ORDER_PROCESSED" || step.status === "FAILED")) return;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 500));
    }
  }

  function resetExecution() {
    presentationId.current += 1;
    visibleStepCountRef.current = 0;
    setVisibleStepCount(0);
    setOrder(null); setTrace(null); setFailure(null); setFailureTraceId(null); setHttpStatus(null); setError(null);
  }

  async function execute() {
    setRunning(true); resetExecution(); setSelected("REQUEST_RECEIVED");
    const currentPresentationId = presentationId.current;
    try {
      const response = await fetch("/api/lab/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: "Engineering Lab", items: [{ name: "Java Architecture Demo", quantity: 1, unitPrice: 199.90 }] }),
      });
      setHttpStatus(response.status);
      const body = await response.json();
      if (!response.ok) throw new Error(body.message ?? `HTTP ${response.status}`);
      const created = body as OrderResponse;
      setOrder(created);
      await pollTrace(created.id, currentPresentationId); await loadHealth();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Engineering Lab request failed"); }
    finally { setRunning(false); }
  }

  async function simulateFailure() {
    setRunning(true); resetExecution();
    try {
      const response = await fetch("/api/lab/orders", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerName: "", items: [] }),
      });
      const body = await response.json();
      setHttpStatus(response.status); setFailureTraceId(response.headers.get("X-Trace-Id"));
      if (response.ok) throw new Error(pt ? "O fluxo de validação não retornou o erro esperado." : "The validation flow did not return the expected error.");
      setFailure(body as ApiError); setSelected("VALIDATION_COMPLETED"); await loadHealth();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Engineering Lab failure simulation failed"); }
    finally { setRunning(false); }
  }

  async function copyText(value: string, key: string) {
    try { await navigator.clipboard.writeText(value); setCopied(key); window.setTimeout(() => setCopied(null), 1400); }
    catch { setCopied(null); }
  }

  function visualState(id: TraceStepName, index: number): StepState {
    if (failure) {
      if (index === 0) return "success";
      if (id === "VALIDATION_COMPLETED") return "failed";
      return "waiting";
    }
    const actual = actualSteps.get(id);
    if (actual?.status === "FAILED") return "failed";
    if (actual) return "success";
    if (visibleSteps.some((step) => step.status === "FAILED")) return "waiting";
    return running && steps.slice(0, index).every((step) => actualSteps.has(step.id)) ? "running" : "waiting";
  }

  const executionLabel = running ? (pt ? "EXECUTANDO FLUXO" : "RUNNING FLOW") : failure || traceFailed ? (pt ? "FLUXO INTERROMPIDO" : "FLOW STOPPED") : completed ? (pt ? "CONCLUÍDO COM SUCESSO" : "COMPLETED SUCCESSFULLY") : (pt ? "PRONTO PARA EXECUTAR" : "READY TO RUN");
  const domainPayload = order ?? failure;

  return <div className={`${styles.page} ${theme === "light" ? styles.light : ""}`}>
    <section className={styles.shell}>
      <header className={styles.hero}>
        <div className={styles.heroPlanet} aria-hidden />
        <div className={styles.heroCopy}>
          <Link href="/" className={styles.back}><ArrowLeft />{pt ? "Voltar ao globo" : "Back to globe"}</Link>
          <span className={styles.eyebrow}>Java Engineering Lab</span>
          <h1>{pt ? "Backend em execução" : "Backend in action"}</h1>
          <p>{pt ? "Execute um fluxo real construído com Java e Spring Boot e acompanhe cada etapa da requisição até o processamento assíncrono." : "Run a real Java and Spring Boot flow and follow each stage from the request to asynchronous processing."}</p>
          <div className={styles.flowProof}><span><Radio />{pt ? "Pipeline real" : "Real pipeline"}</span><strong>Spring Boot API <i>→</i> MongoDB <i>→</i> Kafka <i>→</i> Consumer</strong></div>
          <div className={styles.techChips}>{techChips.map((item) => <span key={item}><SkillIcon name={item} size={14} />{item}</span>)}</div>
        </div>
        <div className={styles.heroActions}>
          <button className={styles.runAction} type="button" onClick={execute} disabled={running}>{running ? <LoaderCircle className={styles.spin} /> : <Play />}<span><strong>{pt ? "Executar fluxo" : "Run flow"}</strong><small>{pt ? "Criar novo pedido e acompanhar em tempo real" : "Create an order and follow it in real time"}</small></span></button>
          <button type="button" onClick={simulateFailure} disabled={running}><TriangleAlert /><span><strong>{pt ? "Simular falha" : "Simulate failure"}</strong><small>{pt ? "Ver tratamento real com Bean Validation" : "See real Bean Validation handling"}</small></span></button>
          <a href="/swagger" target="_blank" rel="noopener noreferrer"><ExternalLink /><span><strong>{pt ? "Abrir Swagger" : "Open Swagger"}</strong><small>{pt ? "Ver documentação da API" : "View API documentation"}</small></span></a>
        </div>
      </header>

      <section className={styles.execution}>
        <header className={styles.executionHeader}>
          <div className={styles.executionState} aria-live="polite"><Radio /><strong>{pt ? "Execução do pedido" : "Order execution"}</strong><span className={failure || traceFailed ? styles.failureBadge : completed ? styles.successBadge : styles.readyBadge}>{executionLabel}</span></div>
          <div className={styles.traceMeta}>{traceId && <button type="button" onClick={() => copyText(traceId, "trace")}><span>TRACE #{traceId}</span>{copied === "trace" ? <Check /> : <Copy />}</button>}{order?.createdAt && <time>{pt ? "Executado em" : "Executed at"} {formatTime(order.createdAt, true)}</time>}{totalLatency != null && <strong>Total: {totalLatency} ms</strong>}{httpStatus != null && <b>HTTP {httpStatus}</b>}</div>
        </header>
        {error && <div className={styles.errorBanner}><X /><strong>FAILED</strong><span>{error}</span></div>}
        <div className={styles.steps}>{steps.map((step, index) => {
          const state = visualState(step.id, index);
          const actual = actualSteps.get(step.id);
          return <button type="button" key={step.id} data-state={state} data-tone={stepTones[step.id]} aria-current={state === "running" ? "step" : undefined} className={selected === step.id ? styles.activeStep : ""} onClick={() => setSelected(step.id)}>
            <span className={styles.stepIndex}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.stepStatus}>{state === "success" ? <Check /> : state === "failed" ? <X /> : state === "running" ? <LoaderCircle className={styles.spin} /> : <CircleDot />}</span>
            <span className={styles.stepLayer}>{step.short}</span><strong>{pt ? step.pt : step.en}</strong><small>{actual?.detail ?? step.layer}</small>{actual?.durationMs != null && <time>{actual.durationMs} ms</time>}{index < steps.length - 1 && <ArrowRight className={styles.stepArrow} />}
          </button>;
        })}</div>

        <div className={styles.workbench}>
          <section className={styles.inspector} data-tone={stepTones[selected]}>
            <header><span><Database />{pt ? "Etapa selecionada" : "Selected stage"}</span><strong>{String(steps.findIndex((step) => step.id === selected) + 1).padStart(2, "0")} / 08</strong></header>
            <div className={styles.inspectorTitle}><Database /><div><span>{selectedMeta.layer}</span><h2>{pt ? selectedMeta.pt : selectedMeta.en}</h2></div>{selectedActual?.durationMs != null && <b><Check />{selectedActual.durationMs} ms</b>}</div>
            <p>{pt ? selectedMeta.responsibility : selectedMeta.responsibilityEn}</p>
            <nav className={styles.tabs} aria-label={pt ? "Detalhes da etapa" : "Stage details"}>{(["overview", "code", "test", "logs"] as InspectorTab[]).map((item) => <button type="button" key={item} className={tab === item ? styles.activeTab : ""} onClick={() => setTab(item)}>{item === "overview" ? (pt ? "Visão geral" : "Overview") : item === "code" ? (pt ? "Código" : "Code") : item === "test" ? (pt ? "Teste" : "Test") : "Logs"}</button>)}</nav>
            <div className={styles.tabBody}>
              {tab === "overview" && <><div><span>{pt ? "Dependências" : "Dependencies"}</span><div className={styles.tags}>{selectedMeta.depends.map((item) => <code key={item}>{item}</code>)}</div></div><div><span>{pt ? "Conceitos aplicados" : "Applied concepts"}</span><div className={styles.tags}>{selectedMeta.concepts.map((item) => <code key={item}>{item}</code>)}</div></div></>}
              {tab === "code" && <div><span>{pt ? "Arquivo real" : "Real file"}</span><code className={styles.path}>{selectedMeta.file}</code></div>}
              {tab === "test" && <div><span>{pt ? "Teste relacionado" : "Related test"}</span>{selectedMeta.test ? <code className={styles.path}>{selectedMeta.test}</code> : <p>{pt ? "Esta etapa não possui um arquivo de teste dedicado no projeto." : "This stage has no dedicated test file in the project."}</p>}</div>}
              {tab === "logs" && <div><span>{pt ? "Registro real da etapa" : "Real stage record"}</span><pre>{selectedActual ? JSON.stringify(selectedActual, null, 2) : (pt ? "Execute o fluxo para gerar o registro." : "Run the flow to generate the record.")}</pre></div>}
            </div>
            <footer><a href={`${repository}${selectedMeta.file}`} target="_blank" rel="noopener noreferrer"><FaGithub />{pt ? "Ver código no GitHub" : "View code on GitHub"}</a>{selectedMeta.test && <a href={`${repository}${selectedMeta.test}`} target="_blank" rel="noopener noreferrer"><TestTube2 />{pt ? "Ver teste no GitHub" : "View test on GitHub"}</a>}</footer>
          </section>

          <section className={styles.sourceColumn}>
            <article className={styles.codePanel}>
              <header><span><FileCode2 />{pt ? "Código fonte" : "Source code"}</span><button type="button" onClick={() => copyText(selectedMeta.code, "code")}>{copied === "code" ? <Check /> : <Clipboard />}{copied === "code" ? (pt ? "Copiado" : "Copied") : (pt ? "Copiar" : "Copy")}</button></header>
              <code className={styles.filePath}>{selectedMeta.file}</code><CodeViewer code={selectedMeta.code} />
            </article>
            <article className={styles.codePanel}>
              <header><span><Code2 />Output port</span><a href={`${repository}src/main/java/com/alanchristofer/portfolio/application/port/output/OrderRepositoryPort.java`} target="_blank" rel="noopener noreferrer">OrderRepositoryPort.java <ExternalLink /></a></header>
              <CodeViewer code={outputPortCode} />
            </article>
          </section>

          <aside className={styles.contextColumn}>
            <article className={styles.domainPanel}>
              <header><span><Code2 />{failure ? (pt ? "Resposta de erro" : "Error response") : (pt ? "Domínio" : "Domain")}</span>{order && <code>Order.java</code>}</header>
              <CodeViewer code={domainPayload ? JSON.stringify(domainPayload, null, 2) : "{}"} />
            </article>
            <article className={styles.architecturePanel}>
              <header><Activity />{pt ? "Arquitetura do fluxo" : "Flow architecture"}</header>
              <div className={styles.architecturePrimary}>{architecture.map((node) => { const Icon = node.icon; return <button key={node.label} type="button" data-tone={stepTones[node.step]} onClick={() => setSelected(node.step)}><Icon /><span><strong>{node.label}</strong><small>{node.detail}</small></span></button>; })}</div>
              <div className={styles.portBridge}><span>OrderRepositoryPort</span><span>EventPublisherPort</span></div>
              <div className={styles.architectureOutputs}>{architectureOutputs.map((node) => { const Icon = node.icon; return <button key={node.label} type="button" data-tone={stepTones[node.step]} onClick={() => setSelected(node.step)}><Icon /><span><strong>{node.label}</strong><small>{node.detail}</small></span></button>; })}</div>
            </article>
          </aside>
        </div>

        <div className={styles.bottomGrid}>
          <section className={styles.healthPanel}>
            <header><Activity />System health{health && <time>{formatTime(health.checkedAt)}</time>}</header>
            <div>{[["springBootApi", "Spring Boot API"], ["mongodb", "MongoDB"], ["kafka", "Kafka"]].map(([key, label]) => { const status = health?.components[key] ?? "UNKNOWN"; return <article key={key} data-status={status.toLowerCase()}><i /><span>{label}</span><strong>{status}</strong></article>; })}</div>
          </section>
          <section className={styles.metricsPanel}>
            <header><Activity />{pt ? "Métricas do lab" : "Lab metrics"}<span>{pt ? "Dados acumulados do runtime" : "Accumulated runtime data"}</span></header>
            <dl><div><dt>{pt ? "Requisições" : "Requests"}</dt><dd>{health?.metrics.requests ?? "—"}</dd></div><div><dt>{pt ? "Pedidos criados" : "Created orders"}</dt><dd>{health?.metrics.created ?? "—"}</dd></div><div><dt>{pt ? "Processados" : "Processed"}</dt><dd>{health?.metrics.processed ?? "—"}</dd></div><div><dt>{pt ? "Latência média" : "Average latency"}</dt><dd>{health ? `${health.metrics.averageLatencyMs.toFixed(1)} ms` : "—"}</dd></div><div><dt>{pt ? "Falhas" : "Failures"}</dt><dd>{health?.metrics.failed ?? "—"}</dd></div></dl>
          </section>
          <section className={styles.fullTrace}>
            <header><GitBranch />{pt ? "Trace completo" : "Full trace"}</header>
            <div>{visibleSteps.length ? visibleSteps.map((step) => <button type="button" key={`${step.name}-${step.timestamp}`} onClick={() => setSelected(step.name)}><time>{formatTime(step.timestamp)}</time><span>{step.name}</span><b>{step.durationMs == null ? "—" : `${step.durationMs} ms`}</b><Check /></button>) : failure ? <div className={styles.failureTrace}><time>{formatTime(failure.timestamp)}</time><span>VALIDATION_FAILED</span><b>HTTP {failure.status}</b><X /></div> : <p>{pt ? "Execute um fluxo para visualizar o trace real." : "Run a flow to see the real trace."}</p>}</div>
          </section>
        </div>
      </section>
    </section>
  </div>;
}
