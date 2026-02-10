
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LiquidDistortionProps {
  imageSrc: string;
  className?: string;
}

const LiquidDistortion: React.FC<LiquidDistortionProps> = ({ imageSrc, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 1;

    // Renderer with alpha true for transparent background support
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Initial resolution uniform
    const initialResolution = new THREE.Vector2(1000, 1000);

    // Texture
    const textureLoader = new THREE.TextureLoader();
    // Use the onLoad callback to ensure the image is ready before accessing dimensions
    const texture = textureLoader.load(imageSrc, (tex) => {
      if (tex.image) {
        material.uniforms.uImageResolution.value.set(tex.image.width, tex.image.height);
      }
    });
    
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Geometry
    const geometry = new THREE.PlaneGeometry(2, 2, 32, 32);

    // Shader
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uAberrationIntensity: { value: 0.0 },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight) },
        uImageResolution: { value: initialResolution }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uMouse;
        uniform vec2 uPrevMouse;
        uniform float uAberrationIntensity;
        uniform vec2 uResolution;
        uniform vec2 uImageResolution;
        uniform float uTime;
        varying vec2 vUv;

        // Simplex noise function could be added here for more complexity, 
        // but let's stick to a fluid velocity distortion

        void main() {
          vec2 uv = vUv;
          
          // Aspect Ratio Correction (Cover mode)
          vec2 ratio = vec2(
            min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
            min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
          );
          vec2 finalUv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );

          // Calculate distance to mouse
          // We normalize mouse coord to aspect corrected space if we want precise following, 
          // but for this effect, normalized screen space is fine.
          
          vec2 mouseVelocity = uMouse - uPrevMouse;
          float speed = length(mouseVelocity) * 100.0;
          
          // Wave effect based on mouse distance
          float dist = distance(uv, uMouse);
          float decay = smoothstep(0.5, 0.0, dist);
          
          // Distortion
          vec2 distortion = mouseVelocity * decay * 2.0;
          
          // Chromatic Aberration
          float r = texture2D(uTexture, finalUv + distortion - vec2(0.005 * uAberrationIntensity * decay, 0.0)).r;
          float g = texture2D(uTexture, finalUv + distortion).g;
          float b = texture2D(uTexture, finalUv + distortion + vec2(0.005 * uAberrationIntensity * decay, 0.0)).b;

          gl_FragColor = vec4(r, g, b, 1.0);
        }
      `,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse Tracking
    let mouse = new THREE.Vector2(0.5, 0.5);
    let targetMouse = new THREE.Vector2(0.5, 0.5);
    let prevMouse = new THREE.Vector2(0.5, 0.5);

    const onMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        targetMouse.x = (e.clientX - rect.left) / rect.width;
        targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height; // Flip Y for WebGL
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animationId: number;
    const animate = () => {
      // Lerp mouse for smoothness
      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;

      material.uniforms.uPrevMouse.value.copy(prevMouse);
      material.uniforms.uMouse.value.copy(mouse);

      // Calculate simple velocity for intensity
      const vel = Math.sqrt(
        Math.pow(mouse.x - prevMouse.x, 2) + Math.pow(mouse.y - prevMouse.y, 2)
      );
      
      // Decay intensity
      let intensity = material.uniforms.uAberrationIntensity.value;
      const targetIntensity = vel * 80.0; // Multiplier for sensitivity
      intensity += (targetIntensity - intensity) * 0.1;
      material.uniforms.uAberrationIntensity.value = intensity;

      // Update prev mouse
      prevMouse.copy(mouse);
      material.uniforms.uTime.value += 0.01;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
      
      // Update camera aspect if needed, though for full-plane shader we usually don't need to move camera
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      // Check if objects exist before disposing
      if (renderer) renderer.dispose();
      if (geometry) geometry.dispose();
      if (material) material.dispose();
    };
  }, [imageSrc]);

  return <div ref={containerRef} className={className} />;
};

export default LiquidDistortion;
