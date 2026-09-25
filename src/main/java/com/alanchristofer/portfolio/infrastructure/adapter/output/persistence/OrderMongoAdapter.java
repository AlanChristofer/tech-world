package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence;

import com.alanchristofer.portfolio.application.port.output.OrderRepositoryPort;
import com.alanchristofer.portfolio.domain.model.Order;
import com.alanchristofer.portfolio.domain.model.OrderItem;
import com.alanchristofer.portfolio.domain.model.OrderStatus;
import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document.OrderDocument;
import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.repository.OrderMongoRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class OrderMongoAdapter implements OrderRepositoryPort {
    private final OrderMongoRepository repository;

    public OrderMongoAdapter(OrderMongoRepository repository) { this.repository = repository; }

    @Override public Order save(Order order) { return toDomain(repository.save(toDocument(order))); }
    @Override public Optional<Order> findById(String id) { return repository.findById(id).map(this::toDomain); }
    @Override public List<Order> findAll() { return repository.findAll().stream().map(this::toDomain).toList(); }

    private OrderDocument toDocument(Order order) {
        List<OrderDocument.OrderItemDocument> items = order.items().stream()
            .map(item -> new OrderDocument.OrderItemDocument(item.name(), item.quantity(), item.unitPrice()))
            .toList();
        return new OrderDocument(order.id(), order.traceId(), order.customerName(), items, order.total(),
            order.status().name(), order.createdAt(), order.expiresAt());
    }

    private Order toDomain(OrderDocument document) {
        List<OrderItem> items = document.items().stream()
            .map(item -> new OrderItem(item.name(), item.quantity(), item.unitPrice()))
            .toList();
        return Order.restore(document.id(), document.traceId(), document.customerName(), items, document.total(),
            OrderStatus.valueOf(document.status()), document.createdAt(), document.expiresAt());
    }
}
