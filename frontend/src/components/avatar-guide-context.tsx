"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowRight, Compass, X } from "lucide-react";
import { useI18n } from "@/i18n/language-context";
import type { AvatarState } from "./avatar-scene";

const AvatarScene = dynamic(() => import("./avatar-scene").then((module) => module.AvatarScene), {
  ssr: false,
  loading: () => <div className="onboarding-avatar-loading" aria-hidden />,
});

const ONBOARDING_KEY = "portfolioOnboardingCompleted";
type OnboardingStatus = "checking" | "open" | "closing" | "closed";
type AvatarGuideContextValue = { onboardingOpen: boolean; replayOnboarding: () => void };

const AvatarGuideContext = createContext<AvatarGuideContextValue | null>(null);

const guideDestinations = [
  { label: "avatar.guide.journey", href: "/experience", state: "explaining" },
  { label: "avatar.guide.projects", href: "/projects", state: "pointRight" },
  { label: "avatar.guide.skills", href: "/skills", state: "explaining" },
  { label: "avatar.guide.architecture", href: "/architecture", state: "explaining" },
  { label: "avatar.guide.how", href: "/about#avatar-guide", state: "thinking" },
] as const;

export function AvatarGuideProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [status, setStatus] = useState<OnboardingStatus>("checking");
  const [avatarState, setAvatarState] = useState<AvatarState>("greeting");
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    setStatus(localStorage.getItem(ONBOARDING_KEY) === "true" ? "closed" : "open");
  }, []);

  useEffect(() => {
    if (status !== "open") return;
    setAvatarState("greeting");
    const timeout = window.setTimeout(() => setAvatarState("explaining"), 1800);
    return () => window.clearTimeout(timeout);
  }, [status]);

  useEffect(() => {
    document.body.classList.toggle("onboarding-open", status === "checking" || status === "open" || status === "closing");
    return () => document.body.classList.remove("onboarding-open");
  }, [status]);

  useEffect(() => setGuideOpen(false), [pathname]);

  const completeOnboarding = useCallback((destination: string) => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setStatus("closing");
    window.setTimeout(() => {
      setStatus("closed");
      router.push(destination);
    }, 280);
  }, [router]);

  const replayOnboarding = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY);
    setGuideOpen(false);
    setStatus("open");
    router.push("/");
  }, [router]);

  const contextValue = useMemo(() => ({
    onboardingOpen: status !== "closed",
    replayOnboarding,
  }), [replayOnboarding, status]);

  const navigateFromGuide = (href: string, state: AvatarState) => {
    setAvatarState(state);
    setGuideOpen(false);
    router.push(href);
  };

  return (
    <AvatarGuideContext.Provider value={contextValue}>
      {children}

      {status !== "closed" && (
        <section
          className={`onboarding-screen${status === "closing" ? " is-closing" : ""}`}
          aria-label={t("avatar.onboarding.label")}
          aria-busy={status === "checking"}
        >
          {status === "checking" ? (
            <div className="onboarding-checking"><span />{t("avatar.preparing")}</div>
          ) : (
            <div className="onboarding-inner">
              <div className="onboarding-avatar">
                <AvatarScene state={avatarState} variant="onboarding" />
              </div>
              <div className="onboarding-copy">
                <span className="eyebrow">Developer Command Center</span>
                <h1>{t("avatar.onboarding.greeting")}</h1>
                <p>{t("avatar.onboarding.intro")}</p>
                <div className="onboarding-actions">
                  <button
                    type="button"
                    onMouseEnter={() => setAvatarState("pointRight")}
                    onMouseLeave={() => setAvatarState("explaining")}
                    onFocus={() => setAvatarState("pointRight")}
                    onBlur={() => setAvatarState("explaining")}
                    onClick={() => completeOnboarding("/experience")}
                  >
                    {t("avatar.onboarding.journey")}<ArrowRight size={16} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onMouseEnter={() => setAvatarState("pointRight")}
                    onMouseLeave={() => setAvatarState("explaining")}
                    onFocus={() => setAvatarState("pointRight")}
                    onBlur={() => setAvatarState("explaining")}
                    onClick={() => completeOnboarding("/projects")}
                  >
                    {t("avatar.onboarding.projects")}<ArrowRight size={16} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onMouseEnter={() => setAvatarState("pointRight")}
                    onMouseLeave={() => setAvatarState("explaining")}
                    onFocus={() => setAvatarState("pointRight")}
                    onBlur={() => setAvatarState("explaining")}
                    onClick={() => completeOnboarding("/recruiter")}
                  >
                    {t("avatar.onboarding.recruiter")}<ArrowRight size={16} aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {status === "closed" && pathname !== "/recruiter" && (
        <aside className={`floating-guide${guideOpen ? " is-open" : ""}`}>
          {guideOpen && (
            <div className="floating-guide-panel" role="dialog" aria-label={t("avatar.guide.title")}>
              <div className="floating-guide-heading">
                <div><span>Alan</span><strong>{t("avatar.guide.title")}</strong></div>
                <button type="button" onClick={() => setGuideOpen(false)} aria-label={t("avatar.guide.close")}><X size={16} /></button>
              </div>
              <nav aria-label={t("avatar.guide.title")}>
                {guideDestinations.map((item) => (
                  <button key={item.href} type="button" onClick={() => navigateFromGuide(item.href, item.state)}>
                    {t(item.label)}<ArrowRight size={14} aria-hidden />
                  </button>
                ))}
              </nav>
            </div>
          )}
          <button
            type="button"
            className="floating-guide-trigger"
            onClick={() => setGuideOpen((current) => !current)}
            aria-expanded={guideOpen}
            aria-label={t("avatar.guide.label")}
          >
            <span>AC</span><Compass size={16} aria-hidden />{t("avatar.guide.short")}
          </button>
        </aside>
      )}
    </AvatarGuideContext.Provider>
  );
}

export function useAvatarGuide() {
  const context = useContext(AvatarGuideContext);
  if (!context) throw new Error("useAvatarGuide must be used inside AvatarGuideProvider");
  return context;
}
