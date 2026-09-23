import { RecruiterView } from "@/components/localized-views";
import { getPortfolioData } from "@/services/api";

export const metadata = { title: "Modo Recrutador / Recruiter Mode" };
export default async function RecruiterPage() { const data = await getPortfolioData(); return <RecruiterView {...data} />; }
