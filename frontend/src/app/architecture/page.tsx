import { SectionHeading } from "@/components/section-heading";
import { ArchitectureMap } from "@/features/architecture/architecture-map";
import { getArchitecture } from "@/services/api";
import { T } from "@/i18n/language-context";

export const metadata = { title: "Architecture Lab" };

export default async function ArchitecturePage() {
  const architecture = await getArchitecture();
  return <section className="container page"><SectionHeading eyebrow={<T id="architecture.eyebrow" />} title={<T id="architecture.title" />} description={<T id="architecture.description" />} /><ArchitectureMap architecture={architecture} /></section>;
}
