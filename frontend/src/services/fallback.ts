import type { PortfolioData } from "@/types/portfolio";

/** Evita quebrar a navegação sem duplicar no frontend o conteúdo mantido pelo backend. */
export const fallbackData: PortfolioData = {
  profile: {
    id: "profile", name: "Alan Christofer", role: "Software Developer",
    headline: "Backend • Full Stack • APIs • Arquitetura",
    bio: "Desenvolvedor de software com experiência na criação e evolução de sistemas corporativos, APIs, integrações, automações e aplicações Full Stack.",
    location: "", githubUrl: "https://github.com/AlanChristofer/AlanChristofer",
    linkedinUrl: "https://www.linkedin.com/in/alan-christofer-700612227", resumeUrl: "",
  },
  skills: [], experiences: [], projects: [],
};
