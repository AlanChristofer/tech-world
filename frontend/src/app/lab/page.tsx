import { SectionHeading } from "@/components/section-heading";
import { DeveloperLab } from "@/features/lab/developer-lab";
import { T } from "@/i18n/language-context";

export const metadata = { title: "Developer Lab" };

export default function LabPage() {
  return <section className="container page"><SectionHeading eyebrow={<T id="lab.eyebrow" />} title={<T id="lab.title" />} description={<T id="lab.description" />} /><DeveloperLab /></section>;
}
