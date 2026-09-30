package com.alanchristofer.portfolio.domain.event;

import java.time.Instant;

public record HeartbeatEvent(String type, Instant timestamp, String traceId) { }
