package com.alanchristofer.portfolio.application.port.output;

import com.alanchristofer.portfolio.domain.model.LabMetricsSnapshot;

public interface LabMetricsPort {
    void recordRequest(long durationMs, boolean success);
    void recordCreated();
    void recordProcessed();
    void recordFailed();
    LabMetricsSnapshot snapshot();
}
