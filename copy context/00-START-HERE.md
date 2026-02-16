# VIP Research Distribution Platform — Full Rebuild Context

## How to Use These Files

This folder contains **everything** an AI (or developer) needs to rebuild the VIP Research Distribution Platform from scratch. The files are numbered in the order they should be read:

| File | Purpose |
|------|---------|
| `00-START-HERE.md` | This file — overview and reading order |
| `01-PROJECT-OVERVIEW.md` | What the app is, who it's for, and the product vision |
| `02-TECH-STACK.md` | Frameworks, libraries, versions, and configuration |
| `03-ARCHITECTURE.md` | File structure, routing, state management, data flow |
| `04-DATA-MODELS.md` | All TypeScript interfaces and data shapes |
| `05-MOCK-DATA.md` | Complete description of all mock data (VIPs, documents, etc.) |
| `06-PAGES-AND-ROUTES.md` | Every page/route, what it shows, and how it behaves |
| `07-COMPONENTS.md` | Every component, its props, behavior, and visual spec |
| `08-DESIGN-SYSTEM.md` | Colors, typography, spacing, shadows, component styles |
| `09-VIEWER.md` | The PDF Viewer — the most complex component, full spec |
| `10-DEMO-FLOW.md` | The end-to-end demo walkthrough (JP Morgan Chase) |
| `11-FACTIFY-API.md` | Factify API reference (for future backend integration) |
| `12-BUSINESS-LOGIC.md` | AI recommendations, chat, personalization, engagement logic |

## Quick Summary

**What**: A frontend prototype of an AI-powered research distribution platform for investment bankers. Bankers upload research PDFs, manage VIP clients, get AI-powered document-to-client matching recommendations, share documents with personalized annotations, and track engagement.

**Tech Stack**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, Framer Motion, react-pdf, Lucide React icons.

**Current State**: Frontend-only prototype with mock data. No backend. No real API calls. All data is in-memory with localStorage persistence. The app is designed to eventually integrate with the Factify API for real document management.

**Key Differentiator**: The PDF Viewer experience — personalized walkthroughs, inline annotations, AI chat, and engagement tracking that bridges the banker and VIP experience.
