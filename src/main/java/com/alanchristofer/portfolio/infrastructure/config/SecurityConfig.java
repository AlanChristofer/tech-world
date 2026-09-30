package com.alanchristofer.portfolio.infrastructure.config;

import com.alanchristofer.portfolio.application.port.output.TokenPort;
import com.alanchristofer.portfolio.infrastructure.security.HeartbeatTokenFilter;
import com.alanchristofer.portfolio.infrastructure.security.JwtTokenAdapter;
import com.alanchristofer.portfolio.infrastructure.security.RestAccessDeniedHandler;
import com.alanchristofer.portfolio.infrastructure.security.RestAuthenticationEntryPoint;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Arrays;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/** Define fronteiras públicas, autenticação stateless e headers defensivos. */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationConverter jwtConverter,
                                            @Value("${portfolio.heartbeat.token:}") String heartbeatToken) throws Exception {
        DefaultBearerTokenResolver jwtTokenResolver = new DefaultBearerTokenResolver();
        http.csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(headers -> headers
                .contentTypeOptions(Customizer.withDefaults())
                .frameOptions(frame -> frame.sameOrigin()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.GET, "/api/profile", "/api/skills", "/api/experiences",
                    "/api/projects", "/api/projects/*", "/api/architecture", "/api/health", "/api/lab/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/lab/orders").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/internal/heartbeat").permitAll()
                .requestMatchers("/api/auth/login", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/actuator/health", "/actuator/health/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/actuator/prometheus").hasRole("ADMIN")
                .anyRequest().authenticated())
            .addFilterBefore(new HeartbeatTokenFilter(heartbeatToken), BearerTokenAuthenticationFilter.class)
            .oauth2ResourceServer(oauth -> oauth
                .bearerTokenResolver(request -> isHeartbeatRequest(request) ? null : jwtTokenResolver.resolve(request))
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtConverter))
                .authenticationEntryPoint(new RestAuthenticationEntryPoint()))
            .exceptionHandling(errors -> errors
                .authenticationEntryPoint(new RestAuthenticationEntryPoint())
                .accessDeniedHandler(new RestAccessDeniedHandler()));
        return http.build();
    }

    private static boolean isHeartbeatRequest(jakarta.servlet.http.HttpServletRequest request) {
        return "POST".equals(request.getMethod()) && "/api/internal/heartbeat".equals(request.getRequestURI());
    }

    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(12); }

    @Bean SecretKey jwtSecretKey(@Value("${portfolio.security.jwt-secret}") String secret) {
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) throw new IllegalStateException("JWT_SECRET must contain at least 32 bytes");
        return new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    @Bean JwtEncoder jwtEncoder(SecretKey key) { return new NimbusJwtEncoder(new ImmutableSecret<>(key)); }
    @Bean JwtDecoder jwtDecoder(SecretKey key) { return NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build(); }
    @Bean TokenPort tokenPort(JwtEncoder encoder, @Value("${portfolio.security.token-ttl}") Duration ttl) { return new JwtTokenAdapter(encoder, ttl); }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();
        authorities.setAuthoritiesClaimName("roles");
        authorities.setAuthorityPrefix("ROLE_");
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authorities);
        return converter;
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(@Value("${portfolio.cors.allowed-origins}") String origins) {
        java.util.List<String> allowedOrigins = Arrays.stream(origins.split(","))
            .map(String::trim)
            .filter(origin -> !origin.isBlank())
            .toList();
        if (allowedOrigins.isEmpty() || allowedOrigins.contains("*")) {
            throw new IllegalStateException("CORS_ALLOWED_ORIGINS must contain explicit origins");
        }
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type"));
        configuration.setExposedHeaders(java.util.List.of("X-Trace-Id"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
