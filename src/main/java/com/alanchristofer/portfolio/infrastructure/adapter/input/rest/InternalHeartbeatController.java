package com.alanchristofer.portfolio.infrastructure.adapter.input.rest;

import com.alanchristofer.portfolio.domain.event.HeartbeatEvent;
import com.alanchristofer.portfolio.infrastructure.adapter.output.messaging.KafkaHeartbeatPublisher;
import io.swagger.v3.oas.annotations.Hidden;
import java.time.Clock;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Hidden
@RestController
@RequestMapping("/api/internal")
public class InternalHeartbeatController {
    private final KafkaHeartbeatPublisher publisher;
    private final Clock clock;

    public InternalHeartbeatController(KafkaHeartbeatPublisher publisher, Clock clock) {
        this.publisher = publisher;
        this.clock = clock;
    }

    @PostMapping("/heartbeat")
    public ResponseEntity<HeartbeatResponse> heartbeat() {
        String traceId = UUID.randomUUID().toString();
        try {
            publisher.publish(new HeartbeatEvent("HEARTBEAT", clock.instant(), traceId));
            return ResponseEntity.ok(new HeartbeatResponse("UP", "PUBLISHED", traceId));
        } catch (RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new HeartbeatResponse("DOWN", "UNAVAILABLE", traceId));
        }
    }

    public record HeartbeatResponse(String status, String kafka, String traceId) { }
}
