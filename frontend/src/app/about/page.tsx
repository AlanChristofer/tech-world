import { AboutView } from "@/components/localized-views";
import { getPortfolioData } from "@/services/api";

export const metadata = { title: "Sobre / About" };
export default async function AboutPage() { const { profile } = await getPortfolioData(); return <AboutView profile={profile} />; }
