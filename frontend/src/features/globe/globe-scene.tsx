"use client";

import { Html, OrbitControls, Stars, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type MutableRefObject } from "react";
import * as THREE from "three";
import type { WorldCopy } from "@/i18n/world-messages";
import { globeMarkers, type DestinationId, type GlobeMarker as GlobeMarkerData, type MarkerDestinationId } from "./destinations";
import { getTravelTimings, type GlobeNavigation, type TravelLocation } from "./globe-travel";

const markerSubtitles: Partial<Record<MarkerDestinationId, string>> = { about: "PERSONAL STORY", projects: "PROJECT HUB", skills: "TECH DISTRICT", career: "CAREER ROUTE", architecture: "SYSTEM CORE", contact: "COMMUNICATION POINT", recruiter: "EXECUTIVE VIEW" };
const sphereRadius = 2;
const routeSurfaceRadius = sphereRadius + 0.085;
const exploreDistance = 6.85;
const planeScale = 0.068;

type TravelProgress = {
  route: MutableRefObject<number>;
  flight: MutableRefObject<number>;
  ready: MutableRefObject<number>;
  arrival: MutableRefObject<number>;
};

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function toSphere(latitude: number, longitude: number, radius = sphereRadius) {
  const latitudeRad = THREE.MathUtils.degToRad(latitude);
  const longitudeRad = THREE.MathUtils.degToRad(longitude);
  return new THREE.Vector3(
    radius * Math.cos(latitudeRad) * Math.sin(longitudeRad),
    radius * Math.sin(latitudeRad),
    radius * Math.cos(latitudeRad) * Math.cos(longitudeRad),
  );
}

function Atmosphere() {
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.FrontSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `varying vec3 vNormal; varying vec3 vView; void main(){ vec4 viewPosition=modelViewMatrix*vec4(position,1.0); vNormal=normalize(normalMatrix*normal); vView=normalize(-viewPosition.xyz); gl_Position=projectionMatrix*viewPosition; }`,
    fragmentShader: `varying vec3 vNormal; varying vec3 vView; void main(){ float rim=pow(1.0-max(dot(normalize(vNormal),normalize(vView)),0.0),3.4); gl_FragColor=vec4(0.12,0.68,1.0,rim*0.7); }`,
  }), []);
  useEffect(() => () => material.dispose(), [material]);
  return <mesh scale={1.08} material={material}><sphereGeometry args={[sphereRadius, 72, 48]} /></mesh>;
}

class SphericalFlightCurve extends THREE.Curve<THREE.Vector3> {
  private readonly start: THREE.Vector3;
  private readonly end: THREE.Vector3;
  private readonly angle: number;
  private readonly sinAngle: number;
  private readonly maxAltitude: number;

  constructor(from: TravelLocation, to: TravelLocation) {
    super();
    this.start = toSphere(from.latitude, from.longitude, 1).normalize();
    this.end = toSphere(to.latitude, to.longitude, 1).normalize();
    this.angle = this.start.angleTo(this.end);
    this.sinAngle = Math.sin(this.angle);
    this.maxAltitude = THREE.MathUtils.lerp(0.2, 0.92, Math.pow(this.angle / Math.PI, 0.78));
  }

  getPoint(progress: number, target = new THREE.Vector3()) {
    if (this.angle < 0.001 || Math.abs(this.sinAngle) < 0.0001) {
      target.copy(this.start).lerp(this.end, progress).normalize();
    } else {
      target.copy(this.start).multiplyScalar(Math.sin((1 - progress) * this.angle) / this.sinAngle)
        .addScaledVector(this.end, Math.sin(progress * this.angle) / this.sinAngle).normalize();
    }
    const altitude = Math.pow(Math.sin(Math.PI * progress), 1.08) * this.maxAltitude;
    return target.multiplyScalar(routeSurfaceRadius + altitude);
  }
}

function createFlightCurve(from: TravelLocation, to: TravelLocation) {
  return new SphericalFlightCurve(from, to);
}

