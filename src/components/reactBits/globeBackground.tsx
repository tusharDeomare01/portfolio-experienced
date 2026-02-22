import { useRef, useEffect, useState } from "react";
import { Vector3, Group, Fog, MathUtils } from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Globe, type GlobeConfig } from "@/components/ui/globe";

const colors = ["#06b6d4", "#3b82f6", "#6366f1"];

const sampleArcs = [
  { order: 1, startLat: -19.885592, startLng: -43.951191, endLat: -22.9068, endLng: -43.1729, arcAlt: 0.1, color: colors[0] },
  { order: 1, startLat: 28.6139, startLng: 77.209, endLat: 3.139, endLng: 101.6869, arcAlt: 0.2, color: colors[1] },
  { order: 1, startLat: -19.885592, startLng: -43.951191, endLat: -1.303396, endLng: 36.852443, arcAlt: 0.5, color: colors[2] },
  { order: 2, startLat: 1.3521, startLng: 103.8198, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.2, color: colors[0] },
  { order: 2, startLat: 51.5072, startLng: -0.1276, endLat: 3.139, endLng: 101.6869, arcAlt: 0.3, color: colors[1] },
  { order: 2, startLat: -15.785493, startLng: -47.909029, endLat: 36.162809, endLng: -115.119411, arcAlt: 0.3, color: colors[2] },
  { order: 3, startLat: -33.8688, startLng: 151.2093, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: colors[0] },
  { order: 3, startLat: 21.3099, startLng: -157.8581, endLat: 40.7128, endLng: -74.006, arcAlt: 0.3, color: colors[1] },
  { order: 3, startLat: -6.2088, startLng: 106.8456, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: colors[2] },
  { order: 4, startLat: 11.986597, startLng: 8.571831, endLat: -15.595412, endLng: -56.05918, arcAlt: 0.5, color: colors[0] },
  { order: 4, startLat: -34.6037, startLng: -58.3816, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.7, color: colors[1] },
  { order: 4, startLat: 51.5072, startLng: -0.1276, endLat: 48.8566, endLng: -2.3522, arcAlt: 0.1, color: colors[2] },
  { order: 5, startLat: 14.5995, startLng: 120.9842, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: colors[0] },
  { order: 5, startLat: 1.3521, startLng: 103.8198, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.2, color: colors[1] },
  { order: 5, startLat: 34.0522, startLng: -118.2437, endLat: 48.8566, endLng: -2.3522, arcAlt: 0.2, color: colors[2] },
  { order: 6, startLat: -15.432563, startLng: 28.315853, endLat: 1.094136, endLng: -63.34546, arcAlt: 0.7, color: colors[0] },
  { order: 6, startLat: 37.5665, startLng: 126.978, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.1, color: colors[1] },
  { order: 6, startLat: 22.3193, startLng: 114.1694, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: colors[2] },
  { order: 7, startLat: -19.885592, startLng: -43.951191, endLat: -15.595412, endLng: -56.05918, arcAlt: 0.1, color: colors[0] },
  { order: 7, startLat: 48.8566, startLng: -2.3522, endLat: 52.52, endLng: 13.405, arcAlt: 0.1, color: colors[1] },
  { order: 7, startLat: 52.52, startLng: 13.405, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.2, color: colors[2] },
  { order: 8, startLat: -8.833221, startLng: 13.264837, endLat: -33.936138, endLng: 18.436529, arcAlt: 0.2, color: colors[0] },
  { order: 8, startLat: 49.2827, startLng: -123.1207, endLat: 52.3676, endLng: 4.9041, arcAlt: 0.2, color: colors[1] },
  { order: 8, startLat: 1.3521, startLng: 103.8198, endLat: 40.7128, endLng: -74.006, arcAlt: 0.5, color: colors[2] },
  { order: 9, startLat: 51.5072, startLng: -0.1276, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.2, color: colors[0] },
  { order: 9, startLat: 22.3193, startLng: 114.1694, endLat: -22.9068, endLng: -43.1729, arcAlt: 0.7, color: colors[1] },
  { order: 9, startLat: 1.3521, startLng: 103.8198, endLat: -34.6037, endLng: -58.3816, arcAlt: 0.5, color: colors[2] },
  { order: 10, startLat: -22.9068, startLng: -43.1729, endLat: 28.6139, endLng: 77.209, arcAlt: 0.7, color: colors[0] },
  { order: 10, startLat: 34.0522, startLng: -118.2437, endLat: 31.2304, endLng: 121.4737, arcAlt: 0.3, color: colors[1] },
  { order: 10, startLat: -6.2088, startLng: 106.8456, endLat: 52.3676, endLng: 4.9041, arcAlt: 0.3, color: colors[2] },
  { order: 11, startLat: 41.9028, startLng: 12.4964, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.2, color: colors[0] },
  { order: 11, startLat: -6.2088, startLng: 106.8456, endLat: 31.2304, endLng: 121.4737, arcAlt: 0.2, color: colors[1] },
  { order: 11, startLat: 22.3193, startLng: 114.1694, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.2, color: colors[2] },
  { order: 12, startLat: 34.0522, startLng: -118.2437, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.1, color: colors[0] },
  { order: 12, startLat: 35.6762, startLng: 139.6503, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.2, color: colors[1] },
  { order: 12, startLat: 22.3193, startLng: 114.1694, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.3, color: colors[2] },
  { order: 13, startLat: 52.52, startLng: 13.405, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: colors[0] },
  { order: 13, startLat: 11.986597, startLng: 8.571831, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.3, color: colors[1] },
  { order: 13, startLat: -22.9068, startLng: -43.1729, endLat: -34.6037, endLng: -58.3816, arcAlt: 0.1, color: colors[2] },
  { order: 14, startLat: -33.936138, startLng: 18.436529, endLat: 21.395643, endLng: 39.883798, arcAlt: 0.3, color: colors[0] },
];

