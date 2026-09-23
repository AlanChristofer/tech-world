package com.alanchristofer.portfolio.application.usecase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.alanchristofer.portfolio.application.port.output.PortfolioContentPort;
import com.alanchristofer.portfolio.domain.exception.ResourceNotFoundException;
import com.alanchristofer.portfolio.domain.model.Project;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PortfolioQueryServiceTest {
    @Mock PortfolioContentPort content;
    private PortfolioQueryService service;

    @BeforeEach void setUp() { service = new PortfolioQueryService(content); }

    @Test
    void shouldPutFeaturedAndRecentlyUpdatedProjectsFirst() {
        Project regular = project("regular", false, Instant.parse("2026-01-01T00:00:00Z"));
        Project olderFeatured = project("older-featured", true, Instant.parse("2026-01-01T00:00:00Z"));
        Project recentFeatured = project("recent-featured", true, Instant.parse("2026-02-01T00:00:00Z"));
        when(content.findProjects()).thenReturn(List.of(regular, olderFeatured, recentFeatured));

        assertThat(service.getProjects()).extracting(Project::slug)
            .containsExactly("recent-featured", "older-featured", "regular");
    }

    @Test
    void shouldReportMissingProjectWithoutLeakingPersistenceDetails() {
        when(content.findProjectBySlug("missing")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.getProject("missing"))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Project not found: missing");
    }

    private Project project(String slug, boolean featured, Instant updatedAt) {
        return new Project(slug, slug, slug, "status", "status", "short", "short", "description", "description",
            List.of("Java"), "", "", featured, "architecture", "architecture", List.of(), List.of(), updatedAt, updatedAt);
    }
}
