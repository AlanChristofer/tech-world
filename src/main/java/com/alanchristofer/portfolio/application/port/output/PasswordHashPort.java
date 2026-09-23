package com.alanchristofer.portfolio.application.port.output;

/** Abstrai o algoritmo de senha para manter a aplicação testável. */
public interface PasswordHashPort {
    String hash(String rawPassword);
    boolean matches(String rawPassword, String hash);
}
