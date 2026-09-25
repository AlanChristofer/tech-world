package com.alanchristofer.portfolio.domain.model;

import java.util.List;

public record OrderTrace(String traceId, String orderId, List<TraceStep> steps) { }
