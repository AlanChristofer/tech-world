"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { LanguageProvider } from "@/i18n/language-context";
import { AvatarGuideProvider } from "@/components/avatar-guide-context";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } }));
  return <QueryClientProvider client={client}><LanguageProvider><AvatarGuideProvider>{children}</AvatarGuideProvider></LanguageProvider></QueryClientProvider>;
}
