package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence;

import com.alanchristofer.portfolio.application.port.output.OrderTracePort;
import com.alanchristofer.portfolio.domain.model.OrderTrace;
import com.alanchristofer.portfolio.domain.model.TraceStep;
import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document.OrderTraceDocument;
import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.repository.OrderTraceMongoRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

@Component
public class OrderTraceMongoAdapter implements OrderTracePort {
    private final OrderTraceMongoRepository repository;
    private final MongoTemplate mongo;

    public OrderTraceMongoAdapter(OrderTraceMongoRepository repository, MongoTemplate mongo) {
        this.repository = repository;
        this.mongo = mongo;
    }

    @Override
    public void start(String traceId, Instant expiresAt) {
        repository.save(new OrderTraceDocument(null, traceId, null, List.of(), expiresAt));
    }

    @Override
    public void associateOrder(String traceId, String orderId) {
        mongo.updateFirst(Query.query(Criteria.where("traceId").is(traceId)), Update.update("orderId", orderId), OrderTraceDocument.class);
    }

    @Override
    public void append(String traceId, TraceStep step) {
        OrderTraceDocument.TraceStepDocument value = new OrderTraceDocument.TraceStepDocument(
            step.name(), step.timestamp(), step.durationMs(), step.status(), step.detail());
        mongo.updateFirst(Query.query(Criteria.where("traceId").is(traceId)), new Update().push("steps", value), OrderTraceDocument.class);
    }

    @Override
    public Optional<OrderTrace> findByOrderId(String orderId) {
        return repository.findByOrderId(orderId).map(document -> new OrderTrace(document.traceId(), document.orderId(),
            document.steps().stream().map(step -> new TraceStep(step.name(), step.timestamp(), step.durationMs(), step.status(), step.detail())).toList()));
    }
}
