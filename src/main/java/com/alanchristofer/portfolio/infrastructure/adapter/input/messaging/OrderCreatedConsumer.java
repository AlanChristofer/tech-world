package com.alanchristofer.portfolio.infrastructure.adapter.input.messaging;

import com.alanchristofer.portfolio.application.port.output.LabMetricsPort;
import com.alanchristofer.portfolio.application.port.output.OrderRepositoryPort;
import com.alanchristofer.portfolio.application.port.output.OrderTracePort;
import com.alanchristofer.portfolio.domain.event.OrderCreatedEvent;
import com.alanchristofer.portfolio.domain.model.Order;
import com.alanchristofer.portfolio.domain.model.TraceStep;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderCreatedConsumer {
    private static final Logger log = LoggerFactory.getLogger(OrderCreatedConsumer.class);
    private final OrderRepositoryPort orders;
    private final OrderTracePort traces;
    private final LabMetricsPort metrics;
    private final Clock clock;

    public OrderCreatedConsumer(OrderRepositoryPort orders, OrderTracePort traces, LabMetricsPort metrics,
                                Clock clock) {
        this.orders = orders;
        this.traces = traces;
        this.metrics = metrics;
        this.clock = clock;
    }

    @KafkaListener(topics = "${portfolio.lab.kafka.topic}", groupId = "${spring.kafka.consumer.group-id}")
    public void consume(String payload) {
        OrderCreatedEvent event = null;
        long startedAt = System.nanoTime();
        try {
            event = decode(payload);
            MDC.put("traceId", event.traceId());
            MDC.put("orderId", event.orderId());
            traces.append(event.traceId(), step("EVENT_CONSUMED", null, "SUCCESS", "Kafka consumer received OrderCreatedEvent"));
            Order order = orders.findById(event.orderId()).orElseThrow(() -> new IllegalStateException("Order not found for event"));
            orders.save(order.markProcessed());
            traces.append(event.traceId(), step("ORDER_PROCESSED", elapsed(startedAt), "SUCCESS", "Asynchronous processing completed"));
            metrics.recordProcessed();
            log.info("Engineering Lab order processed");
        } catch (Exception exception) {
            metrics.recordFailed();
            if (event != null) {
                OrderCreatedEvent failedEvent = event;
                orders.findById(event.orderId()).ifPresent(order -> orders.save(order.markFailed()));
                traces.append(failedEvent.traceId(), step("ORDER_PROCESSING_FAILED", elapsed(startedAt), "FAILED", "Consumer processing failed"));
            }
            log.error("Engineering Lab consumer failure", exception);
        } finally {
            MDC.remove("traceId");
            MDC.remove("orderId");
        }
    }

    private TraceStep step(String name, Long durationMs, String status, String detail) {
        return new TraceStep(name, clock.instant(), durationMs, status, detail);
    }

    private long elapsed(long startedAt) {
        return Math.max(0, (System.nanoTime() - startedAt) / 1_000_000);
    }

    private OrderCreatedEvent decode(String payload) {
        String[] values = payload.split("\\|", -1);
        if (values.length != 4) throw new IllegalArgumentException("Invalid OrderCreatedEvent payload");
        return new OrderCreatedEvent(values[0], values[1], new BigDecimal(values[2]), Instant.parse(values[3]));
    }
}
