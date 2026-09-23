package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.repository;

import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document.ProjectDocument;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProjectMongoRepository extends MongoRepository<ProjectDocument, String> {
    Optional<ProjectDocument> findBySlug(String slug);
}
