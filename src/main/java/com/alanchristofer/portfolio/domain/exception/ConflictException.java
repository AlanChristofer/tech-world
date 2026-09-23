package com.alanchristofer.portfolio.domain.exception;

/** Indica que uma alteração violaria uma identidade única já persistida. */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) { super(message); }
}
