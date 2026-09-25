package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document;

import java.time.Instant;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("lab_order_traces")
public record OrderTraceDocument(
    @Id String id,
    @Indexed(unique = true) String traceId,
    @Indexed String orderId,
    List<TraceStepDocument> steps,
    @Indexed(expireAfter = "0s") Instant expiresAt
) {
    public record TraceStepDocument(String name, Instant timestamp, Long durationMs, String status, String detail) { }
}
