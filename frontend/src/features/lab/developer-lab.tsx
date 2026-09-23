"use client";

import { useMutation } from "@tanstack/react-query";
import { Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { ImplementationInsight } from "@/components/implementation-insight";
import { LazyAvatarGuide } from "@/components/lazy-avatar-guide";
import type { AvatarState } from "@/components/avatar-scene";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/language-context";
import { runLabRequest } from "@/services/api";

const endpoints = ["/api/profile", "/api/projects", "/api/skills"];

export function DeveloperLab() {
  const [endpoint, setEndpoint] = useState(endpoints[0]);
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const request = useMutation({ mutationFn: () => runLabRequest(endpoint) });
  const { t } = useI18n();
  const success = Boolean(request.data && request.data.status >= 200 && request.data.status < 300);
  useEffect(() => {
    if (request.isPending) {
      setAvatarState("working");
      return;
    }
    if (success) {
      setAvatarState("success");
      const timeout = window.setTimeout(() => setAvatarState("idle"), 2400);
      return () => window.clearTimeout(timeout);
    }
    setAvatarState("idle");
  }, [request.isPending, success]);
  return <>
    <LazyAvatarGuide state={avatarState} message={avatarState === "working" ? t("lab.working") : avatarState === "success" ? t("lab.success") : t("avatar.lab.intro")} />
    {(request.isPending || success) && <ol className="lab-runtime-flow" aria-label={t("avatar.lab.flow")}><li>Frontend</li><li>REST</li><li>Spring Boot</li><li>Use Case</li><li>Port</li><li>Adapter</li><li>MongoDB</li></ol>}
    <div className="lab-shell panel"><div className="lab-toolbar"><div className="window-dots"><span /><span /><span /></div><span>public-api.console</span><button onClick={() => request.reset()} aria-label={t("lab.clear")} title={t("lab.clear")}><RotateCcw size={14} aria-hidden /></button></div>
      <div className="lab-body"><div className="endpoint-picker" role="list">{endpoints.map((item) => <button key={item} onClick={() => { setEndpoint(item); request.reset(); }} className={endpoint === item ? "selected" : ""}><span>GET</span>{item}</button>)}</div>
        <div className="request-console"><div className="request-line"><span className="method">GET</span><code>{endpoint}</code><Button onClick={() => request.mutate()} disabled={request.isPending}><Play size={14} aria-hidden /> {request.isPending ? t("lab.running") : t("lab.run")}</Button></div>
          <div className="response-meta">{request.data ? <><span>{t("lab.status")} <strong className={request.data.status < 400 ? "success" : "failure"}>{request.data.status}</strong></span><span>{t("lab.time")} <strong>{request.data.durationMs} ms</strong></span><span>{t("lab.format")} <strong>JSON</strong></span></> : <span>{t("lab.choose")}</span>}</div>
          <pre aria-live="polite">{request.error ? JSON.stringify({ error: request.error.message }, null, 2) : request.data ? JSON.stringify(request.data.body, null, 2) : t("lab.response")}</pre>
        </div></div></div>
    <ImplementationInsight><p>Frontend → REST → Spring Controller → Use Case → Port → Adapter → MongoDB</p></ImplementationInsight>
  </>;
}
