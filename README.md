# Mini ERP — Frontend

Inventory & Sales Management UI built with **React 19**, **Vite 8**, **TypeScript 6**, **Tailwind CSS v4**, **TanStack Query 5**.

> **Live URL:** `https://erp-taskf.vercel.app`
> **Backend API:** `https://erp-taskb.railway.app/api/v1`

---

## Quick Start

```bash
git clone <repo-url>
cd frontend
cp .env.example .env
npm install
npm run dev    # http://localhost:5173
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Manager | manager@example.com | manager123 |
| Employee | employee@example.com | employee123 |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview build locally |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend REST API base URL |
| `VITE_SOCKET_URL` | Backend WebSocket URL |

## Tech Stack

- React 19 + TypeScript 6
- Vite 8
- Tailwind CSS v4
- TanStack Query 5 (server state)
- React Router 7
- react-hook-form + Zod
- Socket.io Client (real-time stock updates)
- Axios with interceptors
- Sonner (toasts)
- Lucide React (icons)
