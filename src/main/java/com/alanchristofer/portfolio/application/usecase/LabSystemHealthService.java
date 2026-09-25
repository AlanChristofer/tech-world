package com.alanchristofer.portfolio.application.usecase;

import com.alanchristofer.portfolio.application.port.input.GetLabSystemHealthUseCase;
import com.alanchristofer.portfolio.application.port.output.LabMetricsPort;
import com.alanchristofer.portfolio.application.port.output.LabSystemHealthPort;
import com.alanchristofer.portfolio.domain.model.LabSystemHealth;
import java.time.Clock;

public class LabSystemHealthService implements GetLabSystemHealthUseCase {
    private final LabSystemHealthPort health;
    private final LabMetricsPort metrics;
    private final Clock clock;

    public LabSystemHealthService(LabSystemHealthPort health, LabMetricsPort metrics, Clock clock) {
        this.health = health;
        this.metrics = metrics;
        this.clock = clock;
    }

    @Override
    public LabSystemHealth getHealth() {
        return new LabSystemHealth(health.componentStatuses(), metrics.snapshot(), clock.instant());
    }
}
