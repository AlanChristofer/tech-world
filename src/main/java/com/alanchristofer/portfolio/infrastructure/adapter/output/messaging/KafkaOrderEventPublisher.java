package com.alanchristofer.portfolio.infrastructure.adapter.output.messaging;

import com.alanchristofer.portfolio.application.port.output.EventPublisherPort;
import com.alanchristofer.portfolio.domain.event.OrderCreatedEvent;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaOrderEventPublisher implements EventPublisherPort {
    private final KafkaTemplate<String, String> kafka;
    private final String topic;

    public KafkaOrderEventPublisher(KafkaTemplate<String, String> kafka,
                                    @Value("${portfolio.lab.kafka.topic}") String topic) {
        this.kafka = kafka;
        this.topic = topic;
    }

    /** Aguarda o acknowledgement do broker para não responder sucesso antes da publicação real. */
    @Override
    public void publish(OrderCreatedEvent event) {
        try {
            kafka.send(topic, event.orderId(), encode(event)).get(5, TimeUnit.SECONDS);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Kafka did not acknowledge OrderCreatedEvent", exception);
        } catch (Exception exception) {
            throw new IllegalStateException("Kafka did not acknowledge OrderCreatedEvent", exception);
        }
    }

    private String encode(OrderCreatedEvent event) {
        return String.join("|", event.orderId(), event.traceId(), event.total().toPlainString(), event.occurredAt().toString());
    }
}
