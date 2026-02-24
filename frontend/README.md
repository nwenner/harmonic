# Harmonic — Frontend

React SPA for [Harmonic](https://harmonic.nickwenner.com). See the [root README](../README.md) for full project setup and deploy instructions.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v3 (`darkMode: "class"`)
- React Router v6 (HashRouter — works with S3/CloudFront, no server config needed)

## Routes

| Path | Component |
|---|---|
| `/#/` | Main app — topic selection → chat → reflection |
| `/#/about` | Project write-up |

## Dev

```bash
npm install
npm run dev
```

Requires a `frontend/.env.local` with:
```
VITE_API_URL=https://your-lambda-function-url
```

## Build & Deploy

```bash
npm run build    # outputs to dist/
npm run deploy   # build + s3 sync + CloudFront invalidation (runs scripts/deploy-site.sh)
```