const globeConfig: GlobeConfig = {
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#FFFFFF",
  atmosphereAltitude: 0.1,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: false,
  autoRotateSpeed: 0,
};

// ── Scroll state bridge (DOM → R3F) ──────────────────────────────────
// Written by scroll listener on main thread, read by useFrame at 60fps.
// Module-level = zero React re-renders, zero GC pressure.
const scroll = {
  current: 0,   // current scrollY
  max: 1,       // scrollHeight - innerHeight
  velocity: 0,  // px/ms — computed from delta between events
  lastY: 0,     // previous scrollY for velocity calc
  lastT: 0,     // previous timestamp
};

/** Fog setup on R3F's managed scene */
function SceneSetup() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new Fog(0xffffff, 400, 2000);
  }, [scene]);
  return null;
}

// ── Smoothing constants ──────────────────────────────────────────────
// Exponential decay rate (per second). Higher = snappier.
//
//   Rate  | 95% settled in | Feel
//   ------+----------------+---------------------------
//     3   | ~1.0s          | Very floaty / cinematic
//     6   | ~0.5s          | Smooth but responsive
//    12   | ~0.25s         | Tight tracking
//    20   | ~0.15s         | Near-instant
//
const SCROLL_SMOOTHING = 12;    // Tight tracking — globe follows scroll closely
const VELOCITY_SMOOTHING = 2.5; // Slow decay — momentum lingers, soft overshoot
const IDLE_SPEED = 0.06;        // Radians/sec idle drift (≈3.4°/s, subtle)
const MOMENTUM_SCALE = 0.35;    // Strong momentum: fling-scroll visibly kicks the globe
const SCROLL_TO_ROTATION = Math.PI * 3; // 540° across entire page (1.5 revolutions)

/**
 * Frame-rate independent exponential damping.
 * Returns the interpolation factor for a given decay rate and delta time.
 * At 60fps (dt=0.016): damp(4, 0.016) ≈ 0.062
 * At 144fps (dt=0.007): damp(4, 0.007) ≈ 0.028
 * The result is identical motion regardless of frame rate.
 */
function damp(smoothing: number, dt: number): number {
  return 1 - Math.exp(-smoothing * dt);
}

