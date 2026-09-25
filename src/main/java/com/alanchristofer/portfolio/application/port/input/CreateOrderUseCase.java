package com.alanchristofer.portfolio.application.port.input;

import com.alanchristofer.portfolio.domain.model.Order;
import com.alanchristofer.portfolio.domain.model.OrderItem;
import java.util.List;

public interface CreateOrderUseCase {
    Order create(String traceId, String customerName, List<OrderItem> items);
}
