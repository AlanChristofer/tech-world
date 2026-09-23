package com.alanchristofer.portfolio.application.port.input;

/** Caso de uso responsável por validar credenciais e emitir acesso administrativo. */
public interface AuthenticateUseCase {
    AuthenticationResult authenticate(String username, String password);

    record AuthenticationResult(String accessToken, String tokenType, long expiresIn) { }
}
