"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useAvatarGuide } from "./avatar-guide-context";
import type { AvatarState } from "./avatar-scene";

const AvatarScene = dynamic(() => import("./avatar-scene").then((module) => module.AvatarScene), { ssr: false });

export function LazyAvatarGuide({ state, message, compact = true }: { state: AvatarState; message?: string; compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { onboardingOpen } = useAvatarGuide();
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "120px" });
    observer.observe(element); return () => observer.disconnect();
  }, [onboardingOpen]);
  if (onboardingOpen) return null;
  return <div ref={ref} className="avatar-guide-slot">{visible ? <div className="avatar-contextual-guide"><AvatarScene state={state} compact={compact} />{message && <p className="avatar-context-message" aria-live="polite">{message}</p>}</div> : <div className="avatar-placeholder" />}</div>;
}
