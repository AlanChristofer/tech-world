package com.alanchristofer.portfolio.domain.model;

import java.time.Instant;

public record TraceStep(String name, Instant timestamp, Long durationMs, String status, String detail) { }
