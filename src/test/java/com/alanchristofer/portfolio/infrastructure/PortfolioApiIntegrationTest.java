package com.alanchristofer.portfolio.infrastructure;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.mongodb.MongoDBContainer;

@Testcontainers(disabledWithoutDocker = true)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestRestTemplate
class PortfolioApiIntegrationTest {
    @Container
    static final MongoDBContainer mongo = new MongoDBContainer("mongo:8.0");

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.mongodb.uri", mongo::getReplicaSetUrl);
        registry.add("portfolio.admin.password", () -> "test-password");
    }

    @Autowired TestRestTemplate http;

    @Test
    void shouldExposeSeededProfileAndProjects() {
        var profile = http.getForEntity("/api/profile", Map.class);
        var projects = http.getForEntity("/api/projects", List.class);
        var openApi = http.getForEntity("/v3/api-docs", Map.class);
        assertThat(profile.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(profile.getBody()).containsEntry("name", "Alan Christofer");
        assertThat(projects.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(projects.getBody()).isNotEmpty();
        assertThat(openApi.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(openApi.getBody()).containsKey("paths");
    }

    @Test
    void shouldAuthenticateAndProtectAdministrativeWrites() {
        Map<String, String> credentials = Map.of("username", "admin", "password", "test-password");
        var login = http.postForEntity("/api/auth/login", credentials, Map.class);
        assertThat(login.getStatusCode()).isEqualTo(HttpStatus.OK);
        String token = (String) login.getBody().get("accessToken");

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> skill = Map.of("name", "JUnit", "category", "Testing", "level", "Configured", "order", 99);
        var created = http.exchange("/api/admin/skills", HttpMethod.POST, new HttpEntity<>(skill, headers), Map.class);
        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        var unauthorized = http.postForEntity("/api/admin/skills", skill, Map.class);
        assertThat(unauthorized.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}
