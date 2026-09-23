package com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto;

import java.time.Instant;
import java.util.Map;

/** Erro estável para clientes sem expor stack trace ou detalhes internos. */
public record ApiError(
    Instant timestamp, int status, String error, String message, String path, Map<String, String> validationErrors
) { }
