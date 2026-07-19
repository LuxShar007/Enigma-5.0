import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────────
   Enigma 5.0  ·  Ocean-Wave Particle Background  (GPU-Shader Edition)

   240Hz Performance Architecture:
   • ZERO CPU particle loops — all wave + ambient math runs in GLSL
     vertex shaders on the GPU (eliminates O(6400) + O(400) JS work/frame)
   • Only 2 float uniforms updated per frame (time, mouseXZ)
   • Pixel-ratio locked at 1.0 — eliminates HiDPI fill-rate cost
   • Raycaster throttled to every 8 frames (~30Hz — invisible to eye)
   • No IntersectionObserver — canvas is fixed/always visible
   • performance.now() timing — no THREE.Clock deprecation overhead
   • Fog via native THREE chunk system (zero extra draw calls)
   • stencil: false, logarithmicDepthBuffer: false — minimal GPU state
───────────────────────────────────────────────────────────────── */

/* ── GLSL: Wave particle vertex shader ────────────────────────── */
const WAVE_VERT = /* glsl */`
  #include <fog_pars_vertex>

  uniform float  time;
  uniform vec2   mouseXZ;
  uniform float  hasHit;
  uniform float  baseSize;

  attribute float waveIX;
  attribute float waveIZ;

  void main() {
    float ix = waveIX;
    float iz = waveIZ;

    /* Four-octave wave — identical math as original CPU version */
    float w =
      sin(ix * 0.13 + time * 1.3)  * 5.5 +
      cos(iz * 0.15 + time * 1.1)  * 5.2 +
      sin((ix * 0.08 + iz * 0.08) + time * 0.7) * 3.5 +
      sin(ix * 0.22 + time * 2.1)  * 1.8;

    float ripple = 0.0;
    if (hasHit > 0.5) {
      float dist = distance(position.xz, mouseXZ);
      if (dist < 95.0) {
        float f = 1.0 - dist / 95.0;
        ripple = sin(dist * 0.14 - time * 4.8) * 14.0 * f * f * (3.0 - 2.0 * f);
      }
    }

    vec3 p = vec3(position.x, w + ripple, position.z);
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = baseSize * (300.0 / -mvPosition.z);
    gl_Position  = projectionMatrix * mvPosition;

    #include <fog_vertex>
  }
`;

const WAVE_FRAG = /* glsl */`
  #include <fog_pars_fragment>

  uniform sampler2D map;

  void main() {
    vec4 c = texture2D(map, gl_PointCoord);
    if (c.a < 0.01) discard;
    gl_FragColor = vec4(c.rgb, c.a);
    #include <fog_fragment>
  }
`;

/* ── GLSL: Ambient floating particle vertex shader ────────────── */
const AMBIENT_VERT = /* glsl */`
  #include <fog_pars_vertex>

  uniform float time;
  uniform float baseSize;

  attribute float phase;

  void main() {
    /* Gentle sinusoidal drift — no CPU update needed */
    vec3 p = position;
    p.x += sin(time * 0.07 + phase) * 3.5;
    p.y += cos(time * 0.18 + phase) * 2.2;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = baseSize * (300.0 / -mvPosition.z);
    gl_Position  = projectionMatrix * mvPosition;

    #include <fog_vertex>
  }
`;

const AMBIENT_FRAG = /* glsl */`
  #include <fog_pars_fragment>

  uniform sampler2D map;

  void main() {
    vec4 c = texture2D(map, gl_PointCoord);
    if (c.a < 0.01) discard;
    gl_FragColor = vec4(c.rgb, c.a * 0.60);
    #include <fog_fragment>
  }
`;

