# Tech Stack & Configuration

## Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.1.6 | Framework (App Router) |
| react | 19.2.3 | UI library |
| react-dom | 19.2.3 | React DOM rendering |
| typescript | ^5 | Type system |
| tailwindcss | ^4 | Utility-first CSS |
| framer-motion | ^12.34.0 | Animations and transitions |
| react-pdf | ^10.3.0 | PDF rendering in-browser |
| lucide-react | ^0.563.0 | Icon library |
| @fontsource-variable/inter | * | Inter font (npm package) |

## Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @types/node | ^20 | Node.js types |
| @types/react | ^19 | React types |
| @types/react-dom | ^19 | React DOM types |
| @eslint/eslintrc | ^3 | ESLint config |
| eslint | ^9 | Linting |
| eslint-config-next | 16.1.6 | Next.js ESLint rules |
| @tailwindcss/postcss | ^4 | Tailwind PostCSS plugin |
| playwright | ^1.49.0 | Browser automation/testing |

## Configuration Files

### package.json scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### next.config.ts
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    // Handle .mjs for pdfjs-dist worker
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    return config;
  },
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: "",
      },
    },
  },
};

export default nextConfig;
```

**Key point**: The `canvas: false` alias is required for `react-pdf` / `pdfjs-dist` to work in Next.js without a native canvas dependency.

### postcss.config.mjs
```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### Tailwind CSS v4
Tailwind v4 does NOT use a `tailwind.config.js` file. Instead, the theme is defined inline in `globals.css` using `@theme inline { ... }`. See the Design System file for full theme definition.

## Fonts

1. **Satoshi Variable** — loaded from Fontshare CDN and also from a local `.woff2` file in `/public/fonts/`
   - CDN: `https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap`
   - Local: `/public/fonts/satoshi-variable.woff2`
2. **Inter** — loaded via npm package `@fontsource-variable/inter` and also via `next/font/google`

## Static Assets

- `/public/pdfs/` — 15 JP Morgan research PDF files
- `/public/pdf.worker.min.mjs` — PDF.js web worker for react-pdf
- `/public/fonts/satoshi-variable.woff2` — Satoshi font file
- `/public/*.svg` — Various UI SVG icons

## Environment Variables (Referenced but not required for prototype)

| Variable | Purpose | Default |
|----------|---------|---------|
| FACTIFY_URL | Factify API URL | Not used in prototype |
| OPENAI_API_KEY | Design parity scripts only | Not used in app |
| DEMO_BASE_URL | Demo walkthrough scripts | http://localhost:3000 |
