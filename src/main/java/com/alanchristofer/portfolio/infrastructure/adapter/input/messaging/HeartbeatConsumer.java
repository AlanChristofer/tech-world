package com.alanchristofer.portfolio.infrastructure.adapter.input.messaging;

import com.alanchristofer.portfolio.domain.event.HeartbeatEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
public class HeartbeatConsumer {
    private static final Logger log = LoggerFactory.getLogger(HeartbeatConsumer.class);
    private final ObjectMapper objectMapper;

    public HeartbeatConsumer(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "${portfolio.heartbeat.kafka.topic}", groupId = "${portfolio.heartbeat.kafka.group-id}")
    public void consume(String payload) {
        try {
            HeartbeatEvent event = objectMapper.readValue(payload, HeartbeatEvent.class);
            if (!"HEARTBEAT".equals(event.type()) || event.timestamp() == null || event.traceId() == null) {
                throw new IllegalArgumentException("Invalid heartbeat event");
            }
            MDC.put("traceId", event.traceId());
            log.info("Production heartbeat consumed");
        } catch (Exception exception) {
            log.error("Heartbeat consumer failure", exception);
        } finally {
            MDC.remove("traceId");
        }
    }
}
