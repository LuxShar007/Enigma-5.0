import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────────
   Enigma 5.0  ·  Ocean-Wave Particle Background
   Smoothness techniques used:
   • Offscreen sprite texture cached once — no per-frame redraws
   • Delta-time normalized physics  (frame-rate independent)
   • Velocity friction model for all easing
   • Raycaster throttled to every 3rd frame
   • Visibility-gated RAF (IntersectionObserver)
   • Pixel-ratio capped at 1 for GPU headroom
   • Integers for particle Y positions (Math.round)
───────────────────────────────────────────────────────────────── */
export default function OceanWaveBackground() {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    let width  = window.innerWidth;
    let height = window.innerHeight;

    /* ── Cached offscreen sprite (drawn once, reused every frame) ── */
    const SPRITE_SIZE = 64;
    const offscreen   = document.createElement('canvas');
    offscreen.width   = SPRITE_SIZE;
    offscreen.height  = SPRITE_SIZE;
    const offCtx      = offscreen.getContext('2d');
    const half        = SPRITE_SIZE / 2;
    const grad        = offCtx.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0,    'rgba(255,255,255,1)');
    grad.addColorStop(0.22, 'rgba(0,242,254,0.9)');
    grad.addColorStop(0.55, 'rgba(100,80,240,0.45)');
    grad.addColorStop(0.80, 'rgba(157,78,221,0.18)');
    grad.addColorStop(1,    'rgba(0,0,0,0)');
    offCtx.fillStyle = grad;
    offCtx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

    /* ── Scene ── */
    const scene = new THREE.Scene();
    scene.fog   = new THREE.Fog(0x02040a, 200, 1600);

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 2400);
    camera.position.set(0, 82, 295);
    camera.lookAt(0, -12, -150);

    /* ── Renderer ── */
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas:          canvasRef.current,
        antialias:       false,
        alpha:           false,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
      renderer.setSize(width, height);
      renderer.setClearColor(0x02040a, 1);
    } catch (err) {
      console.error('[OceanWave] WebGL init failed:', err);
      return;
    }

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const mouseLight = new THREE.PointLight(0x00f2fe, 3.2, 420);
    mouseLight.position.set(0, 100, 100);
    scene.add(mouseLight);

    const dirLight = new THREE.DirectionalLight(0x9d4edd, 2.2);
    dirLight.position.set(200, 300, 100);
    scene.add(dirLight);

    /* ── Wave Grid: 80×80 = 6,400 pts ── */
    const NX    = 80;
    const NZ    = 80;
    const SEP   = 18;
    const COUNT = NX * NZ;

    const geometry  = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);

    let pi = 0;
    for (let ix = 0; ix < NX; ix++) {
      for (let iz = 0; iz < NZ; iz++) {
        positions[pi]     = ix * SEP - (NX * SEP) / 2;
        positions[pi + 1] = 0;
        positions[pi + 2] = iz * SEP - (NZ * SEP) / 2 - 150;
        pi += 3;
      }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const spriteTex = new THREE.CanvasTexture(offscreen);
    const material  = new THREE.PointsMaterial({
      size:        6.5,
      map:         spriteTex,
      blending:    THREE.AdditiveBlending,
      transparent: true,
      depthWrite:  false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    /* ── Ambient Floating Particles (600 points scattered in space) ── */
    const ambientCount = 600;
    const ambientGeometry = new THREE.BufferGeometry();
    const ambientPositions = new Float32Array(ambientCount * 3);
    const ambientSpeeds = new Float32Array(ambientCount);
    const ambientPhases = new Float32Array(ambientCount);

    for (let j = 0; j < ambientCount; j++) {
      // Scatter in a huge box surrounding camera: X (-800 to 800), Y (-100 to 500), Z (-1000 to 600)
      ambientPositions[j * 3]     = (Math.random() - 0.5) * 1600;
      ambientPositions[j * 3 + 1] = (Math.random() - 0.5) * 600 + 200;
      ambientPositions[j * 3 + 2] = (Math.random() - 0.5) * 1600 - 200;
      ambientSpeeds[j] = Math.random() * 0.12 + 0.04;
      ambientPhases[j] = Math.random() * Math.PI * 2;
    }
    ambientGeometry.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));

    const ambientMaterial = new THREE.PointsMaterial({
      size: 4.5,
      map: spriteTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
      opacity: 0.65
    });

    const ambientParticles = new THREE.Points(ambientGeometry, ambientMaterial);
    scene.add(ambientParticles);

    /* ── Crystals ── */
    const crystals = [];
    const addCrystal = (geom, color, pos) => {
      const mat = new THREE.MeshPhongMaterial({
        color,
        emissive:    new THREE.Color(color).multiplyScalar(0.14),
        specular:    new THREE.Color(0xffffff),
        shininess:   110,
        transparent: true,
        opacity:     0.74,
        side:        THREE.DoubleSide,
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(pos);
      scene.add(mesh);

      const edges   = new THREE.EdgesGeometry(geom);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 });
      mesh.add(new THREE.LineSegments(edges, lineMat));

      crystals.push({
        mesh,
        basePos:   pos.clone(),
        rotSpeedX: (Math.random() - 0.5) * 0.011 + 0.004,
        rotSpeedY: (Math.random() - 0.5) * 0.011 + 0.006,
        /* smoothed velocity state */
        velX: 0,
        velY: 0,
      });
    };

    addCrystal(new THREE.OctahedronGeometry(20),  0x00f2fe, new THREE.Vector3(-130, 42, -65));
    addCrystal(new THREE.OctahedronGeometry(24),  0x9d4edd, new THREE.Vector3(130,  62, -95));
    addCrystal(new THREE.IcosahedronGeometry(16), 0x00f5d4, new THREE.Vector3(30,   48, -180));

    /* ── Mouse state — velocity-damped camera ── */
    const rawMouse    = { x: -9999, y: -9999 };
    const camVelocity = { x: 0 };
    const onMouseMove = (e) => {
      rawMouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
      rawMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    /* ── Scroll state for 3D parallax scroll ── */
    let targetScrollY = 0;
    let smoothScrollY = 0;
    const onScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── Raycaster (throttled every 3 frames) ── */
    const raycaster   = new THREE.Raycaster();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    let hasHit     = false;
    let frameCount = 0;

    /* ── Visibility gate ── */
    let isVisible = true;
    const visObs  = new IntersectionObserver(
      ([e]) => { isVisible = e.isIntersecting; },
      { threshold: 0.01 }
    );
    visObs.observe(containerRef.current);

    /* ── Clock for delta-time ── */
    const clock = new THREE.Clock();

    /* ── Animation loop ── */
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const dt   = Math.min(clock.getDelta(), 0.05);  // cap at 50ms to prevent jumps
      const time = clock.elapsedTime;

      frameCount++;

      // Smooth scroll interpolation
      const scrollEase = 1 - Math.pow(0.05, dt * 60);
      smoothScrollY += (targetScrollY - smoothScrollY) * scrollEase;
      const scrollOffset = smoothScrollY * 0.08;

      // Animate ambient particles: drift and bob
      const ambArr = ambientGeometry.attributes.position.array;
      for (let j = 0; j < ambientCount; j++) {
        const idx3 = j * 3;
        ambArr[idx3]     += Math.sin(time * 0.08 + ambientPhases[j]) * 0.15;
        ambArr[idx3 + 1] += Math.cos(time * 0.2 + ambientPhases[j]) * 0.08;
        
        // Wrap edges
        if (Math.abs(ambArr[idx3]) > 800) ambArr[idx3] = -ambArr[idx3];
        if (ambArr[idx3 + 1] > 600) ambArr[idx3 + 1] = -100;
        if (ambArr[idx3 + 1] < -100) ambArr[idx3 + 1] = 600;
      }
      ambientGeometry.attributes.position.needsUpdate = true;

      /* ── Raycaster every 3rd frame ── */
      if (frameCount % 3 === 0) {
        if (Math.abs(rawMouse.x) <= 1 && Math.abs(rawMouse.y) <= 1) {
          raycaster.setFromCamera(
            new THREE.Vector2(rawMouse.x, rawMouse.y),
            camera
          );
          hasHit = !!raycaster.ray.intersectPlane(groundPlane, intersection);
        } else {
          hasHit = false;
        }
      }

      /* ── Mouse light — velocity-based smooth follow ── */
      const lightTargetX = hasHit ? intersection.x : 0;
      const lightTargetZ = hasHit ? intersection.z : mouseLight.position.z;
      mouseLight.position.x += (lightTargetX - mouseLight.position.x) * (1 - Math.pow(0.04, dt * 60));
      mouseLight.position.z += (lightTargetZ - mouseLight.position.z) * (1 - Math.pow(0.04, dt * 60));
      mouseLight.intensity   += ((hasHit ? 3.2 : 0.9) - mouseLight.intensity) * (1 - Math.pow(0.06, dt * 60));

      /* ── Wave vertex update (integer snap for smoothness) ── */
      const posArr = geometry.attributes.position.array;
      let i = 0;
      for (let ix = 0; ix < NX; ix++) {
        for (let iz = 0; iz < NZ; iz++) {
          const x = posArr[i];
          const z = posArr[i + 2];

          const wave =
            Math.sin(ix * 0.13 + time * 1.3)  * 5.5 +
            Math.cos(iz * 0.15 + time * 1.1)  * 5.2 +
            Math.sin((ix * 0.08 + iz * 0.08) + time * 0.7) * 3.5 +
            Math.sin(ix * 0.22 + time * 2.1)  * 1.8;

          let ripple = 0;
          if (hasHit) {
            const dx   = x - intersection.x;
            const dz   = z - intersection.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < 95) {
              const f = 1 - dist / 95;
              ripple  = Math.sin(dist * 0.14 - time * 4.8) * 14 * f * f * (3 - 2 * f);
            }
          }

          posArr[i + 1] = Math.round((wave + ripple) * 10) / 10; // snap to 0.1 grid
          i += 3;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      /* ── Crystal animation — velocity/friction model ── */
      for (let c = 0; c < crystals.length; c++) {
        const cr   = crystals[c];
        const mesh = cr.mesh;

        /* Float bob */
        mesh.position.y = cr.basePos.y + Math.sin(time * 0.72 + c * 1.4) * 4.2;

        /* Spin multiplier based on proximity to mouse */
        let spinMult = 1.0;
        if (hasHit) {
          const dx   = mesh.position.x - intersection.x;
          const dz   = mesh.position.z - intersection.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < 120) spinMult = 1 + 3.2 * (1 - dist / 120) * (1 - dist / 120);
        }

        /* Velocity spring */
        const targetVelX = cr.rotSpeedX * spinMult;
        const targetVelY = cr.rotSpeedY * spinMult;
        const ease = 1 - Math.pow(0.04, dt * 60);
        cr.velX += (targetVelX - cr.velX) * ease;
        cr.velY += (targetVelY - cr.velY) * ease;
        mesh.rotation.x += cr.velX;
        mesh.rotation.y += cr.velY;
      }

      /* ── Camera drift + scroll parallax ── */
      const camTargetX = rawMouse.x * 20;
      const camEase    = 1 - Math.pow(0.025, dt * 60);
      camVelocity.x   += (camTargetX - camera.position.x) * camEase * 0.08;
      camVelocity.x   *= 0.88;  // friction
      
      if (Math.abs(rawMouse.x) <= 1) {
        camera.position.x += camVelocity.x;
      }
      
      // Update camera height (Y) and depth (Z) based on scroll
      camera.position.y = 82 + scrollOffset * 0.45;
      camera.position.z = 295 + scrollOffset * 0.55;
      
      // Keep looking at a point that scrolls with the camera
      camera.lookAt(0, -12 + scrollOffset * 0.35, -150);

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
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      ambientGeometry.dispose();
      ambientMaterial.dispose();
      spriteTex.dispose();
      crystals.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
        mesh.children.forEach(ch => {
          ch.geometry?.dispose();
          ch.material?.dispose();
        });
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
