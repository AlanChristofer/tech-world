package com.alanchristofer.portfolio.domain.exception;

/** Mantém a resposta de autenticação genérica para evitar enumeração de usuários. */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() { super("Invalid credentials"); }
}
