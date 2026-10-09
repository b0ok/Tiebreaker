# The Tiebreaker ⚖️

> **An AI-powered decision-making companion** that cuts through analysis paralysis with rigorous mental models, weighted comparison matrices, strategic SWOT grids, and gut-check tiebreakers.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google%20Gen%20AI-Gemini%202.5%20Flash-orange.svg)](https://ai.google.dev/)

---

## 🎯 Overview

When faced with tough choices—career changes, technical architecture, relocation, or high-stakes purchases—the hardest part isn't a lack of information, it's **analysis paralysis**.

**The Tiebreaker** transforms messy dilemmas into structured, actionable frameworks. Instead of returning generic walls of text, it models decisions systematically and lets you explore your problem through your chosen lens.

---

## ✨ Key Features

### 1. 🔍 Method-First Decision Selector
Save tokens and eliminate bloat by choosing exactly the framework you need, with on-demand lazy loading for additional views:
- **Analyze Pros & Cons**: Detailed lists of weighted benefits, risks, and actionable mitigation tactics.
- **Comparison Matrix**: Side-by-side criteria evaluation with interactive weights (1× to 3×) and real-time score re-ranking.
- **SWOT Analysis**: Strategic 2×2 grid categorizing internal Strengths & Weaknesses alongside external Opportunities & Threats.
- **Deliver Clear Verdict**: A decisive recommendation with confidence score, logical rationale, critical caveats, and a gut-check prompt.
- **Flip a Coin (Tiebreaker)**: Interactive 3D coin toss that forces you to realize what you were secretly hoping for during the flip.

### 2. 🎚️ Dynamic Criteria Weighting
Adjust the importance of any decision criteria (e.g., Cost, Work-Life Balance, Growth, Risk) on the fly using interactive sliders. Watch composite scores and winner rankings update instantaneously in real-time.

### 3. 🪙 Interactive Coin Flip & Gut-Check Engine
When rational analysis yields a 50/50 deadlock, run the coin flip simulator. A 3-second gut-check timer forces instinct calibration: *“While the coin was in the air, which side were you silently hoping would land face up?”*

### 4. 🗂️ Decision Presets & History
- **Pre-configured Templates**: Instantly populate common high-stakes decisions (e.g., Startup vs. Big Tech, Buy vs. Rent Home, React Native vs. Flutter, Mac vs. ThinkPad).
- **Session Persistence**: Previous dilemmas are saved locally so you can revisit, modify criteria, or review verdicts anytime.
- **Export & Share**: Export complete decision summaries or clean Markdown briefs for teams, partners, or journals.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion |
| **Backend** | Node.js, Express, tsx (with Vite middleware during development) |
| **AI Engine** | `@google/genai` TypeScript SDK using `gemini-2.5-flash` with strict structured JSON schemas |
| **Bundling** | Vite 6 + esbuild |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- A Google Gemini API key ([Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install
```bash
git clone <repository-url>
cd the-tiebreaker
npm install
```

### 2. Configure Environment
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Run in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📋 Available Scripts

- `npm run dev`: Starts the development server with Hot Module Replacement and Express API routes.
- `npm run build`: Builds the client with Vite and bundles the Express server with esbuild into `dist/`.
- `npm run start`: Starts the production server from `dist/server.cjs`.
- `npm run lint`: Runs TypeScript compiler (`tsc --noEmit`) to verify types.
- `npm run clean`: Cleans up previous build artifacts.

---

## 🔒 Privacy & Security

- **Server-Side API Calls**: All interactions with the Gemini API occur securely on the backend server; your API key is never exposed to the client browser.
- **Zero Tracking**: No external analytics or tracking scripts are loaded.
- **Local Persistence**: User dilemma history is stored exclusively in your browser's `localStorage`.

---

## 📄 License

MIT © [The Tiebreaker Team]