export default function OceanWaveBackground() {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    let width  = window.innerWidth;
    let height = window.innerHeight;

    /* ── Sprite texture — drawn once, shared by both particle systems ── */
    const SZ   = 64;
    const off  = document.createElement('canvas');
    off.width  = SZ; off.height = SZ;
    const ctx  = off.getContext('2d');
    const half = SZ / 2;
    const g    = ctx.createRadialGradient(half, half, 0, half, half, half);
    g.addColorStop(0,    'rgba(255,255,255,1)');
    g.addColorStop(0.22, 'rgba(0,242,254,0.9)');
    g.addColorStop(0.55, 'rgba(100,80,240,0.45)');
    g.addColorStop(0.80, 'rgba(157,78,221,0.18)');
    g.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SZ, SZ);
    const spriteTex = new THREE.CanvasTexture(off);

    /* ── Scene + Fog ── */
    const scene = new THREE.Scene();
    scene.fog   = new THREE.Fog(0x02040a, 220, 1600);

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 2400);
    camera.position.set(0, 82, 295);
    camera.lookAt(0, -12, -150);

    /* ── Renderer ── */
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas:               canvasRef.current,
        antialias:            false,
        alpha:                false,
        stencil:              false,
        powerPreference:      'high-performance',
      });
      renderer.setPixelRatio(1.0);          // always 1.0 — HiDPI savings
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

    /* ── Wave Grid geometry (positions static — shader animates Y) ── */
    const NX    = 72;
    const NZ    = 72;
    const SEP   = 18;
    const COUNT = NX * NZ;

    const pos  = new Float32Array(COUNT * 3);
    const ixA  = new Float32Array(COUNT);
    const izA  = new Float32Array(COUNT);
    let pi = 0, ai = 0;
    for (let ix = 0; ix < NX; ix++) {
      for (let iz = 0; iz < NZ; iz++) {
        pos[pi]     = ix * SEP - (NX * SEP) / 2;
        pos[pi + 1] = 0;
        pos[pi + 2] = iz * SEP - (NZ * SEP) / 2 - 150;
        ixA[ai] = ix;
        izA[ai] = iz;
        ai++; pi += 3;
      }
    }
    const waveGeo = new THREE.BufferGeometry();
    waveGeo.setAttribute('position', new THREE.BufferAttribute(pos,  3));
    waveGeo.setAttribute('waveIX',   new THREE.BufferAttribute(ixA,  1));
    waveGeo.setAttribute('waveIZ',   new THREE.BufferAttribute(izA,  1));

    /* ── Wave ShaderMaterial (fog uniforms merged in) ── */
    const waveUniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        time:     { value: 0 },
        mouseXZ:  { value: new THREE.Vector2(0, 0) },
        hasHit:   { value: 0.0 },
        baseSize: { value: 6.5 },
        map:      { value: spriteTex },
      }
    ]);
    const waveMat = new THREE.ShaderMaterial({
      uniforms:       waveUniforms,
      vertexShader:   WAVE_VERT,
      fragmentShader: WAVE_FRAG,
      blending:       THREE.AdditiveBlending,
      transparent:    true,
      depthWrite:     false,
      fog:            true,
    });
    scene.add(new THREE.Points(waveGeo, waveMat));

    /* ── Ambient Particles geometry (positions static — shader drifts) ── */
    const AMB   = 420;
    const ambGeo = new THREE.BufferGeometry();
    const ambPos = new Float32Array(AMB * 3);
    const phases = new Float32Array(AMB);
    for (let j = 0; j < AMB; j++) {
      ambPos[j * 3]     = (Math.random() - 0.5) * 1600;
      ambPos[j * 3 + 1] = Math.random() * 700 - 100;
      ambPos[j * 3 + 2] = (Math.random() - 0.5) * 1600 - 200;
      phases[j]          = Math.random() * Math.PI * 2;
    }
    ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPos,  3));
    ambGeo.setAttribute('phase',    new THREE.BufferAttribute(phases,  1));

    const ambUniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        time:     { value: 0 },
        baseSize: { value: 4.0 },
        map:      { value: spriteTex },
      }
    ]);
    const ambMat = new THREE.ShaderMaterial({
      uniforms:       ambUniforms,
      vertexShader:   AMBIENT_VERT,
      fragmentShader: AMBIENT_FRAG,
      blending:       THREE.AdditiveBlending,
      transparent:    true,
      depthWrite:     false,
      fog:            true,
    });
    scene.add(new THREE.Points(ambGeo, ambMat));

    /* ── Crystals ── */
    const crystals = [];
    const addCrystal = (geom, color, p) => {
      const mat  = new THREE.MeshPhongMaterial({
        color, emissive: new THREE.Color(color).multiplyScalar(0.14),
        specular: new THREE.Color(0xffffff), shininess: 110,
        transparent: true, opacity: 0.74,
        side: THREE.DoubleSide, flatShading: true,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(p);
      scene.add(mesh);
      mesh.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(geom),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 })
      ));
      crystals.push({ mesh, baseY: p.y,
        rotSpeedX: (Math.random() - 0.5) * 0.011 + 0.004,
        rotSpeedY: (Math.random() - 0.5) * 0.011 + 0.006,
        velX: 0, velY: 0,
      });
    };
    addCrystal(new THREE.OctahedronGeometry(20),  0x00f2fe, new THREE.Vector3(-130, 42, -65));
    addCrystal(new THREE.OctahedronGeometry(24),  0x9d4edd, new THREE.Vector3(130,  62, -95));
    addCrystal(new THREE.IcosahedronGeometry(16), 0x00f5d4, new THREE.Vector3(30,   48, -180));

    /* ── Input state — minimal per-event work ── */
    const rawMouse    = { x: -9999, y: -9999 };
    const camVelocity = { x: 0 };
    let   targetScrollY = 0;
    let   smoothScrollY = 0;

    const onMouseMove = (e) => {
      rawMouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
      rawMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onScroll = () => { targetScrollY = window.scrollY; };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll',    onScroll,    { passive: true });

    /* ── Raycaster — reuse Vector2 to avoid GC pressure ── */
    const raycaster    = new THREE.Raycaster();
    const groundPlane  = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    const mouseVec2    = new THREE.Vector2();
    let   hasHit       = false;
    let   frameCount   = 0;

    /* ── Timing via performance.now() — no THREE.Clock ── */
    const startTime = performance.now();
    let   lastTime  = startTime;
    let   rafId;

    /* ── Precompute per-loop ease factor at reference dt=1/60 ── */
    const easeBase = (base, dtRef) => 1 - Math.pow(base, dtRef * 60);

    /* ─────────────── RAF loop — ZERO particle CPU updates ─────────── */
    const animate = () => {
      rafId = requestAnimationFrame(animate);

      const now  = performance.now();
      const dt   = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime   = now;
      const time = (now - startTime) * 0.001;

      frameCount++;

      /* ── Uniforms update (GPU receives time once per frame) ── */
      waveUniforms.time.value = time;
      ambUniforms.time.value  = time;

      /* ── Smooth scroll parallax ── */
      smoothScrollY   += (targetScrollY - smoothScrollY) * easeBase(0.05, dt);
      const scrollOff  = smoothScrollY * 0.08;

      /* ── Raycaster throttled to every 8 frames (~30Hz) ── */
      if (frameCount % 8 === 0) {
        if (Math.abs(rawMouse.x) <= 1 && Math.abs(rawMouse.y) <= 1) {
          mouseVec2.set(rawMouse.x, rawMouse.y);
          raycaster.setFromCamera(mouseVec2, camera);
          hasHit = !!raycaster.ray.intersectPlane(groundPlane, intersection);
        } else {
          hasHit = false;
        }
        waveUniforms.hasHit.value = hasHit ? 1.0 : 0.0;
        if (hasHit) waveUniforms.mouseXZ.value.set(intersection.x, intersection.z);
      }

      /* ── Mouse light smooth follow ── */
      const lE = easeBase(0.04, dt);
      mouseLight.position.x += ((hasHit ? intersection.x : 0) - mouseLight.position.x) * lE;
      mouseLight.position.z += ((hasHit ? intersection.z : mouseLight.position.z) - mouseLight.position.z) * lE;
      mouseLight.intensity  += ((hasHit ? 3.2 : 0.9) - mouseLight.intensity) * easeBase(0.06, dt);

      /* ── Crystal animation — minimal: 3 meshes only ── */
      for (let c = 0; c < crystals.length; c++) {
        const cr = crystals[c];
        cr.mesh.position.y = cr.baseY + Math.sin(time * 0.72 + c * 1.4) * 4.2;

        let spinMult = 1.0;
        if (hasHit) {
          const dx   = cr.mesh.position.x - intersection.x;
          const dz   = cr.mesh.position.z - intersection.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < 120) spinMult = 1 + 3.2 * (1 - dist / 120) * (1 - dist / 120);
        }
        const cE  = easeBase(0.04, dt);
        cr.velX  += (cr.rotSpeedX * spinMult - cr.velX) * cE;
        cr.velY  += (cr.rotSpeedY * spinMult - cr.velY) * cE;
        cr.mesh.rotation.x += cr.velX;
        cr.mesh.rotation.y += cr.velY;
      }

      /* ── Camera: horizontal mouse drift + vertical scroll parallax ── */
      const cE2   = easeBase(0.025, dt);
      camVelocity.x += (rawMouse.x * 20 - camera.position.x) * cE2 * 0.08;
      camVelocity.x *= 0.88;
      if (Math.abs(rawMouse.x) <= 1) camera.position.x += camVelocity.x;

      camera.position.y = 82  + scrollOff * 0.45;
      camera.position.z = 295 + scrollOff * 0.55;
      camera.lookAt(0, -12 + scrollOff * 0.35, -150);

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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll',    onScroll);
      window.removeEventListener('resize',    onResize);
      waveGeo.dispose();  waveMat.dispose();
      ambGeo.dispose();   ambMat.dispose();
      spriteTex.dispose();
      crystals.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
        mesh.children.forEach(ch => { ch.geometry?.dispose(); ch.material?.dispose(); });
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
