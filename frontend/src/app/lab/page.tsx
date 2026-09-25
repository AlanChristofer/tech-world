import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { DeveloperLab } from "@/features/lab/developer-lab";
import { T } from "@/i18n/language-context";

export const metadata = { title: "Developer Lab" };

export default function LabPage() {
  return <section className="container page"><Link href="/?destination=architecture" className="back-link"><ArrowLeft size={15} aria-hidden /> Voltar ao globo</Link><SectionHeading eyebrow={<T id="lab.eyebrow" />} title={<T id="lab.title" />} description={<T id="lab.description" />} /><DeveloperLab /></section>;
}
