package com.alanchristofer.portfolio.infrastructure.adapter.input.rest;

import com.alanchristofer.portfolio.application.port.output.LabMetricsPort;
import com.alanchristofer.portfolio.application.port.output.OrderTracePort;
import com.alanchristofer.portfolio.domain.model.TraceStep;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Clock;
import java.time.Duration;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class LabTraceFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(LabTraceFilter.class);
    public static final String TRACE_ID_ATTRIBUTE = "portfolio.lab.traceId";
    private final OrderTracePort traces;
    private final LabMetricsPort metrics;
    private final Clock clock;

    public LabTraceFilter(OrderTracePort traces, LabMetricsPort metrics, Clock clock) {
        this.traces = traces;
        this.metrics = metrics;
        this.clock = clock;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equals(request.getMethod()) || !"/api/lab/orders".equals(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {
        String traceId = UUID.randomUUID().toString();
        long startedAt = System.nanoTime();
        request.setAttribute(TRACE_ID_ATTRIBUTE, traceId);
        response.setHeader("X-Trace-Id", traceId);
        MDC.put("traceId", traceId);
        traces.start(traceId, clock.instant().plus(Duration.ofHours(24)));
        traces.append(traceId, new TraceStep("REQUEST_RECEIVED", clock.instant(), null, "SUCCESS", "POST /api/lab/orders received"));
        try {
            chain.doFilter(request, response);
        } finally {
            long durationMs = Math.max(0, (System.nanoTime() - startedAt) / 1_000_000);
            boolean success = response.getStatus() < 400;
            if (response.getStatus() == 400) {
                traces.append(traceId, new TraceStep("VALIDATION_FAILED", clock.instant(), durationMs, "FAILED", "Bean Validation rejected the request"));
            }
            if (!success) {
                traces.append(traceId, new TraceStep("REQUEST_FAILED", clock.instant(), durationMs, "FAILED", "Request finished with HTTP " + response.getStatus()));
            }
            metrics.recordRequest(durationMs, success);
            log.info("Engineering Lab request completed status={} durationMs={}", response.getStatus(), durationMs);
            MDC.remove("traceId");
            MDC.remove("orderId");
        }
    }
}
