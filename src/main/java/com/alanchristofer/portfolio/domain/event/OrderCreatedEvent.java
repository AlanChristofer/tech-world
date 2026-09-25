package com.alanchristofer.portfolio.domain.event;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderCreatedEvent(String orderId, String traceId, BigDecimal total, Instant occurredAt) { }
