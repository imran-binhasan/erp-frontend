# Mini ERP — Frontend

Inventory & Sales Management UI built with **React 19**, **Vite 8**, **TypeScript 6**, **Tailwind CSS v4**, **TanStack Query 5**, and **TailAdmin** design.

> **Default Local URL:** `http://localhost:5173`

---

## Features

- **Role-based UI** — Admin sees everything; Manager/Employee are gated per permission
- **Authentication** — Login page, JWT stored in localStorage, 401 auto-logout
- **Products** — Table with search/pagination, create/edit modal with image upload, soft-delete (confirm dialog)
- **Customers** — Table with search/pagination, create/edit modal, soft-delete
- **Sales** — Multi-step sale creation (product picker, cart, quantity, price), auto grand-total, ordered list with pagination
- **Users** — Table with search/pagination, create/edit modal with role assignment, soft-delete
- **Roles** — Table with create/edit modal with permission checkboxes (data-driven), delete with guard
- **Profile** — Account info display + change password (current + new password validation)
- **Dashboard** — Stats cards (products, customers, sales, low-stock), real-time Socket.io stock updates
- **Real-time** — Dashboard live-updates when stock changes via Socket.io
- **Dark Mode** — Toggle persisted in localStorage, `.dark` class on `<html>`
- **404 Page** — Catch-all route with "Back to Dashboard" link
- **Network Detection** — Banner when offline, automatic reconnect

---

## Folder Structure

```
src/
├── features/
│   ├── auth/            # LoginPage, AuthContext, ProtectedRoute, hooks, api
│   ├── customers/       # CustomersPage, CustomerFormModal, hooks, api
│   ├── dashboard/       # DashboardPage, hooks, api
│   ├── products/        # ProductsPage, ProductFormModal, hooks, api
│   ├── profile/         # ProfilePage (change password), hooks, api
│   ├── roles/           # RolesPage, RoleFormModal (permission checkboxes), hooks, api
│   ├── sales/           # SalesPage, CreateSalePage, useSaleCart, hooks, api
│   └── users/           # UsersPage, UserFormModal (role dropdown), hooks, api
├── shared/
│   ├── components/      # DataTable, Pagination, SearchInput, ConfirmDialog,
│   │                    # ErrorBoundary, NetworkBanner, ProtectedRoute
│   │   └── ui/          # Button, Input, Select, Modal, Badge, Skeleton, Label (removed)
│   ├── hooks/           # useAuth, useDebounce, useMediaQuery, usePagination (removed)
│   ├── lib/             # cn(), formatCurrency, getErrorMessage
│   └── types/           # API types, common types
├── layouts/             # AppLayout (Sidebar + Header), sidebar config + nav items
├── sockets/             # useSocket singleton
├── pages/               # Lazy-loaded route pages
├── index.css            # Tailwind v4 @theme + TailAdmin tokens + shadcn CSS vars
├── main.tsx             # App entry, providers, router
└── router.tsx           # React Router config with lazy routes
```

---

## Quick Start

```bash
git clone <repo-url>
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL & VITE_SOCKET_URL
npm run dev            # http://localhost:5173
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
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000/api/v1` | Backend REST API base URL |
| `VITE_SOCKET_URL` | `http://localhost:5000` | Backend WebSocket URL |

## Tech Stack

- **React 19** with concurrent features
- **TypeScript 6.0** with strict mode
- **Vite 8** for HMR and builds
- **Tailwind CSS v4** with `@theme` + `.dark` variant
- **shadcn/ui-style** primitives (Button with `asChild`, Input, Select via Radix, Modal via Radix Dialog)
- **TanStack Query 5** for server state
- **React Router 7** with lazy routes
- **react-hook-form** + **Zod** for form validation
- **Socket.io Client** for real-time stock updates
- **Axios** with interceptors
- **Sonner** for toast notifications
- **Lucide React** for icons

## Design Decisions

- **No Redux** — TanStack Query handles server state; `useSaleCart` is the only local state
- **Price snapshots** — sale items store `productName`/`unitPrice` at time of sale (immutable history)
- **Skip/limit pagination** — acceptable at this data volume
- **Dynamic token** — Socket.io `auth` callback reads fresh token from `localStorage` on each reconnect
- **Form modals** — shared Input/Button components with Zod validation and server-error extraction
- **DB-checked permissions** — frontend gates UI via `localStorage` permissions; backend enforces independently
