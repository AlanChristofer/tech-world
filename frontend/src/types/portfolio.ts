export type Profile = {
  id: string;
  name: string;
  role: string;
  headline: string;
  bio: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
};

export type Skill = { id: string; name: string; category: string; level: string; order: number };

export type Experience = {
  id: string;
  company: string;
  role: string;
  roleEn: string;
  description: string;
  descriptionEn: string;
  startYear: number;
  endYear: number | null;
  technologies: string[];
  highlights: string[];
  highlightsEn: string[];
  order: number;
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  status: string;
  statusEn: string;
  shortDescription: string;
  shortDescriptionEn: string;
  description: string;
  descriptionEn: string;
  technologies: string[];
  repositoryUrl: string;
  liveUrl: string;
  featured: boolean;
  architectureDescription: string;
  architectureDescriptionEn: string;
  highlights: string[];
  highlightsEn: string[];
  createdAt: string;
  updatedAt: string;
};

export type Architecture = { style: string; flow: string[]; principles: string[] };
export type PortfolioData = { profile: Profile; skills: Skill[]; experiences: Experience[]; projects: Project[] };
export type LabResult = { endpoint: string; method: "GET"; status: number; durationMs: number; body: unknown };
