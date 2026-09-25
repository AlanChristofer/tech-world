package com.alanchristofer.portfolio.application.port.output;

import com.alanchristofer.portfolio.domain.event.OrderCreatedEvent;

public interface EventPublisherPort {
    void publish(OrderCreatedEvent event);
}
