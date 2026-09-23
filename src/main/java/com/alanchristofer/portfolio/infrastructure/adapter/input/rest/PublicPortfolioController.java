package com.alanchristofer.portfolio.infrastructure.adapter.input.rest;

import com.alanchristofer.portfolio.application.port.input.PortfolioQueryUseCase;
import com.alanchristofer.portfolio.domain.model.Experience;
import com.alanchristofer.portfolio.domain.model.Profile;
import com.alanchristofer.portfolio.domain.model.Project;
import com.alanchristofer.portfolio.domain.model.Skill;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Expõe somente consultas seguras que compõem a experiência pública. */
@RestController
@RequestMapping("/api")
@Tag(name = "Portfólio público", description = "Conteúdo público consumido pelo frontend")
public class PublicPortfolioController {
    private final PortfolioQueryUseCase queries;
    public PublicPortfolioController(PortfolioQueryUseCase queries) { this.queries = queries; }

    @GetMapping("/profile")
    @Operation(summary = "Consultar perfil", description = "Retorna a apresentação profissional configurada.")
    public Profile getProfile() { return queries.getProfile(); }

    @GetMapping("/skills")
    @Operation(summary = "Listar competências", description = "Retorna competências em ordem editorial, sem percentuais artificiais.")
    public List<Skill> getSkills() { return queries.getSkills(); }

    @GetMapping("/experiences")
    @Operation(summary = "Listar experiências", description = "Retorna somente experiências cadastradas pelo administrador.")
    public List<Experience> getExperiences() { return queries.getExperiences(); }

    @GetMapping("/projects")
    @Operation(summary = "Listar projetos", description = "Retorna projetos e suas evidências técnicas.")
    public List<Project> getProjects() { return queries.getProjects(); }

    @GetMapping("/projects/{slug}")
    @Operation(summary = "Consultar projeto", description = "Localiza um projeto pelo slug público.")
    public Project getProject(@PathVariable String slug) { return queries.getProject(slug); }

    @GetMapping("/architecture")
    @Operation(summary = "Consultar arquitetura", description = "Descreve as camadas reais implementadas neste repositório.")
    public Map<String, Object> getArchitecture() {
        return Map.of("style", "Clean Architecture + Hexagonal",
            "flow", List.of("Next.js", "REST API", "Spring Boot", "Application / Use Cases", "Domain", "Ports", "MongoDB Adapter"),
            "principles", List.of("Dependency inversion", "Constructor injection", "Domain without framework dependencies"));
    }

    @GetMapping("/health")
    @Operation(summary = "Verificar disponibilidade", description = "Health check leve para frontend e orquestradores.")
    public ResponseEntity<Map<String, String>> health() { return ResponseEntity.ok(Map.of("status", "UP")); }
}
