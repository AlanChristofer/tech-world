package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.repository;

import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document.ProfileDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProfileMongoRepository extends MongoRepository<ProfileDocument, String> { }
