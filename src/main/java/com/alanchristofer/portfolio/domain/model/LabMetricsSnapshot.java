package com.alanchristofer.portfolio.domain.model;

public record LabMetricsSnapshot(long requests, long created, long processed, long failed, double averageLatencyMs) { }
