package com.alanchristofer.portfolio.infrastructure.adapter.input.rest.dto;

import com.alanchristofer.portfolio.domain.model.Experience;
import com.alanchristofer.portfolio.domain.model.Profile;
import com.alanchristofer.portfolio.domain.model.Project;
import com.alanchristofer.portfolio.domain.model.Skill;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

/** Agrupa os contratos de escrita para não misturar validação HTTP com o domínio. */
public final class AdminRequests {
    private AdminRequests() { }

    public record ProfileRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Size(max = 120) String role,
        @NotBlank @Size(max = 180) String headline,
        @NotBlank @Size(max = 2000) String bio,
        @Size(max = 120) String location,
        String githubUrl,
        String linkedinUrl,
        String resumeUrl
    ) {
        public Profile toDomain() { return new Profile("profile", name, role, headline, bio, location, githubUrl, linkedinUrl, resumeUrl); }
    }

    public record SkillRequest(
        @NotBlank @Size(max = 80) String name,
        @NotBlank @Size(max = 80) String category,
        @NotBlank @Size(max = 40) String level,
        int order
    ) {
        public Skill toDomain(String id) { return new Skill(id, name, category, level, order); }
    }

    public record ExperienceRequest(
        @NotBlank @Size(max = 120) String company,
        @NotBlank @Size(max = 120) String role,
        @NotBlank @Size(max = 120) String roleEn,
        @NotBlank @Size(max = 3000) String description,
        @NotBlank @Size(max = 3000) String descriptionEn,
        int startYear,
        Integer endYear,
        @NotNull List<@NotBlank String> technologies,
        @NotNull List<@NotBlank String> highlights,
        @NotNull List<@NotBlank String> highlightsEn,
        int order
    ) {
        public Experience toDomain(String id) { return new Experience(id, company, role, roleEn, description, descriptionEn, startYear, endYear, technologies, highlights, highlightsEn, order); }
    }

    public record ProjectRequest(
        @NotBlank @Size(max = 100) String slug,
        @NotBlank @Size(max = 140) String name,
        @NotBlank @Size(max = 100) String status,
        @NotBlank @Size(max = 100) String statusEn,
        @NotBlank @Size(max = 300) String shortDescription,
        @NotBlank @Size(max = 300) String shortDescriptionEn,
        @NotBlank @Size(max = 5000) String description,
        @NotBlank @Size(max = 5000) String descriptionEn,
        @NotNull List<@NotBlank String> technologies,
        String repositoryUrl,
        String liveUrl,
        boolean featured,
        @NotBlank @Size(max = 3000) String architectureDescription,
        @NotBlank @Size(max = 3000) String architectureDescriptionEn,
        @NotNull List<@NotBlank String> highlights,
        @NotNull List<@NotBlank String> highlightsEn
    ) {
        public Project toDomain(String id) { return new Project(id, slug, name, status, statusEn, shortDescription, shortDescriptionEn, description, descriptionEn, technologies, repositoryUrl, liveUrl, featured, architectureDescription, architectureDescriptionEn, highlights, highlightsEn, null, null); }
    }
}
