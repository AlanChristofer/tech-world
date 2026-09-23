import Link from "next/link";
import { Button } from "@/components/ui/button";
import { T } from "@/i18n/language-context";

export default function NotFound() {
  return <section className="container page"><div className="empty-state"><strong><T id="notFound.title" /></strong><T id="notFound.text" /><div style={{ marginTop: 24 }}><Button asChild><Link href="/"><T id="notFound.back" /></Link></Button></div></div></section>;
}
