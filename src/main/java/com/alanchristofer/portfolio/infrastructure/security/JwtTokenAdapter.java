package com.alanchristofer.portfolio.infrastructure.security;

import com.alanchristofer.portfolio.application.port.output.TokenPort;
import com.alanchristofer.portfolio.domain.model.UserAccount;
import java.time.Duration;
import java.time.Instant;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;

/** Emite JWT assinado contendo apenas identidade e roles necessárias. */
public class JwtTokenAdapter implements TokenPort {
    private final JwtEncoder encoder;
    private final Duration ttl;

    public JwtTokenAdapter(JwtEncoder encoder, Duration ttl) {
        this.encoder = encoder;
        this.ttl = ttl;
    }

    @Override
    public String issue(UserAccount account) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("developer-command-center")
            .issuedAt(now)
            .expiresAt(now.plus(ttl))
            .subject(account.username())
            .claim("roles", account.roles())
            .build();
        return encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
    }

    @Override public long expiresInSeconds() { return ttl.toSeconds(); }
}
