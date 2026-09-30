"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Menu, Moon, Sun, X } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useI18n } from "@/i18n/language-context";
import { useTheme } from "@/components/theme-context";
import { worldCopy } from "@/i18n/world-messages";

export function SiteHeader() {
  const { language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const copy = worldCopy[language];
  const [mobileOpen, setMobileOpen] = useState(false);
  return <header className="site-header">
    <Link href="/" className="brand" aria-label="Tech World — portfólio de Alan Christofer">
      <img className="brand-mark" src="/branding/tech-world-mark.svg" width="40" height="40" alt="" aria-hidden="true" />
      <span className="brand-copy"><strong>Tech World</strong><small>Alan Christofer</small></span>
    </Link>
    <div className="header-actions">
      <button className="theme-switch" type="button" onClick={toggleTheme} aria-label={theme === "dark" ? (language === "pt-BR" ? "Ativar modo claro" : "Enable light mode") : (language === "pt-BR" ? "Ativar modo escuro" : "Enable dark mode")} title={theme === "dark" ? (language === "pt-BR" ? "Modo claro" : "Light mode") : (language === "pt-BR" ? "Modo escuro" : "Dark mode")}>{theme === "dark" ? <Sun /> : <Moon />}</button>
      <div className="language-switch" role="group" aria-label={language === "pt-BR" ? "Idioma" : "Language"}><button className={language === "pt-BR" ? "active" : ""} onClick={() => setLanguage("pt-BR")} aria-pressed={language === "pt-BR"}>PT</button><span>|</span><button className={language === "en-US" ? "active" : ""} onClick={() => setLanguage("en-US")} aria-pressed={language === "en-US"}>EN</button></div>
      <Link className="mode-link" href="/recruiter">{copy.nav.recruiter}</Link>
    </div>
    <button className="mobile-menu-trigger" type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}>{mobileOpen ? <X /> : <Menu />}</button>
    {mobileOpen && <div className="mobile-menu" id="mobile-navigation"><div className="mobile-menu-actions"><div className="mobile-theme-language"><button className="theme-switch" type="button" onClick={toggleTheme} aria-label={theme === "dark" ? (language === "pt-BR" ? "Ativar modo claro" : "Enable light mode") : (language === "pt-BR" ? "Ativar modo escuro" : "Enable dark mode")}>{theme === "dark" ? <Sun /> : <Moon />}</button><div className="language-switch"><button className={language === "pt-BR" ? "active" : ""} onClick={() => setLanguage("pt-BR")}>PT</button><span>|</span><button className={language === "en-US" ? "active" : ""} onClick={() => setLanguage("en-US")}>EN</button></div></div><div className="mobile-menu-links"><Link href="/recruiter" onClick={() => setMobileOpen(false)}>{copy.nav.recruiter}</Link></div></div></div>}
  </header>;
}

export function SiteFooter() {
  const { language } = useI18n();
  const copy = worldCopy[language];
  return <footer className="footer"><span>v2.0 &nbsp; Built with coffee and purpose ☕</span><div className="footer-right"><span><i /> {copy.online}</span><a href="https://github.com/AlanChristofer" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a><a href="https://www.linkedin.com/in/alan-christofer-700612227" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a><Link href="/?destination=contact" aria-label={copy.nav.contact}><Mail /></Link></div></footer>;
}
