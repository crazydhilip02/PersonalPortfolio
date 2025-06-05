import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

// Floating digital cube with wireframe effect
const DigitalCube = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  
  useFrame((state) => {
    if (!meshRef.current || !wireframeRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Rotate the cube
    meshRef.current.rotation.x = Math.sin(time / 4) * 0.5;
    meshRef.current.rotation.y = time / 2;
    
    // Match wireframe rotation to cube
    wireframeRef.current.rotation.copy(meshRef.current.rotation);
    
    // Floating effect
    meshRef.current.position.y = Math.sin(time) * 0.2;
    wireframeRef.current.position.y = meshRef.current.position.y;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Main cube */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="#000000" 
          metalness={0.8}
          roughness={0.2}
          emissive="#2020ff"
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      <lineSegments ref={wireframeRef}>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(2.05, 2.05, 2.05)]} />
        <lineBasicMaterial 
          attach="material" 
          color="#00ffff" 
          transparent
          opacity={0.8}
          linewidth={1}
        />
      </lineSegments>
    </group>
  );
};

// Floating particles
const Particles = () => {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  
  const particles = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (!particles.current) return;
    
    const time = state.clock.getElapsedTime();
    particles.current.rotation.y = time / 10;
    
    // Access the position attribute of the geometry
    const positions = particles.current.geometry.attributes.position;
    
    // Update each particle position
    for (let i = 0; i < positions.count; i++) {
      const i3 = i * 3;
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Add subtle movement
      positions.setY(i, y + Math.sin(time + x) * 0.01);
      positions.setX(i, x + Math.cos(time + z) * 0.01);
    }
    
    positions.needsUpdate = true;
  });
  
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Position particles in a sphere
    const radius = 5 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
    
    // Assign colors - cyan, purple, green
    const colorChoice = Math.random();
    if (colorChoice < 0.33) {
      colors[i3] = 0; // R
      colors[i3 + 1] = 1; // G
      colors[i3 + 2] = 1; // B
    } else if (colorChoice < 0.66) {
      colors[i3] = 1; // R
      colors[i3 + 1] = 0; // G
      colors[i3 + 2] = 1; // B
    } else {
      colors[i3] = 0.2; // R
      colors[i3 + 1] = 1; // G
      colors[i3 + 2] = 0.1; // B
    }
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  return (
    <points ref={particles}>
      <bufferGeometry attach="geometry" {...geometry} />
      <pointsMaterial 
        attach="material" 
        size={0.1 * aspect} 
        vertexColors 
        transparent
        opacity={0.8}
      />
    </points>
  );
};

// Main Scene component
const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      
      <Stars radius={100} depth={50} count={1000} factor={4} fade speed={1} />
      
      <DigitalCube />
      <Particles />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        rotateSpeed={0.5}
      />
    </Canvas>
  );
};

const Scene3D: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Scene />
    </div>
  );
};

export default Scene3D;