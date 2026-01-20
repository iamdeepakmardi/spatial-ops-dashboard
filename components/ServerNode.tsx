import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ServerData } from '../types';

interface ServerNodeProps {
  data: ServerData;
  isSelected: boolean;
  onSelect: (id: string, position: THREE.Vector3) => void;
}

export const ServerNode: React.FC<ServerNodeProps> = ({ data, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Colors based on status
  const color = useMemo(() => {
    switch (data.status) {
      case 'critical': return '#ef4444'; // Red
      case 'warning': return '#f97316'; // Orange
      case 'healthy': return '#06b6d4'; // Cyan
      default: return '#ffffff';
    }
  }, [data.status]);

  // Height based on load (1 to 5 units)
  const height = 1 + (data.load / 100) * 4;

  useFrame((state) => {
    if (!meshRef.current) return;

    // Pulse effect for critical nodes
    if (data.status === 'critical') {
      const t = state.clock.getElapsedTime();
      const intensity = 1 + Math.sin(t * 5) * 0.5;
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity * 2;
    } else if (hovered || isSelected) {
        (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 2;
    } else {
        (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
    }

    // Scale animation on hover
    const targetScale = hovered || isSelected ? 1.1 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (meshRef.current) {
        const worldPos = new THREE.Vector3();
        meshRef.current.getWorldPosition(worldPos);
        onSelect(data.id, worldPos);
    }
  };

  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        // Shift geometry up so it grows "outwards" from the sphere surface
        position={[0, 0, height / 2]} 
      >
        <boxGeometry args={[1, 1, height]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
        
        {isSelected && (
          <Html distanceFactor={15} position={[0, 0, height/2 + 1]} center className="pointer-events-none">
            <div className="bg-cyber-panel backdrop-blur-md border border-cyber-primary/30 p-4 rounded-lg text-xs font-mono w-48 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
                <span className="text-gray-400">ID</span>
                <span className="font-bold text-white">{data.id}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400">STATUS</span>
                <span style={{ color }} className="font-bold uppercase">{data.status}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400">REGION</span>
                <span className="text-white">{data.region}</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-gray-400 mb-1">
                  <span>LOAD</span>
                  <span>{data.load.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-800 h-1 rounded overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500" 
                    style={{ width: `${data.load}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
};