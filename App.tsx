import React, { useState, useMemo } from 'react';
import { Scene } from './components/Scene';
import { generateServers } from './utils/dataGeneration';
import * as THREE from 'three';

const SERVER_COUNT = 60;

const App: React.FC = () => {
  // Generate data once
  const [servers] = useState(() => generateServers(SERVER_COUNT));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Stats calculation
  const stats = useMemo(() => {
    const total = servers.length;
    const critical = servers.filter(s => s.status === 'critical').length;
    const warning = servers.filter(s => s.status === 'warning').length;
    const healthy = servers.filter(s => s.status === 'healthy').length;
    const avgLoad = servers.reduce((acc, s) => acc + s.load, 0) / total;
    return { total, critical, warning, healthy, avgLoad };
  }, [servers]);

  const handleSelectServer = (id: string, position: THREE.Vector3 | null) => {
    // If clicking the same one, toggle off, otherwise set new
    if (selectedId === id && id !== '') {
        setSelectedId(null);
    } else {
        setSelectedId(id || null);
    }
  };

  return (
    <div className="w-full h-screen relative font-mono text-white overflow-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene 
            servers={servers} 
            selectedId={selectedId} 
            onSelectServer={handleSelectServer} 
        />
      </div>

      {/* UI Overlay Layer - Pointer events none on container, auto on elements */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-10">
        
        {/* Header */}
        <header className="pointer-events-auto">
          <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            NET_VISUALIZER
          </h1>
          <p className="text-cyan-200/60 text-sm mt-1 tracking-widest uppercase">
            Spatial Infrastructure Monitor v2.0
          </p>
        </header>

        {/* Global Stats Panel */}
        <div className="absolute top-10 right-10 w-64 pointer-events-auto">
            <div className="bg-cyber-panel backdrop-blur-md border-l-2 border-cyan-500 p-4 rounded-r-lg shadow-lg">
                <h2 className="text-xs uppercase text-gray-400 mb-4 border-b border-gray-700 pb-2">Cluster Status</h2>
                
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm">System Load</span>
                        <span className="font-bold text-cyan-400">{stats.avgLoad.toFixed(1)}%</span>
                    </div>
                    
                    <div className="h-16 flex items-end gap-1 mb-2 border-b border-gray-800 pb-2">
                        {/* Fake mini histogram */}
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex-1 bg-cyan-900/50 hover:bg-cyan-400 transition-colors" style={{ height: `${20 + Math.random() * 80}%` }}></div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-green-900/20 p-2 rounded border border-green-500/20">
                            <div className="text-green-400 font-bold">{stats.healthy}</div>
                            <div className="text-gray-500">HEALTHY</div>
                        </div>
                        <div className="bg-orange-900/20 p-2 rounded border border-orange-500/20">
                            <div className="text-orange-400 font-bold">{stats.warning}</div>
                            <div className="text-gray-500">WARNING</div>
                        </div>
                        <div className="bg-red-900/20 p-2 rounded border border-red-500/20 col-span-2">
                            <div className="text-red-400 font-bold">{stats.critical}</div>
                            <div className="text-gray-500">CRITICAL ERRORS</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Instructions */}
        <footer className="pointer-events-auto flex justify-between items-end">
          <div className="text-xs text-gray-500 max-w-md">
            <p className="mb-2"><span className="text-cyan-500 font-bold">[LMB]</span> Select Node & Focus</p>
            <p className="mb-2"><span className="text-cyan-500 font-bold">[DRAG]</span> Orbit Camera</p>
            <p><span className="text-cyan-500 font-bold">[SCROLL]</span> Zoom</p>
          </div>

            {!selectedId && (
                <div className="animate-pulse text-cyan-500 text-xs border border-cyan-500/30 px-3 py-1 rounded-full bg-cyan-900/10">
                    SCANNING NETWORK...
                </div>
            )}
        </footer>
      </div>
    </div>
  );
};

export default App;