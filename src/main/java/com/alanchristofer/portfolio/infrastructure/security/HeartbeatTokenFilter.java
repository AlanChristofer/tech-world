package com.alanchristofer.portfolio.infrastructure.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.springframework.web.filter.OncePerRequestFilter;

public class HeartbeatTokenFilter extends OncePerRequestFilter {
    private static final String ENDPOINT = "/api/internal/heartbeat";
    private static final String BEARER_PREFIX = "Bearer ";
    private final byte[] expectedToken;

    public HeartbeatTokenFilter(String expectedToken) {
        this.expectedToken = expectedToken == null ? new byte[0] : expectedToken.getBytes(StandardCharsets.UTF_8);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equals(request.getMethod()) || !ENDPOINT.equals(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        byte[] suppliedToken = authorization != null && authorization.startsWith(BEARER_PREFIX)
            ? authorization.substring(BEARER_PREFIX.length()).getBytes(StandardCharsets.UTF_8)
            : new byte[0];

        if (expectedToken.length == 0 || !MessageDigest.isEqual(expectedToken, suppliedToken)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.getWriter().write("{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Invalid heartbeat credentials\",\"path\":\"" + ENDPOINT + "\"}");
            return;
        }
        chain.doFilter(request, response);
    }
}
