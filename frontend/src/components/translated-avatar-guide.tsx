"use client";

import { LazyAvatarGuide } from "@/components/lazy-avatar-guide";
import { useI18n } from "@/i18n/language-context";
import type { MessageKey } from "@/i18n/messages";
import type { AvatarState } from "./avatar-scene";

export function TranslatedAvatarGuide({ state, message }: { state: AvatarState; message: MessageKey }) {
  const { t } = useI18n();
  return <LazyAvatarGuide state={state} message={t(message)} />;
}
