package com.alanchristofer.portfolio.application.port.output;

import com.alanchristofer.portfolio.domain.model.UserAccount;

/** Emite credenciais temporárias sem acoplar o caso de uso ao formato JWT. */
public interface TokenPort {
    String issue(UserAccount account);
    long expiresInSeconds();
}
