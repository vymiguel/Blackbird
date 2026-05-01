# MiguelGym

A mobile Expo app for a 4-day muscle-building gym plan with a premium dark interface and Convex storage.

## Features

- Home screen with the 4 workout days.
- Detailed exercise lists with sets, reps, rest time, and technique notes.
- Per-exercise completion toggles stored in Convex.
- Workout-day progress bars.
- Rest timer shortcuts for each exercise.
- Weekly progress from Friday through Thursday.
- Workout sessions, set logs, personal exercise notes, and weekly summary history in Convex.
- Exercise detail/edit fields for technique notes, target muscle, equipment, rest time, and substitutes.
- Installable PWA preview at `http://127.0.0.1:4173` with local-storage persistence and offline caching for fast UI testing.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Initialize Convex and generate the Convex client files:

   ```bash
   npx convex dev
   ```

3. Copy `.env.example` to `.env.local` and set `EXPO_PUBLIC_CONVEX_URL` to the deployment URL from Convex.

4. Start the mobile app:

   ```bash
   npm start
   ```

The first app load seeds the default 4-day plan into Convex if the database is empty.

## Deploy PWA Online

Build the static PWA:

```bash
npm run build:pwa
```

This creates a `dist` folder with:

- `index.html`
- `manifest.webmanifest`
- `sw.js`
- `app-icon.svg`

Fastest option: drag the `dist` folder into Netlify Drop.

CLI options:

```bash
npx netlify deploy --prod --dir dist
```

or:

```bash
npx vercel --prod
```
