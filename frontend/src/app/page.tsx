import { HomeView } from "@/components/localized-views";
import { getPortfolioData } from "@/services/api";

export default async function HomePage() { const { profile, projects } = await getPortfolioData(); return <HomeView profile={profile} projects={projects} />; }
