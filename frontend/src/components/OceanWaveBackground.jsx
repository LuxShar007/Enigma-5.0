import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function OceanWaveBackground() {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    let width  = window.innerWidth;
    let height = window.innerHeight;

    const clock = new THREE.Clock();

    /* ── Visibility gate — skip GPU work when off-screen ── */
    let isVisible = true;
    const visObs = new IntersectionObserver(
      ([e]) => { isVisible = e.isIntersecting; },
      { threshold: 0.01 }
    );
    visObs.observe(containerRef.current);

    /* ── Scene ── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02040a, 0.0028);

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 2000);
    camera.position.set(0, 75, 280);
    camera.lookAt(0, -10, -150);

    /* ── Renderer — pixel ratio capped at 1.0 for GPU savings ── */
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas:    canvasRef.current,
        antialias: false,        // off — saves ~15% GPU on background canvas
        alpha:     false,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(1);  // Never upscale a background layer
      renderer.setSize(width, height);
      renderer.setClearColor(0x02040a, 1);
    } catch (err) {
      console.error('WebGL init failed:', err);
      return;
    }

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const mouseLight = new THREE.PointLight(0x00f2fe, 3, 400);
    mouseLight.position.set(0, 100, 100);
    scene.add(mouseLight);

    const dirLight = new THREE.DirectionalLight(0x9d4edd, 2.0);
    dirLight.position.set(200, 300, 100);
    scene.add(dirLight);

    /* ── Wave Grid — 60×60 = 3,600 pts (vs 8,100 before) ── */
    const NX  = 60;
    const NZ  = 60;
    const SEP = 12;          // slightly wider spacing — same visual scale
    const COUNT = NX * NZ;

    const geometry  = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);

    let idx = 0;
    for (let ix = 0; ix < NX; ix++) {
      for (let iz = 0; iz < NZ; iz++) {
        positions[idx]     = ix * SEP - ((NX * SEP) / 2);
        positions[idx + 1] = 0;
        positions[idx + 2] = iz * SEP - ((NZ * SEP) / 2) - 100;
        idx += 3;
      }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    /* ── Particle texture (32px is plenty for a background) ── */
    const makeTexture = () => {
      const c  = document.createElement('canvas');
      c.width  = 32;
      c.height = 32;
      const ctx = c.getContext('2d');
      const g   = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0,    'rgba(255,255,255,1)');
      g.addColorStop(0.28, 'rgba(0,242,254,0.85)');
      g.addColorStop(0.65, 'rgba(157,78,221,0.4)');
      g.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(c);
    };

    const material = new THREE.PointsMaterial({
      size:       5.5,
      map:        makeTexture(),
      blending:   THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    /* ── Crystals — MeshPhongMaterial (GPU-friendly, single-pass) ── */
    const crystals = [];

    const addCrystal = (geom, color, pos) => {
      const mat = new THREE.MeshPhongMaterial({
        color,
        emissive:    new THREE.Color(color).multiplyScalar(0.12),
        specular:    new THREE.Color(0xffffff),
        shininess:   90,
        transparent: true,
        opacity:     0.72,
        side:        THREE.DoubleSide,
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(pos);
      scene.add(mesh);

      // Lightweight wireframe overlay
      const edges   = new THREE.EdgesGeometry(geom);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
      mesh.add(new THREE.LineSegments(edges, lineMat));

      crystals.push({
        mesh,
        basePos:   pos.clone(),
        rotSpeedX: (Math.random() - 0.5) * 0.012 + 0.004,
        rotSpeedY: (Math.random() - 0.5) * 0.012 + 0.007,
        curSpeedX: 0,
        curSpeedY: 0,
      });
    };

    addCrystal(new THREE.OctahedronGeometry(20),   0x00f2fe, new THREE.Vector3(-130, 40, -60));
    addCrystal(new THREE.OctahedronGeometry(24),   0x9d4edd, new THREE.Vector3(130,  60, -90));
    addCrystal(new THREE.IcosahedronGeometry(16),  0x00f5d4, new THREE.Vector3(30,   45, -170));

    /* ── Mouse — raw ref updated every mousemove ── */
    const rawMouse = { x: -9999, y: -9999 };
    const mouse    = new THREE.Vector2(-9999, -9999);
    const onMouseMove = (e) => {
      rawMouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
      rawMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    /* ── Raycaster — only used every other frame ── */
    const raycaster  = new THREE.Raycaster();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    let frameCount   = 0;
    let hasHit       = false;

    /* ── Animation loop ── */
    let rafId;

    const animate = (ts) => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      frameCount++;
      const time  = clock.getElapsedTime();
      const posArr = geometry.attributes.position.array;

      /* Raycasting every 2nd frame — halves raycaster CPU cost */
      if (frameCount % 2 === 0) {
        mouse.set(rawMouse.x, rawMouse.y);
        if (Math.abs(mouse.x) <= 1 && Math.abs(mouse.y) <= 1) {
          raycaster.setFromCamera(mouse, camera);
          hasHit = !!raycaster.ray.intersectPlane(groundPlane, intersection);
        } else {
          hasHit = false;
        }
      }

      /* Mouse light tracking */
      if (hasHit) {
        mouseLight.position.x += (intersection.x - mouseLight.position.x) * 0.06;
        mouseLight.position.z += (intersection.z - mouseLight.position.z) * 0.06;
        mouseLight.intensity   = 3.0;
      } else {
        mouseLight.intensity   = 0.8;
      }

      /* Wave vertex update */
      let i = 0;
      for (let ix = 0; ix < NX; ix++) {
        for (let iz = 0; iz < NZ; iz++) {
          const x = posArr[i];
          const z = posArr[i + 2];

          const baseWave =
            Math.sin((ix * 0.14) + time * 1.35) * 5.2 +
            Math.cos((iz * 0.16) + time * 1.15) * 5.2 +
            Math.sin((ix * 0.09 + iz * 0.09) + time * 0.75) * 3.2;

          let ripple = 0;
          if (hasHit) {
            const dx   = x - intersection.x;
            const dz   = z - intersection.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < 90) {
              const f  = 1 - dist / 90;
              const sf = f * f * (3 - 2 * f);
              ripple   = Math.sin((dist * 0.15) - time * 4.5) * 13 * sf;
            }
          }

          posArr[i + 1] = baseWave + ripple;
          i += 3;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      /* Crystal animation */
      for (let c = 0; c < crystals.length; c++) {
        const cr   = crystals[c];
        const mesh = cr.mesh;

        mesh.position.y = cr.basePos.y + Math.sin(time * 0.75 + c * 1.5) * 3.8;

        let spinMult = 1.0;
        if (hasHit) {
          const dx   = mesh.position.x - intersection.x;
          const dz   = mesh.position.z - intersection.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < 110) spinMult = 4.0 - (dist / 110) * 3.0;
        }

        cr.curSpeedX += (cr.rotSpeedX * spinMult - cr.curSpeedX) * 0.05;
        cr.curSpeedY += (cr.rotSpeedY * spinMult - cr.curSpeedY) * 0.05;
        mesh.rotation.x += cr.curSpeedX;
        mesh.rotation.y += cr.curSpeedY;
      }

      /* Subtle camera drift — cheaper lerp */
      if (Math.abs(rawMouse.x) <= 1) {
        camera.position.x += (rawMouse.x * 18 - camera.position.x) * 0.015;
      }
      camera.lookAt(0, -10, -150);

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    /* ── Resize ── */
    const onResize = () => {
      width  = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(rafId);
      visObs.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      crystals.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
        mesh.children.forEach(ch => { ch.geometry.dispose(); ch.material.dispose(); });
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="ocean-wave-container">
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
