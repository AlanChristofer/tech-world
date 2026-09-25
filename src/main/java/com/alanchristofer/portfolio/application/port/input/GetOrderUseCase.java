package com.alanchristofer.portfolio.application.port.input;

import com.alanchristofer.portfolio.domain.model.Order;

public interface GetOrderUseCase {
    Order getById(String id);
}
