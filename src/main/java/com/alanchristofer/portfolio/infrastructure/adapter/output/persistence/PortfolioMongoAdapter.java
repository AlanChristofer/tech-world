package com.alanchristofer.portfolio.infrastructure.adapter.output.persistence;

import com.alanchristofer.portfolio.application.port.output.PortfolioContentPort;
import com.alanchristofer.portfolio.domain.model.Experience;
import com.alanchristofer.portfolio.domain.model.Profile;
import com.alanchristofer.portfolio.domain.model.Project;
import com.alanchristofer.portfolio.domain.model.Skill;
import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document.ExperienceDocument;
import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document.ProfileDocument;
import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document.ProjectDocument;
import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.document.SkillDocument;
import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.repository.ExperienceMongoRepository;
import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.repository.ProfileMongoRepository;
import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.repository.ProjectMongoRepository;
import com.alanchristofer.portfolio.infrastructure.adapter.output.persistence.repository.SkillMongoRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Component;

/** Adapter único de conteúdo que traduz documentos Mongo em entidades de domínio. */
@Component
public class PortfolioMongoAdapter implements PortfolioContentPort {
    private final ProfileMongoRepository profiles;
    private final SkillMongoRepository skills;
    private final ExperienceMongoRepository experiences;
    private final ProjectMongoRepository projects;

    public PortfolioMongoAdapter(ProfileMongoRepository profiles, SkillMongoRepository skills,
                                 ExperienceMongoRepository experiences, ProjectMongoRepository projects) {
        this.profiles = profiles;
        this.skills = skills;
        this.experiences = experiences;
        this.projects = projects;
    }

    @Override public Optional<Profile> findProfile() { return profiles.findAll().stream().findFirst().map(this::toDomain); }
    @Override public Profile saveProfile(Profile value) { return toDomain(profiles.save(toDocument(value))); }
    @Override public List<Skill> findSkills() { return skills.findAll().stream().map(this::toDomain).toList(); }
    @Override public Skill saveSkill(Skill value) { return toDomain(skills.save(toDocument(value))); }
    @Override public void deleteSkill(String id) { skills.deleteById(id); }
    @Override public List<Experience> findExperiences() { return experiences.findAll().stream().map(this::toDomain).toList(); }
    @Override public Experience saveExperience(Experience value) { return toDomain(experiences.save(toDocument(value))); }
    @Override public void deleteExperience(String id) { experiences.deleteById(id); }
    @Override public List<Project> findProjects() { return projects.findAll().stream().map(this::toDomain).toList(); }
    @Override public Optional<Project> findProjectBySlug(String slug) { return projects.findBySlug(slug).map(this::toDomain); }
    @Override public Project saveProject(Project value) { return toDomain(projects.save(toDocument(value))); }
    @Override public void deleteProject(String id) { projects.deleteById(id); }

    private Profile toDomain(ProfileDocument d) { return new Profile(d.id(), d.name(), d.role(), d.headline(), d.bio(), d.location(), d.githubUrl(), d.linkedinUrl(), d.resumeUrl()); }
    private ProfileDocument toDocument(Profile d) { return new ProfileDocument(d.id(), d.name(), d.role(), d.headline(), d.bio(), d.location(), d.githubUrl(), d.linkedinUrl(), d.resumeUrl()); }
    private Skill toDomain(SkillDocument d) { return new Skill(d.id(), d.name(), d.category(), d.level(), d.order()); }
    private SkillDocument toDocument(Skill d) { return new SkillDocument(d.id(), d.name(), d.category(), d.level(), d.order()); }
    private Experience toDomain(ExperienceDocument d) { return new Experience(d.id(), d.company(), d.role(), d.roleEn(), d.description(), d.descriptionEn(), d.startYear(), d.endYear(), d.technologies(), d.highlights(), d.highlightsEn(), d.order()); }
    private ExperienceDocument toDocument(Experience d) { return new ExperienceDocument(d.id(), d.company(), d.role(), d.roleEn(), d.description(), d.descriptionEn(), d.startYear(), d.endYear(), d.technologies(), d.highlights(), d.highlightsEn(), d.order()); }
    private Project toDomain(ProjectDocument d) { return new Project(d.id(), d.slug(), d.name(), d.status(), d.statusEn(), d.shortDescription(), d.shortDescriptionEn(), d.description(), d.descriptionEn(), d.technologies(), d.repositoryUrl(), d.liveUrl(), d.featured(), d.architectureDescription(), d.architectureDescriptionEn(), d.highlights(), d.highlightsEn(), d.createdAt(), d.updatedAt()); }
    private ProjectDocument toDocument(Project d) { return new ProjectDocument(d.id(), d.slug(), d.name(), d.status(), d.statusEn(), d.shortDescription(), d.shortDescriptionEn(), d.description(), d.descriptionEn(), d.technologies(), d.repositoryUrl(), d.liveUrl(), d.featured(), d.architectureDescription(), d.architectureDescriptionEn(), d.highlights(), d.highlightsEn(), d.createdAt(), d.updatedAt()); }
}
