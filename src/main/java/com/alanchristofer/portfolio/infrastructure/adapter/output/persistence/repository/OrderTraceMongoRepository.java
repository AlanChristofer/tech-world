package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.repository;

import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document.OrderTraceDocument;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrderTraceMongoRepository extends MongoRepository<OrderTraceDocument, String> {
    Optional<OrderTraceDocument> findByOrderId(String orderId);
}
