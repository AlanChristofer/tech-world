package com.alanchristofer.portfolio.infrastructure.adapter.input.rest;

import com.alanchristofer.portfolio.application.port.input.AuthenticateUseCase;
import com.alanchristofer.portfolio.application.port.input.AuthenticateUseCase.AuthenticationResult;
import com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto.LoginRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Oferece o único ponto público que emite tokens administrativos. */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticação")
public class AuthenticationController {
    private final AuthenticateUseCase authentication;
    public AuthenticationController(AuthenticateUseCase authentication) { this.authentication = authentication; }

    @PostMapping("/login")
    @Operation(summary = "Autenticar administrador", description = "Valida usuário e senha configurados por environment variables e retorna Bearer JWT.")
    public AuthenticationResult login(@Valid @RequestBody LoginRequest request) {
        return authentication.authenticate(request.username(), request.password());
    }
}
