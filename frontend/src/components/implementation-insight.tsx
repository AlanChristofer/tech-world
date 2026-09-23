"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/i18n/language-context";

export function ImplementationInsight({ children, behind = false }: { children: ReactNode; behind?: boolean }) {
  const { t } = useI18n();
  return <details className="implementation-insight"><summary>{t(behind ? "insight.behind" : "insight.title")}</summary><div>{children}</div></details>;
}
