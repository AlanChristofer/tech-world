import { ArchitectureMap } from "@/features/architecture/architecture-map";
import { getArchitecture } from "@/services/api";

export const metadata = { title: "Architecture Lab" };

export default async function ArchitecturePage() {
  const architecture = await getArchitecture();
  return <ArchitectureMap architecture={architecture} />;
}
