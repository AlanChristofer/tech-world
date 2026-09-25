package com.alanchristofer.portfolio.application.port.output;

import com.alanchristofer.portfolio.domain.model.Order;
import java.util.List;
import java.util.Optional;

public interface OrderRepositoryPort {
    Order save(Order order);
    Optional<Order> findById(String id);
    List<Order> findAll();
}
