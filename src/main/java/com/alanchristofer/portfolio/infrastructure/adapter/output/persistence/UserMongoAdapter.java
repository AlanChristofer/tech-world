package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence;

import com.alanchristofer.portfolio.application.port.output.UserAccountPort;
import com.alanchristofer.portfolio.domain.model.UserAccount;
import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document.UserDocument;
import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.repository.UserMongoRepository;
import java.util.Optional;
import org.springframework.stereotype.Component;

/** Traduz contas entre o domínio e a collection protegida de usuários. */
@Component
public class UserMongoAdapter implements UserAccountPort {
    private final UserMongoRepository repository;
    public UserMongoAdapter(UserMongoRepository repository) { this.repository = repository; }
    @Override public Optional<UserAccount> findByUsername(String username) { return repository.findByUsername(username).map(this::toDomain); }
    @Override public UserAccount save(UserAccount a) { return toDomain(repository.save(new UserDocument(a.id(), a.username(), a.passwordHash(), a.roles()))); }
    @Override public long count() { return repository.count(); }
    private UserAccount toDomain(UserDocument d) { return new UserAccount(d.id(), d.username(), d.passwordHash(), d.roles()); }
}
