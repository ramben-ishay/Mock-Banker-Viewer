# Project Overview

## Product Vision

The VIP Research Distribution Platform is an AI-powered tool for investment bankers at firms like J.P. Morgan to distribute research documents to their VIP clients in a personalized, trackable way.

Instead of blindly emailing PDFs, the platform:
1. **Analyzes** uploaded research documents
2. **Matches** documents to VIP clients based on their interests and reading history
3. **Enables** personalized sharing with inline annotations and comments
4. **Tracks** engagement (who read what, how far, how long)
5. **Provides** VIPs with an interactive reading experience (guided walkthroughs, AI chat)

## Two User Personas

### The Banker (Primary User)
- Uploads research documents
- Manages a portfolio of VIP clients
- Receives AI recommendations on which documents to send to which VIPs
- Adds personalized comments/annotations before sharing
- Tracks engagement and follows up on declining engagement

### The VIP Client (Secondary User)
- Receives shared documents
- Views documents in an interactive PDF viewer
- Gets a personalized walkthrough highlighting sections relevant to their interests
- Can reply to the banker's comments
- Can chat with an AI about the document content

## Current State

This is a **frontend-only prototype** with all mock data. There is no backend, no database, and no real API calls. The application demonstrates the full user experience for both personas.

The prototype was built for a hackathon/demo involving the Factify platform (a document infrastructure company). In production, Factify would handle document hosting, sharing, access control, and analytics.

## Key Screens

1. **Landing Page** — Document upload with "Factification" animation
2. **VIPs List** — Grid of VIP client cards with CRM connection
3. **VIP Detail** — Engagement data + AI recommendations for a specific VIP
4. **Documents Library** — All uploaded research documents
5. **Document Analytics** — Per-document engagement metrics
6. **PDF Viewer** — Full-featured viewer with chat, comments, walkthrough, annotations

## Branding

The app follows the **Factify Design System** — a clean, modern design language with:
- Primary brand color: `#444aff` (blue/purple)
- Font families: Satoshi Variable (headings) + Inter (body)
- 4px spacing grid
- Clean card-based layouts
- Subtle animations via Framer Motion
