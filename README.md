# GAMING TORNAMENT PORTAL

A polished, responsive esports tournament management portal built as a frontend-only university project demonstration. Discover tournaments, sign in with a demo player or admin account, and explore connected player and administration workflows.

## Technology

- React 18, Vite, JavaScript ES modules
- React Router DOM for public, detail, and dashboard routes
- Lucide React for interface icons
- Recharts for dashboard visualizations
- CSS Grid, Flexbox, responsive CSS, and accessible interactions
- LocalStorage for demo accounts, tournaments, registrations, teams, results, and session state

## Features

- Public landing page, tournament discovery and details, about, contact, and FAQ pages
- Game, status, prize, and entry-fee filters; search; grid/list views
- Demonstration-only player/admin authentication and protected dashboard
- Player registration with required game IDs, duplicate and capacity checks, per-tournament UPI display, demo payment confirmation, player profile, teams, schedule, results, and leaderboard
- Admin tournament create/edit/delete for built-in or custom game titles, configurable game-logo URLs and maximum-player limits, registrations and status, player and team directories, match result publishing, reports, charts, and CSV export
- Shared state updates across dashboards and browser tabs; reset-to-seed action
- Responsive layout, visible keyboard focus, form validation, toast feedback, confirmations, and empty states

## Install and run (Windows / VS Code)

Open the project folder in VS Code. In the integrated PowerShell terminal, run:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). To create a production build:

```powershell
npm.cmd run build
```

## Demo credentials

| Role | Email | Password |
|---|---|---|
| Player | `player@demo.com` | `player123` |
| Admin | `admin@demo.com` | `admin123` |

Use the login quick-fill buttons to populate either account. New demo users can also be created from the signup page.

## Important demo security and payment note

This project has no backend, database, account verification, or payment gateway. Passwords and app data are stored in browser LocalStorage and are **not production secure**. Entry fees, revenue, and prize pools are illustrative; no real money is charged, held, or paid. The sample UPI ID `arena-demo@upi` is a placeholder, not a payment destination; an admin can set a different display ID for each tournament. Registration records the player’s game ID per game. Do not enter real passwords or sensitive information. Admin controls are frontend role-gated for demonstration only.

## Project structure

```text
src/
  components/       Shared public UI, tournament card, toast
  context/          LocalStorage-backed app state and demo auth
  data/             Tournament seed data and supported games
  layouts/          Dashboard navigation and shell
  pages/            Landing, tournament, auth, information, dashboard views
  styles/           Responsive application stylesheet
  utils/            IDs, date, initials, and currency formatting
```

## Project presentation outline

1. **Problem statement:** Tournament information, team participation, registration, and event administration are often spread across disconnected tools.
2. **Objectives:** Demonstrate a clear player journey and a connected organizer workflow in one accessible, responsive portal.
3. **Modules:** Public discovery, demo authentication, player dashboard, admin dashboard, LocalStorage persistence, and charts/reports.
4. **Architecture:** Vite and React entry point; React Router for page navigation; shared Context API for seeded state and updates; reusable components; browser LocalStorage for frontend persistence.
5. **Demo flow:** Browse events → open tournament details → log in as a player → register (simulated payment) → inspect player dashboard → log in as admin → create/edit an event → publish a result → inspect reports.
6. **Future scope:** Add a secure API and database, verified identities and server-side authorization, real-time brackets and match check-in, notification delivery, and a compliant payment provider.
