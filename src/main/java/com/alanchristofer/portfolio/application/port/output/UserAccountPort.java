package com.alanchristofer.portfolio.application.port.output;

import com.alanchristofer.portfolio.domain.model.UserAccount;
import java.util.Optional;

/** Porta mínima para que autenticação não dependa do repositório Mongo. */
public interface UserAccountPort {
    Optional<UserAccount> findByUsername(String username);
    UserAccount save(UserAccount account);
    long count();
}
