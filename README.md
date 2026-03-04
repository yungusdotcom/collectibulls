# Collectibulls

Premium trading card portfolio tracker. Track. Trade. Triumph.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repo at [vercel.com/new](https://vercel.com/new).

## Tech Stack

- **Next.js 14** — React framework
- **Recharts** — Portfolio trend charts
- **Tailwind CSS** — Utility styles
- **localStorage** — Client-side data persistence

## Security

- CSP headers configured in `next.config.js`
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Input sanitization on all storage keys
- No raw HTML injection
