# Blackbird Logistics

Static web preview for the Blackbird Logistics operations app.

## Local Preview

```bash
npm start
```

Open `http://127.0.0.1:4173`.

## Convex Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start Convex and follow the login/project prompts:

   ```bash
   npm run convex:dev
   ```

3. Copy the Convex deployment URL into `.env.local`:

   ```bash
   VITE_CONVEX_URL=https://your-deployment.convex.cloud
   ```

When `VITE_CONVEX_URL` is present, shared app data syncs through Convex in real time. Without it, the app falls back to local browser storage for previewing.

## Deploy

Vercel and Netlify are configured to run:

```bash
npm run build
```

and publish `dist/`.

For client-launch security and reporting notes, see `docs/production-readiness.md`.
