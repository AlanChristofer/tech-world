package com.alanchristofer.portfolio.infrastructure.adapter.input.rest;

import com.alanchristofer.portfolio.application.port.input.PortfolioAdminUseCase;
import com.alanchristofer.portfolio.domain.model.Experience;
import com.alanchristofer.portfolio.domain.model.Profile;
import com.alanchristofer.portfolio.domain.model.Project;
import com.alanchristofer.portfolio.domain.model.Skill;
import com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto.AdminRequests.ExperienceRequest;
import com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto.AdminRequests.ProfileRequest;
import com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto.AdminRequests.ProjectRequest;
import com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto.AdminRequests.SkillRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Entrada protegida para manutenção do conteúdo sem regras de negócio no controller. */
@RestController
@RequestMapping("/api/admin")
@Tag(name = "Administração", description = "Escritas protegidas por Bearer JWT com role ADMIN")
@SecurityRequirement(name = "bearerAuth")
public class AdminPortfolioController {
    private final PortfolioAdminUseCase admin;
    public AdminPortfolioController(PortfolioAdminUseCase admin) { this.admin = admin; }

    @PutMapping("/profile")
    @Operation(summary = "Atualizar perfil")
    public Profile saveProfile(@Valid @RequestBody ProfileRequest request) { return admin.saveProfile(request.toDomain()); }

    @PostMapping("/skills")
    @Operation(summary = "Criar competência")
    public ResponseEntity<Skill> createSkill(@Valid @RequestBody SkillRequest request) {
        Skill saved = admin.saveSkill(request.toDomain(null));
        return ResponseEntity.created(URI.create("/api/admin/skills/" + saved.id())).body(saved);
    }

    @PutMapping("/skills/{id}")
    @Operation(summary = "Atualizar competência")
    public Skill updateSkill(@PathVariable String id, @Valid @RequestBody SkillRequest request) { return admin.saveSkill(request.toDomain(id)); }

    @DeleteMapping("/skills/{id}")
    @Operation(summary = "Excluir competência")
    public ResponseEntity<Void> deleteSkill(@PathVariable String id) { admin.deleteSkill(id); return ResponseEntity.noContent().build(); }

    @PostMapping("/experiences")
    @Operation(summary = "Criar experiência")
    public ResponseEntity<Experience> createExperience(@Valid @RequestBody ExperienceRequest request) {
        Experience saved = admin.saveExperience(request.toDomain(null));
        return ResponseEntity.created(URI.create("/api/admin/experiences/" + saved.id())).body(saved);
    }

    @PutMapping("/experiences/{id}")
    @Operation(summary = "Atualizar experiência")
    public Experience updateExperience(@PathVariable String id, @Valid @RequestBody ExperienceRequest request) { return admin.saveExperience(request.toDomain(id)); }

    @DeleteMapping("/experiences/{id}")
    @Operation(summary = "Excluir experiência")
    public ResponseEntity<Void> deleteExperience(@PathVariable String id) { admin.deleteExperience(id); return ResponseEntity.noContent().build(); }

    @PostMapping("/projects")
    @Operation(summary = "Criar projeto")
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectRequest request) {
        Project saved = admin.saveProject(request.toDomain(null));
        return ResponseEntity.created(URI.create("/api/projects/" + saved.slug())).body(saved);
    }

    @PutMapping("/projects/{id}")
    @Operation(summary = "Atualizar projeto")
    public Project updateProject(@PathVariable String id, @Valid @RequestBody ProjectRequest request) { return admin.saveProject(request.toDomain(id)); }

    @DeleteMapping("/projects/{id}")
    @Operation(summary = "Excluir projeto")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) { admin.deleteProject(id); return ResponseEntity.noContent().build(); }
}
