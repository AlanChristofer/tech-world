package com.alanchristofer.portfolio.infrastructure.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Mantém a documentação navegável e declara o Bearer JWT para testes administrativos. */
@Configuration
public class OpenApiConfig {
    @Bean
    OpenAPI portfolioOpenApi() {
        return new OpenAPI()
            .info(new Info().title("Developer Command Center API")
                .description("API pública do portfólio e administração protegida."))
            .components(new Components().addSecuritySchemes("bearerAuth", new SecurityScheme()
                .type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}
