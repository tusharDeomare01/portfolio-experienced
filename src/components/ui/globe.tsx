import { useEffect, useRef, useMemo, useState } from "react";
import { Color, Group } from "three";
import ThreeGlobe from "three-globe";
import { extend } from "@react-three/fiber";
import countries from "@/data/globe.json";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: ThreeElements["mesh"] & {
      new (): ThreeGlobe;
    };
  }
}

extend({ ThreeGlobe: ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

// Pre-compute arc stroke values to avoid Math.random() per accessor call
const ARC_STROKES = [0.32, 0.28, 0.3];

// Fisher-Yates partial shuffle — O(count) instead of O(n²) indexOf loop
function pickRandomIndices(max: number, count: number): Set<number> {
  const indices = Array.from({ length: max }, (_, i) => i);
  const n = Math.min(count, max);
  for (let i = max - 1; i >= max - n; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return new Set(indices.slice(max - n));
}

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const groupRef = useRef<Group>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoize merged config to prevent re-running effects on every render
  const config = useMemo(
    () => ({
      pointSize: 1,
      atmosphereColor: "#ffffff",
      showAtmosphere: true,
      atmosphereAltitude: 0.1,
      polygonColor: "rgba(255,255,255,0.7)",
      globeColor: "#1d072e",
      emissive: "#000000",
      emissiveIntensity: 0.1,
      shininess: 0.9,
      arcTime: 2000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      ...globeConfig,
    }),
    [globeConfig]
  );

  // Create ThreeGlobe instance once
  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe();
      groupRef.current.add(globeRef.current);
      setIsInitialized(true);
    }
  }, []);

  // Apply material properties
  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(config.globeColor);
    globeMaterial.emissive = new Color(config.emissive);
    globeMaterial.emissiveIntensity = config.emissiveIntensity;
    globeMaterial.shininess = config.shininess;
  }, [isInitialized, config.globeColor, config.emissive, config.emissiveIntensity, config.shininess]);

  // Pre-compute deduplicated points from arc data
  const filteredPoints = useMemo(() => {
    if (!data) return [];
    const seen = new Set<string>();
    const points: Array<{ size: number; order: number; color: string; lat: number; lng: number }> = [];
    for (const arc of data) {
      const startKey = `${arc.startLat},${arc.startLng}`;
      if (!seen.has(startKey)) {
        seen.add(startKey);
        points.push({ size: config.pointSize, order: arc.order, color: arc.color, lat: arc.startLat, lng: arc.startLng });
      }
      const endKey = `${arc.endLat},${arc.endLng}`;
      if (!seen.has(endKey)) {
        seen.add(endKey);
        points.push({ size: config.pointSize, order: arc.order, color: arc.color, lat: arc.endLat, lng: arc.endLng });
      }
    }
    return points;
  }, [data, config.pointSize]);

  // Configure globe geometry and arcs
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(2)
      .hexPolygonMargin(0.7)
      .showAtmosphere(config.showAtmosphere)
      .atmosphereColor(config.atmosphereColor)
      .atmosphereAltitude(config.atmosphereAltitude)
      .hexPolygonColor(() => config.polygonColor);

    globeRef.current
      .arcsData(data)
      .arcStartLat((d) => (d as Position).startLat)
      .arcStartLng((d) => (d as Position).startLng)
      .arcEndLat((d) => (d as Position).endLat)
      .arcEndLng((d) => (d as Position).endLng)
      .arcColor((e: unknown) => (e as Position).color)
      .arcAltitude((e) => (e as Position).arcAlt)
      .arcStroke(() => ARC_STROKES[Math.floor(Math.random() * 3)])
      .arcDashLength(config.arcLength)
      .arcDashInitialGap((e) => (e as Position).order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => config.arcTime);

    globeRef.current
      .pointsData(filteredPoints)
      .pointColor((e) => (e as { color: string }).color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
      .ringColor(() => config.polygonColor)
      .ringMaxRadius(config.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((config.arcTime * config.arcLength) / config.rings);
  }, [isInitialized, data, filteredPoints, config]);

  // Ring animation interval — uses efficient Fisher-Yates instead of O(n²) indexOf
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;

    const interval = setInterval(() => {
      if (!globeRef.current) return;

      const selected = pickRandomIndices(data.length, Math.floor((data.length * 4) / 5));
      const ringsData = data
        .filter((_d, i) => selected.has(i))
        .map((d) => ({ lat: d.startLat, lng: d.startLng, color: d.color }));

      globeRef.current.ringsData(ringsData);
    }, 2000);

    return () => { clearInterval(interval); };
  }, [isInitialized, data]);

  return <group ref={groupRef} />;
}
