package com.alanchristofer.portfolio.domain.model;

/** Representa uma competência sem inventar percentuais artificiais de domínio. */
public record Skill(String id, String name, String category, String level, int order) {
}
