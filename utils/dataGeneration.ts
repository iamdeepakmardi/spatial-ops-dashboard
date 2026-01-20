import { ServerData, ServerStatus } from '../types';
import * as THREE from 'three';

const REGIONS = ['us-east', 'us-west', 'eu-central', 'ap-south', 'sa-east'];

export const generateServers = (count: number = 50, radius: number = 15): ServerData[] => {
  const servers: ServerData[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
    const radiusAtY = Math.sqrt(1 - y * y); // radius at y
    
    const theta = phi * i; // golden angle increment

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    // Final position on sphere surface
    const positionVector = new THREE.Vector3(x * radius, y * radius, z * radius);
    
    // Calculate rotation to face center (0,0,0)
    // We create a dummy object to calculate the lookAt rotation easily
    const dummy = new THREE.Object3D();
    dummy.position.copy(positionVector);
    dummy.lookAt(0, 0, 0);

    const load = Math.random() * 100;
    let status: ServerStatus = 'healthy';
    if (load > 70) status = 'warning';
    if (load > 90) status = 'critical';

    servers.push({
      id: `SRV-${1000 + i}`,
      status,
      load,
      region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
      position: [positionVector.x, positionVector.y, positionVector.z],
      rotation: [dummy.rotation.x, dummy.rotation.y, dummy.rotation.z]
    });
  }

  return servers;
};