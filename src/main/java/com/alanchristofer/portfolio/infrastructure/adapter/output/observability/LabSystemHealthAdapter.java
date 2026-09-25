package com.alanchristofer.portfolio.infrastructure.adapter.output.observability;

import com.alanchristofer.portfolio.application.port.output.LabSystemHealthPort;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class LabSystemHealthAdapter implements LabSystemHealthPort {
    private final MongoTemplate mongo;
    private final String bootstrapServers;

    public LabSystemHealthAdapter(MongoTemplate mongo, @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
        this.mongo = mongo;
        this.bootstrapServers = bootstrapServers;
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
        properties.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        properties.put(AdminClientConfig.REQUEST_TIMEOUT_MS_CONFIG, (int) Duration.ofSeconds(2).toMillis());
        try (AdminClient client = AdminClient.create(properties)) {
            return client.describeCluster().nodes().get(2, TimeUnit.SECONDS).isEmpty() ? "DOWN" : "UP";
        } catch (Exception exception) {
            return "DOWN";
        }
    }
}
