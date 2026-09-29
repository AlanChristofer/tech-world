import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import "./globals.css";

const description = "Portfólio profissional de Alan Christofer. Desenvolvimento de software, APIs, arquitetura, projetos Full Stack e Java Engineering Lab.";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
const socialImage = configuredSiteUrl ? `${configuredSiteUrl}/social-preview` : undefined;

export const metadata: Metadata = {
  title: { default: "Alan Christofer — Tech World", template: "%s — Alan Christofer" },
  description,
  applicationName: "Tech World",
  authors: [{ name: "Alan Christofer" }],
  creator: "Alan Christofer",
  openGraph: {
    title: "Alan Christofer — Tech World",
    description,
    type: "website",
    locale: "pt_BR",
    siteName: "Tech World",
    ...(socialImage ? { images: [{ url: socialImage, width: 1200, height: 630, alt: "Alan Christofer — Tech World" }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "Alan Christofer — Tech World",
    description,
    ...(socialImage ? { images: [socialImage] } : {}),
  },
  ...(configuredSiteUrl ? {
    metadataBase: new URL(configuredSiteUrl),
    alternates: { canonical: "/" },
  } : {}),
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="pt-BR"><body><Providers><SiteHeader /><main>{children}</main><SiteFooter /></Providers></body></html>;
}
