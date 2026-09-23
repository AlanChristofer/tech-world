"use client";

import { Environment, useAnimations, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { Box3, MathUtils, Vector3, type Group, type PerspectiveCamera } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useI18n } from "@/i18n/language-context";

export type AvatarState =
  | "idle"
  | "greeting"
  | "explaining"
  | "pointLeft"
  | "pointRight"
  | "thinking"
  | "working"
  | "success";

const MODEL_PATH = "/models/model.glb";
const VIEWPORT_FILL = 0.8;

function AvatarModel({ onReady, motionReduced }: { onReady: () => void; motionReduced: boolean }) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL_PATH);
  const model = useMemo(() => clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);
  const camera = useThree((context) => context.camera) as PerspectiveCamera;
  const viewportSize = useThree((context) => context.size);

  const bounds = useMemo(() => {
    model.updateMatrixWorld(true);
    const box = new Box3().setFromObject(model);
    return {
      center: box.getCenter(new Vector3()),
      size: box.getSize(new Vector3()),
    };
  }, [model]);

  useLayoutEffect(() => {
    const avatarHeight = Math.max(bounds.size.y, 0.001);
    const avatarWidth = Math.max(bounds.size.x, 0.001);
    const aspect = Math.max(viewportSize.width / Math.max(viewportSize.height, 1), 0.001);
    const verticalFov = MathUtils.degToRad(camera.fov);
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
    const heightDistance = avatarHeight / (2 * Math.tan(verticalFov / 2) * VIEWPORT_FILL);
    const widthDistance = avatarWidth / (2 * Math.tan(horizontalFov / 2) * 0.84);
    const distance = Math.max(heightDistance, widthDistance);

    camera.position.set(bounds.center.x, bounds.center.y, bounds.center.z + distance);
    camera.near = Math.max(0.01, distance / 100);
    camera.far = Math.max(100, distance * 20 + bounds.size.z);
    camera.lookAt(bounds.center);
    camera.updateProjectionMatrix();
    onReady();
  }, [bounds, camera, onReady, viewportSize.height, viewportSize.width]);

  useEffect(() => {
    const action = names[0] ? actions[names[0]] : undefined;
    action?.play();
    if (action) action.paused = motionReduced;
    return () => {
      action?.stop();
    };
  }, [actions, motionReduced, names]);

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}

function AvatarPreparing() {
  const { t } = useI18n();

  return (
    <div className="avatar-preparing" role="status">
      <span className="avatar-preparing-signal" aria-hidden="true" />
      <p>{t("avatar.preparing")}</p>
    </div>
  );
}

class AvatarBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function AvatarCanvas({
  mobile,
  motionReduced,
  pageVisible,
  onReady,
}: {
  mobile: boolean;
  motionReduced: boolean;
  pageVisible: boolean;
  onReady: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.9, 3], fov: 38 }}
      dpr={mobile ? 1 : [1, 1.25]}
      frameloop={pageVisible ? "always" : "never"}
      performance={{ min: 0.6 }}
      gl={{ antialias: !mobile }}
    >
      <ambientLight intensity={1.35} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color="#fffaf2" />
      <directionalLight position={[-3, 2, -4]} intensity={1.15} color="#73efc2" />
      <Suspense fallback={null}>
        <AvatarModel onReady={onReady} motionReduced={motionReduced} />
        <Environment preset="city" environmentIntensity={0.55} />
      </Suspense>
    </Canvas>
  );
}

export function AvatarScene({
  state = "idle",
  message,
  compact = false,
  variant = "contextual",
}: {
  state?: AvatarState;
  message?: string;
  compact?: boolean;
  variant?: "contextual" | "onboarding";
}) {
  const { t } = useI18n();
  const [mobile, setMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [modelAvailable, setModelAvailable] = useState(false);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 700px)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setMobile(mobileQuery.matches);
      setReducedMotion(reducedQuery.matches);
    };
    update();
    mobileQuery.addEventListener("change", update);
    reducedQuery.addEventListener("change", update);
    return () => {
      mobileQuery.removeEventListener("change", update);
      reducedQuery.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    let active = true;
    const checkModel = async () => {
      try {
        const response = await fetch(MODEL_PATH, { method: "HEAD", cache: "no-store" });
        if (active) setModelAvailable(response.ok);
      } catch {
        if (active) setModelAvailable(false);
      }
    };
    void checkModel();
    return () => {
      active = false;
    };
  }, []);

  const handleReady = useCallback(() => setModelReady(true), []);
  const handleFailure = useCallback(() => {
    setModelReady(false);
    setModelAvailable(false);
  }, []);

  return (
    <div
      className={`avatar-shell${compact ? " avatar-compact" : ""}${variant === "onboarding" ? " avatar-onboarding" : ""}`}
      aria-label={t("avatar.label")}
      data-avatar-state={state}
    >
      <div className="avatar-grid" />
      {modelAvailable ? (
        <AvatarBoundary fallback={<AvatarPreparing />} onFailure={handleFailure}>
          <AvatarCanvas mobile={mobile} motionReduced={reducedMotion} pageVisible={pageVisible} onReady={handleReady} />
        </AvatarBoundary>
      ) : (
        <AvatarPreparing />
      )}
      {modelAvailable && !modelReady && <AvatarPreparing />}
      {message && <p className="avatar-message" aria-live="polite">{message}</p>}
      <div className="avatar-label"><span /> {t("avatar.fallback")}</div>
    </div>
  );
}
