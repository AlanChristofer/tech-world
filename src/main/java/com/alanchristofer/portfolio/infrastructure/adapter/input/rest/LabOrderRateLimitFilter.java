package com.alanchristofer.portfolio.infrastructure.adapter.input.rest;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Clock;
import java.time.Duration;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** Lightweight per-instance protection for the public Engineering Lab command endpoint. */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 20)
@ConditionalOnProperty(name = "portfolio.lab.rate-limit.enabled", havingValue = "true")
public class LabOrderRateLimitFilter extends OncePerRequestFilter {
    private final Map<String, Deque<Long>> attemptsByClient = new ConcurrentHashMap<>();
    private final AtomicLong requestCounter = new AtomicLong();
    private final Clock clock;
    private final int maxRequests;
    private final long windowMillis;

    public LabOrderRateLimitFilter(Clock clock,
                                   @Value("${portfolio.lab.rate-limit.max-requests:5}") int maxRequests,
                                   @Value("${portfolio.lab.rate-limit.window:PT1M}") Duration window) {
        if (maxRequests < 1 || window.isZero() || window.isNegative()) {
            throw new IllegalArgumentException("Engineering Lab rate limit must be positive");
        }
        this.clock = clock;
        this.maxRequests = maxRequests;
        this.windowMillis = window.toMillis();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equals(request.getMethod()) || !"/api/lab/orders".equals(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {
        LimitDecision decision = register(request.getRemoteAddr());
        if (!decision.allowed()) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setHeader("Retry-After", Long.toString(decision.retryAfterSeconds()));
            response.getWriter().write("{\"status\":429,\"error\":\"Too Many Requests\",\"message\":\"Engineering Lab rate limit exceeded\",\"path\":\"/api/lab/orders\"}");
            return;
        }
        chain.doFilter(request, response);
    }

    private LimitDecision register(String clientAddress) {
        long now = clock.millis();
        Deque<Long> attempts = attemptsByClient.computeIfAbsent(clientAddress, ignored -> new ArrayDeque<>());
        LimitDecision decision;
        synchronized (attempts) {
            removeExpired(attempts, now);
            if (attempts.size() >= maxRequests) {
                long retryAfterMillis = Math.max(1, attempts.peekFirst() + windowMillis - now);
                decision = new LimitDecision(false, Math.max(1, (retryAfterMillis + 999) / 1000));
            } else {
                attempts.addLast(now);
                decision = new LimitDecision(true, 0);
            }
        }
        if (requestCounter.incrementAndGet() % 500 == 0) removeInactiveClients(now);
        return decision;
    }

    private void removeExpired(Deque<Long> attempts, long now) {
        long cutoff = now - windowMillis;
        while (!attempts.isEmpty() && attempts.peekFirst() <= cutoff) attempts.removeFirst();
    }

    private void removeInactiveClients(long now) {
        attemptsByClient.entrySet().removeIf(entry -> {
            Deque<Long> attempts = entry.getValue();
            synchronized (attempts) {
                removeExpired(attempts, now);
                return attempts.isEmpty();
            }
        });
    }

    private record LimitDecision(boolean allowed, long retryAfterSeconds) { }
}
