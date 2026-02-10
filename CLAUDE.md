# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Work with Gen" is a marketing/portfolio site for a GoHighLevel (GHL) automation consultant. It's a React SPA with an inquiry form funnel and a GHL-integrated booking calendar.

## Commands

- `npm run dev` — Start Vite dev server on port 3000
- `npm run build` — Production build
- `npm run preview` — Preview production build

No test runner or linter is configured.

## Architecture

**Stack:** React 19, TypeScript, Vite, Tailwind CSS (loaded via CDN script in `index.html`), Three.js, Recharts, Lucide icons.

**Routing:** Uses `HashRouter` from react-router-dom v7. All routes use hash-based URLs (`/#/book`, etc.). `App.tsx` includes a `ForceHomeRedirect` that sends non-root paths back to `/` on page load/refresh.

**Three routes:**
- `/` — `LandingPage` (main marketing page with sections: hero, efficiency stats, services grid, projects carousel, features, deployment protocol, CTA)
- `/book` — `BookingPage` (inquiry form via `InquiryForm` component)
- `/thank-you` — `ThankYouPage` (GHL calendar integration for booking discovery calls). Receives form data via router `state`.

**Key patterns:**
- **Theme system:** `ThemeContext` provides light/dark toggle. Persists to `localStorage`, falls back to `prefers-color-scheme`. Dark mode uses Tailwind's `class` strategy (adds `dark` to `<html>`). Most components consume `useTheme()`.
- **Global background:** `GenerativeNetwork` is a full-viewport fixed canvas (`-z-10`) rendering an interactive particle network. Particle count is screen-area-based (`width*height/15000`). Mouse repels particles within 200px radius. Re-initializes on theme change.
- **Custom cursor:** `CustomCursor` replaces the native cursor (hidden via CSS `cursor: none` in `index.html`) with a dot + trailing ring using `requestAnimationFrame` lerp. Disabled on viewports < 768px.
- **Animations:** CSS keyframe animations (`animate-reveal-up`, `animate-reveal-left`) triggered by `IntersectionObserver` via the `Reveal` wrapper component (defined locally in both `LandingPage.tsx` and `BookingPage.tsx`). `CountUp` component animates numbers on scroll-into-view.
- **Magnetic effect:** `Magnetic` component applies mouse-following translation to children (used on CTA buttons).
- **LiquidDistortion:** Three.js shader-based image distortion with chromatic aberration on mouse movement. Imported but currently only available as a component (not actively used on any page).

**GHL Integration:** `ThankYouPage` fetches calendar slots from `rest.gohighlevel.com/v1/appointments/slots` and posts bookings to `/v1/appointments/`. Uses `CALENDAR_ID` constant and `GHL_API_KEY` from `process.env` (injected via Vite's `define` from `GEMINI_API_KEY` env var in `.env.local`).

**Styling approach:** Tailwind utility classes via CDN `<script>` tag (not PostCSS). Custom CSS classes (`glass-card`, `apple-blur`, `purple-gradient`, animation keyframes) are defined inline in `index.html <style>`. The Tailwind config extends colors with CSS custom properties (`--background`, `--foreground`).

**Path alias:** `@` maps to the project root (configured in both `vite.config.ts` and `tsconfig.json`).

## Important Notes

- All static assets (images, videos) are hosted externally on Google Cloud Storage (`storage.googleapis.com/msgsndr/...`). No local assets directory exists.
- The `background-demo.html` is a standalone vanilla JS demo of the generative network effect, not part of the React app.
- Form submission in `InquiryForm` simulates a 1.5s delay then navigates to `/thank-you` — there is no backend API call for form data.
- The env var setup in `vite.config.ts` maps `GEMINI_API_KEY` to both `process.env.API_KEY` and `process.env.GEMINI_API_KEY`, but `ThankYouPage` reads `process.env.GHL_API_KEY` which is not wired up — this needs a separate env var or config fix for GHL API calls to work.
