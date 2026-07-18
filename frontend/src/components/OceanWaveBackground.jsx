import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function OceanWaveBackground() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // Dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Clock for track timing
    const clock = new THREE.Clock();

    // Scene & Fog (matching deep obsidian theme #020408)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020408, 0.003);

    // Camera - exceptionally low-angle perspective looking down the Z-axis
    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 2000);
    camera.position.set(0, 75, 280);
    camera.lookAt(0, -10, -150);

    // Renderer using existing canvas element with graceful WebGL support fallback
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: false
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0x020408, 1);
    } catch (error) {
      console.error("WebGL Renderer failed to initialize:", error);
      if (canvasRef.current) {
        canvasRef.current.style.display = 'none';
      }
      return;
    }

    // Add Lights for physical glass rendering
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Point Light that tracks the mouse cursor to cast dynamic reflections
    const mouseLight = new THREE.PointLight(0x00f2fe, 4, 450);
    mouseLight.position.set(0, 100, 100);
    scene.add(mouseLight);

    // Directional Light for sharp highlights
    const dirLight = new THREE.DirectionalLight(0x9d4edd, 2.5);
    dirLight.position.set(200, 300, 100);
    scene.add(dirLight);

    // Wave Math Parameters
    const numParticlesX = 90;
    const numParticlesZ = 90;
    const separation = 9; // Spacing distance between coordinates
    const count = numParticlesX * numParticlesZ;

    // Buffer Geometry for Points rendering
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    // Initial grid allocation
    let idx = 0;
    for (let ix = 0; ix < numParticlesX; ix++) {
      for (let iz = 0; iz < numParticlesZ; iz++) {
        // Center the wave grid on X and Z axis
        positions[idx] = ix * separation - ((numParticlesX * separation) / 2); // X
        positions[idx + 1] = 0; // Y (Calculated in render tick loop)
        positions[idx + 2] = iz * separation - ((numParticlesZ * separation) / 2) - 100; // Z (Shifted back)
        idx += 3;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Dynamic Canvas feathered circle texture map
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');      // Hot white center core
      gradient.addColorStop(0.25, 'rgba(0, 242, 254, 0.85)');  // Cyan glowing aura
      gradient.addColorStop(0.65, 'rgba(157, 78, 221, 0.45)'); // Purple ambient envelope
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');            // Dissolved border
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    // Material configuration using Additive Blending and custom texture mapping
    const material = new THREE.PointsMaterial({
      size: 4.8,
      map: createCircleTexture(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    });

    // Create particles Points mesh
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // -------------------------------------------------------------
    // Inject Solid Refractive Glass Crystals (Three.js Meshes)
    // -------------------------------------------------------------
    const crystals = [];

    const createCrystal = (geom, color, pos) => {
      // Physical glass material with refraction and transmission
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        opacity: 0.85,
        transmission: 0.85, // Glossy glass transparency
        ior: 1.55,          // Index of refraction
        thickness: 8.0,     // Glass thickness
        side: THREE.DoubleSide,
        flatShading: true   // Gives a sharp, low-poly faceted crystal look
      });

      const mesh = new THREE.Mesh(geom, glassMat);
      mesh.position.copy(pos);
      scene.add(mesh);

      // Create a wireframe overlay for tech aesthetics
      const wireframeGeom = new THREE.EdgesGeometry(geom);
      const wireframeMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.25
      });
      const wireframe = new THREE.LineSegments(wireframeGeom, wireframeMat);
      mesh.add(wireframe);

      return {
        mesh,
        baseRotationSpeed: {
          x: (Math.random() - 0.5) * 0.015 + 0.005,
          y: (Math.random() - 0.5) * 0.015 + 0.008
        },
        currentRotationSpeed: { x: 0, y: 0 },
        basePosition: pos.clone()
      };
    };

    // Instantiate 3 distinct crystals
    crystals.push(createCrystal(
      new THREE.OctahedronGeometry(20),
      0x00f2fe, // Cyan
      new THREE.Vector3(-130, 40, -60)
    ));

    crystals.push(createCrystal(
      new THREE.OctahedronGeometry(24),
      0x9d4edd, // Purple
      new THREE.Vector3(130, 60, -90)
    ));

    crystals.push(createCrystal(
      new THREE.IcosahedronGeometry(16),
      0x00f5d4, // Emerald
      new THREE.Vector3(30, 45, -170)
    ));

    // Global Mouse & Raycaster Telemetry
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Flat surface intersection at y = 0
    const mouse = new THREE.Vector2(-9999, -9999); // Off-screen initially
    const targetIntersection = new THREE.Vector3();
    let hasIntersected = false;

    // Track mouse inputs
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Handle touch inputs for mobile responsiveness
    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Render loop ticker
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      const positionAttr = geometry.attributes.position;
      const array = positionAttr.array;

      // Project mouse screen coordinates to 3D wave plane intersection safely
      hasIntersected = false;
      if (Math.abs(mouse.x) <= 1 && Math.abs(mouse.y) <= 1) {
        raycaster.setFromCamera(mouse, camera);
        if (raycaster.ray.intersectPlane(plane, targetIntersection)) {
          hasIntersected = true;
        }
      }

      // Smoothly update point light to follow the mouse position
      if (hasIntersected) {
        mouseLight.position.x += (targetIntersection.x - mouseLight.position.x) * 0.05;
        mouseLight.position.z += (targetIntersection.z - mouseLight.position.z) * 0.05;
        mouseLight.intensity = 4.0;
      } else {
        mouseLight.intensity = 1.0;
      }

      let i = 0;
      for (let ix = 0; ix < numParticlesX; ix++) {
        for (let iz = 0; iz < numParticlesZ; iz++) {
          const x = array[i];
          const z = array[i + 2];

          // 1. Layered waves: sine and cosine equations creating detailed, organic swell ripples
          const baseWave = Math.sin((ix * 0.12) + time * 1.4) * 5.0 +
                           Math.cos((iz * 0.15) + time * 1.2) * 5.0 +
                           Math.sin((ix * 0.08 + iz * 0.08) + time * 0.8) * 3.5;

          // 2. Localized cursor turbulence within interactive zone
          let ripple = 0;
          if (hasIntersected) {
            const dx = x - targetIntersection.x;
            const dz = z - targetIntersection.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            // 60px equivalent radius in 3D coordinate space is roughly ~85 units
            const activeRadius = 85;
            if (dist < activeRadius) {
              const factor = 1 - dist / activeRadius;
              const smoothFactor = factor * factor * (3 - 2 * factor);
              
              // Wave disturbance ripples outwards from mouse position
              ripple = Math.sin((dist * 0.16) - time * 5.0) * 14.0 * smoothFactor;
            }
          }

          // Apply displacement to elevation (Y-axis)
          array[i + 1] = baseWave + ripple;
          i += 3;
        }
      }

      // Mark attribute dynamic changes for buffer updates
      positionAttr.needsUpdate = true;

      // Update and animate crystals
      crystals.forEach((crystal) => {
        const mesh = crystal.mesh;
        
        // Float movement
        mesh.position.y = crystal.basePosition.y + Math.sin(time * 0.8 + mesh.position.x) * 4.0;

        // Calculate distance to cursor intersection
        let spinMultiplier = 1.0;
        if (hasIntersected) {
          const dx = mesh.position.x - targetIntersection.x;
          const dz = mesh.position.z - targetIntersection.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          // If mouse is near, speed up the spin
          if (dist < 100) {
            spinMultiplier = 4.0 - (dist / 100) * 3.0; // Interpolate spin acceleration
          }
        }

        // Apply rotation
        crystal.currentRotationSpeed.x += (crystal.baseRotationSpeed.x * spinMultiplier - crystal.currentRotationSpeed.x) * 0.05;
        crystal.currentRotationSpeed.y += (crystal.baseRotationSpeed.y * spinMultiplier - crystal.currentRotationSpeed.y) * 0.05;

        mesh.rotation.x += crystal.currentRotationSpeed.x;
        mesh.rotation.y += crystal.currentRotationSpeed.y;
      });

      // Subtle scene camera drift
      if (Math.abs(mouse.x) <= 1) {
        camera.position.x += (mouse.x * 20 - camera.position.x) * 0.02;
      }
      camera.lookAt(0, -10, -150);

      renderer.render(scene, camera);
    };

    // Trigger initial render
    animate();

    // Window Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Lifecycle Cleanup on Component Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      // Clean up WebGL resources
      geometry.dispose();
      material.dispose();
      crystals.forEach((c) => {
        c.mesh.geometry.dispose();
        c.mesh.material.dispose();
        // Remove children wireframes
        c.mesh.children.forEach((child) => {
          child.geometry.dispose();
          child.material.dispose();
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
