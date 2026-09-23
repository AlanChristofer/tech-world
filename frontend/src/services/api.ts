import { fallbackData } from "./fallback";
import type { Architecture, Experience, LabResult, PortfolioData, Profile, Project, Skill } from "@/types/portfolio";

const serverApiUrl = process.env.API_URL ?? "http://localhost:8080";
const browserApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function get<T>(path: string, baseUrl = serverApiUrl): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { next: { revalidate: 60 }, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
  return response.json() as Promise<T>;
}

/** Centraliza o fallback para que indisponibilidade local do backend não quebre a apresentação. */
export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const [profile, skills, experiences, projects] = await Promise.all([
      get<Profile>("/api/profile"), get<Skill[]>("/api/skills"),
      get<Experience[]>("/api/experiences"), get<Project[]>("/api/projects"),
    ]);
    return { profile, skills, experiences, projects };
  } catch {
    return fallbackData;
  }
}

export async function getProject(slug: string): Promise<Project | undefined> {
  try { return await get<Project>(`/api/projects/${encodeURIComponent(slug)}`); }
  catch { return fallbackData.projects.find((project) => project.slug === slug); }
}

export async function getArchitecture(): Promise<Architecture> {
  try { return await get<Architecture>("/api/architecture"); }
  catch { return { style: "Clean Architecture + Hexagonal", flow: ["Next.js", "REST API", "Spring Boot", "Application / Use Cases", "Domain", "Ports", "MongoDB Adapter"], principles: ["Dependency inversion", "Constructor injection", "Domain without framework dependencies"] }; }
}

const allowedLabEndpoints = new Set(["/api/profile", "/api/projects", "/api/skills"]);

export async function runLabRequest(endpoint: string): Promise<LabResult> {
  if (!allowedLabEndpoints.has(endpoint)) throw new Error("Endpoint is not allowed in Developer Lab");
  const startedAt = performance.now();
  const response = await fetch(`${browserApiUrl}${endpoint}`, { headers: { Accept: "application/json" } });
  const body = await response.json().catch(() => ({ message: "Response is not JSON" }));
  return { endpoint, method: "GET", status: response.status, durationMs: Math.round(performance.now() - startedAt), body };
}
