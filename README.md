# NET_VISUALIZER - Spatial Infrastructure Monitor v2.0

A futuristic, 3D spatial dashboard for visualizing server infrastructure health and performance in real-time.

## 🚀 Features

- **3D Visualization:** Interactive 3D scene displaying a cluster of 60 servers.
- **Real-time Monitoring:** Visual indicators for server health (Healthy, Warning, Critical) and system load.
- **Interactive Controls:**
  - Orbit Control: Drag to rotate the camera.
  - Zoom: Scroll to zoom in/out.
  - Inspection: Click on a server node to focus and view details.
- **Status Dashboard:** Floating HUD showing global cluster stats such as average load and health counts.

## 🛠️ Tech Stack

- **Frontend Framework:** React
- **3D Library:** Three.js
- **Styling:** Tailwind CSS
- **Build Tool:** Vite

## 📦 Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd spatial-ops-dashboard
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173` (or the port shown in your terminal).

## 🎮 Controls

- **Left Click:** Select Node & Focus
- **Drag Mouse:** Rotate Camera
- **Scroll:** Zoom In/Out
