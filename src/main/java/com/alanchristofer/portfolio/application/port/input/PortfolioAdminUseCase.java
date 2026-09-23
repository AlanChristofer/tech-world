package com.alanchristofer.portfolio.application.port.input;

import com.alanchristofer.portfolio.domain.model.Experience;
import com.alanchristofer.portfolio.domain.model.Profile;
import com.alanchristofer.portfolio.domain.model.Project;
import com.alanchristofer.portfolio.domain.model.Skill;

/** Define as alterações protegidas disponíveis ao administrador. */
public interface PortfolioAdminUseCase {
    Profile saveProfile(Profile profile);
    Skill saveSkill(Skill skill);
    void deleteSkill(String id);
    Experience saveExperience(Experience experience);
    void deleteExperience(String id);
    Project saveProject(Project project);
    void deleteProject(String id);
}
