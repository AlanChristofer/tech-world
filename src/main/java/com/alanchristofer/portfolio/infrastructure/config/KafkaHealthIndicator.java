package com.alanchristofer.portfolio.infrastructure.config;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.springframework.boot.health.contributor.Health;
import org.springframework.boot.health.contributor.HealthIndicator;
import org.springframework.kafka.core.KafkaAdmin;
import org.springframework.stereotype.Component;

/** Readiness check that reuses the same local or SASL Kafka configuration as producer and consumer. */
@Component
public class KafkaHealthIndicator implements HealthIndicator {
    private final KafkaAdmin kafkaAdmin;

    public KafkaHealthIndicator(KafkaAdmin kafkaAdmin) {
        this.kafkaAdmin = kafkaAdmin;
    }

    @Override
    public Health health() {
        Map<String, Object> properties = new HashMap<>(kafkaAdmin.getConfigurationProperties());
        properties.put(AdminClientConfig.REQUEST_TIMEOUT_MS_CONFIG, (int) Duration.ofSeconds(3).toMillis());
        try (AdminClient client = AdminClient.create(properties)) {
            if (client.describeCluster().nodes().get(3, TimeUnit.SECONDS).isEmpty()) return Health.down().build();
            return Health.up().build();
        } catch (Exception exception) {
            return Health.down().build();
        }
    }
}
