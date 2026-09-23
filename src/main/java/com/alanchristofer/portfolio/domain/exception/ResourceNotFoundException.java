package com.alanchristofer.portfolio.domain.exception;

/** Exceção de domínio usada quando um recurso solicitado não existe. */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) { super(message); }
}
