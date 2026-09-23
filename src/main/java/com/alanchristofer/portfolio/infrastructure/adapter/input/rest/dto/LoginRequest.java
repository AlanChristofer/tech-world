package com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(@NotBlank String username, @NotBlank String password) { }