function isDestinationVisible(destination: TravelLocation, globeQuaternion: THREE.Quaternion, cameraPosition: THREE.Vector3) {
  const surfacePoint = toSphere(destination.latitude, destination.longitude).applyQuaternion(globeQuaternion);
  const surfaceNormal = surfacePoint.clone().normalize();
  const cameraDirection = cameraPosition.clone().sub(surfacePoint).normalize();
  return surfaceNormal.dot(cameraDirection) > 0.08;
}

function FlightRoute({ navigation, progress, curve, mobile, reducedMotion }: { navigation: GlobeNavigation; progress: TravelProgress; curve: SphericalFlightCurve; mobile: boolean; reducedMotion: boolean }) {
  const plane = useRef<THREE.Group>(null);
  const planeBody = useRef<THREE.Group>(null);
  const hasFlight = navigation.nonce > 0 && navigation.from !== navigation.to && navigation.to !== "global";
  const points = useMemo(() => curve.getSpacedPoints(128), [curve]);
  const routeLine = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineDashedMaterial({ color: "#70ffe0", transparent: true, opacity: 0, dashSize: 0.065, gapSize: 0.044, depthTest: true, depthWrite: false, toneMapped: false });
    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    return line;
  }, [points]);
  const wingGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.14, 0.36); shape.lineTo(-1.5, -0.05); shape.lineTo(-1.16, -0.31); shape.lineTo(-0.18, -0.2);
    shape.lineTo(-0.2, -0.48); shape.lineTo(0.2, -0.48); shape.lineTo(0.18, -0.2); shape.lineTo(1.16, -0.31);
    shape.lineTo(1.5, -0.05); shape.lineTo(0.14, 0.36); shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);
  const tailGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.08, 0.2); shape.lineTo(-0.66, -0.06); shape.lineTo(-0.5, -0.22);
    shape.lineTo(0.5, -0.22); shape.lineTo(0.66, -0.06); shape.lineTo(0.08, 0.2); shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);
  const finGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0); shape.lineTo(0.5, 0.02); shape.lineTo(0.25, 0.52); shape.lineTo(0.02, 0.58); shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);
  const beforeTangent = useMemo(() => new THREE.Vector3(), []);
  const afterTangent = useMemo(() => new THREE.Vector3(), []);
  const radial = useMemo(() => new THREE.Vector3(), []);
  const nextPoint = useMemo(() => new THREE.Vector3(), []);
  const orientationMatrix = useMemo(() => new THREE.Matrix4(), []);
  const desiredQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => () => {
    routeLine.geometry.dispose();
    (routeLine.material as THREE.Material).dispose();
    wingGeometry.dispose();
    tailGeometry.dispose();
    finGeometry.dispose();
  }, [finGeometry, routeLine, tailGeometry, wingGeometry]);

  useFrame(() => {
    const material = routeLine.material as THREE.LineDashedMaterial;
    const routeProgress = THREE.MathUtils.clamp(progress.route.current, 0, 1);
    const routePhase = navigation.phase === "drawingRoute" || navigation.phase === "readyForDeparture" || navigation.phase === "flying" || navigation.phase === "arriving";
    const arrivalFade = navigation.phase === "arriving" ? 1 - THREE.MathUtils.smoothstep(progress.arrival.current, 0.58, 1) : 1;
    const opacity = hasFlight && routePhase ? 0.88 * arrivalFade : 0;
    routeLine.visible = opacity > 0.01;
    material.opacity = opacity;
    routeLine.geometry.setDrawRange(0, Math.max(0, Math.ceil(points.length * routeProgress)));

    if (!plane.current || !planeBody.current) return;
    const departureOpacity = navigation.phase === "readyForDeparture"
      ? THREE.MathUtils.smoothstep(progress.ready.current, 0.46, 0.9)
      : navigation.phase === "flying" ? 1
        : navigation.phase === "arriving" ? 1 - THREE.MathUtils.smoothstep(progress.arrival.current, 0, 0.58) : 0;
    plane.current.visible = hasFlight && departureOpacity > 0.01;
    if (!plane.current.visible) return;
    const planeProgress = navigation.phase === "arriving" ? 1 : THREE.MathUtils.clamp(progress.flight.current, 0, 1);
    const point = curve.getPointAt(planeProgress);
    const tangent = curve.getTangentAt(planeProgress).normalize();
    radial.copy(point).normalize();
    plane.current.position.copy(point).addScaledVector(radial, 0.04);
    nextPoint.copy(plane.current.position).add(tangent);
    right.crossVectors(radial, tangent).normalize();
    up.crossVectors(tangent, right).normalize();
    orientationMatrix.makeBasis(right, up, tangent);
    desiredQuaternion.setFromRotationMatrix(orientationMatrix);
    if (navigation.phase === "readyForDeparture" || reducedMotion) plane.current.quaternion.copy(desiredQuaternion);
    else plane.current.quaternion.slerp(desiredQuaternion, 0.18);
    curve.getTangentAt(Math.max(0, planeProgress - 0.018), beforeTangent);
    curve.getTangentAt(Math.min(1, planeProgress + 0.018), afterTangent);
    const turn = beforeTangent.cross(afterTangent).dot(radial);
    const bank = reducedMotion ? 0 : THREE.MathUtils.clamp(turn * 5.5, -THREE.MathUtils.degToRad(11), THREE.MathUtils.degToRad(11));
    planeBody.current.rotation.z = THREE.MathUtils.lerp(planeBody.current.rotation.z, bank, 0.12);
    plane.current.scale.setScalar(planeScale * (mobile ? 1.12 : 1) * departureOpacity);
    plane.current.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const planeMaterial = object.material as THREE.MeshStandardMaterial;
      planeMaterial.transparent = true;
      planeMaterial.opacity = departureOpacity;
    });
  });

  return <>
    <primitive object={routeLine} />
    <group ref={plane} scale={planeScale} visible={false}>
      <group ref={planeBody}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.16, 0.22, 1.35, 12]} /><meshStandardMaterial color="#ffffff" emissive="#8fe8d4" emissiveIntensity={0.42} metalness={0.42} roughness={0.22} /></mesh>
        <mesh position={[0, 0, .82]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.17, .55, 12]} /><meshStandardMaterial color="#ffffff" metalness={0.45} roughness={0.21} /></mesh>
        <mesh geometry={wingGeometry} position={[0, 0, -.02]} rotation={[Math.PI / 2, 0, 0]}><meshStandardMaterial color="#edf4f2" emissive="#55f6cf" emissiveIntensity={0.18} metalness={0.4} roughness={0.22} side={THREE.DoubleSide} /></mesh>
        <mesh geometry={tailGeometry} position={[0, .03, -.57]} rotation={[Math.PI / 2, 0, 0]}><meshStandardMaterial color="#93f8df" emissive="#55f6cf" emissiveIntensity={0.26} metalness={0.35} roughness={0.24} side={THREE.DoubleSide} /></mesh>
        <mesh geometry={finGeometry} position={[0, .02, -.72]} rotation={[0, Math.PI / 2, 0]}><meshStandardMaterial color="#80efd5" emissive="#55f6cf" emissiveIntensity={0.24} metalness={0.34} roughness={0.25} side={THREE.DoubleSide} /></mesh>
        {[-0.55, 0.55].map((x) => <group key={x} position={[x, -0.09, -0.02]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.105, 0.13, 0.42, 12]} /><meshStandardMaterial color="#dfe9e7" metalness={0.48} roughness={0.24} /></mesh>
          <mesh position={[0, 0, .25]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.105, .16, 12]} /><meshStandardMaterial color="#f8ffff" metalness={0.45} roughness={0.22} /></mesh>
        </group>)}
        <mesh position={[0, .16, .35]} scale={[.11, .07, .25]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#75cddd" emissive="#2baabf" emissiveIntensity={0.34} metalness={0.62} roughness={0.18} /></mesh>
      </group>
    </group>
  </>;
}

