package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.repository;

import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document.UserDocument;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserMongoRepository extends MongoRepository<UserDocument, String> {
    Optional<UserDocument> findByUsername(String username);
}
