import { useRef, memo } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const SEGMENTS = 3;
const SEGMENT_TEXT = "OPEN TO WORK";
const DOT_RADIUS = 5;

interface CircularStatusTextProps {
  size?: number;
  className?: string;
}

const CircularStatusTextComponent = ({
  size = 300,
  className = "",
}: CircularStatusTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const center = size / 2;
  const textRadius = size / 2 - 16;

  useGSAP(
    () => {
      if (!svgRef.current) return;

      // Smooth continuous rotation
      gsap.to(svgRef.current, {
        rotation: 360,
        duration: 18,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });

      // Pulse the green dot rings
      const pulseRings =
        svgRef.current.querySelectorAll<SVGCircleElement>(".dot-pulse");
      if (pulseRings.length) {
        gsap.to(pulseRings, {
          attr: { r: DOT_RADIUS + 6 },
          opacity: 0,
          duration: 1.4,
          repeat: -1,
          ease: "power2.out",
          stagger: { each: 0.45, repeat: -1 },
        });
      }
    },
    { scope: containerRef }
  );

  const segmentAngle = 360 / SEGMENTS;

  const segments = Array.from({ length: SEGMENTS }, (_, i) => {
    const startAngle = i * segmentAngle;

    // Dot position at the start of each segment
    const dotAngleRad = ((startAngle - 90) * Math.PI) / 180;
    const dotX = center + textRadius * Math.cos(dotAngleRad);
    const dotY = center + textRadius * Math.sin(dotAngleRad);

    // Text arc — tighter gap around dots so text fills more of the ring
    const textStartAngle = startAngle + 6;
    const textEndAngle = startAngle + segmentAngle - 6;

    const startRad = ((textStartAngle - 90) * Math.PI) / 180;
    const endRad = ((textEndAngle - 90) * Math.PI) / 180;
    const sx = center + textRadius * Math.cos(startRad);
    const sy = center + textRadius * Math.sin(startRad);
    const ex = center + textRadius * Math.cos(endRad);
    const ey = center + textRadius * Math.sin(endRad);
    const largeArc = textEndAngle - textStartAngle > 180 ? 1 : 0;
    const arcPath = `M ${sx},${sy} A ${textRadius},${textRadius} 0 ${largeArc},1 ${ex},${ey}`;

    return { dotX, dotY, arcPath, index: i };
  });

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        overflow="visible"
      >
        <defs>
          {segments.map(({ arcPath, index }) => (
            <path
              key={`path-${index}`}
              id={`text-arc-${index}`}
              d={arcPath}
              fill="none"
            />
          ))}
        </defs>

        {segments.map(({ dotX, dotY, index }) => (
          <g key={`dot-${index}`}>
            {/* Animated pulse ring */}
            <circle
              cx={dotX}
              cy={dotY}
              r={DOT_RADIUS + 2}
              className="dot-pulse fill-none stroke-emerald-400"
              strokeWidth={1.5}
              opacity={0.6}
            />
            {/* Solid green dot */}
            <circle
              cx={dotX}
              cy={dotY}
              r={DOT_RADIUS}
              className="fill-emerald-500"
            />
            {/* Inner highlight */}
            <circle
              cx={dotX - 1.2}
              cy={dotY - 1.2}
              r={1.8}
              className="fill-emerald-300"
              opacity={0.7}
            />
          </g>
        ))}

        {segments.map(({ index }) => (
          <text key={`text-${index}`} className="select-none">
            <textPath
              href={`#text-arc-${index}`}
              startOffset="50%"
              textAnchor="middle"
              className="fill-black dark:fill-white"
              style={{
                fontSize: "17px",
                fontWeight: 900,
                letterSpacing: "5px",
                fontFamily:
                  "ui-sans-serif, system-ui, -apple-system, sans-serif",
              }}
            >
              {SEGMENT_TEXT}
            </textPath>
          </text>
        ))}
      </svg>
    </div>
  );
};

export const CircularStatusText = memo(CircularStatusTextComponent);