function DestinationMarker({ destination, selected, navigation, progress, copy, locked, onSelect }: {
  destination: GlobeMarkerData;
  selected: DestinationId;
  navigation: GlobeNavigation;
  progress: TravelProgress;
  copy: WorldCopy;
  locked: boolean;
  onSelect: (id: DestinationId, location?: TravelLocation) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const marker = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const halo = useRef<THREE.Mesh>(null);
  const haloMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const label = useRef<HTMLDivElement>(null);
  const camera = useThree((state) => state.camera);
  const worldPosition = useMemo(() => new THREE.Vector3(), []);
  const cameraDirection = useMemo(() => new THREE.Vector3(), []);
  const surfaceNormal = useMemo(() => new THREE.Vector3(), []);
  const position = useMemo(() => toSphere(destination.latitude, destination.longitude, 2.08), [destination.latitude, destination.longitude]);
  const text = copy.destinations[destination.id];
  const markerStyle = { "--marker-color": destination.color } as CSSProperties;

  useFrame(() => {
    if (!group.current || !marker.current || !material.current || !halo.current || !haloMaterial.current || !label.current) return;
    group.current.getWorldPosition(worldPosition);
    surfaceNormal.copy(worldPosition).normalize();
    cameraDirection.copy(camera.position).sub(worldPosition).normalize();
    const facing = THREE.MathUtils.smoothstep(surfaceNormal.dot(cameraDirection), -0.03, 0.2);
    const flightProgress = progress.flight.current;
    const inTravelSequence = navigation.phase === "focusingOrigin" || navigation.phase === "drawingRoute" || navigation.phase === "readyForDeparture" || navigation.phase === "flying" || navigation.phase === "arriving";
    const destinationMode = navigation.phase === "destination";
    let phaseOpacity = destinationMode && destination.id !== selected ? 0.52 : inTravelSequence ? 0.42 : 1;
    if (inTravelSequence && destination.id === navigation.from) {
      phaseOpacity = navigation.phase === "flying" || navigation.phase === "arriving"
        ? 1 - THREE.MathUtils.smoothstep(flightProgress, 0.08, 0.52)
        : 1;
    }
    if (inTravelSequence && destination.id === navigation.to) phaseOpacity = 0.3 + THREE.MathUtils.smoothstep(flightProgress, 0.56, 0.95) * 0.7;
    const opacity = facing * phaseOpacity;
    const arrival = destination.id === navigation.to ? THREE.MathUtils.smoothstep(flightProgress, 0.78, 1) : 0;
    const pulse = inTravelSequence && destination.id === navigation.to ? 1 + Math.sin(flightProgress * Math.PI * 7) * 0.08 * arrival : 1;
    marker.current.scale.setScalar(pulse);
    material.current.opacity = opacity;
    halo.current.scale.setScalar(1 + arrival * 0.42);
    haloMaterial.current.opacity = opacity * (destination.id === selected ? 0.16 + arrival * 0.2 : 0.055);
    const labelOpacity = destinationMode ? facing : opacity;
    label.current.style.opacity = labelOpacity.toFixed(3);
    label.current.style.visibility = opacity < 0.035 ? "hidden" : "visible";
    label.current.style.pointerEvents = locked || opacity < 0.45 ? "none" : "auto";
  });

  const Icon = destination.icon;
  return <group ref={group} position={position}>
    <mesh ref={marker}><sphereGeometry args={[0.095, 18, 18]} /><meshBasicMaterial ref={material} color={destination.color} transparent depthWrite={false} /></mesh>
    <mesh ref={halo}><sphereGeometry args={[0.14, 18, 18]} /><meshBasicMaterial ref={haloMaterial} color={destination.color} transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
    <Html center distanceFactor={4.05} zIndexRange={[20, 0]}>
      <div ref={label} className="marker-offset" style={{ opacity: 0, transform: `translate(${destination.labelOffset[0]}px, ${destination.labelOffset[1]}px)` }}>
        <button type="button" disabled={locked} data-destination={destination.id} className={`globe-marker ${selected === destination.id ? "active" : ""}`} style={markerStyle} onClick={() => destination.href ? window.location.assign(destination.href) : onSelect(destination.id as DestinationId, { latitude: destination.latitude, longitude: destination.longitude })} aria-label={`${text.title}: ${text.subtitle}`}>
          <Icon size={17} aria-hidden /><span><strong>{text.title}</strong><small>{markerSubtitles[destination.id] ?? text.subtitle}</small></span>
        </button>
      </div>
    </Html>
  </group>;
}

function Earth({ selected, navigation, copy, onSelect, onOriginVisibility, reducedMotion, locked, mobile }: {
  selected: DestinationId;
  navigation: GlobeNavigation;
  copy: WorldCopy;
  onSelect: (id: DestinationId, location?: TravelLocation) => void;
  onOriginVisibility: (nonce: number, visible: boolean) => void;
  reducedMotion: boolean;
  locked: boolean;
  mobile: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const camera = useThree((state) => state.camera);
  const routeProgress = useRef(0);
  const flightProgress = useRef(navigation.phase === "destination" ? 1 : 0);
  const readyProgress = useRef(0);
  const arrivalProgress = useRef(navigation.phase === "destination" ? 1 : 0);
  const progress = useMemo<TravelProgress>(() => ({
    route: routeProgress,
    flight: flightProgress,
    ready: readyProgress,
    arrival: arrivalProgress,
  }), []);
  const phaseElapsed = useRef(0);
  const focusStartQuaternion = useRef(new THREE.Quaternion());
  const originQuaternion = useRef(new THREE.Quaternion());
  const destinationQuaternion = useRef(new THREE.Quaternion());
  const returnQuaternion = useRef(new THREE.Quaternion());
  const explorationQuaternion = useMemo(() => new THREE.Quaternion().setFromEuler(new THREE.Euler(0, THREE.MathUtils.degToRad(28), -0.08)), []);
  const explorationCamera = useMemo(() => new THREE.Vector3(0, 0.1, exploreDistance), []);
  const flightCurve = useMemo(() => {
    return createFlightCurve(navigation.fromLocation, navigation.toLocation);
  }, [navigation.fromLocation, navigation.nonce, navigation.toLocation]);
  const cameraTarget = useRef(new THREE.Vector3());
  const flightPoint = useRef(new THREE.Vector3());
  const startDistance = useRef(exploreDistance);
  const returnCamera = useRef(new THREE.Vector3(0, 0.1, exploreDistance));
  const [day, specular, lights, clouds] = useTexture([
    "/textures/earth/earth-day.jpg",
    "/textures/earth/earth-specular.jpg",
    "/textures/earth/earth-lights.png",
    "/textures/earth/earth-clouds.png",
  ]);

  useEffect(() => {
    [day, specular, lights, clouds].forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
    });
    specular.colorSpace = THREE.NoColorSpace;
  }, [clouds, day, lights, specular]);

  useEffect(() => {
    phaseElapsed.current = 0;
    if (!group.current) return;

    if (navigation.phase === "focusingOrigin") {
      const origin = navigation.fromLocation;
      const target = navigation.toLocation;
      const current = group.current.quaternion.clone();
      const cameraDirection = camera.position.clone().normalize();
      const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
      const originVisible = isDestinationVisible(origin, current, camera.position);
      const originWorld = toSphere(origin.latitude, origin.longitude, 1).applyQuaternion(current).normalize();
      const targetWorld = toSphere(target.latitude, target.longitude, 1).applyQuaternion(current).normalize();
      const travelDirection = Math.sign(targetWorld.dot(cameraRight) - originWorld.dot(cameraRight)) || 1;
      const comfortableOrigin = cameraDirection.clone().addScaledVector(cameraRight, -travelDirection * 0.17).normalize();
      const fullyFocused = new THREE.Quaternion().setFromUnitVectors(originWorld, comfortableOrigin).multiply(current).normalize();
      // Every trip must settle on its exact origin before the route starts,
      // even when that point is already visible on the current hemisphere.
      const focused = fullyFocused;
      const destinationWorld = toSphere(target.latitude, target.longitude, 1).applyQuaternion(focused).normalize();

      focusStartQuaternion.current.copy(current);
      originQuaternion.current.copy(focused);
      destinationQuaternion.current.copy(new THREE.Quaternion().setFromUnitVectors(destinationWorld, cameraDirection).multiply(focused)).normalize();
      startDistance.current = camera.position.length();
      routeProgress.current = 0;
      flightProgress.current = 0;
      readyProgress.current = 0;
      arrivalProgress.current = 0;
      onOriginVisibility(navigation.nonce, originVisible);
    }

    if (navigation.phase === "destination" && navigation.nonce === 0) {
      const target = navigation.toLocation;
      const current = group.current.quaternion.clone();
      const targetWorld = toSphere(target.latitude, target.longitude, 1).applyQuaternion(current).normalize();
      const cameraDirection = camera.position.clone().normalize();
      const focused = new THREE.Quaternion().setFromUnitVectors(targetWorld, cameraDirection).multiply(current).normalize();
      group.current.quaternion.copy(focused);
      originQuaternion.current.copy(focused);
      destinationQuaternion.current.copy(focused);
      flightProgress.current = 1;
      arrivalProgress.current = 1;
    }
    if (navigation.phase === "returning") {
      returnQuaternion.current.copy(group.current.quaternion);
      returnCamera.current.copy(camera.position);
    }
  }, [camera, navigation.from, navigation.fromLocation, navigation.nonce, navigation.phase, navigation.to, navigation.toLocation, onOriginVisibility]);

  useFrame((_, delta) => {
    if (!group.current) return;
    phaseElapsed.current += delta * 1000;
    const timings = getTravelTimings(mobile, reducedMotion);

    if (navigation.phase === "focusingOrigin" && navigation.originVisible !== null) {
      const focusDuration = navigation.originVisible ? timings.focusVisible : timings.focusHidden;
      const local = focusDuration === 0 ? 1 : THREE.MathUtils.clamp(phaseElapsed.current / focusDuration, 0, 1);
      const focusMotion = THREE.MathUtils.clamp(local / 0.78, 0, 1);
      group.current.quaternion.slerpQuaternions(focusStartQuaternion.current, originQuaternion.current, reducedMotion ? 1 : easeInOutCubic(focusMotion));
    }

    if (navigation.phase === "drawingRoute") {
      const local = timings.drawRoute === 0 ? 1 : THREE.MathUtils.clamp(phaseElapsed.current / timings.drawRoute, 0, 1);
      routeProgress.current = easeInOutCubic(local);
      group.current.quaternion.copy(originQuaternion.current);
    }

    if (navigation.phase === "readyForDeparture") {
      routeProgress.current = 1;
      readyProgress.current = timings.ready === 0 ? 1 : THREE.MathUtils.clamp(phaseElapsed.current / timings.ready, 0, 1);
      group.current.quaternion.copy(originQuaternion.current);
    }

    if (navigation.phase === "flying") {
      routeProgress.current = 1;
      readyProgress.current = 1;
      const local = timings.flight === 0 ? 1 : THREE.MathUtils.clamp(phaseElapsed.current / timings.flight, 0, 1);
      flightProgress.current = easeInOutCubic(local);
      group.current.quaternion.slerpQuaternions(originQuaternion.current, destinationQuaternion.current, reducedMotion ? 1 : flightProgress.current);
      const arrivalDistance = mobile ? 6.62 : 6.45;
      const distance = THREE.MathUtils.lerp(startDistance.current, arrivalDistance, reducedMotion ? 1 : flightProgress.current);
      camera.position.setLength(distance);
      flightCurve.getPoint(flightProgress.current, flightPoint.current).applyQuaternion(group.current.quaternion);
      cameraTarget.current.copy(flightPoint.current).multiplyScalar(Math.sin(Math.PI * flightProgress.current) * 0.045);
      camera.lookAt(cameraTarget.current);
    }

    if (navigation.phase === "arriving") {
      routeProgress.current = 1;
      flightProgress.current = 1;
      readyProgress.current = 1;
      arrivalProgress.current = timings.arrival === 0 ? 1 : THREE.MathUtils.clamp(phaseElapsed.current / timings.arrival, 0, 1);
      group.current.quaternion.copy(destinationQuaternion.current);
      cameraTarget.current.multiplyScalar(reducedMotion ? 0 : Math.max(0, 1 - delta * 7));
      camera.lookAt(cameraTarget.current);
    }

    if (navigation.phase === "destination") {
      routeProgress.current = 0;
      flightProgress.current = 1;
      readyProgress.current = 1;
      arrivalProgress.current = 1;
    }

    if (navigation.phase === "returning") {
      const local = timings.return === 0 ? 1 : THREE.MathUtils.clamp(phaseElapsed.current / timings.return, 0, 1);
      const eased = easeInOutCubic(local);
      group.current.quaternion.slerpQuaternions(returnQuaternion.current, explorationQuaternion, reducedMotion ? 1 : eased);
      camera.position.lerpVectors(returnCamera.current, explorationCamera, reducedMotion ? 1 : eased);
      cameraTarget.current.set(0, 0, 0);
      camera.lookAt(0, 0, 0);
    }
  });

  return <group ref={group} rotation={[0, THREE.MathUtils.degToRad(28), -0.08]}>
    <mesh receiveShadow rotation={[0, -1.75, 0]}>
      <sphereGeometry args={[sphereRadius, 96, 64]} />
      <meshPhongMaterial map={day} specularMap={specular} specular={new THREE.Color("#183c4a")} shininess={6} />
    </mesh>
    <mesh scale={1.003} rotation={[0, -1.75, 0]}>
      <sphereGeometry args={[sphereRadius, 72, 48]} />
      <meshBasicMaterial map={lights} color="#8fffe0" blending={THREE.AdditiveBlending} transparent opacity={0.52} depthWrite={false} />
    </mesh>
    <mesh scale={1.011} rotation={[0, -1.75, 0]}>
      <sphereGeometry args={[sphereRadius, 72, 48]} />
      <meshPhongMaterial map={clouds} transparent opacity={0.22} depthWrite={false} />
    </mesh>
    <Atmosphere />
    <FlightRoute navigation={navigation} progress={progress} curve={flightCurve} mobile={mobile} reducedMotion={reducedMotion} />
    {globeMarkers.map((destination) => <DestinationMarker key={destination.key} destination={destination} selected={selected} navigation={navigation} progress={progress} copy={copy} locked={locked} onSelect={onSelect} />)}
  </group>;
}

