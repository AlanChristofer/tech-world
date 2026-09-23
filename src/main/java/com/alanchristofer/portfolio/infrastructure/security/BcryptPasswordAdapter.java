package com.alanchristofer.portfolio.infrastructure.security;

import com.alanchristofer.portfolio.application.port.output.PasswordHashPort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Adapta BCrypt à porta da aplicação para evitar dependência direta no caso de uso. */
@Component
public class BcryptPasswordAdapter implements PasswordHashPort {
    private final PasswordEncoder encoder;
    public BcryptPasswordAdapter(PasswordEncoder encoder) { this.encoder = encoder; }
    @Override public String hash(String rawPassword) { return encoder.encode(rawPassword); }
    @Override public boolean matches(String rawPassword, String hash) { return encoder.matches(rawPassword, hash); }
}
