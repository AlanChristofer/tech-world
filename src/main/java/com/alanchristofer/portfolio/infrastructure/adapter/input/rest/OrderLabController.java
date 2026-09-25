package com.alanchristofer.portfolio.infrastructure.adapter.input.rest;

import com.alanchristofer.portfolio.application.port.input.CreateOrderUseCase;
import com.alanchristofer.portfolio.application.port.input.GetLabSystemHealthUseCase;
import com.alanchristofer.portfolio.application.port.input.GetOrderTraceUseCase;
import com.alanchristofer.portfolio.application.port.input.GetOrderUseCase;
import com.alanchristofer.portfolio.application.port.input.ListOrdersUseCase;
import com.alanchristofer.portfolio.application.port.output.OrderTracePort;
import com.alanchristofer.portfolio.domain.model.OrderItem;
import com.alanchristofer.portfolio.domain.model.TraceStep;
import com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto.OrderLabRequests.CreateOrderRequest;
import com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto.OrderLabResponses.OrderResponse;
import com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto.OrderLabResponses.SystemHealthResponse;
import com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto.OrderLabResponses.TraceResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.Clock;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.slf4j.MDC;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lab")
@Tag(name = "Java Engineering Lab", description = "Fluxo real com Clean Architecture, MongoDB, Kafka, trace e métricas")
public class OrderLabController {
    private final CreateOrderUseCase createOrder;
    private final GetOrderUseCase getOrder;
    private final ListOrdersUseCase listOrders;
    private final GetOrderTraceUseCase getTrace;
    private final GetLabSystemHealthUseCase getHealth;
    private final OrderTracePort traces;
    private final Clock clock;

    public OrderLabController(CreateOrderUseCase createOrder, GetOrderUseCase getOrder, ListOrdersUseCase listOrders,
                              GetOrderTraceUseCase getTrace, GetLabSystemHealthUseCase getHealth,
                              OrderTracePort traces, Clock clock) {
        this.createOrder = createOrder;
        this.getOrder = getOrder;
        this.listOrders = listOrders;
        this.getTrace = getTrace;
        this.getHealth = getHealth;
        this.traces = traces;
        this.clock = clock;
    }

    @PostMapping("/orders")
    @Operation(summary = "Executar fluxo de pedido", description = "Valida, persiste no MongoDB, publica OrderCreatedEvent no Kafka e retorna o trace ID real.")
    @ApiResponses({ @ApiResponse(responseCode = "201", description = "Pedido persistido e evento confirmado pelo Kafka"), @ApiResponse(responseCode = "400", description = "Falha de Bean Validation"), @ApiResponse(responseCode = "503", description = "Persistência ou mensageria indisponível") })
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest body, HttpServletRequest request) {
        String traceId = (String) request.getAttribute(LabTraceFilter.TRACE_ID_ATTRIBUTE);
        traces.append(traceId, new TraceStep("VALIDATION_COMPLETED", clock.instant(), null, "SUCCESS", "Bean Validation completed"));
        List<OrderItem> items = body.items().stream().map(item -> new OrderItem(item.name(), item.quantity(), item.unitPrice())).toList();
        OrderResponse response = OrderResponse.from(createOrder.create(traceId, body.customerName(), items));
        MDC.put("orderId", response.id());
        return ResponseEntity.status(HttpStatus.CREATED).header("X-Trace-Id", traceId).body(response);
    }

    @GetMapping("/orders/{id}")
    @Operation(summary = "Consultar pedido", description = "Retorna o estado persistido do pedido demonstrativo.")
    public OrderResponse get(@PathVariable String id) { return OrderResponse.from(getOrder.getById(id)); }

    @GetMapping("/orders")
    @Operation(summary = "Listar pedidos", description = "Lista pedidos ainda retidos pelo índice TTL de 24 horas.")
    public List<OrderResponse> list() { return listOrders.list().stream().map(OrderResponse::from).toList(); }

    @GetMapping("/orders/{id}/trace")
    @Operation(summary = "Consultar trace real", description = "Retorna as etapas registradas pelo controller, caso de uso, MongoDB, producer e consumer.")
    public TraceResponse trace(@PathVariable String id) { return TraceResponse.from(getTrace.getByOrderId(id)); }

    @GetMapping("/system-health")
    @Operation(summary = "Consultar saúde do laboratório", description = "Verifica Spring Boot, MongoDB e Kafka e retorna métricas Micrometer reais.")
    public SystemHealthResponse health() { return SystemHealthResponse.from(getHealth.getHealth()); }
}