export default function GlobeScene({ selected, navigation, copy, onSelect, onOriginVisibility, reducedMotion, locked }: {
  selected: DestinationId;
  navigation: GlobeNavigation;
  copy: WorldCopy;
  onSelect: (id: DestinationId, location?: TravelLocation) => void;
  onOriginVisibility: (nonce: number, visible: boolean) => void;
  reducedMotion: boolean;
  locked: boolean;
}) {
  const [visible, setVisible] = useState(true);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    const media = window.matchMedia("(max-width: 1040px)");
    const updateMobile = () => setMobile(media.matches);
    updateMobile();
    document.addEventListener("visibilitychange", update);
    media.addEventListener("change", updateMobile);
    return () => {
      document.removeEventListener("visibilitychange", update);
      media.removeEventListener("change", updateMobile);
    };
  }, []);

  return <Canvas className="globe-canvas" camera={{ position: [0, 0.1, exploreDistance], fov: 43, near: 0.1, far: 80 }} dpr={mobile ? [1, 1.25] : [1, 1.5]} frameloop={visible ? "always" : "never"} performance={{ min: 0.5 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
    <ambientLight intensity={0.26} />
    <directionalLight position={[-4, 3, 5]} intensity={1.55} color="#d5f7ff" />
    <directionalLight position={[4, -1, -3]} intensity={0.7} color="#35e8c0" />
    <Stars radius={34} depth={18} count={mobile ? 480 : 900} factor={2.1} saturation={0.2} fade speed={reducedMotion ? 0 : 0.25} />
    <Earth selected={selected} navigation={navigation} copy={copy} onSelect={onSelect} onOriginVisibility={onOriginVisibility} reducedMotion={reducedMotion} locked={locked} mobile={mobile} />
    <OrbitControls
      enabled={!locked}
      enableDamping
      dampingFactor={0.075}
      rotateSpeed={0.55}
      zoomSpeed={0.6}
      enablePan={false}
      minDistance={5.4}
      maxDistance={7.8}
      minPolarAngle={Math.PI * 0.08}
      maxPolarAngle={Math.PI * 0.92}
      target={[0, 0, 0]}
    />
  </Canvas>;
}

useTexture.preload("/textures/earth/earth-day.jpg");
useTexture.preload("/textures/earth/earth-specular.jpg");
useTexture.preload("/textures/earth/earth-lights.png");
useTexture.preload("/textures/earth/earth-clouds.png");
