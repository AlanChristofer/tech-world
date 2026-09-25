package com.alanchristofer.portfolio.application.port.input;

import com.alanchristofer.portfolio.domain.model.Order;
import java.util.List;

public interface ListOrdersUseCase {
    List<Order> list();
}
