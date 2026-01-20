import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface CameraHandlerProps {
  selectedPosition: THREE.Vector3 | null;
}

export const CameraHandler: React.FC<CameraHandlerProps> = ({ selectedPosition }) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  
  // Vector reusable for calculations to avoid GC
  const cameraOffset = useRef(new THREE.Vector3());
  const origin = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    if (selectedPosition) {
      // Calculate where the camera should be:
      // Take the object position, normalize it (direction from center), 
      // multiply by a scalar to step back "out" from the sphere surface.
      cameraOffset.current.copy(selectedPosition).normalize().multiplyScalar(25); // Radius 15 + 10 distance
      
      // Lerp camera position
      state.camera.position.lerp(cameraOffset.current, 4 * delta);
      
      // Lerp controls target to look at the object
      controlsRef.current.target.lerp(selectedPosition, 4 * delta);
    } else {
      // Reset target to center (0,0,0) when not selected, so the orbit axis returns to the sphere center
      controlsRef.current.target.lerp(origin.current, 2 * delta);
    }
    
    controlsRef.current.update();
  });

  return (
    <OrbitControls 
      ref={controlsRef} 
      enablePan={false}
      minDistance={18}
      maxDistance={50}
      autoRotate={!selectedPosition}
      autoRotateSpeed={0.5}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.5}
    />
  );
};