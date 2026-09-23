package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/** Documento separado para impedir anotações Mongo no domínio. */
@Document("profiles")
public record ProfileDocument(
    @Id String id, String name, String role, String headline, String bio, String location,
    String githubUrl, String linkedinUrl, String resumeUrl
) { }
