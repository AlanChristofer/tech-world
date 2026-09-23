import { ExperienceView } from "@/components/localized-views";
import { getPortfolioData } from "@/services/api";

export const metadata = { title: "Experiência / Experience" };
export default async function ExperiencePage() { const { experiences } = await getPortfolioData(); return <ExperienceView experiences={experiences} />; }
