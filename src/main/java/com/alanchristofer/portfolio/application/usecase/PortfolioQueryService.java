package com.alanchristofer.portfolio.application.usecase;

import com.alanchristofer.portfolio.application.port.input.PortfolioQueryUseCase;
import com.alanchristofer.portfolio.application.port.output.PortfolioContentPort;
import com.alanchristofer.portfolio.domain.exception.ResourceNotFoundException;
import com.alanchristofer.portfolio.domain.model.Experience;
import com.alanchristofer.portfolio.domain.model.Profile;
import com.alanchristofer.portfolio.domain.model.Project;
import com.alanchristofer.portfolio.domain.model.Skill;
import java.util.Comparator;
import java.util.List;

/**
 * Centraliza consultas públicas e garante ordenação consistente, independentemente
 * da ordem retornada pelo banco.
 */
public class PortfolioQueryService implements PortfolioQueryUseCase {
    private final PortfolioContentPort contentPort;

    public PortfolioQueryService(PortfolioContentPort contentPort) { this.contentPort = contentPort; }

    /** Recupera o perfil público único. */
    @Override
    public Profile getProfile() {
        return contentPort.findProfile().orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
    }

    /** Lista competências na ordem editorial definida pelo administrador. */
    @Override
    public List<Skill> getSkills() {
        return contentPort.findSkills().stream().sorted(Comparator.comparingInt(Skill::order)).toList();
    }

    @Override
    public List<Experience> getExperiences() {
        return contentPort.findExperiences().stream().sorted(Comparator.comparingInt(Experience::order)).toList();
    }

    @Override
    public List<Project> getProjects() {
        return contentPort.findProjects().stream()
            .sorted(Comparator.comparing(Project::featured).reversed()
                .thenComparing(Project::updatedAt, Comparator.reverseOrder()))
            .toList();
    }

    /** Resolve o slug público ou produz um erro sem expor detalhes de persistência. */
    @Override
    public Project getProject(String slug) {
        return contentPort.findProjectBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + slug));
    }
}
