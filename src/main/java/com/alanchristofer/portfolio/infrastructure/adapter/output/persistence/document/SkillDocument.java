package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("skills")
public record SkillDocument(@Id String id, String name, String category, String level, int order) { }
