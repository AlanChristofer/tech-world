package com.alanchristofer.portfolio.domain.model;

/**
 * Representa a identidade profissional exibida publicamente, sem dependência
 * de HTTP, Spring ou da tecnologia de persistência.
 */
public record Profile(
    String id, String name, String role, String headline, String bio, String location,
    String githubUrl, String linkedinUrl, String resumeUrl
) {
}
