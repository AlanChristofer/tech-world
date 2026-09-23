package com.alanchristofer.portfolio.infrastructure.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

/** Responde 403 em JSON sem revelar regras internas de autorização. */
public class RestAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException exception) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().printf("{\"timestamp\":\"%s\",\"status\":403,\"error\":\"Forbidden\",\"message\":\"Insufficient permissions\",\"path\":\"%s\"}", Instant.now(), request.getRequestURI());
    }
}
