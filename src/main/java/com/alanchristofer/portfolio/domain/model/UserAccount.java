package com.alanchristofer.portfolio.domain.model;

import java.util.Set;

/** Mantém somente os dados necessários para autenticar administradores. */
public record UserAccount(String id, String username, String passwordHash, Set<String> roles) {
}
