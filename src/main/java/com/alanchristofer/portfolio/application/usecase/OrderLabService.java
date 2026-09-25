package com.alanchristofer.portfolio.application.usecase;

import com.alanchristofer.portfolio.application.port.input.CreateOrderUseCase;
import com.alanchristofer.portfolio.application.port.input.GetOrderTraceUseCase;
import com.alanchristofer.portfolio.application.port.input.GetOrderUseCase;
import com.alanchristofer.portfolio.application.port.input.ListOrdersUseCase;
import com.alanchristofer.portfolio.application.port.output.EventPublisherPort;
import com.alanchristofer.portfolio.application.port.output.LabMetricsPort;
import com.alanchristofer.portfolio.application.port.output.OrderRepositoryPort;
import com.alanchristofer.portfolio.application.port.output.OrderTracePort;
import com.alanchristofer.portfolio.domain.event.OrderCreatedEvent;
import com.alanchristofer.portfolio.domain.exception.LabExecutionException;
import com.alanchristofer.portfolio.domain.exception.ResourceNotFoundException;
import com.alanchristofer.portfolio.domain.model.Order;
import com.alanchristofer.portfolio.domain.model.OrderItem;
import com.alanchristofer.portfolio.domain.model.OrderTrace;
import com.alanchristofer.portfolio.domain.model.TraceStep;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

/**
 * Coordena o laboratório conhecendo somente portas. Persistência e mensageria
 * permanecem substituíveis e não vazam detalhes de infraestrutura para o caso de uso.
 */
public class OrderLabService implements CreateOrderUseCase, GetOrderUseCase, ListOrdersUseCase, GetOrderTraceUseCase {
    private static final Duration DATA_RETENTION = Duration.ofHours(24);
    private final OrderRepositoryPort orders;
    private final EventPublisherPort events;
    private final OrderTracePort traces;
    private final LabMetricsPort metrics;
    private final Clock clock;

    public OrderLabService(OrderRepositoryPort orders, EventPublisherPort events, OrderTracePort traces,
                           LabMetricsPort metrics, Clock clock) {
        this.orders = orders;
        this.events = events;
        this.traces = traces;
        this.metrics = metrics;
        this.clock = clock;
    }

    @Override
    public Order create(String traceId, String customerName, List<OrderItem> items) {
        Instant startedAt = clock.instant();
        traces.append(traceId, step("USE_CASE_STARTED", null, "SUCCESS", "CreateOrderUseCase started"));
        String orderId = UUID.randomUUID().toString();
        Order order = Order.create(orderId, traceId, customerName, items, startedAt, startedAt.plus(DATA_RETENTION));
        traces.associateOrder(traceId, orderId);

        long persistenceStart = System.nanoTime();
        try {
            order = orders.save(order);
            traces.append(traceId, step("ORDER_PERSISTED", elapsed(persistenceStart), "SUCCESS", "MongoDB adapter persisted the order"));
        } catch (RuntimeException exception) {
            traces.append(traceId, step("ORDER_PERSIST_FAILED", elapsed(persistenceStart), "FAILED", "MongoDB persistence failed"));
            throw new LabExecutionException("Order persistence failed", exception);
        }

        long publishStart = System.nanoTime();
        try {
            OrderCreatedEvent event = new OrderCreatedEvent(order.id(), traceId, order.total(), clock.instant());
            traces.append(traceId, step("ORDER_CREATED_EVENT", null, "SUCCESS", "Domain event created"));
            events.publish(event);
            traces.append(traceId, step("EVENT_PUBLISHED", elapsed(publishStart), "SUCCESS", "Kafka acknowledged OrderCreatedEvent"));
            metrics.recordCreated();
            return order;
        } catch (RuntimeException exception) {
            orders.save(order.markFailed());
            traces.append(traceId, step("EVENT_PUBLISH_FAILED", elapsed(publishStart), "FAILED", "Kafka did not acknowledge the event"));
            throw new LabExecutionException("Order event publication failed", exception);
        }
    }

    @Override
    public Order getById(String id) {
        return orders.findById(id).orElseThrow(() -> new ResourceNotFoundException("Lab order not found: " + id));
    }

    @Override
    public List<Order> list() {
        return orders.findAll().stream().sorted(Comparator.comparing(Order::createdAt).reversed()).toList();
    }

    @Override
    public OrderTrace getByOrderId(String orderId) {
        return traces.findByOrderId(orderId).orElseThrow(() -> new ResourceNotFoundException("Trace not found for order: " + orderId));
    }

    private TraceStep step(String name, Long durationMs, String status, String detail) {
        return new TraceStep(name, clock.instant(), durationMs, status, detail);
    }

    private long elapsed(long startedAt) {
        return Math.max(0, (System.nanoTime() - startedAt) / 1_000_000);
    }
}
