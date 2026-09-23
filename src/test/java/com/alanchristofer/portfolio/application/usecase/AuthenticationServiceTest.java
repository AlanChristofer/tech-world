package com.alanchristofer.portfolio.application.usecase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.alanchristofer.portfolio.application.port.output.PasswordHashPort;
import com.alanchristofer.portfolio.application.port.output.TokenPort;
import com.alanchristofer.portfolio.application.port.output.UserAccountPort;
import com.alanchristofer.portfolio.domain.exception.InvalidCredentialsException;
import com.alanchristofer.portfolio.domain.model.UserAccount;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {
    @Mock UserAccountPort users;
    @Mock PasswordHashPort passwords;
    @Mock TokenPort tokens;
    private AuthenticationService service;

    @BeforeEach void setUp() { service = new AuthenticationService(users, passwords, tokens); }

    @Test
    void shouldIssueTokenForValidCredentials() {
        UserAccount account = new UserAccount("1", "admin", "hash", Set.of("ADMIN"));
        when(users.findByUsername("admin")).thenReturn(Optional.of(account));
        when(passwords.matches("secret", "hash")).thenReturn(true);
        when(tokens.issue(account)).thenReturn("signed-token");
        when(tokens.expiresInSeconds()).thenReturn(7200L);

        var result = service.authenticate("admin", "secret");
        assertThat(result.accessToken()).isEqualTo("signed-token");
        assertThat(result.tokenType()).isEqualTo("Bearer");
    }

    @Test
    void shouldUseGenericErrorForUnknownUser() {
        when(users.findByUsername("unknown")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.authenticate("unknown", "secret"))
            .isInstanceOf(InvalidCredentialsException.class)
            .hasMessage("Invalid credentials");
    }
}
