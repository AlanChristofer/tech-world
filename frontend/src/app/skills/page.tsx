import { SkillsView } from "@/components/localized-views";
import { getPortfolioData } from "@/services/api";

export const metadata = { title: "Habilidades / Skills" };
export default async function SkillsPage() { const { skills } = await getPortfolioData(); return <SkillsView skills={skills} />; }
