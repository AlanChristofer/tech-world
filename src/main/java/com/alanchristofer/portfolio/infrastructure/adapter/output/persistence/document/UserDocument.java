package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document;

import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("users")
public record UserDocument(@Id String id, @Indexed(unique = true) String username, String passwordHash, Set<String> roles) { }
