package com.alanchristofer.portfolio.infrastructure.adapter.input.rest;

import com.alanchristofer.portfolio.domain.exception.ConflictException;
import com.alanchristofer.portfolio.domain.exception.InvalidCredentialsException;
import com.alanchristofer.portfolio.domain.exception.ResourceNotFoundException;
import com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Converte falhas conhecidas em um contrato estável e oculta detalhes internos. */
@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<ApiError> notFound(ResourceNotFoundException exception, HttpServletRequest request) {
        return error(HttpStatus.NOT_FOUND, exception.getMessage(), request, Map.of());
    }

    @ExceptionHandler(ConflictException.class)
    ResponseEntity<ApiError> conflict(ConflictException exception, HttpServletRequest request) {
        return error(HttpStatus.CONFLICT, exception.getMessage(), request, Map.of());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    ResponseEntity<ApiError> unauthorized(InvalidCredentialsException exception, HttpServletRequest request) {
        return error(HttpStatus.UNAUTHORIZED, exception.getMessage(), request, Map.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> invalid(MethodArgumentNotValidException exception, HttpServletRequest request) {
        Map<String, String> fields = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(field -> fields.putIfAbsent(field.getField(), field.getDefaultMessage()));
        return error(HttpStatus.BAD_REQUEST, "Request validation failed", request, fields);
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiError> unexpected(Exception exception, HttpServletRequest request) {
        log.error("Unexpected request failure", exception);
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", request, Map.of());
    }

    private ResponseEntity<ApiError> error(HttpStatus status, String message, HttpServletRequest request, Map<String, String> fields) {
        return ResponseEntity.status(status).body(new ApiError(Instant.now(), status.value(), status.getReasonPhrase(), message, request.getRequestURI(), fields));
    }
}
