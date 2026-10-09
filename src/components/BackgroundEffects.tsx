import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const BackgroundEffects: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    const canvas = renderer.domElement;
    canvas.className = 'w-full h-full block';
    container.appendChild(canvas);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.055);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 120);
    camera.position.set(0, 0, 14);

    // Three-Point Dynamic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const pointLightViolet = new THREE.PointLight(0x8b5cf6, 8, 35);
    pointLightViolet.position.set(6, 5, 6);
    scene.add(pointLightViolet);

    const pointLightCyan = new THREE.PointLight(0x38bdf8, 6, 35);
    pointLightCyan.position.set(-7, -4, 5);
    scene.add(pointLightCyan);

    // 1. 3D Starfield / Kinetic Particle Lattice
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorViolet = new THREE.Color(0x8b5cf6);
    const colorCyan = new THREE.Color(0x38bdf8);
    const colorWhite = new THREE.Color(0xe4e4e7);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 38;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 28;

      const mixChoice = Math.random();
      const c =
        mixChoice > 0.6
          ? colorViolet
          : mixChoice > 0.3
            ? colorCyan
            : colorWhite;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });

    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // 2. Scroll-Choreographed 3D Mirage Sculpture Group
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    const wireMatViolet = new THREE.MeshStandardMaterial({
      color: 0xa78bfa,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });

    const iridescentShardMat = new THREE.MeshPhysicalMaterial({
      color: 0xc4b5fd,
      emissive: 0x1e1b4b,
      emissiveIntensity: 0.3,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.28,
    });

    // Central Background Sculptural Torus Knot
    const bgKnotGeo = new THREE.TorusKnotGeometry(3.6, 0.85, 140, 20, 2, 3);
    const bgKnot = new THREE.Mesh(bgKnotGeo, wireMatViolet);
    worldGroup.add(bgKnot);

    // Concentric Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(6.5, 0.03, 16, 120);
    const ring1 = new THREE.Mesh(ring1Geo, iridescentShardMat);
    ring1.rotation.x = Math.PI / 2.6;
    worldGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(8.2, 0.02, 16, 120);
    const ring2 = new THREE.Mesh(ring2Geo, wireMatViolet);
    ring2.rotation.y = Math.PI / 3;
    worldGroup.add(ring2);

    // Floating 3D Crystal Shards in Deep Space
    const shardsGroup = new THREE.Group();
    scene.add(shardsGroup);
    const shardMeshes: Array<{
      mesh: THREE.Mesh;
      rx: number;
      ry: number;
      floatOffset: number;
      baseY: number;
    }> = [];

    const shardGeo = new THREE.OctahedronGeometry(0.32, 0);
    shardGeo.scale(0.7, 1.6, 0.7);

    for (let i = 0; i < 22; i++) {
      const mesh = new THREE.Mesh(
        shardGeo,
        i % 2 === 0 ? iridescentShardMat : wireMatViolet
      );
      const angle = (i / 22) * Math.PI * 2;
      const radius = 5.5 + (i % 4) * 2.2;
      const baseY = (Math.random() - 0.5) * 18;
      mesh.position.set(
        Math.cos(angle) * radius,
        baseY,
        Math.sin(angle) * radius - 3
      );
      shardsGroup.add(mesh);
      shardMeshes.push({
        mesh,
        rx: (Math.random() - 0.5) * 0.025,
        ry: (Math.random() - 0.5) * 0.025,
        floatOffset: Math.random() * Math.PI * 2,
        baseY,
      });
    }

    let mouseX = 0;
    let mouseY = 0;
    let targetScrollY = window.scrollY;
    let smoothScrollY = window.scrollY;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / width - 0.5) * 2;
      mouseY = (e.clientY / height - 0.5) * 2;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      smoothScrollY += (targetScrollY - smoothScrollY) * 0.06;
      const scrollRatio = smoothScrollY * 0.0012;

      // Camera 3D flight path along scroll & cursor parallax
      const targetCamX = mouseX * 1.6 + Math.sin(scrollRatio * 1.5) * 1.8;
      const targetCamY = -mouseY * 1.2 - smoothScrollY * 0.0018;
      const targetCamZ = 14 - Math.sin(scrollRatio) * 2.2;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(0, camera.position.y * 0.4, 0);

      // Rotate & morph central 3D sculpture with scroll + time
      worldGroup.rotation.y = elapsed * 0.14 + scrollRatio * 1.8;
      worldGroup.rotation.x = elapsed * 0.09 + scrollRatio * 0.9;
      worldGroup.position.y = camera.position.y * 0.65;

      ring1.rotation.z = elapsed * 0.25;
      ring2.rotation.x = -elapsed * 0.2 + scrollRatio;

      // Animate individual 3D shards
      shardsGroup.rotation.y = -elapsed * 0.06 + scrollRatio * 0.7;
      for (let i = 0; i < shardMeshes.length; i++) {
        const s = shardMeshes[i];
        s.mesh.rotation.x += s.rx;
        s.mesh.rotation.y += s.ry;
        s.mesh.position.y =
          s.baseY + Math.sin(elapsed * 1.5 + s.floatOffset) * 0.45;
      }

      // Starfield rotation
      particleSystem.rotation.y = elapsed * 0.035 + scrollRatio * 0.5;
      particleSystem.rotation.x = elapsed * 0.018;

      // Dynamic orbiting lights
      pointLightViolet.position.x = Math.cos(elapsed * 0.7) * 9;
      pointLightViolet.position.z = Math.sin(elapsed * 0.7) * 9;
      pointLightCyan.position.x = Math.cos(-elapsed * 0.5) * 9;
      pointLightCyan.position.y = Math.sin(-elapsed * 0.5) * 7;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050507]">
      {/* Studio Mirage Ambient Lighting Fields */}
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[960px] h-[540px] bg-gradient-to-b from-[#7042f8]/15 via-[#38bdf8]/06 to-transparent blur-[130px] rounded-full" />
      <div className="absolute top-[50%] -left-[12%] w-[580px] h-[580px] bg-[#4c1d95]/12 blur-[150px] rounded-full" />

      {/* Three.js Scroll-Choreographed 3D Spatial Stage */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full opacity-90" />

      {/* Subtle Editorial Film Grain */}
      <div className="absolute inset-0 noise-overlay pointer-events-none opacity-35 mix-blend-overlay" />
    </div>
  );
};
