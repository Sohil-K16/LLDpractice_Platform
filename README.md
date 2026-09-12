# Low-Level Design (LLD) Practice & Evaluation Platform

An enterprise-grade, interactive **Low-Level Object-Oriented Design (LLD) Practice & Evaluation Platform** built for software engineers to practice classic system design challenges (Parking Lot, Vending Machine, Elevator Management System) with structured submissions, live Mermaid class diagram previews, objective 6-dimension rubric evaluation, and actionable redo tasks.

---

## Key Features

1. **Structured LLD Submission Schema**
   - Eliminates vague, unstructured text submissions.
   - Distinct sections for: Assumptions, Classes & Responsibilities (SRP), Relationships (UML), Key Execution Flows, Design Decisions & Trade-offs, and Mermaid Class Diagrams.
2. **Evaluator Strategy Pattern**
   - Pluggable `Evaluator` interface:
     - `RuleBasedEvaluator`: Deterministic, offline heuristic engine analyzing SRP violations, pattern coverage, and edge-case handling.
     - `AIEvaluator`: OpenAI LLM integration producing structured JSON with evidence quotes.
     - `HybridEvaluator`: Resilient hybrid orchestrator that falls back gracefully to rule-based evaluation if an API key is absent or network requests fail.
3. **Actionable Redo Tasks (The Core Differentiator)**
   - Not just a score (e.g., 78/100), but concrete diagnostics:
     > *"Your `ParkingLot` class handles both spot allocation and fee calculation. If dynamic surge pricing is introduced, this class will require breaking modifications. Refactor by introducing a `PricingStrategy` interface."*
   - Direct "Refactor & Retry Attempt" workflow with iterative score comparison.
4. **Interactive Mermaid.js Diagram Editor**
   - Real-time syntax validation and instant SVG class diagram visualization.
5. **Full Attempt Lifecycle State Machine**
   - Rigorous state transitions: `DRAFT` → `SUBMITTED` → `EVALUATING` → `COMPLETED` / `FAILED`.
   - Submissions are persistently committed before evaluation starts, ensuring user work is never lost even if external evaluators fail.

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React 19 + TypeScript + Vite | Blazing fast development, strict typing, clean component architecture |
| **Styling** | Tailwind CSS + Lucide Icons | Responsive, modern dark-mode developer UI |
| **Backend** | Node.js + Express + TypeScript | Lightweight, clean REST API |
| **Database & ORM** | SQLite + Prisma ORM | Zero infrastructure setup, type-safe queries, portable file-based DB |
| **Diagrams** | Mermaid.js | Plain-text UML diagram syntax, stored directly in database |
| **Validation** | Zod | Deterministic runtime schema validation |
| **Testing** | Vitest | Fast unit testing for domain models, validation, and evaluators |

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20/v26)
- npm 9+

### 1. Installation
In the project root directory:
```bash
npm run install:all
```
*(Or navigate to `server/` and `client/` and run `npm install` in each).*

### 2. Database Setup & Seeding
From the `server/` directory:
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```
This initializes the SQLite database (`server/dev.db`) and seeds the 3 foundational problems and a demo user.

### 3. Running the Application

**Run Backend:**
```bash
npm run dev:server
# Server starts on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

**Run Frontend:**
```bash
npm run dev:client
# Frontend runs on http://localhost:5173
```

---

## Optional OpenAI API Configuration

To enable LLM evaluation via OpenAI:
1. Open `server/.env`.
2. Provide your API key:
   ```env
   OPENAI_API_KEY="sk-..."
   OPENAI_MODEL="gpt-4o-mini"
   ```
3. Restart the server. The `HybridEvaluator` will automatically activate AI evaluation while maintaining fallback protection.

---

## Running Automated Tests

Run the Vitest test suite covering validation services, state machine transitions, and rubric evaluations:
```bash
cd server
npm test
```

---

## Deployment Guide

### Option 1: Render (Recommended - Free Tier)

Deploy the entire full-stack app (Backend + Frontend + SQLite) to **Render** as a single Web Service:

#### Using Render Blueprints (1-Click):
1. Push this repo to your GitHub account.
2. Sign in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Blueprint**.
4. Connect your `LLDpractice_Platform` repository. Render will automatically detect `render.yaml`.
5. Click **Apply**. Render will automatically build the client, prepare the database, and launch your live site!

#### Manual Web Service Setup:
1. On [Render](https://dashboard.render.com), click **New +** → **Web Service**.
2. Connect your GitHub repository (`LLDpractice_Platform`).
3. Set the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm run install:all && npm run build && npm run db:setup`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = `file:./dev.db`
   - *(Optional)* `OPENAI_API_KEY` = your OpenAI key (if using GPT evaluation)
5. Click **Deploy Web Service**.

---

### Option 2: Docker / Container Deployment

A multi-stage `Dockerfile` is included. Build and run locally or on any cloud VPS (DigitalOcean, AWS ECS, GCP Cloud Run, Fly.io):

```bash
docker build -t lld-practice-platform .
docker run -p 5000:5000 -e DATABASE_URL="file:./dev.db" lld-practice-platform
```
Open `http://localhost:5000` in your browser.
