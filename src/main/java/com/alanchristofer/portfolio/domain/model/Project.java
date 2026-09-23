package com.alanchristofer.portfolio.domain.model;

import java.time.Instant;
import java.util.List;

/** Reúne evidências técnicas de um projeto apresentado no portfólio. */
public record Project(
    String id, String slug, String name, String status, String statusEn,
    String shortDescription, String shortDescriptionEn, String description, String descriptionEn,
    List<String> technologies, String repositoryUrl, String liveUrl, boolean featured,
    String architectureDescription, String architectureDescriptionEn,
    List<String> highlights, List<String> highlightsEn, Instant createdAt, Instant updatedAt
) {
}
