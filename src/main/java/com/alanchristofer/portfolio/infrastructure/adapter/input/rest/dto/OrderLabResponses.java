package com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto;

import com.alanchristofer.portfolio.domain.model.LabSystemHealth;
import com.alanchristofer.portfolio.domain.model.LabMetricsSnapshot;
import com.alanchristofer.portfolio.domain.model.Order;
import com.alanchristofer.portfolio.domain.model.OrderTrace;
import com.alanchristofer.portfolio.domain.model.TraceStep;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

public final class OrderLabResponses {
    private OrderLabResponses() { }

    @Schema(name = "LabOrderResponse")
    public record OrderResponse(String id, String traceId, String customerName, String status, BigDecimal total, Instant createdAt) {
        public static OrderResponse from(Order order) {
            return new OrderResponse(order.id(), order.traceId(), order.customerName(), order.status().name(), order.total(), order.createdAt());
        }
    }

    @Schema(name = "LabOrderTraceResponse")
    public record TraceResponse(String traceId, String orderId, List<TraceStep> steps) {
        public static TraceResponse from(OrderTrace trace) { return new TraceResponse(trace.traceId(), trace.orderId(), trace.steps()); }
    }

    @Schema(name = "LabSystemHealthResponse")
    public record SystemHealthResponse(Map<String, String> components, LabMetricsSnapshot metrics, Instant checkedAt) {
        public static SystemHealthResponse from(LabSystemHealth health) {
            return new SystemHealthResponse(health.components(), health.metrics(), health.checkedAt());
        }
    }
}