/**
 * ScrollDrivenGlobe — the scroll-rotation core.
 *
 * Three layers of motion composited together:
 *
 * 1. SCROLL POSITION — maps page progress (0→1) to rotation (0→2π).
 *    Frame-rate independent exponential damping for silky tracking.
 *
 * 2. SCROLL MOMENTUM — scroll velocity adds extra rotational kick.
 *    Fling-scroll → globe overshoots slightly then settles. Physical feel.
 *    Decays exponentially so it never accumulates.
 *
 * 3. IDLE DRIFT — barely perceptible constant rotation when not scrolling.
 *    Keeps the globe alive. Blends out when actively scrolling.
 */
function ScrollDrivenGlobe() {
  const wrapperRef = useRef<Group>(null);
  const smoothRotation = useRef(0);
  const smoothMomentum = useRef(0);
  const idleOffset = useRef(0);
  const lastScrollTime = useRef(Date.now());

  // Scroll listener — passive, no layout thrashing
  useEffect(() => {
    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - scroll.lastT);

      scroll.current = window.scrollY;
      scroll.max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

      // Velocity in px/ms — clamped, then EMA smoothed to kill jitter
      const rawVelocity = (scroll.current - scroll.lastY) / dt;
      const clamped = MathUtils.clamp(rawVelocity, -5, 5);
      // Exponential moving average (0.3 = responsive but jitter-free)
      scroll.velocity = scroll.velocity * 0.7 + clamped * 0.3;

      scroll.lastY = scroll.current;
      scroll.lastT = now;
      lastScrollTime.current = now;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useFrame((_state, delta) => {
    if (!wrapperRef.current) return;

    // Clamp delta to avoid jumps after tab switch / debugger pause
    const dt = Math.min(delta, 0.1);
    const factor = damp(SCROLL_SMOOTHING, dt);
    const velFactor = damp(VELOCITY_SMOOTHING, dt);

    // Decay source velocity to 0 when no scroll events are firing
    const msSinceScroll = performance.now() - lastScrollTime.current;
    if (msSinceScroll > 100) {
      scroll.velocity *= 1 - damp(5, dt); // fast decay when idle
    }

    // ── Layer 1: Scroll position → rotation ──
    const progress = scroll.current / scroll.max;
    const targetRotation = progress * SCROLL_TO_ROTATION;
    smoothRotation.current += (targetRotation - smoothRotation.current) * factor;

    // ── Layer 2: Momentum from scroll velocity ──
    const targetMomentum = scroll.velocity * MOMENTUM_SCALE;
    smoothMomentum.current += (targetMomentum - smoothMomentum.current) * velFactor;

    // ── Layer 3: Idle drift ──
    // Fade in when not scrolling (over 1.5s), fade out instantly when scrolling
    const idleBlend = MathUtils.clamp(msSinceScroll / 1500, 0, 1);
    idleOffset.current += IDLE_SPEED * dt * idleBlend;

    // ── Composite ──
    wrapperRef.current.rotation.y =
      smoothRotation.current + smoothMomentum.current + idleOffset.current;
  });

  return (
    <group ref={wrapperRef}>
      <Globe globeConfig={globeConfig} data={sampleArcs} />
    </group>
  );
}

interface GlobeBackgroundProps {
  className?: string;
}

export default function GlobeBackground({ className }: GlobeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handler = () => { setVisible(!document.hidden); };
    document.addEventListener("visibilitychange", handler);
    return () => { document.removeEventListener("visibilitychange", handler); };
  }, []);

  if (!visible) return <div ref={containerRef} className={className} />;

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        camera={{ fov: 50, near: 180, far: 1800, position: [0, 0, 300] }}
        frameloop="always"
        dpr={Math.min(window.devicePixelRatio, 2)}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <SceneSetup />
        <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
        <directionalLight
          color={globeConfig.directionalLeftLight}
          position={new Vector3(-400, 100, 400)}
        />
        <directionalLight
          color={globeConfig.directionalTopLight}
          position={new Vector3(-200, 500, 200)}
        />
        <pointLight
          color={globeConfig.pointLight}
          position={new Vector3(-200, 500, 200)}
          intensity={0.8}
        />
        <ScrollDrivenGlobe />
      </Canvas>
    </div>
  );
}
