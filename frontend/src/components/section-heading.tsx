import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, description }: { eyebrow: ReactNode; title: ReactNode; description?: ReactNode }) {
  return <div className="section-heading"><span className="eyebrow">// {eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>;
}
