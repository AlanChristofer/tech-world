import { Suspense } from "react";
import { TechWorld } from "@/features/globe/tech-world";
import { getPortfolioData } from "@/services/api";

export default async function HomePage() {
  const data = await getPortfolioData();
  return <Suspense fallback={<div className="world-page-loading">ALAN CHRISTOFER — TECH WORLD</div>}><TechWorld data={data} /></Suspense>;
}
