import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh, Transform } from 'ogl';
import { useWebGLSupport } from '../hooks/use-webgl-support';

interface SkillParticle {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  color: [number, number, number];
  size: number;
  trail: Array<{ x: number; y: number; z: number }>;
}

interface AttractionPoint {
  x: number;
  y: number;
  z: number;
  strength: number;
  color: [number, number, number];
}

interface FluidSkillParticlesProps {
  skills: Array<{ id: string; name: string; color: string }>;
  attractionPoint?: AttractionPoint | null;
  mousePosition?: { x: number; y: number } | null;
  className?: string;
  onError?: (error: Error) => void;
  onReady?: () => void;
}

const hexToRgb = (hex: string): [number, number, number] => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const int = parseInt(hex, 16);
  return [
    ((int >> 16) & 255) / 255,
    ((int >> 8) & 255) / 255,
    (int & 255) / 255,
  ];
};

// Physics constants
const ATTRACTION_STRENGTH = 0.0008;
const REPULSION_STRENGTH = 0.0002;
const REPULSION_DISTANCE = 0.3;
const DAMPING = 0.92;
const MOUSE_ATTRACTION = 0.0003;
const MOUSE_DISTANCE = 0.5;
const TRAIL_LENGTH = 5;
const INIT_TIMEOUT = 5000; // 5 seconds max wait for initialization

