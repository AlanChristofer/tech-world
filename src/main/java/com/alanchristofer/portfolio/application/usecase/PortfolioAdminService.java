package com.alanchristofer.portfolio.application.usecase;

import com.alanchristofer.portfolio.application.port.input.PortfolioAdminUseCase;
import com.alanchristofer.portfolio.application.port.output.PortfolioContentPort;
import com.alanchristofer.portfolio.domain.exception.ConflictException;
import com.alanchristofer.portfolio.domain.model.Experience;
import com.alanchristofer.portfolio.domain.model.Profile;
import com.alanchristofer.portfolio.domain.model.Project;
import com.alanchristofer.portfolio.domain.model.Skill;
import java.time.Instant;

/** Implementa as escritas administrativas preservando regras de identidade e auditoria. */
public class PortfolioAdminService implements PortfolioAdminUseCase {
    private final PortfolioContentPort contentPort;

    public PortfolioAdminService(PortfolioContentPort contentPort) { this.contentPort = contentPort; }

    @Override public Profile saveProfile(Profile profile) { return contentPort.saveProfile(profile); }
    @Override public Skill saveSkill(Skill skill) { return contentPort.saveSkill(skill); }
    @Override public void deleteSkill(String id) { contentPort.deleteSkill(id); }
    @Override public Experience saveExperience(Experience experience) { return contentPort.saveExperience(experience); }
    @Override public void deleteExperience(String id) { contentPort.deleteExperience(id); }

    /** Mantém timestamps confiáveis no servidor e impede slugs duplicados. */
    @Override
    public Project saveProject(Project project) {
        contentPort.findProjectBySlug(project.slug())
            .filter(existing -> !existing.id().equals(project.id()))
            .ifPresent(existing -> { throw new ConflictException("Project slug already exists: " + project.slug()); });
        Instant now = Instant.now();
        Instant createdAt = project.createdAt() == null ? now : project.createdAt();
        return contentPort.saveProject(new Project(project.id(), project.slug(), project.name(), project.status(), project.statusEn(),
            project.shortDescription(), project.shortDescriptionEn(), project.description(), project.descriptionEn(),
            project.technologies(), project.repositoryUrl(), project.liveUrl(), project.featured(),
            project.architectureDescription(), project.architectureDescriptionEn(), project.highlights(), project.highlightsEn(), createdAt, now));
    }

    @Override public void deleteProject(String id) { contentPort.deleteProject(id); }
}
