package com.alanchristofer.portfolio.infrastructure.adapter.output.observability;

import com.alanchristofer.portfolio.application.port.output.LabSystemHealthPort;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.admin.AdminClient;
import org.springframework.kafka.core.KafkaAdmin;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class LabSystemHealthAdapter implements LabSystemHealthPort {
    private final MongoTemplate mongo;
    private final KafkaAdmin kafkaAdmin;

    public LabSystemHealthAdapter(MongoTemplate mongo, KafkaAdmin kafkaAdmin) {
        this.mongo = mongo;
        this.kafkaAdmin = kafkaAdmin;
    }

    @Override
    public Map<String, String> componentStatuses() {
        Map<String, String> components = new LinkedHashMap<>();
        components.put("springBootApi", "UP");
        components.put("mongodb", mongoStatus());
        components.put("kafka", kafkaStatus());
        return components;
    }

    private String mongoStatus() {
        try {
            mongo.executeCommand("{ ping: 1 }");
            return "UP";
        } catch (RuntimeException exception) {
            return "DOWN";
        }
    }

    private String kafkaStatus() {
        Properties properties = new Properties();
        properties.putAll(kafkaAdmin.getConfigurationProperties());
        properties.put(org.apache.kafka.clients.admin.AdminClientConfig.REQUEST_TIMEOUT_MS_CONFIG, (int) Duration.ofSeconds(2).toMillis());
        try (AdminClient client = AdminClient.create(properties)) {
            return client.describeCluster().nodes().get(2, TimeUnit.SECONDS).isEmpty() ? "DOWN" : "UP";
        } catch (Exception exception) {
            return "DOWN";
        }
    }
}
