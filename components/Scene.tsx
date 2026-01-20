import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ServerNode } from './ServerNode';
import { Effects } from './Effects';
import { CameraHandler } from './CameraHandler';
import { ServerData } from '../types';

interface SceneProps {
  servers: ServerData[];
  selectedId: string | null;
  onSelectServer: (id: string, position: THREE.Vector3 | null) => void;
}

export const Scene: React.FC<SceneProps> = ({ servers, selectedId, onSelectServer }) => {
  
  // Find position of selected server for camera focus
  const selectedPosition = useMemo(() => {
    if (!selectedId) return null;
    const server = servers.find(s => s.id === selectedId);
    return server ? new THREE.Vector3(...server.position) : null;
  }, [selectedId, servers]);

  const handleMiss = () => {
    onSelectServer('', null);
  };

  return (
    <Canvas
      camera={{ position: [30, 20, 30], fov: 45 }}
      dpr={[1, 2]} // Handle high DPI screens
      gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}
      onPointerMissed={handleMiss}
    >
      <color attach="background" args={['#050505']} />
      
      <group>
        {servers.map((server) => (
          <ServerNode
            key={server.id}
            data={server}
            isSelected={selectedId === server.id}
            onSelect={(id, pos) => onSelectServer(id, pos)}
          />
        ))}
      </group>

      {/* Central Core Visualization */}
      <mesh>
        <sphereGeometry args={[10, 32, 32]} />
        <meshStandardMaterial 
            color="#000000" 
            wireframe 
            emissive="#06b6d4"
            emissiveIntensity={0.1}
            transparent
            opacity={0.3}
        />
      </mesh>
      
      <pointLight position={[0, 0, 0]} intensity={2} color="#06b6d4" distance={20} decay={2} />

      <Environment preset="city" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <CameraHandler selectedPosition={selectedPosition} />
      <Effects />
    </Canvas>
  );
};