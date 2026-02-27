# ⚖️ LexAI — AI Legal Agent for Everyone

<div align="center">

**Upload any contract → AI flags illegal clauses, writes counter-clauses, gives a Sign/Don't Sign verdict, and trains you to negotiate. Free legal protection for everyone.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.1_70B-orange?style=for-the-badge)](https://groq.com)
[![Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-blue?style=for-the-badge&logo=google)](https://aistudio.google.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

[🚀 Live Demo](https://lex-ai-puce.vercel.app/) · [📹 Demo Video](https://youtube.com/your-link) · [🐛 Report Bug](https://github.com/yourusername/lexai/issues)

![LexAI Hero](public/hero.png)

</div>

---

## 📌 The Problem

Every year, millions of Indians sign rental agreements, employment contracts, NDAs, and loan documents they don't understand. Legal review costs **₹2,000–₹10,000 per document** — 92% of people can't afford it. They sign anyway.

A clause that violates the Indian Contract Act. A non-compete that is legally unenforceable. A deposit clause designed to never be returned. **Signed. Every day. By people who just didn't know.**

LexAI fixes that.

---

## ✨ Features

### 🚨 Illegal Clause Detection
Flags clauses that violate actual Indian law — not just "risky," but **legally unenforceable** — with specific Act name and section number.

> Covers: Indian Contract Act §23/§27 · IT Act §43/§72 · Rent Control Acts · Industrial Disputes Act · Consumer Protection Act 2019

### 🚦 "Sign or Don't Sign" Verdict
A clear decision — not a score:
- ✅ `SAFE TO SIGN` — no critical issues
- ⚠️ `DO NOT SIGN YET` — fix these 3 clauses first
- 🚫 `DO NOT SIGN` — serious illegal content

### ✍️ Counter-Clause Generator
For every risky clause, LexAI writes **ready-to-send alternative wording** the user can demand from the other party.

### 🎭 Negotiation Roleplay Simulator
AI plays the landlord, employer, or client. You practice your pushback. After 3 rounds, AI gives a negotiation debrief and outcome score.

### 🆚 Contract Version Comparator
Upload old + new contract. AI diffs every clause — what changed, what disappeared, and whether each change hurts or helps you.

### ⏰ Clause Danger Timeline
Visual timeline of *when* each clause activates over the contract period. The auto-renewal that fires in month 10. The rent hike trigger in month 6.

### 📊 Clause Benchmark Engine
Compares your clauses against 200+ real Indian contracts. *"Your 90-day notice period is above market for 73% of similar IT roles."*

### 📋 Dispute Letter Generator
Rights violated after signing? LexAI generates a proper Indian legal notice — correct citations, 15-day deadline, court-ready language.

### 🌐 Hindi + Voice Support
Full Hindi explanations + Text-to-Speech on every clause. Works on ₹8,000 Android phones.

---

## 🖥️ Screenshots

| Verdict Banner | Clause Analysis | Danger Timeline |
|---|---|---|
| ![verdict](public/screenshots/verdict.png) | ![clauses](public/screenshots/clauses.png) | ![timeline](public/screenshots/timeline.png) |

| Negotiation Roleplay | Contract Compare | Dispute Letter |
|---|---|---|
| ![roleplay](public/screenshots/roleplay.png) | ![compare](public/screenshots/compare.png) | ![dispute](public/screenshots/dispute.png) |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 14 (App Router) | UI + API routes in one project |
| Styling | Tailwind CSS | Fast, responsive design |
| Primary LLM | Groq LLaMA 3.1 70B | Sub-1s clause analysis + negotiation |
| Vision / OCR | Google Gemini 1.5 Flash | PDF → text extraction |
| Database | MongoDB Atlas | Documents, clauses, benchmark data |
| Deployment | Vercel | Auto-deploy from GitHub |
| Voice | Web Speech API | Browser-native TTS + mic input |

---

## 🏗️ Architecture

```
User Browser (Next.js 14 PWA)
        │
        ├── /analyze    → Upload + full analysis workspace
        ├── /compare    → Contract version diff
        ├── /roleplay   → Negotiation simulator
        ├── /dispute    → Legal notice generator
        └── /history    → Past analyzed documents
        │
        ▼
Next.js API Routes
        │
        ├── /api/parse-document      → Gemini: PDF → raw text
        ├── /api/analyze-clauses     → Groq: master analysis JSON
        ├── /api/counter-clause      → Groq: alternative clause wording
        ├── /api/compare-contracts   → Groq: old vs new diff
        ├── /api/negotiation-chat    → Groq: SSE streaming roleplay
        ├── /api/benchmark-clause    → MongoDB + Groq comparison
        ├── /api/dispute-letter      → Groq: legal notice draft
        └── /api/documents           → MongoDB CRUD
        │
        ├── Groq LLaMA 3.1 70B   (analysis, negotiation, letters)
        ├── Gemini 1.5 Flash      (PDF parsing)
        └── MongoDB Atlas         (storage + 200 benchmark clauses)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB Atlas account (free)
- Groq API key (free)
- Google Gemini API key (free)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/lexai.git
cd lexai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your API keys (see below)

# 4. Seed benchmark database
node scripts/seed-benchmarks.js

# 5. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Atlas
# Get from: cloud.mongodb.com → Connect → Drivers
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/lexai

# Groq (Free: 14,400 req/day)
# Get from: console.groq.com/keys
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Gemini (Free: 1,500 req/day)
# Get from: aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_64_char_random_secret
```

### Getting Free API Keys

| Service | URL | Free Limit |
|---|---|---|
| Groq | [console.groq.com/keys](https://console.groq.com/keys) | 14,400 req/day · 30 RPM |
| Gemini | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) | 1,500 req/day · 15 RPM |
| MongoDB | [cloud.mongodb.com](https://cloud.mongodb.com) | 512MB free M0 cluster |

---

## 📁 Project Structure

```
lexai/
├── app/
│   ├── layout.jsx              # Root layout
│   ├── page.jsx                # Landing page
│   ├── analyze/page.jsx        # ★ Main analysis workspace
│   ├── compare/page.jsx        # Contract version diff
│   ├── roleplay/page.jsx       # Negotiation simulator
│   ├── dispute/page.jsx        # Dispute letter generator
│   ├── history/page.jsx        # Past documents
│   └── api/                    # All API routes
│
├── components/
│   ├── VerdictBanner.jsx       # Sign / Don't Sign banner
│   ├── ClauseCard.jsx          # Expandable clause card
│   ├── DangerTimeline.jsx      # Visual clause timeline
│   ├── NegotiationChat.jsx     # Roleplay chat UI
│   ├── DiffViewer.jsx          # Contract compare view
│   └── ...                     # Other components
│
├── lib/
│   ├── mongodb.js              # DB connection
│   ├── groq.js                 # Groq client
│   ├── gemini.js               # Gemini client
│   └── prompts.js              # All LLM prompts
│
├── models/                     # Mongoose schemas
├── scripts/
│   └── seed-benchmarks.js      # Seeds 200 Indian contract clauses
│
├── .env.example                # Environment template
└── package.json
```

---

## 📦 Key Dependencies

```json
{
  "next": "14.2.0",
  "groq-sdk": "^0.7.0",
  "@google/generative-ai": "^0.17.0",
  "mongoose": "^8.4.0",
  "recharts": "^2.12.0",
  "lucide-react": "^0.400.0",
  "tailwindcss": "^3.4.0"
}
```

---

## 🌐 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# After deploy, add env vars in:
# Vercel Dashboard → Project → Settings → Environment Variables
```

Add all variables from `.env.local` in the Vercel dashboard, then redeploy.

---

## 🗺️ Roadmap

- [x] PDF upload + Gemini text extraction
- [x] Illegal clause detection with Indian law citations
- [x] Sign / Don't Sign verdict
- [x] Counter-clause generator
- [x] Negotiation roleplay simulator
- [x] Contract version comparator
- [x] Clause danger timeline
- [x] Benchmark engine (200 seeded clauses)
- [x] Dispute letter generator
- [x] Hindi + voice support
- [ ] Regional languages (Marathi, Telugu, Tamil)
- [ ] WhatsApp bot integration
- [ ] Lawyer connect (30-min paid consultation)
- [ ] B2B API for real-estate platforms
- [ ] Community red flags (crowdsourced clause warnings)

---

## ⚠️ Disclaimer

LexAI provides **legal information**, not legal advice. It is not a substitute for professional legal counsel. Always consult a qualified lawyer for important legal decisions. Illegal clause detection is based on publicly available Indian law and should be independently verified for your specific situation.

---

## 👥 Team

Built with ❤️ at **TerraCode Convergence 2026**

| Name | Role |
|---|---|
|  Yashodip More | Full Stack + AI |
|  Teammate | Frontend + Design |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**LexAI** · TerraCode Convergence 2026

*"Harvey AI serves law firms. LexAI serves you."*

</div>
