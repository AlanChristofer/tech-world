import { ContactView } from "@/components/localized-views";
import { getPortfolioData } from "@/services/api";

export const metadata = { title: "Contato / Contact" };
export default async function ContactPage() { const { profile } = await getPortfolioData(); return <ContactView profile={profile} />; }
