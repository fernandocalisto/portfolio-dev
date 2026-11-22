import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PROJECTS } from '../../../shared/portfolioData';
import type { ProjectId } from '../../../shared/types';
import { useLocale } from '../../context/LocaleContext';
import { SaturnFallbackSvg } from './SaturnFallbackSvg';

export interface SaturnPortfolioSceneProps {
  onSelectProject: (projectId: ProjectId) => void;
}

const PLANET_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vLocalPosition;

  void main() {
    vLocalPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PLANET_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec3 uObsidian;
  uniform vec3 uGold;
  uniform vec3 uCopper;
  uniform vec3 uTeal;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vLocalPosition;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(
        mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),
        f.y
      ),
      mix(
        mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),
        f.y
      ),
      f.z
    );
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    vec3 sphereDir = normalize(vLocalPosition);

    // Fresnel rim calculation
    float ndotv = clamp(dot(normal, viewDir), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 2.8);
    float crispRim = pow(1.0 - ndotv, 4.8);

    // Subtle directional key light from upper-right
    vec3 keyLightDir = normalize(vec3(0.68, 0.48, 0.56));
    float keyLight = clamp(dot(normal, keyLightDir), 0.0, 1.0);

    // Subtle swirling surface grain & zonal bands
    float lat = sphereDir.y;
    float swirl = noise(vec3(sphereDir.x * 3.5 + uTime * 0.04, lat * 6.0, sphereDir.z * 3.5));
    float fineBand = sin(lat * 18.0 + swirl * 2.4) * 0.5 + 0.5;

    // Deep obsidian base with gentle atmospheric sculpting
    vec3 color = uObsidian + vec3(0.02, 0.028, 0.036) * (0.35 + 0.65 * keyLight);
    color += vec3(0.025, 0.02, 0.015) * fineBand * (0.25 + 0.55 * keyLight);

    // Subtle internal teal atmospheric filament near the equatorial belt
    float bandCenter = sin(sphereDir.x * 2.2 - uTime * 0.16) * 0.07 + 0.04;
    float tealBand = exp(-pow((lat - bandCenter) * 7.5, 2.0));
    float tealFilament = tealBand * (0.45 + 0.55 * swirl) * (0.38 + 0.62 * (1.0 - fresnel * 0.5));
    color += uTeal * tealFilament * 0.28;

    // Secondary warm bronze contour band in upper hemisphere
    float goldBand = exp(-pow((lat + 0.34) * 9.5, 2.0)) * (0.3 + 0.7 * swirl);
    color += uGold * goldBand * 0.12 * (0.4 + 0.6 * keyLight);

    // Warm bronze-gold Fresnel rim glow modulated by key light
    vec3 rimTone = mix(uCopper, uGold, 0.55 + 0.45 * keyLight);
    color += rimTone * fresnel * (0.58 + 0.52 * keyLight);
    color += vec3(0.95, 0.86, 0.68) * crispRim * (0.22 + 0.35 * keyLight);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const ATMOSPHERE_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uGold;
  uniform vec3 uTeal;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float rim = clamp(1.0 - abs(dot(normal, viewDir)), 0.0, 1.0);
    float glow = pow(rim, 3.2) * 0.42;
    vec3 tint = mix(uTeal, uGold, 0.68);
    gl_FragColor = vec4(tint, glow);
  }
`;

const RING_PARTICLE_VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float shimmer = 0.72 + 0.28 * sin(uTime * 1.15 + aPhase);
    vAlpha = shimmer;
    gl_PointSize = clamp(aSize * uPixelRatio * (18.0 / max(-mvPosition.z, 1.0)), 1.5, 11.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const RING_PARTICLE_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;
    float radial = smoothstep(0.5, 0.06, dist);
    gl_FragColor = vec4(vColor, radial * vAlpha * 0.85);
  }
`;

function createGlowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.28, 'rgba(255, 255, 255, 0.62)');
    gradient.addColorStop(0.62, 'rgba(255, 255, 255, 0.16)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const SaturnPortfolioScene: React.FC<SaturnPortfolioSceneProps> = ({ onSelectProject }) => {
  const { locale, t } = useLocale();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hoveredIdRef = useRef<ProjectId | null>(null);

  const [hoveredId, setHoveredId] = useState<ProjectId | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const handleSetHovered = (id: ProjectId | null) => {
    hoveredIdRef.current = id;
    setHoveredId(id);
  };

  useEffect(() => {
    if (webglFailed) return;
    const container = containerRef.current;
    const mount = canvasMountRef.current;
    if (!container || !mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const scene = new THREE.Scene();
    const initialWidth = Math.max(container.clientWidth, 320);
    const initialHeight = Math.max(container.clientHeight, 320);
    const initialIsMobile = initialWidth < 640;

    const camera = new THREE.PerspectiveCamera(
      initialIsMobile ? 46 : 42,
      initialWidth / initialHeight,
      0.1,
      100
    );

    const getDpr = (width: number) =>
      Math.min(window.devicePixelRatio || 1, width < 640 ? 1.5 : 2);

    renderer.setPixelRatio(getDpr(initialWidth));
    renderer.setSize(initialWidth, initialHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    mount.appendChild(renderer.domElement);

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setWebglFailed(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    // Track disposable GPU resources
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    const glowTexture = createGlowTexture();
    textures.push(glowTexture);

    // Background Starfield
    const starCount = initialIsMobile ? 150 : 320;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starPalette = [
      new THREE.Color('#F1EFEA'),
      new THREE.Color('#C59538'),
      new THREE.Color('#94A3B8'),
      new THREE.Color('#38B2AC'),
    ];
    for (let i = 0; i < starCount; i++) {
      const r = 16 + Math.random() * 24;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi) * 0.72;
      starPositions[i * 3 + 2] = -Math.abs(r * Math.sin(phi) * Math.sin(theta)) - 4;

      const c = starPalette[i % starPalette.length];
      const brightness = 0.38 + Math.random() * 0.55;
      starColors[i * 3] = c.r * brightness;
      starColors[i * 3 + 1] = c.g * brightness;
      starColors[i * 3 + 2] = c.b * brightness;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    geometries.push(starGeo);

    const starMat = new THREE.PointsMaterial({
      size: initialIsMobile ? 0.08 : 0.075,
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    materials.push(starMat);
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Master Saturn Group (handles viewport positioning & interactive parallax/drag)
    const saturnRoot = new THREE.Group();
    scene.add(saturnRoot);

    // Tilted Orbital Plane (~24 degrees obliquity)
    const tiltedGroup = new THREE.Group();
    tiltedGroup.rotation.x = THREE.MathUtils.degToRad(24);
    tiltedGroup.rotation.z = THREE.MathUtils.degToRad(-15);
    saturnRoot.add(tiltedGroup);

    // 1. Central Saturn Planet with custom GLSL ShaderMaterial
    const planetRadius = 1.16;
    const planetGeo = new THREE.SphereGeometry(planetRadius, 64, 64);
    geometries.push(planetGeo);

    const planetUniforms = {
      uTime: { value: 0 },
      uObsidian: { value: new THREE.Color('#0B0F13') },
      uGold: { value: new THREE.Color('#C59538') },
      uCopper: { value: new THREE.Color('#D4722C') },
      uTeal: { value: new THREE.Color('#2DD4BF') },
    };
    const planetMat = new THREE.ShaderMaterial({
      vertexShader: PLANET_VERTEX_SHADER,
      fragmentShader: PLANET_FRAGMENT_SHADER,
      uniforms: planetUniforms,
    });
    materials.push(planetMat);

    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    tiltedGroup.add(planetMesh);

    // Soft Back-Side Atmospheric Rim Halo
    const atmoGeo = new THREE.SphereGeometry(planetRadius * 1.14, 48, 48);
    geometries.push(atmoGeo);
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: ATMOSPHERE_VERTEX_SHADER,
      fragmentShader: ATMOSPHERE_FRAGMENT_SHADER,
      uniforms: {
        uGold: { value: new THREE.Color('#C59538') },
        uTeal: { value: new THREE.Color('#2DD4BF') },
      },
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    materials.push(atmoMat);
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    tiltedGroup.add(atmoMesh);

    // 2. Saturn Particle Ring System (~2200 desktop / ~1000 mobile)
    const particleCount = initialIsMobile ? 1000 : 2200;
    const ringPositions = new Float32Array(particleCount * 3);
    const ringColors = new Float32Array(particleCount * 3);
    const ringSizes = new Float32Array(particleCount);
    const ringPhases = new Float32Array(particleCount);

    const goldCol = new THREE.Color('#C59538');
    const copperCol = new THREE.Color('#D4722C');
    const ivoryCol = new THREE.Color('#F1EFEA');
    const tealCol = new THREE.Color('#2DD4BF');
    const tempColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      // Concentric layered ring bands with subtle Cassini-like gaps
      const bandRoll = Math.random();
      let radius: number;
      if (bandRoll < 0.22) {
        radius = 1.68 + Math.random() * 0.52;
      } else if (bandRoll < 0.72) {
        radius = 2.28 + Math.random() * 0.78;
      } else {
        radius = 3.16 + Math.random() * 0.68;
      }

      const angle = Math.random() * Math.PI * 2;
      const ySpread = (Math.random() - 0.5) * 0.065;

      ringPositions[i * 3] = Math.cos(angle) * radius;
      ringPositions[i * 3 + 1] = ySpread;
      ringPositions[i * 3 + 2] = Math.sin(angle) * radius;

      const colorRoll = Math.random();
      if (colorRoll < 0.52) {
        tempColor.copy(goldCol).lerp(ivoryCol, Math.random() * 0.28);
      } else if (colorRoll < 0.84) {
        tempColor.copy(copperCol).lerp(goldCol, Math.random() * 0.45);
      } else if (colorRoll < 0.94) {
        tempColor.copy(ivoryCol);
      } else {
        tempColor.copy(tealCol).lerp(ivoryCol, 0.2);
      }

      const radialFade = 0.65 + 0.35 * Math.sin(((radius - 1.68) / 2.2) * Math.PI);
      ringColors[i * 3] = tempColor.r * radialFade;
      ringColors[i * 3 + 1] = tempColor.g * radialFade;
      ringColors[i * 3 + 2] = tempColor.b * radialFade;

      ringSizes[i] = 1.1 + Math.random() * 2.1;
      ringPhases[i] = Math.random() * Math.PI * 2;
    }

    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
    ringGeo.setAttribute('aColor', new THREE.BufferAttribute(ringColors, 3));
    ringGeo.setAttribute('aSize', new THREE.BufferAttribute(ringSizes, 1));
    ringGeo.setAttribute('aPhase', new THREE.BufferAttribute(ringPhases, 1));
    geometries.push(ringGeo);

    const ringParticleUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: getDpr(initialWidth) },
    };

    const ringParticleMat = new THREE.ShaderMaterial({
      vertexShader: RING_PARTICLE_VERTEX_SHADER,
      fragmentShader: RING_PARTICLE_FRAGMENT_SHADER,
      uniforms: ringParticleUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    materials.push(ringParticleMat);

    const ringParticles = new THREE.Points(ringGeo, ringParticleMat);
    tiltedGroup.add(ringParticles);

    // 3 Thin Orbital Metallic Rings matching the 3 project orbit radii
    const orbitTracks: Array<{ radius: number; color: string; opacity: number; tube: number }> = [
      { radius: 2.35, color: '#D4722C', opacity: 0.36, tube: 0.0085 },
      { radius: 2.95, color: '#C59538', opacity: 0.44, tube: 0.0095 },
      { radius: 3.45, color: '#38B2AC', opacity: 0.3, tube: 0.008 },
    ];

    orbitTracks.forEach((track) => {
      const torusGeo = new THREE.TorusGeometry(track.radius, track.tube, 10, 144);
      geometries.push(torusGeo);
      const torusMat = new THREE.MeshBasicMaterial({
        color: track.color,
        transparent: true,
        opacity: track.opacity,
        depthWrite: false,
      });
      materials.push(torusMat);
      const torusMesh = new THREE.Mesh(torusGeo, torusMat);
      torusMesh.rotation.x = Math.PI / 2;
      tiltedGroup.add(torusMesh);
    });

    // 3. Five Project Satellites (3D luminous orb + halo sprite + equatorial accent ring)
    interface SatelliteRuntime {
      id: ProjectId;
      group: THREE.Group;
      halo: THREE.Sprite;
      baseHaloScale: number;
      angle: number;
      radius: number;
      speed: number;
      yOffset: number;
    }

    const satellites: SatelliteRuntime[] = PROJECTS.map((project, index) => {
      const group = new THREE.Group();

      const orbGeo = new THREE.SphereGeometry(project.orbit.size, 24, 24);
      geometries.push(orbGeo);
      const orbMat = new THREE.MeshBasicMaterial({
        color: project.badgeTextColor,
      });
      materials.push(orbMat);
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      group.add(orbMesh);

      // Subtle ring around each satellite orb
      const satRingGeo = new THREE.TorusGeometry(project.orbit.size * 1.65, 0.01, 8, 48);
      geometries.push(satRingGeo);
      const satRingMat = new THREE.MeshBasicMaterial({
        color: project.accentColor,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      });
      materials.push(satRingMat);
      const satRing = new THREE.Mesh(satRingGeo, satRingMat);
      satRing.rotation.x = Math.PI / 2.2;
      group.add(satRing);

      // Soft additive halo sprite
      const haloMat = new THREE.SpriteMaterial({
        map: glowTexture,
        color: project.accentColor,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      materials.push(haloMat);
      const halo = new THREE.Sprite(haloMat);
      const baseHaloScale = project.orbit.size * 6.4;
      halo.scale.set(baseHaloScale, baseHaloScale, 1);
      group.add(halo);

      // Slight vertical offset per ring index for organic parallax
      const yOffset = (index % 2 === 0 ? 1 : -1) * 0.04;
      group.position.set(
        Math.cos(project.orbit.initialAngle) * project.orbit.radius,
        yOffset,
        Math.sin(project.orbit.initialAngle) * project.orbit.radius
      );

      tiltedGroup.add(group);

      return {
        id: project.id,
        group,
        halo,
        baseHaloScale,
        angle: project.orbit.initialAngle,
        radius: project.orbit.radius,
        speed: project.orbit.speed,
        yOffset,
      };
    });

    // Responsive camera & Saturn framing
    let viewportWidth = initialWidth;
    let viewportHeight = initialHeight;

    const updateLayout = (width: number, height: number) => {
      viewportWidth = Math.max(width, 300);
      viewportHeight = Math.max(height, 300);
      const aspect = viewportWidth / viewportHeight;
      const isMobile = viewportWidth < 640;
      const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

      const dpr = getDpr(viewportWidth);
      renderer.setPixelRatio(dpr);
      renderer.setSize(viewportWidth, viewportHeight);
      ringParticleUniforms.uPixelRatio.value = dpr;

      camera.fov = isMobile ? 46 : 42;
      camera.aspect = aspect;

      if (isMobile) {
        // Pull camera back proportionally so full Saturn + outer ring fit in upper half
        const halfFovTan = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
        const requiredDistForWidth = 4.1 / (halfFovTan * Math.max(aspect, 0.42));
        const camZ = Math.min(Math.max(requiredDistForWidth, 12.2), 20.5);
        camera.position.set(0, 1.5, camZ);
        saturnRoot.position.set(0, camZ * 0.14, 0);
        camera.lookAt(0, 0, 0);
      } else if (isTablet) {
        camera.position.set(0, 1.35, 11.4);
        saturnRoot.position.set(1.05, 0.35, 0);
        camera.lookAt(0, 0, 0);
      } else {
        camera.position.set(0, 1.25, 9.8);
        saturnRoot.position.set(1.75, 0.12, 0);
        camera.lookAt(0, 0, 0);
      }

      camera.updateProjectionMatrix();
    };

    updateLayout(initialWidth, initialHeight);

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        updateLayout(width, height);
      }
    });
    resizeObserver.observe(container);

    // Interactive pointer parallax (desktop) + horizontal touch drag (mobile)
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    let dragRotationY = 0;
    let targetDragRotationY = 0;
    let isDragging = false;
    let lastPointerX = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const dx = e.clientX - lastPointerX;
        lastPointerX = e.clientX;
        targetDragRotationY += dx * 0.0065;
        return;
      }

      if (e.pointerType === 'mouse' && viewportWidth >= 640) {
        const rect = container.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
        const ny = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
        targetTiltY = THREE.MathUtils.clamp(nx, -1, 1) * 0.18;
        targetTiltX = THREE.MathUtils.clamp(ny, -1, 1) * 0.14;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Do not hijack button clicks
      const target = e.target as HTMLElement | null;
      if (target && target.closest('button, a')) return;
      if (viewportWidth < 640 || e.pointerType === 'touch') {
        isDragging = true;
        lastPointerX = e.clientX;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handlePointerLeave = () => {
      isDragging = false;
      targetTiltX = 0;
      targetTiltY = 0;
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Pause animation when offscreen or tab is hidden
    let isVisible = true;
    let isPageVisible = !document.hidden;
    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let speedMultiplier = 1;

    const projVec = new THREE.Vector3();
    const worldPos = new THREE.Vector3();
    const viewPos = new THREE.Vector3();
    const planetWorldPos = new THREE.Vector3();
    const planetViewPos = new THREE.Vector3();
    const planetNdc = new THREE.Vector3();
    const planetEdgeWorld = new THREE.Vector3();
    const planetEdgeNdc = new THREE.Vector3();

    const shouldRun = () => isVisible && isPageVisible;

    const renderFrame = (now: number) => {
      if (!shouldRun()) {
        rafId = 0;
        return;
      }

      rafId = window.requestAnimationFrame(renderFrame);

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;

      // Smooth orbital slowdown on hover/focus (0.15x)
      const targetSpeed = hoveredIdRef.current ? 0.15 : 1.0;
      speedMultiplier += (targetSpeed - speedMultiplier) * Math.min(1, dt * 6);

      // Smooth pointer parallax & drag lerp
      currentTiltX += (targetTiltX - currentTiltX) * Math.min(1, dt * 4.5);
      currentTiltY += (targetTiltY - currentTiltY) * Math.min(1, dt * 4.5);
      dragRotationY += (targetDragRotationY - dragRotationY) * Math.min(1, dt * 6.5);

      saturnRoot.rotation.x = currentTiltX;
      saturnRoot.rotation.y = currentTiltY + dragRotationY;

      // Gentle axial planet rotation & ring drift
      planetMesh.rotation.y += dt * 0.16 * (0.4 + 0.6 * speedMultiplier);
      ringParticles.rotation.y += dt * 0.032 * speedMultiplier;
      starField.rotation.y = elapsed * 0.008;

      planetUniforms.uTime.value = elapsed;
      ringParticleUniforms.uTime.value = elapsed;

      // Advance orbiting project satellites
      for (let i = 0; i < satellites.length; i++) {
        const sat = satellites[i];
        sat.angle += sat.speed * dt * speedMultiplier;
        sat.group.position.set(
          Math.cos(sat.angle) * sat.radius,
          sat.yOffset,
          Math.sin(sat.angle) * sat.radius
        );

        const isActive = hoveredIdRef.current === sat.id;
        const targetHalo = isActive ? sat.baseHaloScale * 1.45 : sat.baseHaloScale;
        const nextScale = sat.halo.scale.x + (targetHalo - sat.halo.scale.x) * Math.min(1, dt * 8);
        sat.halo.scale.set(nextScale, nextScale, 1);
      }

      // Ensure matrices are fresh before 3D -> 2D projection
      scene.updateMatrixWorld();
      renderer.render(scene, camera);

      // Compute planet center screen position & projected screen radius for occlusion check
      planetMesh.getWorldPosition(planetWorldPos);
      planetViewPos.copy(planetWorldPos).applyMatrix4(camera.matrixWorldInverse);
      planetNdc.copy(planetWorldPos).project(camera);
      const planetScreenX = (planetNdc.x * 0.5 + 0.5) * viewportWidth;
      const planetScreenY = (-planetNdc.y * 0.5 + 0.5) * viewportHeight;

      planetEdgeWorld.copy(planetWorldPos).add(new THREE.Vector3(planetRadius, 0, 0));
      planetEdgeNdc.copy(planetEdgeWorld).project(camera);
      const planetScreenRadius = Math.abs(
        (planetEdgeNdc.x * 0.5 + 0.5) * viewportWidth - planetScreenX
      );

      // Project all 5 satellites to HTML button overlays without React re-renders
      for (let i = 0; i < satellites.length; i++) {
        const btn = buttonRefs.current[i];
        if (!btn) continue;

        const sat = satellites[i];
        sat.group.getWorldPosition(worldPos);
        viewPos.copy(worldPos).applyMatrix4(camera.matrixWorldInverse);
        projVec.copy(worldPos).project(camera);

        if (projVec.z > 1) {
          btn.style.opacity = '0';
          btn.style.pointerEvents = 'none';
          continue;
        }

        const rawSx = (projVec.x * 0.5 + 0.5) * viewportWidth;
        const rawSy = (-projVec.y * 0.5 + 0.5) * viewportHeight;
        const edgePadX = viewportWidth < 640 ? 48 : 64;
        const sx = THREE.MathUtils.clamp(rawSx, edgePadX, viewportWidth - edgePadX);
        const sy = THREE.MathUtils.clamp(rawSy, 48, viewportHeight - 48);

        const isActive = hoveredIdRef.current === sat.id;
        // View space looks down -Z: larger z is closer to camera
        const relZ = viewPos.z - planetViewPos.z;
        const depthFactor = THREE.MathUtils.clamp((relZ + 3.6) / 7.2, 0, 1);

        const distFromPlanetCenter = Math.hypot(sx - planetScreenX, sy - planetScreenY);
        const isOccludedBehindPlanet = relZ < -0.15 && distFromPlanetCenter < planetScreenRadius * 0.96;

        let scale = 0.8 + depthFactor * 0.24;
        let opacity = 0.56 + depthFactor * 0.44;
        let zIndex = Math.round(10 + depthFactor * 14);

        if (isOccludedBehindPlanet && !isActive) {
          opacity = 0.24;
          scale = 0.76;
          zIndex = 5;
        }

        if (isActive) {
          scale = 1.08;
          opacity = 1;
          zIndex = 40;
        }

        btn.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        btn.style.opacity = opacity.toFixed(3);
        btn.style.zIndex = String(zIndex);
        btn.style.pointerEvents = 'auto';
      }
    };

    const startLoop = () => {
      if (rafId === 0 && shouldRun()) {
        lastTime = performance.now();
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    const stopLoop = () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : true;
        if (shouldRun()) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.02 }
    );
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (shouldRun()) {
        startLoop();
      } else {
        stopLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startLoop();

    return () => {
      stopLoop();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointerleave', handlePointerLeave);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((tex) => tex.dispose());
      renderer.dispose();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [webglFailed]);

  if (webglFailed) {
    return <SaturnFallbackSvg onSelectProject={onSelectProject} />;
  }

  return (
    <div
      ref={containerRef}
      style={{ touchAction: 'pan-y' }}
      className="relative w-full h-full overflow-hidden select-none"
      role="region"
      aria-label={
        locale === 'en'
          ? '3D Saturn Orbital System — Orbiting Projects'
          : 'Sistema Orbital Saturno 3D — Projetos em órbita'
      }
    >
      {/* WebGL Canvas Mount */}
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* Synchronized 3D -> 2D HTML Project Satellite Buttons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PROJECTS.map((project, index) => {
          const isActive = hoveredId === project.id;
          return (
            <button
              key={project.id}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              onClick={() => onSelectProject(project.id)}
              onMouseEnter={() => handleSetHovered(project.id)}
              onMouseLeave={() => {
                if (hoveredIdRef.current === project.id) {
                  handleSetHovered(null);
                }
              }}
              onFocus={() => handleSetHovered(project.id)}
              onBlur={() => {
                if (hoveredIdRef.current === project.id) {
                  handleSetHovered(null);
                }
              }}
              aria-label={t.hero.satelliteClickAria(project.shortName)}
              style={{
                left: 0,
                top: 0,
                opacity: 0,
                willChange: 'transform, opacity',
              }}
              className={`group absolute flex items-center gap-2 rounded-full px-2.5 py-1.5 backdrop-blur-md border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold shadow-lg ${
                isActive
                  ? 'bg-brand-obsidian/95 border-brand-gold/80 text-brand-ivory shadow-glow-gold'
                  : 'bg-brand-surface/75 border-brand-hairline/90 hover:border-brand-gold/70 text-brand-ivory/95'
              }`}
            >
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: project.badgeTextColor,
                  boxShadow: `0 0 12px ${project.accentColor}`,
                }}
              />
              <span className="font-mono text-[11px] sm:text-xs font-medium tracking-wide whitespace-nowrap">
                {project.shortName}
              </span>

              {/* Micro-preview tooltip on hover or keyboard focus */}
              {isActive && (
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-1/2 bottom-full mb-2.5 -translate-x-1/2 w-max max-w-[230px] rounded-lg bg-brand-obsidian/95 border border-brand-gold/45 px-3 py-2 text-left shadow-2xl animate-fadeIn"
                >
                  <span
                    className="block font-mono text-[10px] uppercase tracking-wider"
                    style={{ color: project.badgeTextColor }}
                  >
                    {project.shortName}
                  </span>
                  <span className="block text-xs font-sans text-brand-ivory/90 leading-snug mt-0.5">
                    {project.role[locale]}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SaturnPortfolioScene;
