import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { asuraStudioAbstract } from '../lib/assets';

export type GeometryMode = 'arise_monolith' | 'kinetic_torus' | 'discord_nexus';
export type MaterialFinish = 'iridescent' | 'wireframe' | 'obsidian';

interface Mirage3DShowcaseProps {
  className?: string;
}

const GEOMETRY_MODES: Array<{
  id: GeometryMode;
  index: string;
  label: string;
  subtitle: string;
}> = [
  {
    id: 'arise_monolith',
    index: '01',
    label: 'ARISE SMP Monolith',
    subtitle: 'Faceted Crystal & Orbital Rings',
  },
  {
    id: 'kinetic_torus',
    index: '02',
    label: 'Asura Kinetic Core',
    subtitle: 'Sculptural Torus Knot',
  },
  {
    id: 'discord_nexus',
    index: '03',
    label: 'Community Lattice',
    subtitle: 'Geodesic Polyhedron',
  },
];

export const Mirage3DShowcase: React.FC<Mirage3DShowcaseProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeMode, setActiveMode] = useState<GeometryMode>('arise_monolith');
  const [finish, setFinish] = useState<MaterialFinish>('iridescent');
  const [webglFallback, setWebglFallback] = useState(false);

  const modeRef = useRef<GeometryMode>(activeMode);
  const finishRef = useRef<MaterialFinish>(finish);

  useEffect(() => {
    modeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFallback(true);
      return;
    }

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 480;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.innerHTML = '';
    const canvas = renderer.domElement;
    canvas.className = 'w-full h-full block cursor-grab active:cursor-grabbing';
    container.appendChild(canvas);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFallback(true);
    };
    const handleContextRestored = () => {
      setWebglFallback(false);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.6);

    // Studio Mirage Three-Point Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    // Key Light (Warm Violet-White)
    const keyLight = new THREE.DirectionalLight(0xf5f3ff, 2.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Fill Light (Cool Cyan)
    const fillLight = new THREE.PointLight(0x38bdf8, 4.5, 16);
    fillLight.position.set(-4.5, -2.5, 3);
    scene.add(fillLight);

    // Rim Light (Electric Violet)
    const rimLight = new THREE.PointLight(0x7042f8, 6.0, 18);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Root 3D Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Shared Materials
    const createPrimaryMaterial = (matFinish: MaterialFinish) => {
      if (matFinish === 'wireframe') {
        return new THREE.MeshStandardMaterial({
          color: 0xa78bfa,
          emissive: 0x3b0764,
          emissiveIntensity: 0.45,
          metalness: 0.85,
          roughness: 0.15,
          wireframe: true,
        });
      }
      if (matFinish === 'obsidian') {
        return new THREE.MeshPhysicalMaterial({
          color: 0x0f0f16,
          metalness: 0.92,
          roughness: 0.12,
          clearcoat: 1.0,
          clearcoatRoughness: 0.08,
          reflectivity: 1.0,
        });
      }
      return new THREE.MeshPhysicalMaterial({
        color: 0xd8b4fe,
        emissive: 0x1e1b4b,
        emissiveIntensity: 0.35,
        metalness: 0.88,
        roughness: 0.14,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        iridescence: 1.0,
        iridescenceIOR: 1.4,
      });
    };

    const wireframeOverlayMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x7042f8,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.2,
    });

    // Build Geometry Groups for the 3 Modes
    const buildSculpture = (mode: GeometryMode, matFinish: MaterialFinish) => {
      while (rootGroup.children.length > 0) {
        const child = rootGroup.children[0];
        rootGroup.remove(child);
      }

      const mainMat = createPrimaryMaterial(matFinish);

      if (mode === 'arise_monolith') {
        // Central ARISE SMP Octahedron Monolith + Floating Crystal Shards + Dual Orbital Rings
        const monolithGeo = new THREE.OctahedronGeometry(1.35, 0);
        monolithGeo.scale(0.82, 1.38, 0.82);
        const monolith = new THREE.Mesh(monolithGeo, mainMat);
        rootGroup.add(monolith);

        const cage = new THREE.Mesh(monolithGeo.clone().scale(1.06, 1.06, 1.06), wireframeOverlayMat);
        rootGroup.add(cage);

        // Orbital rings
        const ring1Geo = new THREE.TorusGeometry(1.95, 0.018, 16, 100);
        const ring1 = new THREE.Mesh(ring1Geo, ringMaterial);
        ring1.rotation.x = Math.PI / 2.4;
        ring1.rotation.y = 0.3;
        rootGroup.add(ring1);

        const ring2Geo = new THREE.TorusGeometry(2.25, 0.012, 16, 100);
        const ring2 = new THREE.Mesh(ring2Geo, wireframeOverlayMat);
        ring2.rotation.x = -Math.PI / 3;
        ring2.rotation.z = 0.5;
        rootGroup.add(ring2);

        // Floating satellite crystals
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const shardGeo = new THREE.OctahedronGeometry(0.18, 0);
          shardGeo.scale(0.7, 1.5, 0.7);
          const shard = new THREE.Mesh(shardGeo, mainMat);
          shard.position.set(Math.cos(angle) * 1.9, Math.sin(angle * 2) * 0.45, Math.sin(angle) * 1.9);
          rootGroup.add(shard);
        }
      } else if (mode === 'kinetic_torus') {
        // Studio Mirage Sculptural Torus Knot
        const knotGeo = new THREE.TorusKnotGeometry(1.1, 0.34, 160, 28, 2, 3);
        const knot = new THREE.Mesh(knotGeo, mainMat);
        rootGroup.add(knot);

        const outerCageGeo = new THREE.IcosahedronGeometry(2.05, 1);
        const outerCage = new THREE.Mesh(outerCageGeo, wireframeOverlayMat);
        rootGroup.add(outerCage);
      } else {
        // Geodesic Community Lattice
        const icoGeo = new THREE.IcosahedronGeometry(1.45, 1);
        const ico = new THREE.Mesh(icoGeo, mainMat);
        rootGroup.add(ico);

        const innerCoreGeo = new THREE.DodecahedronGeometry(0.85, 0);
        const innerCore = new THREE.Mesh(innerCoreGeo, ringMaterial);
        rootGroup.add(innerCore);

        const ringGeo = new THREE.TorusGeometry(2.05, 0.02, 16, 100);
        const ring = new THREE.Mesh(ringGeo, ringMaterial);
        ring.rotation.x = Math.PI / 3;
        rootGroup.add(ring);
      }
    };

    let currentBuiltMode = modeRef.current;
    let currentBuiltFinish = finishRef.current;
    buildSculpture(currentBuiltMode, currentBuiltFinish);

    // Interactive Pointer / Drag state
    let isDragging = false;
    let prevPointer = { x: 0, y: 0 };
    let targetRotX = 0.25;
    let targetRotY = 0.4;
    let currentRotX = 0.25;
    let currentRotY = 0.4;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointer = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      if (isDragging) {
        const dx = e.clientX - prevPointer.x;
        const dy = e.clientY - prevPointer.y;
        targetRotY += dx * 0.012;
        targetRotX += dy * 0.012;
        prevPointer = { x: e.clientX, y: e.clientY };
      } else {
        targetRotY += relX * 0.008;
        targetRotX = relY * 0.45;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 520;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (
        modeRef.current !== currentBuiltMode ||
        finishRef.current !== currentBuiltFinish
      ) {
        currentBuiltMode = modeRef.current;
        currentBuiltFinish = finishRef.current;
        buildSculpture(currentBuiltMode, currentBuiltFinish);
      }

      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        targetRotY += 0.0045;
      }

      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      rootGroup.rotation.x = currentRotX + Math.sin(elapsed * 0.7) * 0.08;
      rootGroup.rotation.y = currentRotY;
      rootGroup.position.y = Math.sin(elapsed * 1.4) * 0.1;

      // Subtle counter-rotation for rings/cage children
      if (rootGroup.children[1]) {
        rootGroup.children[1].rotation.z = -elapsed * 0.25;
      }
      if (rootGroup.children[2]) {
        rootGroup.children[2].rotation.z = elapsed * 0.35;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      data-cursor="DRAG 3D"
      className={`relative w-full h-[460px] sm:h-[520px] rounded-2xl overflow-hidden border border-white/[0.09] bg-[#08080c]/80 backdrop-blur-xl flex flex-col justify-between ${className}`}
    >
      {/* Top Semantic HUD Overlay */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.06] bg-black/30 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
          <span>Interactive 3D Stage</span>
          <span aria-hidden="true">·</span>
          <span className="text-zinc-400">Drag to Orbit</span>
        </div>

        {/* Material Finish Switcher (Segmented Interactive Controls) */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
          {(['iridescent', 'wireframe', 'obsidian'] as MaterialFinish[]).map((mat) => (
            <button
              key={mat}
              type="button"
              onClick={() => setFinish(mat)}
              className={`px-2.5 py-1 text-[11px] font-mono capitalize rounded-md transition-colors whitespace-nowrap ${
                finish === mat
                  ? 'bg-white text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {mat}
            </button>
          ))}
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport or Fallback */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {webglFallback ? (
          <img
            src={asuraStudioAbstract}
            alt="Asura Kinetics 3D Architecture"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <div ref={containerRef} className="w-full h-full" />
        )}
      </div>

      {/* Bottom Interactive Sculpture Selector */}
      <div className="relative z-10 grid grid-cols-3 border-t border-white/[0.08] bg-black/40 backdrop-blur-md divide-x divide-white/[0.06]">
        {GEOMETRY_MODES.map((m) => {
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveMode(m.id)}
              className={`p-3.5 text-left transition-colors ${
                isActive ? 'bg-white/[0.07] text-white' : 'text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200'
              }`}
            >
              <div className="text-[11px] font-mono text-violet-400 mb-0.5 tabular-nums">
                {m.index}.
              </div>
              <div className="text-xs font-display font-semibold tracking-tight truncate">
                {m.label}
              </div>
              <div className="text-[11px] text-zinc-400 truncate hidden sm:block">
                {m.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
