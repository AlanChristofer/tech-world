package com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

public final class OrderLabRequests {
    private OrderLabRequests() { }

    @Schema(name = "CreateLabOrderRequest", description = "Pedido demonstrativo processado pelo Java Engineering Lab")
    public record CreateOrderRequest(
        @NotBlank @Size(max = 80) @Schema(example = "Engineering Lab") String customerName,
        @NotEmpty @Size(max = 10) List<@NotNull @Valid OrderItemRequest> items
    ) { }

    @Schema(name = "CreateLabOrderItemRequest")
    public record OrderItemRequest(
        @NotBlank @Size(max = 120) @Schema(example = "Java Architecture Demo") String name,
        @Positive @Max(100) @Schema(example = "1") int quantity,
        @NotNull @DecimalMin(value = "0.01") @DecimalMax(value = "100000.00") @Schema(example = "199.90") BigDecimal unitPrice
    ) { }
}
