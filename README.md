# 🚀 Freight Tracker Frontend (React + Vite + Tailwind)

This is the frontend for the **Freight Tracker** project, built with modern React tooling — **Vite**, **TypeScript**, and **Tailwind CSS**. It provides the user-facing dashboard to track shipments and integrates with the backend's real-time WebSocket updates.

## 🧰 Tech Stack

- **React 18 + TypeScript** – Component-based UI with type safety
- **Vite** – Fast development and build tool
- **Tailwind CSS (latest)** – Utility-first styling
- **React Router DOM** – Client-side routing (Home + Shipments pages)

## 📂 Project Structure

```
client-freight/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components (buttons, cards, etc.)
│   ├── pages/             # Full-page components (Dashboard, ShipmentList, etc.)
│   ├── hooks/             # Custom React hooks (e.g., useShipments)
│   ├── services/          # API calls / WebSocket helpers
│   ├── types/             # TypeScript types/interfaces
│   ├── context/           # React context (e.g., AuthContext, ThemeContext)
│   ├── App.tsx            # Main app component (entry point for routing)
│   ├── main.tsx           # Vite entry point
│   └── index.css          # Tailwind global styles
├── index.html             # Root HTML file
└── package.json           # Dependencies and scripts
```

## ✨ Features Implemented (Frontend Phase 1)

- **Project setup** with Vite, TypeScript, and Tailwind CSS
- **Routing** between:
  - `/` → Home page
  - `/shipments` → Shipments page
- Basic folder structure aligned with best practices

## ⚙️ Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## 📌 Roadmap (Frontend)

- **Phase 2**: Connect to backend API (CRUD, search, stats)
- **Phase 3**: Integrate WebSockets for real-time updates
- **Phase 4**: Add authentication & role-based UI
- **Phase 5**: Deploy frontend (e.g., Netlify/Vercel) and integrate with backend deployment
