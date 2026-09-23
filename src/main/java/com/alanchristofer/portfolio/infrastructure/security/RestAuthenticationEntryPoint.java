package com.alanchristofer.portfolio.infrastructure.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

/** Garante que falhas JWT também respeitem o contrato JSON da API. */
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().printf("{\"timestamp\":\"%s\",\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Authentication required\",\"path\":\"%s\"}", Instant.now(), request.getRequestURI());
    }
}
