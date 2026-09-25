import type { LucideIcon } from "lucide-react";
import { Boxes, BriefcaseBusiness, Database, Globe2, Heart, Mail, Network, UserRound } from "lucide-react";

export type DestinationId = "global" | "about" | "career" | "projects" | "skills" | "architecture" | "contact";

export type Destination = {
  id: DestinationId;
  latitude: number;
  longitude: number;
  labelOffset: [number, number];
  icon: LucideIcon;
};

export type MarkerDestinationId = Exclude<DestinationId, "global"> | "recruiter";

export type GlobeMarker = {
  key: string;
  id: MarkerDestinationId;
  latitude: number;
  longitude: number;
  labelOffset: [number, number];
  icon: LucideIcon;
  color: string;
  href?: string;
};

export const destinations: Destination[] = [
  { id: "global", latitude: 5, longitude: -28, labelOffset: [0, 0], icon: Globe2 },
  { id: "projects", latitude: 68, longitude: 0, labelOffset: [-48, -30], icon: Boxes },
  { id: "skills", latitude: 52, longitude: 138, labelOffset: [48, -26], icon: Database },
  { id: "architecture", latitude: 40, longitude: -85, labelOffset: [-58, -8], icon: Network },
  { id: "career", latitude: 30, longitude: 53, labelOffset: [52, -8], icon: BriefcaseBusiness },
  { id: "contact", latitude: 21, longitude: -170, labelOffset: [-54, 16], icon: Mail },
  { id: "about", latitude: 4, longitude: 105, labelOffset: [54, -8], icon: Heart },
];

export const globeMarkers: GlobeMarker[] = [
  // Fourteen evenly distributed points preserve comfortable spacing after adding About.
  { key: "projects-1", id: "projects", latitude: 68, longitude: 0, labelOffset: [-48, -30], icon: Boxes, color: "#ff6b6b" },
  { key: "skills-1", id: "skills", latitude: 52, longitude: 138, labelOffset: [48, -26], icon: Database, color: "#56c8ff" },
  { key: "architecture-1", id: "architecture", latitude: 40, longitude: -85, labelOffset: [-58, -8], icon: Network, color: "#aa8cff" },
  { key: "career-1", id: "career", latitude: 30, longitude: 53, labelOffset: [52, -8], icon: BriefcaseBusiness, color: "#ffc857" },
  { key: "contact-1", id: "contact", latitude: 21, longitude: -170, labelOffset: [-54, 16], icon: Mail, color: "#ff78c6" },
  { key: "recruiter-1", id: "recruiter", latitude: 12, longitude: -33, labelOffset: [-58, 15], icon: UserRound, color: "#55f6cf", href: "/recruiter" },
  { key: "about-1", id: "about", latitude: 4, longitude: 105, labelOffset: [54, -8], icon: Heart, color: "#ff9f68" },
  { key: "projects-2", id: "projects", latitude: -4, longitude: -118, labelOffset: [-58, 8], icon: Boxes, color: "#ff6b6b" },
  { key: "skills-2", id: "skills", latitude: -12, longitude: 20, labelOffset: [56, 8], icon: Database, color: "#56c8ff" },
  { key: "architecture-2", id: "architecture", latitude: -21, longitude: 158, labelOffset: [48, 18], icon: Network, color: "#aa8cff" },
  { key: "career-2", id: "career", latitude: -30, longitude: -65, labelOffset: [-52, 20], icon: BriefcaseBusiness, color: "#ffc857" },
  { key: "contact-2", id: "contact", latitude: -40, longitude: 73, labelOffset: [46, 22], icon: Mail, color: "#ff78c6" },
  { key: "recruiter-2", id: "recruiter", latitude: -52, longitude: -150, labelOffset: [-50, 24], icon: UserRound, color: "#55f6cf", href: "/recruiter" },
  { key: "about-2", id: "about", latitude: -68, longitude: -13, labelOffset: [44, 28], icon: Heart, color: "#ff9f68" },
];

export const destinationIds = destinations.map(({ id }) => id);

export function isDestinationId(value: string | null): value is DestinationId {
  return destinationIds.includes(value as DestinationId);
}
