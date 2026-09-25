package com.alanchristofer.portfolio.domain.model;

import java.time.Instant;
import java.util.Map;

public record LabSystemHealth(Map<String, String> components, LabMetricsSnapshot metrics, Instant checkedAt) { }
