import { Vector3 } from 'three';

export type ServerStatus = 'healthy' | 'warning' | 'critical';

export interface ServerData {
  id: string;
  status: ServerStatus;
  load: number; // 0 to 100
  region: string;
  position: [number, number, number];
  rotation: [number, number, number]; // Euler angles to face center
}

export interface CameraTarget {
  position: Vector3;
  target: Vector3;
}