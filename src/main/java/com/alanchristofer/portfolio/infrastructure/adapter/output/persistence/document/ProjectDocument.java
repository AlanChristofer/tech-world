package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document;

import java.time.Instant;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("projects")
public record ProjectDocument(
    @Id String id, @Indexed(unique = true) String slug, String name, String status, String statusEn,
    String shortDescription, String shortDescriptionEn, String description, String descriptionEn,
    List<String> technologies, String repositoryUrl, String liveUrl, boolean featured,
    String architectureDescription, String architectureDescriptionEn,
    List<String> highlights, List<String> highlightsEn, Instant createdAt, Instant updatedAt
) { }
