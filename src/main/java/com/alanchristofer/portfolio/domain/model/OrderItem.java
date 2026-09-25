package com.alanchristofer.portfolio.domain.model;

import java.math.BigDecimal;
import java.util.Objects;

public record OrderItem(String name, int quantity, BigDecimal unitPrice) {
    public OrderItem {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Item name is required");
        if (name.length() > 120) throw new IllegalArgumentException("Item name must not exceed 120 characters");
        if (quantity <= 0) throw new IllegalArgumentException("Item quantity must be greater than zero");
        if (quantity > 100) throw new IllegalArgumentException("Item quantity must not exceed 100");
        if (unitPrice == null || unitPrice.signum() <= 0) throw new IllegalArgumentException("Item unit price must be greater than zero");
        if (unitPrice.compareTo(new BigDecimal("100000.00")) > 0) throw new IllegalArgumentException("Item unit price is too high");
        name = name.trim();
        unitPrice = Objects.requireNonNull(unitPrice).stripTrailingZeros();
    }

    public BigDecimal subtotal() {
        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }
}