const FluidSkillParticles: React.FC<FluidSkillParticlesProps> = ({
  skills,
  attractionPoint,
  mousePosition,
  className = '',
  onError,
  onReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<SkillParticle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const rendererRef = useRef<Renderer | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const sceneRef = useRef<Transform | null>(null);
  const programRef = useRef<Program | null>(null);
  const geometryRef = useRef<Geometry | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const isInitializedRef = useRef<boolean>(false);
  const initTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const resizeHandlerRef = useRef<(() => void) | undefined>(undefined);
  const attractionPointRef = useRef<AttractionPoint | null | undefined>(attractionPoint);
  const mousePositionRef = useRef<{ x: number; y: number } | null | undefined>(mousePosition);

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check WebGL support
  const webglSupport = useWebGLSupport();

  // Initialize particles symmetrically - memoized
  const initializeParticles = useCallback((skillList: typeof skills): SkillParticle[] => {
    return skillList.map((skill, index) => {
      const skillCount = skillList.length;
      const angle = (index / skillCount) * Math.PI * 2;
      
      // Symmetric distribution: evenly spaced in concentric rings
      let radius: number;
      let z: number;
      
      if (skillCount <= 4) {
        radius = 2.0;
        z = index % 2 === 0 ? 0.2 : -0.2;
      } else if (skillCount <= 8) {
        const mid = Math.ceil(skillCount / 2);
        if (index < mid) {
          radius = 1.5;
          z = 0.2;
        } else {
          radius = 2.5;
          z = -0.2;
        }
      } else {
        const ring1Size = Math.ceil(skillCount / 3);
        const ring2Size = Math.ceil((skillCount - ring1Size) / 2);
        
        if (index < ring1Size) {
          radius = 1.2;
          z = 0.3;
        } else if (index < ring1Size + ring2Size) {
          radius = 2.0;
          z = 0;
        } else {
          radius = 2.8;
          z = -0.3;
        }
      }
      
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      return {
        id: skill.id,
        x,
        y,
        z,
        vx: 0,
        vy: 0,
        vz: 0,
        targetX: x,
        targetY: y,
        targetZ: z,
        color: hexToRgb(skill.color),
        size: 0.1 + Math.random() * 0.05,
        trail: Array(TRAIL_LENGTH).fill(null).map(() => ({ x, y, z })),
      };
    });
  }, []);

  // Update refs when props change
  useEffect(() => {
    attractionPointRef.current = attractionPoint;
  }, [attractionPoint]);

  useEffect(() => {
    mousePositionRef.current = mousePosition;
  }, [mousePosition]);

  // Initialize particles when skills change
  useEffect(() => {
    if (skills.length === 0) return;
    particlesRef.current = initializeParticles(skills);
  }, [skills, initializeParticles]);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Stop animation
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    // Clear timeout
    if (initTimeoutRef.current !== undefined) {
      clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = undefined;
    }

    // Remove resize listener
    if (resizeHandlerRef.current !== undefined) {
      window.removeEventListener('resize', resizeHandlerRef.current);
      resizeHandlerRef.current = undefined;
    }

    // Destroy WebGL context
    const currentRenderer = rendererRef.current;
    if (currentRenderer?.gl) {
      try {
        const canvas = currentRenderer.gl.canvas;
        const loseContextExt = currentRenderer.gl.getExtension('WEBGL_lose_context');
        
        if (loseContextExt) {
          loseContextExt.loseContext();
        }
        
        if (canvas?.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      } catch (err) {
        // Silently handle cleanup errors
        if (process.env.NODE_ENV === 'development') {
          console.warn('WebGL cleanup error:', err);
        }
      }
    }

    // Clear refs
    rendererRef.current = null;
    cameraRef.current = null;
    meshRef.current = null;
    sceneRef.current = null;
    programRef.current = null;
    geometryRef.current = null;
    isInitializedRef.current = false;
  }, []);

  // Initialize WebGL
  useEffect(() => {
    // Don't initialize if WebGL not supported
    if (!webglSupport.isSupported || !webglSupport.isInitialized) {
      if (webglSupport.error) {
        const err = new Error(webglSupport.error);
        setError(err);
        onError?.(err);
      }
      return;
    }

    const container = containerRef.current;
    if (!container || skills.length === 0) return;

    // Prevent duplicate initialization
    if (isInitializedRef.current || container.querySelector('canvas')) {
      return;
    }

    // Cleanup any existing context first
    cleanup();

    let renderer: Renderer;
    let camera: Camera;
    let mesh: Mesh;
    let scene: Transform;
    let program: Program;
    let geometry: Geometry;

    try {
      // Create renderer
      renderer = new Renderer({ 
        dpr: Math.min(window.devicePixelRatio, 2), 
        depth: true, 
        alpha: true 
      });
      const gl = renderer.gl;
      
      // Check if context is valid
      if (!gl) {
        throw new Error('Failed to create WebGL context');
      }

      container.appendChild(gl.canvas);
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      // Create camera
      camera = new Camera(gl, { fov: 45 });
      camera.position.set(0, 0, 8);

      // Resize handler
      const resize = () => {
        if (!container || !renderer || !camera) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width > 0 && height > 0) {
          renderer.setSize(width, height);
          camera.perspective({ aspect: width / height });
        }
      };
      resizeHandlerRef.current = resize;
      window.addEventListener('resize', resize);

      // Shaders
      const vertex = /* glsl */ `
        attribute vec3 position;
        attribute vec3 color;
        attribute float size;
        
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float depth = -mvPosition.z / 10.0;
          vAlpha = clamp(depth, 0.3, 1.0);
          
          gl_PointSize = size * 200.0 / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `;

      const fragment = /* glsl */ `
        precision highp float;
        
        uniform float uTime;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vec2 uv = gl_PointCoord.xy;
          float dist = length(uv - vec2(0.5));
          
          float circle = smoothstep(0.5, 0.3, dist);
          float glow = smoothstep(0.7, 0.3, dist) * 0.5;
          
          vec3 finalColor = vColor + glow;
          gl_FragColor = vec4(finalColor, circle * vAlpha);
        }
      `;

      // Create program
      program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uTime: { value: 0 },
        },
        transparent: true,
        depthTest: true,
        depthWrite: false,
      });

      // Initialize geometry with particle data
      const particles = particlesRef.current;
      if (particles.length !== skills.length) {
        throw new Error('Particle count mismatch');
      }

      const initialPositions = new Float32Array(skills.length * 3);
      const initialColors = new Float32Array(skills.length * 3);
      const initialSizes = new Float32Array(skills.length);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const idx = i * 3;
        initialPositions[idx] = p.x;
        initialPositions[idx + 1] = p.y;
        initialPositions[idx + 2] = p.z;
        initialColors[idx] = p.color[0];
        initialColors[idx + 1] = p.color[1];
        initialColors[idx + 2] = p.color[2];
        initialSizes[i] = p.size;
      }

      geometry = new Geometry(gl, {
        position: { size: 3, data: initialPositions },
        color: { size: 3, data: initialColors },
        size: { size: 1, data: initialSizes },
      });

      mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
      scene = new Transform();
      mesh.setParent(scene);

      // Store refs
      rendererRef.current = renderer;
      cameraRef.current = camera;
      meshRef.current = mesh;
      sceneRef.current = scene;
      programRef.current = program;
      geometryRef.current = geometry;
      isInitializedRef.current = true;

      // Animation loop
      const update = (currentTime: number) => {
        if (!isInitializedRef.current || !rendererRef.current || !cameraRef.current) {
          return;
        }

        animationFrameRef.current = requestAnimationFrame(update);
        
        const deltaTime = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
        lastTimeRef.current = currentTime;

        const currentParticles = particlesRef.current;
        if (!currentParticles.length || currentParticles.length !== skills.length) {
          return;
        }

        // Get current props from refs to avoid stale closures
        const currentAttractionPoint = attractionPointRef.current;
        const currentMousePosition = mousePositionRef.current;

        // Update physics
        for (let i = 0; i < currentParticles.length; i++) {
          const p = currentParticles[i];
          let ax = 0, ay = 0, az = 0;

          // Attraction to target point
          if (currentAttractionPoint) {
            const dx = currentAttractionPoint.x - p.x;
            const dy = currentAttractionPoint.y - p.y;
            const dz = currentAttractionPoint.z - p.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (dist > 0.01) {
              const force = ATTRACTION_STRENGTH * currentAttractionPoint.strength / (dist * dist + 0.1);
              ax += dx * force;
              ay += dy * force;
              az += dz * force;
            }
          }

          // Repulsion between particles
          for (let j = 0; j < currentParticles.length; j++) {
            if (i === j) continue;
            const other = currentParticles[j];
            const dx = p.x - other.x;
            const dy = p.y - other.y;
            const dz = p.z - other.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (dist < REPULSION_DISTANCE && dist > 0) {
              const force = REPULSION_STRENGTH / (dist * dist + 0.01);
              ax += dx * force;
              ay += dy * force;
              az += dz * force;
            }
          }

          // Mouse attraction
          if (currentMousePosition) {
            const mouseX = (currentMousePosition.x / window.innerWidth) * 4 - 2;
            const mouseY = -((currentMousePosition.y / window.innerHeight) * 4 - 2);
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < MOUSE_DISTANCE) {
              const force = MOUSE_ATTRACTION / (dist + 0.1);
              ax += dx * force;
              ay += dy * force;
            }
          }

          // Update velocity
          p.vx += ax * deltaTime;
          p.vy += ay * deltaTime;
          p.vz += az * deltaTime;

          // Apply damping
          p.vx *= DAMPING;
          p.vy *= DAMPING;
          p.vz *= DAMPING;

          // Update position
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          // Boundary constraints
          const boundary = 4;
          if (Math.abs(p.x) > boundary) {
            p.x = Math.sign(p.x) * boundary;
            p.vx *= -0.5;
          }
          if (Math.abs(p.y) > boundary) {
            p.y = Math.sign(p.y) * boundary;
            p.vy *= -0.5;
          }
          if (Math.abs(p.z) > boundary) {
            p.z = Math.sign(p.z) * boundary;
            p.vz *= -0.5;
          }

          // Update trail
          p.trail.push({ x: p.x, y: p.y, z: p.z });
          if (p.trail.length > TRAIL_LENGTH) {
            p.trail.shift();
          }
        }

        // Update geometry
        const positions = geometry.attributes.position.data as Float32Array;
        const colors = geometry.attributes.color.data as Float32Array;
        const sizes = geometry.attributes.size.data as Float32Array;

        for (let i = 0; i < currentParticles.length; i++) {
          const p = currentParticles[i];
          const idx = i * 3;
          positions[idx] = p.x;
          positions[idx + 1] = p.y;
          positions[idx + 2] = p.z;
          colors[idx] = p.color[0];
          colors[idx + 1] = p.color[1];
          colors[idx + 2] = p.color[2];
          sizes[i] = p.size;
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        geometry.attributes.size.needsUpdate = true;

        // Update time uniform
        program.uniforms.uTime.value = currentTime * 0.001;

        // Render
        try {
          renderer.render({ scene, camera });
        } catch (renderError) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Render error:', renderError);
          }
        }
      };

      // Start animation loop
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(update);
      
      // Mark as ready after first frame
      requestAnimationFrame(() => {
        setIsReady(true);
        onReady?.();
        if (initTimeoutRef.current !== undefined) {
          clearTimeout(initTimeoutRef.current);
          initTimeoutRef.current = undefined;
        }
      });

      // Timeout protection
      initTimeoutRef.current = setTimeout(() => {
        if (!isReady) {
          const timeoutError = new Error('WebGL initialization timeout');
          setError(timeoutError);
          onError?.(timeoutError);
          cleanup();
        }
      }, INIT_TIMEOUT);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('WebGL initialization failed');
      setError(error);
      onError?.(error);
      cleanup();
      
      if (process.env.NODE_ENV === 'development') {
        console.error('WebGL initialization error:', error);
      }
    }

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webglSupport.isSupported, webglSupport.isInitialized, skills.length]);

  // Show error or loading state
  if (error || !webglSupport.isSupported) {
    return (
      <div className={`relative w-full h-full bg-transparent ${className}`}>
        {/* Error state - will be handled by parent fallback */}
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className={`relative w-full h-full bg-transparent ${className}`}>
        {/* Loading state - transparent, parent will show fallback */}
      </div>
    );
  }

  return <div ref={containerRef} className={`relative w-full h-full bg-transparent ${className}`} />;
};

export default FluidSkillParticles;
