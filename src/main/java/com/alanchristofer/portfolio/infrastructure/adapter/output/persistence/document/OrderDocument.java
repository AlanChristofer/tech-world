package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("lab_orders")
public record OrderDocument(
    @Id String id,
    @Indexed String traceId,
    String customerName,
    List<OrderItemDocument> items,
    BigDecimal total,
    String status,
    Instant createdAt,
    @Indexed(expireAfter = "0s") Instant expiresAt
) {
    public record OrderItemDocument(String name, int quantity, BigDecimal unitPrice) { }
}
