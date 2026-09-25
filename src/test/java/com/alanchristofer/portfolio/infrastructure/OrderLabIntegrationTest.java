package com.alanchristofer.portfolio.infrastructure;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

import com.alanchristofer.portfolio.domain.model.TraceStep;
import com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto.OrderLabResponses.TraceResponse;
import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.kafka.KafkaContainer;
import org.testcontainers.mongodb.MongoDBContainer;
import org.testcontainers.utility.DockerImageName;

@Testcontainers(disabledWithoutDocker = true)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestRestTemplate
class OrderLabIntegrationTest {
    @Container static final MongoDBContainer mongo = new MongoDBContainer("mongo:8.0");
    @Container static final KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("apache/kafka-native:3.9.1"));

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.mongodb.uri", mongo::getReplicaSetUrl);
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
        registry.add("portfolio.admin.password", () -> "test-password");
    }

    @Autowired TestRestTemplate http;

    @Test
    void shouldPersistPublishConsumeAndExposeRealTrace() {
        Map<String, Object> request = Map.of(
            "customerName", "Engineering Lab",
            "items", List.of(Map.of("name", "Java Architecture Demo", "quantity", 1, "unitPrice", new BigDecimal("199.90")))
        );

        var created = http.postForEntity("/api/lab/orders", request, Map.class);
        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(created.getHeaders().getFirst("X-Trace-Id")).isNotBlank();
        String orderId = created.getBody().get("id").toString();

        await().atMost(Duration.ofSeconds(15)).pollInterval(Duration.ofMillis(250)).untilAsserted(() -> {
            var order = http.getForEntity("/api/lab/orders/" + orderId, Map.class);
            assertThat(order.getBody()).containsEntry("status", "PROCESSED");
        });

        var trace = http.getForEntity("/api/lab/orders/" + orderId + "/trace", TraceResponse.class);
        assertThat(trace.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(trace.getBody()).isNotNull();
        assertThat(trace.getBody().steps()).extracting(TraceStep::name)
            .contains("ORDER_PERSISTED", "ORDER_CREATED_EVENT", "EVENT_PUBLISHED", "EVENT_CONSUMED", "ORDER_PROCESSED");
    }

    @Test
    void shouldRejectInvalidOrderWithTraceHeader() {
        Map<String, Object> request = Map.of("customerName", "", "items", List.of());

        var response = http.postForEntity("/api/lab/orders", request, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getHeaders().getFirst("X-Trace-Id")).isNotBlank();
        assertThat(response.getBody()).containsKey("validationErrors");
    }
}
