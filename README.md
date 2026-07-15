# Komalpreet Kaur — Portfolio

Personal portfolio of Komalpreet Kaur, an AI/ML Engineer from India building agentic AI, LLM inference systems, and multimodal models for speech, vision, and memory.

**Live site:** [komalpreet.me](https://komalpreet.me) · **Resume:** [resume.pdf](resume.pdf) · **Contact:** [kaurkomalpreetsohal@gmail.com](mailto:kaurkomalpreetsohal@gmail.com)

---

## Overview

A hand-built, single-page portfolio written in vanilla HTML, CSS, and JavaScript — no frameworks or templates. It features an animated hero, expandable project cards with inline video players, a live GitHub contribution heatmap, real-time traffic analytics, and an adaptive light/dark theme.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (adaptive light/dark theme, animations) |
| Scripting | Vanilla JavaScript |
| Analytics | Upstash Redis (via serverless API) |
| Hosting | Vercel |

## Features

- **Animated hero** — portrait, staggered name reveal, and an "Open to work" status indicator.
- **Featured works** — expandable project cards with custom inline video players, live demos, and source links.
- **More builds** — a grid of 14 additional projects, each with a full detail modal.
- **GitHub heatmap** — live contribution graph integrated into the works section.
- **Live analytics** — total views, unique visitors, and active-now counts backed by Upstash Redis.
- **Adaptive theming** — neutral, high-contrast light and dark modes with a custom toggle.
- **Dock navigation** — floating bottom dock for smooth section scrolling.

## Project Structure

```
.
├── index.html            # Full single-page site
├── styles.css            # Site styles (light/dark theme, animations)
├── script.js             # Modals, analytics, scroll animations
├── api/                  # Serverless endpoints (analytics)
├── resume.pdf            # Downloadable resume
├── context.md            # Full written content of every section and project
├── generate_og.js        # OpenGraph social-card generator
└── README.md
```

## Running Locally

```bash
git clone https://github.com/Komalpreet2809/My-Portfolio-Website.git
cd My-Portfolio-Website

# Serve the static site
python -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000`.

---

## Projects

### Featured

| Project | Description | Stack | Links |
|---------|-------------|-------|-------|
| **Chimera** *(in development)* | LLM inference observability engine — a transformer built from first principles that exposes KV caching, continuous batching, PagedAttention, and speculative decoding. | PyTorch, FastAPI, WebSockets, Next.js, TypeScript, Tailwind, Docker, HF Spaces, Vercel | [Code](https://github.com/Komalpreet2809/Chimera) |
| **Soma** | Cognitive memory architecture — hybrid Vector + Graph RAG with a memory-consolidation "sleep cycle." | FastAPI, LangChain, LangGraph, Neo4j, ChromaDB, React, Docker, Groq, OpenAI API | [Demo](https://soma.komalpreet.me) · [Code](https://github.com/Komalpreet2809/SOMA) |
| **Vanta** | Speaker-conditioned voice extraction — isolates a target speaker from noisy audio using a reference clip. | PyTorch, SpeechBrain, FastAPI, Next.js, Docker, HF Spaces, Vercel | [Demo](https://vanta.komalpreet.me) · [Code](https://github.com/Komalpreet2809/Vanta) |
| **Specula** | Deepfake forensic analysis — explainable, multi-signal detection with Grad-CAM, ELA, and FFT forensics. | FastAPI, PyTorch, OpenCV, Hugging Face, NumPy, SciPy, PyWavelets, ReportLab, JS, Chart.js | [Demo](https://komalsohal-specula.hf.space/) · [Code](https://github.com/Komalpreet2809/Specula) |
| **Rolequill** | Grounded AI application drafting from resumes, job descriptions, and real GitHub repositories. | Next.js 16, React 19, TypeScript, Tailwind CSS 4, NextAuth.js, Groq SDK, Cheerio, unpdf | [Demo](https://rolequill.komalpreet.me) · [Code](https://github.com/Komalpreet2809/Rolequill) |

### More Builds

| Project | Description | Stack | Links |
|---------|-------------|-------|-------|
| **Conflux** | Predictive traffic-management layer for event-driven congestion. | Next.js 16, React 19, TypeScript, Tailwind CSS 4, FastAPI, scikit-learn, NetworkX, Leaflet, Recharts | [Code](https://github.com/Komalpreet2809/Conflux) |
| **BrokeTogether** | Deterministic settlement engine for messy, real-world group expenses. | React 19, Vite, Tailwind, Radix UI, Django 5, DRF, SimpleJWT, PostgreSQL, Groq Llama 3.3 | [Demo](https://broketogether.komalpreet.me) · [Code](https://github.com/Komalpreet2809/BrokeTogether) |
| **Altair** | AI investment research agent with cited, transparent verdicts. | Next.js, TypeScript, LangGraph.js, Groq (Llama 3.3/3.1), Tavily, Zod, Tailwind | [Demo](https://investment-research-agent-virid.vercel.app) · [Code](https://github.com/Komalpreet2809/Altair) |
| **Qlothi** | AI-powered fashion discovery that turns static images into shoppable experiences. | FastAPI, PyTorch, SegFormer, BLIP, Chrome Extension APIs, JS, Docker, Hugging Face, Playwright | [Code](https://github.com/Komalpreet2809/Qlothi) |
| **Tile Price Prediction** | Predicting tile prices from product specifications and images. | Python, pandas, NumPy, scikit-learn, LightGBM, PyTorch, TorchVision, Pillow, PyArrow | [Code](https://github.com/Komalpreet2809/Ezoraassign) |
| **Truss** | AI safety verification layer for model-generated code and queries. | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Route Handlers, Deterministic Parsing | [Demo](https://truss.komalpreet.me) · [Code](https://github.com/Komalpreet2809/TRUSS) |
| **POMguard** | Maven dependency auditing and version analysis. | Java 17, Spring Boot, Thymeleaf, Jackson XML, Maven Central API, ComparableVersion, Docker | [Demo](https://pomguard.komalpreet.me) · [Code](https://github.com/Komalpreet2809/POMguard) |
| **Earnomly** | ML dashboard for income prediction and socioeconomic analysis. | Python, Streamlit, Scikit-learn, Pandas, NumPy, Plotly Express | [Code](https://github.com/Komalpreet2809/Earnomly) |
| **Shadow Spies** | Tactical stealth game with fog-of-war and trap-based strategy. | Java, Swing, AWT, Maven, JUnit 5 | [Code](https://github.com/Komalpreet2809/Shadow-Spies) |
| **Fact Flow** | VS Code extension for interactive fun facts and status-bar microinteractions. | TypeScript, VS Code Extension API, Node.js, node-fetch, ESLint | [Code](https://github.com/Komalpreet2809/FactFlow) |
| **Women Safe** | Crime analytics dashboard for women's safety trends across India. | Power BI, DAX, Power Query, M Query, CSV Analytics Pipeline | [Code](https://github.com/Komalpreet2809/WomenSafe) |
| **Hospital ER Dashboard** | ER analytics dashboard for patient flow and operational monitoring. | Power BI, DAX, Excel, Healthcare Analytics Pipeline | — |
| **CultureCompass** | AI-powered cultural etiquette and global customs assistant. | HTML5, CSS3, JavaScript, Groq API, LLaMA 3.1 | [Code](https://github.com/Komalpreet2809/CultureCompass) |
| **Customer Churn Prediction** | ML system for telecom customer churn prediction. | Python, Flask, Scikit-learn, Pandas, NumPy, HTML, CSS | [Code](https://github.com/Komalpreet2809/Customer-churn-prediction) |

Full write-ups for every project (idea, architecture, highlights, and stack) are documented in [context.md](context.md).

---

## Skills

| Area | Tools |
|------|-------|
| LLM & Generative AI | LangChain, LangGraph, RAG, Vector DBs, Knowledge Graphs, Prompt Engineering |
| AI Systems & Infrastructure | Tokenization, KV Caching, Continuous Batching, Model Serving, GPU Inference, CUDA |
| Machine Learning | PyTorch, TensorFlow, Scikit-learn, Hugging Face Transformers, SpeechBrain, NLP |
| Programming | Python, Java, C++, Bash, SQL |
| Backend & APIs | FastAPI, REST APIs, Model Deployment, WebSockets |
| Frontend | React, Next.js, JavaScript, HTML, CSS |
| Databases | ChromaDB, Neo4j, SQLite, NoSQL |
| DevOps, Automation & Cloud | Docker, Git, GitHub Actions, CI/CD, AWS, Azure, Vercel |

---

## Contact

- **Email:** [kaurkomalpreetsohal@gmail.com](mailto:kaurkomalpreetsohal@gmail.com)
- **LinkedIn:** [komalpreetkaur-k](https://www.linkedin.com/in/komalpreetkaur-k/)
- **GitHub:** [Komalpreet2809](https://github.com/Komalpreet2809)
- **X:** [@komalpreet2809](https://x.com/komalpreet2809)
- **LeetCode:** [komalpreet2809](https://leetcode.com/u/komalpreet2809/)
- **Schedule a call:** [cal.com/komalpreet/30min](https://cal.com/komalpreet/30min)
