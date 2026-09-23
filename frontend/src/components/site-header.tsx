"use client";

import Link from "next/link";
import { useAvatarGuide } from "@/components/avatar-guide-context";
import { useI18n } from "@/i18n/language-context";
import type { MessageKey } from "@/i18n/messages";

const links: Array<[MessageKey, string]> = [
  ["nav.about", "/about"], ["nav.experience", "/experience"], ["nav.skills", "/skills"], ["nav.projects", "/projects"],
  ["nav.architecture", "/architecture"], ["nav.lab", "/lab"], ["nav.contact", "/contact"],
];

export function SiteHeader() {
  const { language, setLanguage, t } = useI18n();
  return <header className="site-header">
    <Link href="/" className="brand" aria-label={`${t("nav.home")} · Alan Christofer`}><span className="brand-mark">AC</span><span>command.center</span></Link>
    <nav className="nav-links" aria-label={t("nav.primary")}>{links.map(([label, href]) => <Link key={href} href={href}>{t(label)}</Link>)}</nav>
    <div className="header-actions">
      <div className="language-switch" role="group" aria-label={t("language.label")}><button className={language === "pt-BR" ? "active" : ""} onClick={() => setLanguage("pt-BR")} aria-pressed={language === "pt-BR"}>PT</button><span aria-hidden>|</span><button className={language === "en-US" ? "active" : ""} onClick={() => setLanguage("en-US")} aria-pressed={language === "en-US"}>EN</button></div>
      <Link className="mode-link" href="/recruiter">{t("nav.recruiter")} <span aria-hidden>↗</span></Link>
    </div>
  </header>;
}

export function SiteFooter() {
  const { t } = useI18n();
  const { replayOnboarding } = useAvatarGuide();
  return <footer className="footer"><span>Alan Christofer · Software Developer</span><span>{t("footer.built")}</span><button type="button" className="replay-onboarding" onClick={replayOnboarding}>{t("avatar.onboarding.replay")}</button></footer>;
}
