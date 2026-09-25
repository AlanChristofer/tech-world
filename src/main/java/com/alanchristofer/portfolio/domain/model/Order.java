package com.alanchristofer.portfolio.domain.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/** Entidade de domínio sem dependências de HTTP, Spring, MongoDB ou Kafka. */
public final class Order {
    private final String id;
    private final String traceId;
    private final String customerName;
    private final List<OrderItem> items;
    private final BigDecimal total;
    private final OrderStatus status;
    private final Instant createdAt;
    private final Instant expiresAt;

    private Order(String id, String traceId, String customerName, List<OrderItem> items, BigDecimal total,
                  OrderStatus status, Instant createdAt, Instant expiresAt) {
        if (customerName == null || customerName.isBlank()) throw new IllegalArgumentException("Customer name is required");
        if (customerName.length() > 80) throw new IllegalArgumentException("Customer name must not exceed 80 characters");
        if (items == null || items.isEmpty()) throw new IllegalArgumentException("At least one order item is required");
        if (items.size() > 10) throw new IllegalArgumentException("An order must not contain more than 10 items");
        this.id = id;
        this.traceId = traceId;
        this.customerName = customerName.trim();
        this.items = List.copyOf(items);
        this.total = total;
        this.status = status;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    public static Order create(String id, String traceId, String customerName, List<OrderItem> items, Instant createdAt, Instant expiresAt) {
        if (items == null || items.isEmpty()) throw new IllegalArgumentException("At least one order item is required");
        BigDecimal total = items.stream().map(OrderItem::subtotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new Order(id, traceId, customerName, items, total, OrderStatus.CREATED, createdAt, expiresAt);
    }

    public static Order restore(String id, String traceId, String customerName, List<OrderItem> items, BigDecimal total,
                                OrderStatus status, Instant createdAt, Instant expiresAt) {
        return new Order(id, traceId, customerName, items, total, status, createdAt, expiresAt);
    }

    public Order markProcessed() {
        return new Order(id, traceId, customerName, items, total, OrderStatus.PROCESSED, createdAt, expiresAt);
    }

    public Order markFailed() {
        return new Order(id, traceId, customerName, items, total, OrderStatus.FAILED, createdAt, expiresAt);
    }

    public String id() { return id; }
    public String traceId() { return traceId; }
    public String customerName() { return customerName; }
    public List<OrderItem> items() { return items; }
    public BigDecimal total() { return total; }
    public OrderStatus status() { return status; }
    public Instant createdAt() { return createdAt; }
    public Instant expiresAt() { return expiresAt; }
}
