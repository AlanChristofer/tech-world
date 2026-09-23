package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("experiences")
public record ExperienceDocument(
    @Id String id, String company, String role, String roleEn, String description, String descriptionEn,
    int startYear, Integer endYear, List<String> technologies,
    List<String> highlights, List<String> highlightsEn, int order
) { }
