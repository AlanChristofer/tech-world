package com.alanchristofer.portfolio.application.port.input;

import com.alanchristofer.portfolio.domain.model.Experience;
import com.alanchristofer.portfolio.domain.model.Profile;
import com.alanchristofer.portfolio.domain.model.Project;
import com.alanchristofer.portfolio.domain.model.Skill;
import java.util.List;

/** Contrato dos dados públicos consumidos pelo frontend. */
public interface PortfolioQueryUseCase {
    Profile getProfile();
    List<Skill> getSkills();
    List<Experience> getExperiences();
    List<Project> getProjects();
    Project getProject(String slug);
}
