import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Alan Christofer — Software Developer", template: "%s — Alan Christofer" },
  description: "Portfólio Full Stack com arquitetura e laboratório de API.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="pt-BR"><body><Providers><SiteHeader /><main>{children}</main><SiteFooter /></Providers></body></html>;
}
