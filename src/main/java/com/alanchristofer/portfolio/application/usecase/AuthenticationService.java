package com.alanchristofer.portfolio.application.usecase;

import com.alanchristofer.portfolio.application.port.input.AuthenticateUseCase;
import com.alanchristofer.portfolio.application.port.output.PasswordHashPort;
import com.alanchristofer.portfolio.application.port.output.TokenPort;
import com.alanchristofer.portfolio.application.port.output.UserAccountPort;
import com.alanchristofer.portfolio.domain.exception.InvalidCredentialsException;

/** Valida login sem revelar se o usuário ou a senha foi o dado incorreto. */
public class AuthenticationService implements AuthenticateUseCase {
    private final UserAccountPort userAccountPort;
    private final PasswordHashPort passwordHashPort;
    private final TokenPort tokenPort;

    public AuthenticationService(UserAccountPort userAccountPort, PasswordHashPort passwordHashPort, TokenPort tokenPort) {
        this.userAccountPort = userAccountPort;
        this.passwordHashPort = passwordHashPort;
        this.tokenPort = tokenPort;
    }

    @Override
    public AuthenticationResult authenticate(String username, String password) {
        var account = userAccountPort.findByUsername(username)
            .orElseThrow(InvalidCredentialsException::new);
        if (!passwordHashPort.matches(password, account.passwordHash())) {
            throw new InvalidCredentialsException();
        }
        return new AuthenticationResult(tokenPort.issue(account), "Bearer", tokenPort.expiresInSeconds());
    }
}
