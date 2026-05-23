# 🌿 EcoSense Frontend

Smart Agricultural Monitoring System — React Web Application

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env
# Edit VITE_API_URL to point to your backend

# 3. Start dev server
npm run dev
# Opens at http://localhost:3000
```

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/       # Sidebar, Topbar, AppLayout
│   └── ui/           # Modal, Skeleton, EmptyState, ConfirmDialog
├── context/
│   ├── AuthContext   # JWT auth state
│   └── SocketContext # Socket.io real-time connection
├── hooks/
│   └── useFetch      # Generic data fetching hook
├── pages/
│   ├── Login         # Login with email/password
│   ├── Register      # 2-step registration with OTP
│   ├── Dashboard     # Role-aware overview
│   ├── Sectors       # Farm sector management
│   ├── Devices       # IoT device registry
│   ├── Sensors       # Live sensor data + AI analysis
│   ├── Images        # Plant scan & disease detection
│   ├── Reports       # Charts + CSV export
│   ├── Notifications # Alerts management
│   └── Workers       # Worker management (Owner only)
├── services/
│   └── api.js        # All Axios API calls
└── utils/
    └── helpers.js    # Date, status, download utilities
```

## 🔧 Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:6000/api`) |

## 🛠 Tech Stack

- **React 18** + **Vite**
- **React Router v6** — client-side routing
- **Tailwind CSS v3** — utility-first styling
- **Recharts** — charts and analytics
- **Socket.io-client** — real-time notifications
- **Axios** — HTTP requests
- **React Hot Toast** — notifications
- **Lucide React** — icons
- **DM Sans** font — clean agricultural aesthetic

## 🎨 Design System

Green agricultural theme with:
- `forest-*` — primary green palette
- `sage-*` — neutral grays
- `earth-*` — warm accent tones
- Custom animations: `fade-in`, `slide-up`, `shimmer`
- Consistent card, button, input, badge component classes
