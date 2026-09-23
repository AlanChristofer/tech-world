package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.repository;

import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document.ExperienceDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExperienceMongoRepository extends MongoRepository<ExperienceDocument, String> { }
