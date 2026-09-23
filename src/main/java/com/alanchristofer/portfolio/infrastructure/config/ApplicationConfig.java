package com.alanchristofer.portfolio.infrastructure.config;

import com.alanchristofer.portfolio.application.port.input.AuthenticateUseCase;
import com.alanchristofer.portfolio.application.port.input.PortfolioAdminUseCase;
import com.alanchristofer.portfolio.application.port.input.PortfolioQueryUseCase;
import com.alanchristofer.portfolio.application.port.output.PasswordHashPort;
import com.alanchristofer.portfolio.application.port.output.PortfolioContentPort;
import com.alanchristofer.portfolio.application.port.output.TokenPort;
import com.alanchristofer.portfolio.application.port.output.UserAccountPort;
import com.alanchristofer.portfolio.application.usecase.AuthenticationService;
import com.alanchristofer.portfolio.application.usecase.PortfolioAdminService;
import com.alanchristofer.portfolio.application.usecase.PortfolioQueryService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Compõe casos de uso com suas portas, mantendo a criação fora das regras de negócio. */
@Configuration
public class ApplicationConfig {
    @Bean PortfolioQueryUseCase portfolioQueryUseCase(PortfolioContentPort port) { return new PortfolioQueryService(port); }
    @Bean PortfolioAdminUseCase portfolioAdminUseCase(PortfolioContentPort port) { return new PortfolioAdminService(port); }
    @Bean AuthenticateUseCase authenticateUseCase(UserAccountPort users, PasswordHashPort passwords, TokenPort tokens) {
        return new AuthenticationService(users, passwords, tokens);
    }
}
