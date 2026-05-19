# Centauri: Next-Gen Tech Infrastructure

Centauri is a high-tech digital infrastructure and AI guidance platform designed for the next generation of technology talent in the UK. It bridges the gap between ambition and access by providing a network of physical "Hub Points" and digital mentorship.

![App Preview](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop)

## 🌌 The Vision

Centauri provides the "hardware and headspace" required for modern engineering. Through our **Centauri Points** network, users can access high-spec laptops and 5G connectivity hubs at local libraries and community centers, coordinated through a tactical, real-time dashboard.

## 🚀 Key Features

-   **Centauri Points (West Midlands Sector):** A real-time, interactive map interface displaying hardware locker availability across Birmingham, Wolverhampton, Dudley, and Solihull.
-   **Mission Hub:** A personalized dashboard for tracking streaks, points, and active workstation sessions.
-   **AI Guide:** Dynamic, context-aware assistance to help users navigate the tech landscape.
-   **Mentor Network:** Connect with industry leads for "Verified Sessions" and career acceleration.
-   **Locker Shop:** Redeem points for hardware upgrades, tech gear, and server credits.
-   **Tactical UI:** A "Low-Light" optimized interface built with a minimalist, high-contrast aesthetic using Tailwind CSS and Motion.

## 🛠 Tech Stack

-   **Frontend:** React 18 + Vite
-   **Styling:** Tailwind CSS (Utility-first, dark theme optimized)
-   **Animations:** Motion (Framer Motion) for fluid UI transitions and interactive map pulses
-   **Icons:** Lucide React
-   **Deployment:** Cloud Run (Dockerized Express/Vite hybrid)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/centauri.git
   cd centauri
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Enable Environment Variables:**
   Create a `.env` file in the root:
   ```env
   VITE_APP_NAME="Centauri"
   # Add any required API keys here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🗺 Map Architecture

The Centauri Points system uses a custom-layered coordinate system to simulate real-time geographical data without the overhead of heavy map APIs, ensuring high performance even on low-bandwidth connections at Hub Points.

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built for the next generation of engineers.*
