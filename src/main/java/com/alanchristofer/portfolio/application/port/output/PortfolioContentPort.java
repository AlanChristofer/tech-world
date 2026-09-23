package com.alanchristofer.portfolio.application.port.output;

import com.alanchristofer.portfolio.domain.model.Experience;
import com.alanchristofer.portfolio.domain.model.Profile;
import com.alanchristofer.portfolio.domain.model.Project;
import com.alanchristofer.portfolio.domain.model.Skill;
import java.util.List;
import java.util.Optional;

/** Porta que isola os casos de uso dos detalhes do MongoDB. */
public interface PortfolioContentPort {
    Optional<Profile> findProfile();
    Profile saveProfile(Profile profile);
    List<Skill> findSkills();
    Skill saveSkill(Skill skill);
    void deleteSkill(String id);
    List<Experience> findExperiences();
    Experience saveExperience(Experience experience);
    void deleteExperience(String id);
    List<Project> findProjects();
    Optional<Project> findProjectBySlug(String slug);
    Project saveProject(Project project);
    void deleteProject(String id);
}
