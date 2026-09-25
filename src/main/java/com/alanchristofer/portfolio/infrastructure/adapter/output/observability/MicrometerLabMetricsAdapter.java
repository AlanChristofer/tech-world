package com.alanchristofer.portfolio.infrastructure.adapter.output.observability;

import com.alanchristofer.portfolio.application.port.output.LabMetricsPort;
import com.alanchristofer.portfolio.domain.model.LabMetricsSnapshot;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import java.util.concurrent.TimeUnit;
import org.springframework.stereotype.Component;

@Component
public class MicrometerLabMetricsAdapter implements LabMetricsPort {
    private final Counter requests;
    private final Counter created;
    private final Counter processed;
    private final Counter failed;
    private final Timer latency;

    public MicrometerLabMetricsAdapter(MeterRegistry registry) {
        requests = registry.counter("portfolio.lab.orders.requests");
        created = registry.counter("portfolio.lab.orders.created");
        processed = registry.counter("portfolio.lab.orders.processed");
        failed = registry.counter("portfolio.lab.orders.failed");
        latency = registry.timer("portfolio.lab.orders.latency");
    }

    @Override public void recordRequest(long durationMs, boolean success) {
        requests.increment();
        latency.record(durationMs, TimeUnit.MILLISECONDS);
        if (!success) failed.increment();
    }
    @Override public void recordCreated() { created.increment(); }
    @Override public void recordProcessed() { processed.increment(); }
    @Override public void recordFailed() { failed.increment(); }

    @Override
    public LabMetricsSnapshot snapshot() {
        return new LabMetricsSnapshot(Math.round(requests.count()), Math.round(created.count()),
            Math.round(processed.count()), Math.round(failed.count()), latency.mean(TimeUnit.MILLISECONDS));
    }
}
