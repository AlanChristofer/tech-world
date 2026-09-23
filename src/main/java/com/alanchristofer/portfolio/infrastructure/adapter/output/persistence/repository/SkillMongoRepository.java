package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.repository;

import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document.SkillDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SkillMongoRepository extends MongoRepository<SkillDocument, String> { }
