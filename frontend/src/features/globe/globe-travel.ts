"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { destinations, type DestinationId } from "./destinations";

export type TravelLocation = { latitude: number; longitude: number };

export type TravelPhase =
  | "idle"
  | "focusingOrigin"
  | "drawingRoute"
  | "readyForDeparture"
  | "flying"
  | "arriving"
  | "destination"
  | "returning";

export type GlobeNavigation = {
  phase: TravelPhase;
  from: DestinationId;
  to: DestinationId;
  fromLocation: TravelLocation;
  toLocation: TravelLocation;
  nonce: number;
  originVisible: boolean | null;
};

export type TravelTimings = {
  focusHidden: number;
  focusVisible: number;
  drawRoute: number;
  ready: number;
  flight: number;
  arrival: number;
  return: number;
};

export function getTravelTimings(mobile: boolean, reducedMotion: boolean): TravelTimings {
  if (reducedMotion) return { focusHidden: 120, focusVisible: 80, drawRoute: 120, ready: 80, flight: 0, arrival: 220, return: 280 };
  if (mobile) return { focusHidden: 760, focusVisible: 520, drawRoute: 620, ready: 340, flight: 1800, arrival: 520, return: 850 };
  return { focusHidden: 860, focusVisible: 620, drawRoute: 720, ready: 380, flight: 2350, arrival: 560, return: 1000 };
}

const lockedPhases = new Set<TravelPhase>([
  "focusingOrigin",
  "drawingRoute",
  "readyForDeparture",
  "flying",
  "arriving",
  "returning",
]);

function locationFor(id: DestinationId): TravelLocation {
  const destination = destinations.find((item) => item.id === id) ?? destinations[0];
  return { latitude: destination.latitude, longitude: destination.longitude };
}

export function useGlobeTravel(initial: DestinationId) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [selected, setSelected] = useState<DestinationId>(initial);
  const initialLocation = locationFor(initial);
  const [navigation, setNavigation] = useState<GlobeNavigation>({
    phase: initial === "global" ? "idle" : "destination",
    from: initial,
    to: initial,
    fromLocation: initialLocation,
    toLocation: initialLocation,
    nonce: 0,
    originVisible: true,
  });
  const navigationRef = useRef(navigation);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const viewport = window.matchMedia("(max-width: 620px)");
    const update = () => {
      setReducedMotion(motion.matches);
      setMobile(viewport.matches);
    };
    update();
    motion.addEventListener("change", update);
    viewport.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      viewport.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => { navigationRef.current = navigation; }, [navigation]);

  useEffect(() => {
    const timings = getTravelTimings(mobile, reducedMotion);
    let delay: number | null = null;
    let next: TravelPhase | null = null;

    if (navigation.phase === "focusingOrigin") {
      if (navigation.originVisible === null) return;
      delay = navigation.originVisible ? timings.focusVisible : timings.focusHidden;
      next = "drawingRoute";
    }
    if (navigation.phase === "drawingRoute") { delay = timings.drawRoute; next = "readyForDeparture"; }
    if (navigation.phase === "readyForDeparture") { delay = timings.ready; next = "flying"; }
    if (navigation.phase === "flying") { delay = timings.flight; next = "arriving"; }
    if (navigation.phase === "arriving") { delay = timings.arrival; next = "destination"; }
    if (navigation.phase === "returning") { delay = timings.return; next = "idle"; }
    if (delay === null || next === null) return;

    const timer = window.setTimeout(() => {
      if (next === "idle") {
        const globalLocation = locationFor("global");
        setSelected("global");
        setNavigation((current) => ({ phase: "idle", from: "global", to: "global", fromLocation: globalLocation, toLocation: globalLocation, nonce: current.nonce, originVisible: true }));
        return;
      }
      setNavigation((current) => ({ ...current, phase: next as TravelPhase }));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [mobile, navigation.originVisible, navigation.phase, navigation.nonce, reducedMotion]);

  const reportOriginVisibility = useCallback((nonce: number, visible: boolean) => {
    setNavigation((current) => current.nonce === nonce && current.phase === "focusingOrigin" && current.originVisible === null
      ? { ...current, originVisible: visible }
      : current);
  }, []);

  const select = useCallback((next: DestinationId, requestedLocation?: TravelLocation) => {
    const current = navigationRef.current;
    if (lockedPhases.has(current.phase)) return;
    if (next === current.to && ((next === "global" && current.phase === "idle") || current.phase === "destination")) return;

    if (next === "global") {
      window.history.replaceState({}, "", "/");
      setNavigation({ phase: "returning", from: current.to, to: "global", fromLocation: current.toLocation, toLocation: locationFor("global"), nonce: Date.now(), originVisible: true });
      return;
    }

    const origin = current.to === "global" ? "global" : current.to;
    const targetLocation = requestedLocation ?? locationFor(next);
    setSelected(next);
    setNavigation({ phase: "focusingOrigin", from: origin, to: next, fromLocation: current.toLocation, toLocation: targetLocation, nonce: Date.now(), originVisible: null });
    window.history.replaceState({}, "", `/?destination=${next}`);
  }, []);

  const locked = lockedPhases.has(navigation.phase);
  const travelling = locked && navigation.phase !== "returning";
  const destinationOpen = navigation.phase === "destination" && selected !== "global";
  const destinationLayout = navigation.phase === "arriving" || destinationOpen || (navigation.from !== "global" && travelling);

  return { selected, navigation, select, reportOriginVisibility, locked, travelling, destinationOpen, destinationLayout, reducedMotion };
}
