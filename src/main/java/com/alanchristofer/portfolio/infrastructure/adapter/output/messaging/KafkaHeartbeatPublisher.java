package com.alanchristofer.portfolio.infrastructure.adapter.output.messaging;

import com.alanchristofer.portfolio.domain.event.HeartbeatEvent;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

@Component
public class KafkaHeartbeatPublisher {
    private final KafkaTemplate<String, String> kafka;
    private final ObjectMapper objectMapper;
    private final String topic;

    public KafkaHeartbeatPublisher(KafkaTemplate<String, String> kafka, ObjectMapper objectMapper,
                                   @Value("${portfolio.heartbeat.kafka.topic}") String topic) {
        this.kafka = kafka;
        this.objectMapper = objectMapper;
        this.topic = topic;
    }

    public void publish(HeartbeatEvent event) {
        try {
            kafka.send(topic, event.traceId(), encode(event)).get(5, TimeUnit.SECONDS);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Kafka did not acknowledge heartbeat", exception);
        } catch (Exception exception) {
            throw new IllegalStateException("Kafka did not acknowledge heartbeat", exception);
        }
    }

    private String encode(HeartbeatEvent event) throws JacksonException {
        return objectMapper.writeValueAsString(event);
    }
}
