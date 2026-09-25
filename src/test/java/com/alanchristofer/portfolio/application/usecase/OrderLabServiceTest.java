package com.alanchristofer.portfolio.application.usecase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.alanchristofer.portfolio.application.port.output.EventPublisherPort;
import com.alanchristofer.portfolio.application.port.output.LabMetricsPort;
import com.alanchristofer.portfolio.application.port.output.OrderRepositoryPort;
import com.alanchristofer.portfolio.application.port.output.OrderTracePort;
import com.alanchristofer.portfolio.domain.event.OrderCreatedEvent;
import com.alanchristofer.portfolio.domain.exception.LabExecutionException;
import com.alanchristofer.portfolio.domain.model.Order;
import com.alanchristofer.portfolio.domain.model.OrderItem;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class OrderLabServiceTest {
    private final OrderRepositoryPort orders = mock(OrderRepositoryPort.class);
    private final EventPublisherPort events = mock(EventPublisherPort.class);
    private final OrderTracePort traces = mock(OrderTracePort.class);
    private final LabMetricsPort metrics = mock(LabMetricsPort.class);
    private final Clock clock = Clock.fixed(Instant.parse("2026-09-25T12:00:00Z"), ZoneOffset.UTC);
    private OrderLabService service;

    @BeforeEach
    void setUp() {
        service = new OrderLabService(orders, events, traces, metrics, clock);
        when(orders.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void shouldPersistOrderAndPublishEventThroughPorts() {
        Order order = service.create("trace-1", "Engineering Lab",
            List.of(new OrderItem("Java Architecture Demo", 2, new BigDecimal("199.90"))));

        assertThat(order.total()).isEqualByComparingTo("399.80");
        assertThat(order.status().name()).isEqualTo("CREATED");
        verify(orders).save(any(Order.class));
        verify(events).publish(any(OrderCreatedEvent.class));
        verify(metrics).recordCreated();
    }

    @Test
    void shouldRejectInvalidDomainValues() {
        assertThatThrownBy(() -> new OrderItem("", 0, BigDecimal.ZERO))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void shouldMarkOrderAsFailedWhenKafkaDoesNotAcknowledgeEvent() {
        doThrow(new IllegalStateException("Kafka unavailable")).when(events).publish(any(OrderCreatedEvent.class));

        assertThatThrownBy(() -> service.create("trace-2", "Engineering Lab",
            List.of(new OrderItem("Java Architecture Demo", 1, new BigDecimal("199.90")))))
            .isInstanceOf(LabExecutionException.class)
            .hasMessage("Order event publication failed");

        verify(orders, org.mockito.Mockito.times(2)).save(any(Order.class));
    }

    @Test
    void shouldStopBeforePublishingWhenPersistenceFails() {
        when(orders.save(any(Order.class))).thenThrow(new IllegalStateException("MongoDB unavailable"));

        assertThatThrownBy(() -> service.create("trace-3", "Engineering Lab",
            List.of(new OrderItem("Java Architecture Demo", 1, new BigDecimal("199.90")))))
            .isInstanceOf(LabExecutionException.class)
            .hasMessage("Order persistence failed");

        org.mockito.Mockito.verifyNoInteractions(events);
    }
}
