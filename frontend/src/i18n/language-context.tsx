"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { enUS, ptBR, type MessageKey } from "./messages";

export type Language = "pt-BR" | "en-US";
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (key: MessageKey) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt-BR");
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-language");
    if (saved === "en-US" || saved === "pt-BR") setLanguage(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("portfolio-language", language);
  }, [language]);
  const value = useMemo(() => ({ language, setLanguage, t: (key: MessageKey) => (language === "pt-BR" ? ptBR : enUS)[key] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useI18n must be used inside LanguageProvider");
  return context;
}

export function T({ id }: { id: MessageKey }) {
  const { t } = useI18n();
  return <>{t(id)}</>;
}
