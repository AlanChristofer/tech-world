package com.alanchristofer.portfolio.infrastructure.adapter.input.rest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.alanchristofer.portfolio.domain.event.HeartbeatEvent;
import com.alanchristofer.portfolio.infrastructure.adapter.output.messaging.KafkaHeartbeatPublisher;
import com.alanchristofer.portfolio.infrastructure.security.HeartbeatTokenFilter;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class InternalHeartbeatControllerTest {
    private static final String TOKEN = "test-heartbeat-token";
    private KafkaHeartbeatPublisher publisher;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        publisher = mock(KafkaHeartbeatPublisher.class);
        Clock clock = Clock.fixed(Instant.parse("2026-09-29T12:00:00Z"), ZoneOffset.UTC);
        mvc = MockMvcBuilders.standaloneSetup(new InternalHeartbeatController(publisher, clock))
            .addFilters(new HeartbeatTokenFilter(TOKEN))
            .build();
    }

    @Test
    void shouldRejectMissingToken() throws Exception {
        mvc.perform(post("/api/internal/heartbeat"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldRejectInvalidToken() throws Exception {
        mvc.perform(post("/api/internal/heartbeat").header(HttpHeaders.AUTHORIZATION, "Bearer invalid"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldPublishHeartbeatWithValidToken() throws Exception {
        mvc.perform(post("/api/internal/heartbeat").header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("UP"))
            .andExpect(jsonPath("$.kafka").value("PUBLISHED"))
            .andExpect(jsonPath("$.traceId").isNotEmpty());

        verify(publisher).publish(any(HeartbeatEvent.class));
    }

    @Test
    void shouldReturnServiceUnavailableWhenKafkaPublishFails() throws Exception {
        doThrow(new IllegalStateException("Kafka unavailable")).when(publisher).publish(any(HeartbeatEvent.class));

        mvc.perform(post("/api/internal/heartbeat").header(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN))
            .andExpect(status().isServiceUnavailable())
            .andExpect(jsonPath("$.status").value("DOWN"))
            .andExpect(jsonPath("$.kafka").value("UNAVAILABLE"));
    }
}
