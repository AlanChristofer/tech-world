package com.alanchristofer.portfolio.application.port.output;

import com.alanchristofer.portfolio.domain.model.OrderTrace;
import com.alanchristofer.portfolio.domain.model.TraceStep;
import java.time.Instant;
import java.util.Optional;

public interface OrderTracePort {
    void start(String traceId, Instant expiresAt);
    void associateOrder(String traceId, String orderId);
    void append(String traceId, TraceStep step);
    Optional<OrderTrace> findByOrderId(String orderId);
}
