package com.alanchristofer.portfolio.application.port.input;

import com.alanchristofer.portfolio.domain.model.OrderTrace;

public interface GetOrderTraceUseCase {
    OrderTrace getByOrderId(String orderId);
}
