package com.alanchristofer.portfolio.infrastructure.config;

import com.alanchristofer.portfolio.application.port.output.PasswordHashPort;
import com.alanchristofer.portfolio.application.port.output.PortfolioContentPort;
import com.alanchristofer.portfolio.application.port.output.UserAccountPort;
import com.alanchristofer.portfolio.domain.model.Experience;
import com.alanchristofer.portfolio.domain.model.Profile;
import com.alanchristofer.portfolio.domain.model.Project;
import com.alanchristofer.portfolio.domain.model.Skill;
import com.alanchristofer.portfolio.domain.model.UserAccount;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/** Mantém o conteúdo inicial verificável e sincronizado com o portfólio público. */
@Component
public class DevelopmentDataSeeder implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(DevelopmentDataSeeder.class);
    private static final String GITHUB_URL = "https://github.com/AlanChristofer/AlanChristofer";
    private static final String LINKEDIN_URL = "https://www.linkedin.com/in/alan-christofer-700612227";
    private final PortfolioContentPort content;
    private final UserAccountPort users;
    private final PasswordHashPort passwords;
    private final String adminUsername;
    private final String adminPassword;

    public DevelopmentDataSeeder(PortfolioContentPort content, UserAccountPort users, PasswordHashPort passwords,
                                 @Value("${portfolio.admin.username}") String adminUsername,
                                 @Value("${portfolio.admin.password}") String adminPassword) {
        this.content = content;
        this.users = users;
        this.passwords = passwords;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(ApplicationArguments args) {
        seedProfile();
        seedSkills();
        seedExperiences();
        seedProjects();
        seedAdminOnlyWhenConfigured();
    }

    private void seedProfile() {
        Profile current = content.findProfile().orElse(null);
        content.saveProfile(new Profile(current == null ? "profile" : current.id(), "Alan Christofer", "Software Developer",
            "Backend • Full Stack • APIs • Arquitetura",
            "Desenvolvedor de software com experiência na criação e evolução de sistemas corporativos, APIs, integrações, automações e aplicações Full Stack.",
            current == null ? "" : current.location(), GITHUB_URL, LINKEDIN_URL, current == null ? "" : current.resumeUrl()));
    }

    private void seedSkills() {
        Map<String, String> catalog = new LinkedHashMap<>();
        List.of("Java", "Spring Boot", "C#", ".NET", "PHP", "Laravel", "Node.js", "NestJS", "Python").forEach(name -> catalog.put(name, "Backend"));
        List.of("JavaScript", "TypeScript", "React", "Next.js", "HTML5", "CSS3", "TailwindCSS", "Vite").forEach(name -> catalog.put(name, "Frontend"));
        List.of("SQL Server", "PostgreSQL", "MongoDB").forEach(name -> catalog.put(name, "Database"));
        List.of("REST API", "Kafka", "OpenAPI", "Swagger").forEach(name -> catalog.put(name, "Architecture / Integration"));
        List.of("Git", "GitFlow", "Jenkins", "Docker", "Kubernetes", "GitLab CI/CD").forEach(name -> catalog.put(name, "DevOps / Tools"));
        List.of("Cloudflare", "Neon", "Supabase").forEach(name -> catalog.put(name, "Project technologies"));
        List<Skill> current = content.findSkills();
        boolean synchronizedData = current.size() == catalog.size()
            && current.stream().allMatch(skill -> catalog.containsKey(skill.name()) && catalog.get(skill.name()).equals(skill.category()));
        if (synchronizedData) return;
        current.forEach(skill -> content.deleteSkill(skill.id()));
        int order = 0;
        for (Map.Entry<String, String> entry : catalog.entrySet()) {
            content.saveSkill(new Skill(null, entry.getKey(), entry.getValue(), "Applied", order));
            order++;
        }
    }

    private void seedExperiences() {
        Set<String> expectedRoles = Set.of("Analista de Tráfego Pleno", "Analista de Desenvolvimento de Sistemas Júnior / Git Master", "Analista de Desenvolvimento de Sistemas Pleno");
        List<Experience> current = content.findExperiences();
        boolean synchronizedData = current.size() == 3
            && current.stream().allMatch(item -> "PLANSUL – Planejamento e Consultoria".equals(item.company()) && expectedRoles.contains(item.role()))
            && current.stream().filter(item -> "Analista de Tráfego Pleno".equals(item.role())).allMatch(item -> item.startYear() == 2022 && Integer.valueOf(2023).equals(item.endYear()) && item.technologies().isEmpty())
            && current.stream().filter(item -> "Analista de Desenvolvimento de Sistemas Júnior / Git Master".equals(item.role())).allMatch(item -> item.startYear() == 2023 && Integer.valueOf(2025).equals(item.endYear()))
            && current.stream().filter(item -> "Analista de Desenvolvimento de Sistemas Pleno".equals(item.role())).allMatch(item -> item.startYear() == 2025 && item.endYear() == null && item.technologies().containsAll(List.of("Java", "Spring Boot")));
        if (synchronizedData) return;
        current.forEach(item -> content.deleteExperience(item.id()));
        content.saveExperience(new Experience(null, "PLANSUL – Planejamento e Consultoria", "Analista de Tráfego Pleno", "Mid-level Traffic Analyst",
            "Iniciei minha trajetória atuando diretamente com a operação de contact center, acompanhando atendimento, pausas, produtividade e indicadores operacionais. Nesse período comecei a desenvolver painéis e ferramentas internas para resolver problemas reais da operação. O impacto dessas soluções contribuiu diretamente para minha transição para a equipe de Desenvolvimento.",
            "I began my career working directly with contact center operations, monitoring service, breaks, productivity, and operational indicators. During this period, I started developing dashboards and internal tools to solve real operational problems. The impact of these solutions directly contributed to my transition to the Development team.",
            2022, 2023, List.of(),
            List.of("Acompanhamento de operadores, ligações e pausas", "Painéis internos", "Produtividade", "TMA", "SLA", "Nível de atendimento", "Qualidade", "Turnover", "Chats e ferramentas internas"),
            List.of("Monitoring operators, calls, and breaks", "Internal dashboards", "Productivity", "Average handling time", "SLA", "Service level", "Quality", "Turnover", "Chats and internal tools"), 1));
        content.saveExperience(new Experience(null, "PLANSUL – Planejamento e Consultoria", "Analista de Desenvolvimento de Sistemas Júnior / Git Master", "Junior Systems Development Analyst / Git Master",
            "Passei a atuar oficialmente na equipe de Desenvolvimento, participando da criação, manutenção e evolução de aplicações corporativas Full Stack, ferramentas internas, dashboards e automações. Atuei também como Git Master em um dos sistemas da empresa, apoiando o fluxo de integração entre equipes, GitFlow, versionamento e pipelines de CI/CD com Jenkins.",
            "I officially joined the Development team, contributing to the creation, maintenance, and evolution of corporate full-stack applications, internal tools, dashboards, and automations. I also served as Git Master for one of the company’s systems, supporting cross-team integration, GitFlow, version control, and CI/CD pipelines with Jenkins.",
            2023, 2025, List.of("JavaScript", "PHP", "Laravel", "HTML5", "CSS3", "React", "Node.js", "NestJS", "SQL Server", "PostgreSQL", "Python", "GitFlow", "Jenkins"),
            List.of("Automações", "APIs e integrações", "Dashboards", "Participação do levantamento de requisitos à implantação"),
            List.of("Automations", "APIs and integrations", "Dashboards", "Participation from requirements gathering through deployment"), 2));
        content.saveExperience(new Experience(null, "PLANSUL – Planejamento e Consultoria", "Analista de Desenvolvimento de Sistemas Pleno", "Mid-level Systems Development Analyst",
            "Com a evolução para Pleno em 2025, passei a atuar com maior autonomia técnica no desenvolvimento de APIs e sistemas corporativos com Java 21 e Spring Boot, além de novas funcionalidades, sustentação, investigação de incidentes, integrações e evolução de soluções legadas. Também ampliei minha atuação em aplicações C# e .NET.",
            "After progressing to a mid-level role in 2025, I began working with greater technical autonomy on APIs and corporate systems using Java 21 and Spring Boot, alongside new features, application support, incident investigation, integrations, and legacy solution evolution. I also expanded my work with C# and .NET applications.",
            2025, null, List.of("Java", "Spring Boot", "JavaScript", "PHP", "Laravel", "Node.js", "React", "C#", ".NET", "PostgreSQL", "SQL Server", "Python", "Kafka", "OpenAPI", "Swagger", "Git", "GitFlow", "Jenkins", "CI/CD"),
            List.of("Desenvolvimento de APIs com Java 21 e Spring Boot", "Desenvolvimento Full Stack", "Criação de APIs REST do zero", "Manutenção e evolução de APIs", "Gateways", "Integração entre sistemas", "Análise de requisitos", "Implantação", "Sustentação em produção"),
            List.of("API development with Java 21 and Spring Boot", "Full-stack development", "Building REST APIs from scratch", "API maintenance and evolution", "Gateways", "System integration", "Requirements analysis", "Deployment", "Production support"), 3));
    }

    private void seedProjects() {
        Set<String> expectedSlugs = Set.of("vidaplus", "nexo-financeiro", "caraoque");
        List<Project> current = content.findProjects();
        boolean synchronizedData = current.size() == 3 && current.stream().map(Project::slug).collect(java.util.stream.Collectors.toSet()).equals(expectedSlugs);
        if (synchronizedData) return;
        current.forEach(item -> content.deleteProject(item.id()));
        Instant now = Instant.now();
        content.saveProject(new Project(null, "vidaplus", "VidaPlus", "Projeto acadêmico / TCC", "Academic project / Final project",
            "Protótipo front-end de gestão hospitalar e serviços de saúde, desenvolvido como projeto acadêmico.", "Front-end prototype for hospital and healthcare services management, developed as an academic project.",
            "Protótipo front-end de um Sistema de Gestão Hospitalar e de Serviços de Saúde (SGHSS), desenvolvido como projeto acadêmico. A aplicação simula fluxos para diferentes perfis de acesso e centraliza funcionalidades como pacientes, profissionais, agendamentos, prescrições, leitos, estoque, relatórios e uma demonstração de telemedicina. O projeto também explora controle de acesso por perfil, auditoria e conceitos relacionados à LGPD.",
            "Front-end prototype of a Hospital and Healthcare Services Management System (SGHSS), developed as an academic project. The application simulates workflows for different access profiles and centralizes patients, professionals, appointments, prescriptions, beds, inventory, reports, and a telemedicine demonstration. It also explores role-based access control, auditing, and concepts related to Brazil’s data protection law (LGPD).",
            List.of("JavaScript", "HTML5", "CSS3", "sql.js", "localStorage"), "https://github.com/AlanChristofer/VidaPlus", "https://alanchristofer.github.io/VidaPlus/", false,
            "O sistema funciona integralmente no navegador, utilizando JavaScript, HTML e CSS, com sql.js e localStorage para simular persistência de dados sem depender de um backend.", "The system runs entirely in the browser using JavaScript, HTML, and CSS, with sql.js and localStorage simulating data persistence without a backend dependency.", List.of(), List.of(), now, now));
        content.saveProject(new Project(null, "nexo-financeiro", "Nexo Financeiro", "Em desenvolvimento", "In development",
            "Controle financeiro pessoal com autenticação, dashboard e gerenciamento de despesas e categorias.", "Personal finance management with authentication, a dashboard, and expense and category management.",
            "Aplicação de controle financeiro pessoal desenvolvida para centralizar renda, despesas e visão financeira em uma experiência simples e responsiva. O projeto possui autenticação, dashboard financeiro, gerenciamento de despesas e categorias e está sendo evoluído para incorporar metas, simulações e novos recursos de planejamento financeiro.",
            "A personal finance application designed to centralize income, expenses, and financial insights in a simple, responsive experience. It includes authentication, a financial dashboard, and expense and category management, and is being evolved to incorporate goals, simulations, and additional financial planning features.",
            List.of("React", "Vite", "Supabase", "TailwindCSS", "React Router", "Recharts", "PWA"), "", "https://nexo-financeiro.netlify.app/", false,
            "Desenvolvido como aplicação React com Vite, autenticação e serviços através do Supabase, suporte a PWA, navegação com React Router e visualizações financeiras com Recharts.", "Built as a React application with Vite, authentication and services through Supabase, PWA support, React Router navigation, and financial visualizations with Recharts.", List.of(), List.of(), now, now));
        content.saveProject(new Project(null, "caraoque", "Caraôque?", "Em produção", "Production",
            "Plataforma Full Stack de karaokê para gerenciar sessões, participantes, músicas, pontuação e ranking.", "Full-stack karaoke platform for managing sessions, participants, songs, scoring, and rankings.",
            "Plataforma Full Stack de karaokê criada para gerenciar uma sessão completa, desde a organização do evento e da fila de participantes até pesquisa de músicas, reprodução, avaliação vocal, pontuação, ranking e histórico de apresentações.",
            "A full-stack karaoke platform created to manage an entire session, from event organization and participant queues to song search, playback, vocal assessment, scoring, rankings, and performance history.",
            List.of("React", "Vite", "Node.js", "Express", "PostgreSQL", "Neon", "YouTube Data API", "Mercado Pago", "Cloudflare"), "", "https://clubkaraoke.uk/", true,
            "A solução utiliza React e Vite no front-end, Node.js e Express na API e PostgreSQL para persistência. Integra YouTube Data API, autenticação, controle de acesso, pagamentos e recursos de análise vocal através do áudio autorizado do microfone. O backend também aplica práticas como validação, idempotência, cache, rate limiting, tratamento centralizado de erros e controle de concorrência.", "The solution uses React and Vite on the front end, Node.js and Express for the API, and PostgreSQL for persistence. It integrates the YouTube Data API, authentication, access control, payments, and vocal analysis based exclusively on authorized microphone input. The backend also applies validation, idempotency, caching, rate limiting, centralized error handling, and concurrency control.", List.of(), List.of(), now, now));
    }

    private void seedAdminOnlyWhenConfigured() {
        if (users.count() > 0) return;
        if (adminPassword == null || adminPassword.isBlank()) { log.warn("ADMIN_PASSWORD is empty; administrative login was not created"); return; }
        users.save(new UserAccount(null, adminUsername, passwords.hash(adminPassword), Set.of("ADMIN")));
        log.info("Administrative account created from environment configuration");
    }
}
