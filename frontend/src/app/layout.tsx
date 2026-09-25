import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Alan Christofer — Tech World", template: "%s — Alan Christofer" },
  description: "Portfólio de Alan Christofer: desenvolvimento de software, APIs e arquitetura.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="pt-BR"><body><Providers><SiteHeader /><main>{children}</main><SiteFooter /></Providers></body></html>;
}
