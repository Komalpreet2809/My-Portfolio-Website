# Komalpreet Kaur — Portfolio Context

Komalpreet Kaur | AI/ML Engineer

Nav: [#hero] [#projects] [#skills] [#contact]

Live site: https://komalpreet.me
Location: PUNJAB, IN
Resume: resume.pdf?v=1.2

Links: GitHub https://github.com/Komalpreet2809 · LinkedIn https://www.linkedin.com/in/komalpreetkaur-k/ · X https://x.com/komalpreet2809 · Cal.com https://cal.com/komalpreet/30min · Email kaurkomalpreetsohal@gmail.com

## Hire / Open to Work

Status badge: "OPEN TO WORK"

Hire me to bring your ideas to life!
Feel free to reach out!

Actions: Gmail · LinkedIn · X · GitHub · Schedule a call ↗

## Live Traffic (Analytics Modal)

Powered by Upstash Redis

- TOTAL VIEWS — --
- UNIQUE VISITORS — --
- LIVE NOW — --

Real-time connection active

## Hero

# Komalpreet Kaur

AI/ML Engineer from India — building agentic AI, LLM inference systems, and multimodal models for speech, vision, and memory.

---

# WORKS

GitHub: @Komalpreet2809 — -- contributions in the last year (live contribution heatmap, Less → More).

Featured projects (in order):

---

## Chimera
LLM inference observability engine — In development

### 01 THE IDEA
Every developer uses LLMs, but almost no one can see why generation is slow, why memory explodes, or what techniques like KV caching and PagedAttention actually do — the internals are hidden behind a `generate()` call. Chimera is an inference engine built from first principles that exposes all of it. If Wireshark is for networks and DevTools is for browsers, Chimera is for LLM inference.

### 02 BUILT FROM SCRATCH
No generation APIs, no black boxes. Every component of GPT-2 is hand-implemented in PyTorch:
- Multi-head causal self-attention, MLP, LayerNorm, residual streams
- Autoregressive decode loop with greedy / temperature / top-k sampling
- Verified against the reference implementation to 5e-5 logit accuracy

### 03 THE OPTIMIZATION STACK
Each technique was built, then measured against the naive baseline:
- **KV Cache** — cuts decode from O(N²) to O(N): up to 46× faster per-step, byte-identical output
- **Continuous Batching** — rebuilds the batch every step so finished slots free instantly: 3.7× throughput (9.8 → 36.2 tok/s), time-to-first-token 25.8s → 3.4s
- **PagedAttention** — OS-style paged KV memory with a block allocator and page tables: memory waste 80% → 6.2%, fitting 4.6× more concurrent users in the same GPU budget
- **Speculative Decoding** — a small draft model proposes, the large model verifies in one pass; output provably identical to the target model alone

### 04 MAKING IT VISIBLE
The engine streams its own internals over WebSockets — every token carries latency, KV-cache growth, block allocations, and scheduler decisions. The frontend turns that into five interactive labs:
- **Inference Lab** — watch tokens stream with live per-token latency; toggle the KV cache off and watch the cost curve climb
- **Scheduler** — race sequential vs static vs continuous batching across concurrent users
- **Paged Memory** — a live memory map of allocation, fragmentation, and block reuse
- **Attention Explorer** — browse all 144 attention heads of the running model
- **Benchmark Arena** — run the engine's benchmarks live on the host machine

Flow: Inference Lab ↔ FastAPI + WebSockets ↔ Chimera Engine (PyTorch)

### 05 HIGHLIGHTS
- Transformer implemented from first principles
- KV caching, continuous batching, PagedAttention, speculative decoding
- Real-time inference telemetry and observability
- Reproducible benchmarks with verified correctness
- OS-inspired paged memory allocator

### 06 STACK
PyTorch · FastAPI · WebSockets · Next.js · TypeScript · Tailwind · Docker · Hugging Face Spaces · Vercel

Links: Source Code https://github.com/Komalpreet2809/Chimera

---

## Soma
Cognitive memory architecture

### 01 THE IDEA
Most AI systems treat memory as raw chat history. SOMA approaches memory differently by converting conversations into structured concepts, semantic relationships, and long-term knowledge graphs inspired by human cognitive memory.

### 02 MEMORY ARCHITECTURE
SOMA combines:
- Vector-based retrieval for semantic memory
- Graph-based reasoning using Neo4j
- Episodic conversation storage
- Real-time working context for active reasoning

Instead of retrieving full conversations, the system extracts compact conceptual relationships and builds a growing semantic network over time.

### 03 COGNITIVE CONSOLIDATION
A built-in "Sleep Cycle" periodically summarizes interactions, strengthens important concepts, and prunes redundant memory to maintain a cleaner reasoning system.

### 04 INTERACTIVE SYSTEM
The project includes a neural-console inspired frontend with live memory visualization, reasoning telemetry, and interactive graph exploration powered by FastAPI, LangGraph, ChromaDB, and Neo4j.

Flow: Neural Console UI ↔ FastAPI + LangGraph ↔ Neo4j + ChromaDB

### 05 HIGHLIGHTS
- Cognitive AI memory architecture
- Hybrid Vector + Graph RAG
- Semantic knowledge graph generation
- Memory consolidation engine
- Real-time reasoning visualization

### 06 STACK
FastAPI · LangChain · LangGraph · Neo4j · ChromaDB · React · Docker · Groq · OpenAI API

Links: Live Demo https://soma.komalpreet.me · Source Code https://github.com/Komalpreet2809/SOMA

---

## Vanta
Speaker-conditioned voice extraction

### 01 THE IDEA
Traditional noise cancellation removes background sound but struggles with overlapping voices. Vanta isolates a specific speaker from noisy audio using a short reference clip of the target voice.

Flow: Noisy Audio + Target Voice → Vanta AI → Clean Isolated Speech

### 02 SPEAKER-CONDITIONED SEPARATION
The system pairs a Conv-TasNet inspired separation network with an ECAPA-TDNN speaker encoder — both trained from scratch, with no pretrained weights. The fingerprint is injected at every separation block, so the model is told who to keep at every layer.

Flow: Reference Clip → ECAPA-TDNN Encoder → Voice Embedding

Instead of generic denoising, the model learns who to keep.

### 03 TRAINING PIPELINE
Two networks trained on a single 8 GB laptop GPU. Mixtures are synthesized fresh at every training step — nothing cached — from:
- LibriSpeech (1,552 speakers)
- AMI Meeting Corpus (conversational speech)
- WHAM! (15,000 real ambient recordings)
- MUSAN noise dataset
- RIRS_NOISES (60,218 room impulse responses)

Mixtures add room reverberation, turn-taking, and a simulated recording chain (mic EQ, band-limiting, codec artifacts). The separator is optimized with SI-SDR loss; the speaker encoder with AAM-Softmax.

### 04 RESULTS
Evaluated on 500 held-out mixtures from speakers never seen in training:
- +9.28 dB median SI-SDR
- +8.45 dB mean SI-SDR
- 9.5M parameters, zero pretrained

The self-trained speaker encoder outperformed the pretrained ECAPA-TDNN it replaced on 3 of 4 benchmarks, improving separation quality while making CPU inference ~6× faster.

### 05 FULL-STACK SYSTEM
Vanta includes a FastAPI inference backend and a Next.js frontend for interactive audio testing, waveform playback, and real-time speaker extraction workflows.

Flow: Next.js Frontend ↔ FastAPI Backend ↔ PyTorch Inference

### 06 HIGHLIGHTS
- Two neural networks trained from scratch, no pretrained weights
- Speaker-conditioned voice extraction
- Time-domain neural audio separation
- Synthetic mixture generation pipeline
- Interactive audio inference system
- Full-stack AI deployment pipeline

### 07 STACK
PyTorch · FastAPI · Next.js · Docker · Hugging Face Spaces · Vercel

Links: Live Demo https://vanta.komalpreet.me · Source Code https://github.com/Komalpreet2809/Vanta

---

## Specula
Deepfake forensic analysis

### 01 THE IDEA
Most deepfake detectors behave like black boxes — they generate predictions without explaining why an image appears manipulated.

Specula approaches deepfake detection as a forensic analysis pipeline, combining multiple independent signals to detect and explain synthetic or edited imagery.

### 02 FORENSIC PIPELINE
The system combines:
- CNN-based deepfake classification
- Error Level Analysis (ELA)
- Frequency-domain artifact detection
- Noise inconsistency analysis
- Metadata forensics

Each analyzer contributes to a weighted authenticity score and generates visual forensic evidence for the final verdict.

### 03 EXPLAINABLE ANALYSIS
Instead of returning only a confidence score, Specula provides:
- Grad-CAM heatmaps
- FFT spectrum analysis
- Compression artifact visualization
- Metadata inspection
- Side-by-side comparison workflows

The goal was to make deepfake detection more interpretable and investigation-oriented.

### 04 FULL-STACK SYSTEM
Specula includes a FastAPI backend, interactive frontend dashboard, batch image analysis, PDF forensic report generation, and persistent analysis history for real-world usability.

### 05 HIGHLIGHTS
- Multi-stage forensic analysis pipeline
- Explainable deepfake detection
- Grad-CAM visualizations
- FFT + metadata forensics
- Batch image analysis workflows
- PDF forensic report generation

### 06 STACK
FastAPI · PyTorch · OpenCV · Hugging Face · NumPy · SciPy · PyWavelets · ReportLab · JavaScript · Chart.js

Links: Live Demo https://komalsohal-specula.hf.space/ · Source Code https://github.com/Komalpreet2809/Specula

---

## Rolequill
Grounded AI application drafting

### 01 THE IDEA
Most AI-generated job applications sound generic because they lack real project context. Rolequill was built to generate grounded, evidence-backed application content using resumes, job descriptions, and actual GitHub repositories.

### 02 GROUNDED CONTEXT ENGINE
The system analyzes:
- Uploaded resumes
- Target job descriptions
- Synced GitHub repositories
- Repository READMEs and metadata

Instead of generating broad claims, Rolequill identifies the strongest project-role matches and builds responses directly from verified project context.

### 03 ROLE-AWARE DRAFTING
Rolequill generates contextual application drafts, interview responses, and project explanations tailored to specific roles.

The assistant understands when to prioritize:
- Resume experience
- Repository evidence
- Technical stack relevance
- Job description requirements

### 04 FULL-STACK SYSTEM
The platform combines GitHub OAuth, contextual AI workflows, repository analysis pipelines, and role-aware drafting inside a modern Next.js workspace designed for interactive application preparation.

### 05 HIGHLIGHTS
- Grounded AI application drafting
- GitHub repository analysis
- Resume + JD contextual matching
- Role-aware AI chat workflows
- Evidence-backed project explanations
- Intelligent project shortlisting

### 06 STACK
Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · NextAuth.js · Groq SDK · Cheerio · unpdf

Links: Live Demo https://rolequill.komalpreet.me · Source Code https://github.com/Komalpreet2809/Rolequill

---

# MORE BUILDS

Other things I've built. (in order)

---

## 01 · Conflux
Predictive traffic-management layer for event-driven congestion.
Card tags: Next.js 16 · React 19 · TypeScript · FastAPI · scikit-learn · NetworkX

### 01 THE IDEA
Cities respond to event traffic reactively — impact is never quantified until the jam is already forming. Conflux introduces a forecasting layer that turns any planned or unplanned event into a space-time congestion prediction and an actionable response plan before the first vehicle moves.

Instead of: Event → React
Conflux turns the flow into: Event → Forecast → Recommend → Learn

### 02 SPACE-TIME FORECASTING
The system models an event as a moving pressure on a real road network. It predicts per-junction congestion across the full event timeline — arrival, peak, dispersal — isolating the event's own impact from normal baseline traffic, and generalizes across event archetypes.
Archetypes: Cricket · Concert · Rally · Marathon · Protest · Festival

### 03 ACTIONABLE, EXPLAINABLE PLANS
Rather than returning a single congestion number, Conflux exposes the full decision pipeline — turning a forecast into a defensible deployment plan, with the reasoning behind every recommendation left inspectable instead of hidden.
- Manpower allocation
- Barricade points
- Diversion routes
- Per-junction delay-reduction estimates
- Priority & centrality scores
- Predicted-vs-actual accuracy traces

### 04 COMMAND-CENTER WORKSPACE
The interface was designed as an operations command center rather than a chart dashboard — a live city map, a time-scrubber that animates congestion build-up, and a scenario simulator that re-plans instantly as attendance, timing, or weather change.

### 05 HIGHLIGHTS
- Space-time congestion forecasting (R² 0.94, held-out events)
- Event-attributable impact isolation
- Marginal-utility resource optimization
- Congestion-aware diversion routing
- Post-event predicted-vs-actual learning loop
- Interactive scenario simulator

### 06 STACK
Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · FastAPI · scikit-learn · NetworkX · Leaflet · Recharts · Route Handlers

Links: Source Code https://github.com/Komalpreet2809/Conflux

---

## 02 · BrokeTogether
Deterministic settlement engine for messy, real-world group expenses.
Card tags: React 19 · Vite · Django 5 · Django REST Framework · PostgreSQL · Groq Llama 3.3

### 01 THE IDEA
Most expense splitters assume clean data and a static group. Real shared finances are neither — files are messy, people move in and out, and a single rounding slip breaks trust. BrokeTogether treats every imported expense as untrusted input, verifying and reconciling it before a single balance is written.

Instead of: Import → Trust
BrokeTogether turns the flow into: Import → Detect → Resolve → Settle

### 02 ANOMALY-AWARE IMPORT
The system scans every uploaded row against 20+ deterministic anomaly detectors, halts on conflict instead of guessing, and only writes transactions to the database after a human resolves each issue in an interactive conflict grid.
Detectors: Negative amounts · Rounding mismatches · Case & identity clashes · Date-format errors · Missing payers · Duplicate spikes

### 03 AIRTIGHT, EXPLAINABLE MATH
Rather than trusting floats or a language model with arithmetic, BrokeTogether stores money as integer minor units and computes every share, net, and settlement deterministically — with the reasoning behind each figure fully traceable.
- Integer-money engine (no float drift)
- Largest-remainder share allocation
- Equal / unequal / ratio / percentage splits
- Time-bounded membership filtering
- Net-zero balance verification
- Greedy simplify-debt settlement

### 04 CONVERSATIONAL WORKSPACE
The interface was built as a settlement workspace rather than a chatbot wrapper — an interactive SVG debt map with zoom, pan, and drag, alongside a copilot that answers questions in plain language while every number comes from the deterministic engine, never the model.

### 05 HIGHLIGHTS
- Two-phase stage → resolve → commit import
- 20+ deterministic anomaly detectors
- Fixed-point integer money engine
- Time-bounded membership calculations
- Deterministic AI copilot (LLM phrases, never computes)
- Interactive SVG settlement map

### 06 STACK
React 19 · Vite · Tailwind CSS · Radix UI · Django 5 · Django REST Framework · SimpleJWT · PostgreSQL · Groq Llama 3.3

Links: Live Demo https://broketogether.komalpreet.me · Source Code https://github.com/Komalpreet2809/BrokeTogether

---

## 03 · Altair
AI investment research agent with cited, transparent verdicts.
Card tags: Next.js · TypeScript · LangGraph.js · Groq · Tavily Web Search · Zod

### 01 THE IDEA
Most "AI research" tools either dump a wall of unverifiable text or only work on famous public companies. Altair takes any company name — a public giant or an unknown startup — researches the live web, and returns a clear Invest / Hold / Pass verdict with its reasoning, a confidence level, and every source cited.

### 02 AUTONOMOUS RESEARCH AGENT
Altair is an agent, not a chatbot. It plans what to research (adapting to whether the company is a household name or an obscure startup), gathers real citable sources from the live web, scores the company across six weighted factors, and commits to a decision. The whole run streams live, so you watch it plan → research → analyze → decide in real time.

### 03 TRANSPARENT DECISION ENGINE
The verdict is explainable math, not an LLM's whim. The LLM scores each of six fixed factors 0–10 from the evidence; a weighted average produces a composite, and a fixed threshold rule maps it to Invest / Hold / Pass. Conviction is hard-capped by data quality, so the agent is never falsely confident about a company it could barely research — and refuses to invent a verdict for a company that doesn't exist.

### 04 STREAMING UI + REFLECT-AND-RETRY
A LangGraph state machine drives the pipeline, streaming typed progress events to the browser over Server-Sent Events. When evidence is thin, a reflect-and-retry "deepen" loop re-researches with broader queries before deciding — giving small, unlisted startups a fair shot. The dashboard renders a conviction gauge, a radar chart of the six factors, and a bull-vs-bear breakdown, all as hand-built SVG.

### 05 HIGHLIGHTS
- Any-company web research
- Cited, verifiable sources
- Deterministic weighted verdict rule
- Data-quality conviction capping
- Reflect-and-retry deepen loop
- Live streaming agent trace

### 06 STACK
Next.js (App Router) · TypeScript · LangGraph.js · Groq (Llama 3.3 70B / 3.1 8B) · Tavily Web Search · Zod · Tailwind CSS

Links: Live Demo https://investment-research-agent-virid.vercel.app · Source Code https://github.com/Komalpreet2809/Altair

---

## 04 · Qlothi
AI-powered fashion discovery that turns static images into shoppable experiences.
Card tags: FastAPI · PyTorch · SegFormer · BLIP · Chrome Extension APIs · Playwright

### 01 THE IDEA
Fashion discovery is often fragmented — users see outfits they like online but struggle to identify individual clothing items or find similar products.

Qlothi transforms static fashion images into interactive, shoppable experiences using computer vision, multimodal search, and browser-integrated AI workflows.

### 02 MULTIMODAL FASHION SEARCH
The system combines SegFormer-based clothing segmentation with BLIP vision-language models to identify garments and generate semantic descriptions for more accurate product discovery.

Each detected clothing item becomes an interactive shopping point connected to visually similar fashion results.

### 03 BROWSER-INTEGRATED AI
Instead of relying on expensive visual search APIs, Qlothi uses a custom browser automation pipeline that interacts with Google Lens through hidden browser tabs and dynamic DOM extraction.

The system was optimized specifically for Indian fashion discovery and localized shopping results.

### 04 FULL-STACK SYSTEM
Qlothi includes:
- Chrome Extension frontend
- FastAPI inference backend
- Interactive wardrobe management
- Multimodal fashion search pipelines
- Browser automation workflows

The platform combines AI inference with real-time browser interaction and product discovery.

### 05 HIGHLIGHTS
- AI clothing segmentation
- Vision-language fashion search
- Browser-integrated AI workflows
- Interactive virtual wardrobe
- Google Lens automation pipeline
- Localized fashion discovery system

### 06 STACK
FastAPI · PyTorch · SegFormer · BLIP · Chrome Extension APIs · JavaScript · Docker · Hugging Face · Playwright

Links: Source Code https://github.com/Komalpreet2809/Qlothi

---

## 05 · Tile Price Prediction
Predicting tile prices from product specifications and product images.
Card tags: Python · pandas · scikit-learn · LightGBM · PyTorch · TorchVision
(repo: Komalpreet2809/Ezoraassign)

### 01 THE IDEA
This project focused on building a machine learning solution for a pricing problem in the tile catalog domain. The goal was to estimate the price of each SKU from its structured attributes and visual product image, using a workflow that could generalize across many products with varying formats and styles.

### 02 DATA PREPARATION
The dataset contained messy, nested product records with many missing values and inconsistent field structures. I cleaned and flattened the data, extracted meaningful geometry-related features, and used missingness as a signal rather than treating it as noise. I also parsed information from product names and dimensions to derive useful features for the modeling stage.

### 03 MODELING STRATEGY
I developed an end-to-end pipeline that started with simple baselines and progressed to a stronger gradient-boosted regression model trained on log-price. Collection information was incorporated through target encoding so the model could capture family-level pricing patterns without relying on raw categorical memorization. I also tested image-based embeddings to evaluate whether visual features added any additional predictive value beyond the structured attributes.

### 04 RESULTS
The final model performed strongly and achieved high accuracy on the held-out evaluation metric. The most influential predictors were collection-level pricing patterns and physical format characteristics such as size and thickness, which showed that pricing was heavily driven by product form and family-level structure.

### 05 HIGHLIGHTS
- End-to-end feature engineering from raw catalog data
- Missingness-aware preprocessing and structured flattening
- Collection-aware modeling with target encoding
- Gradient-boosted regression on log-price
- Image embedding experiments for visual feature comparison
- Reproducible training, evaluation, and prediction workflow

### 06 STACK
Python · pandas · NumPy · scikit-learn · LightGBM · PyTorch · TorchVision · Pillow · PyArrow

Links: Source Code https://github.com/Komalpreet2809/Ezoraassign

---

## 06 · Truss
AI safety verification layer for model-generated code and queries.
Card tags: Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Route Handlers · Deterministic Parsing

### 01 THE IDEA
Most AI systems execute generated outputs on trust. TRUSS introduces a verification layer that intercepts model responses, analyzes them structurally, and evaluates safety constraints before execution.

Instead of: Model Output → Execute
TRUSS turns the flow into: Model Output → Verify → Accept / Reject / Refine

### 02 DOMAIN-AWARE VERIFICATION
The system detects whether output belongs to a specific execution domain, then generates domain-specific safety rules, parses the candidate into a structured artifact, and evaluates explicit constraints before producing a verdict.
Domains: Shell · SQL · Python · General text

### 03 EXPLAINABLE SAFETY
Rather than returning a simple pass/fail result, TRUSS exposes the full decision pipeline — making AI verification transparent and inspectable instead of hidden behind moderation layers.
- Generated safety formulas
- Parsing artifacts
- Violation traces
- Grammar matrices
- Structured proof metadata
- Refinement suggestions

### 04 INTERACTIVE WORKSPACE
The interface was designed as a verification workspace rather than a chatbot wrapper, exposing the full reasoning and decision pipeline behind each safety verdict.

### 05 HIGHLIGHTS
- AI output verification pipeline
- Domain-aware safety analysis
- Structured parsing & constraint evaluation
- Explainable verification reports
- Refinement-based safety workflow
- Interactive verification workspace

### 06 STACK
Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Route Handlers · Deterministic Parsing Systems

Links: Live Demo https://truss.komalpreet.me · Source Code https://github.com/Komalpreet2809/TRUSS

---

## 07 · POMguard
Maven dependency auditing and version analysis.
Card tags: Java 17 · Spring Boot · Thymeleaf · Maven Central API · Docker

### 01 THE IDEA
Java projects often accumulate outdated dependencies over time, making upgrades difficult to track. POMguard scans Maven pom.xml files and instantly identifies outdated packages without requiring local Maven setup.

### 02 DEPENDENCY AUDITING
The system parses uploaded dependencies, fetches the latest versions directly from Maven Central, and compares them using Maven's native semantic version comparison logic.
Categorized as: Up to date · Outdated · Unresolved

### 03 PARALLEL LOOKUP PIPELINE
Dependency lookups run in parallel using cached Maven Central requests to improve audit speed and reduce repeated network calls across larger dependency trees. The application also stores recent audit sessions for quick re-analysis.

### 04 LIGHTWEIGHT WEB APP
POMguard was built using Spring Boot and Thymeleaf with a lightweight server-rendered architecture focused on fast uploads, instant reports, and simple dependency visualization.

### 05 HIGHLIGHTS
- Maven dependency auditing
- Semantic version comparison
- Maven Central integration
- Parallel dependency lookups
- Cached audit pipeline
- Audit history tracking

### 06 STACK
Java 17 · Spring Boot · Thymeleaf · Jackson XML · Maven Central API · ComparableVersion · Docker

Links: Live Demo https://pomguard.komalpreet.me · Source Code https://github.com/Komalpreet2809/POMguard

---

## 08 · Earnomly
Machine learning dashboard for income prediction and socioeconomic analysis.
Card tags: Python · Streamlit · Scikit-learn · Plotly Express

### 01 THE IDEA
Income patterns are influenced by multiple demographic and socioeconomic factors. Earnomly was built as an interactive ML platform for analyzing, visualizing, and predicting income levels using the UCI Adult Income dataset.

### 02 DATA ANALYSIS & MODELING
The platform combines exploratory data analysis with supervised and unsupervised machine learning workflows.
Users can:
- Explore demographic correlations
- Analyze income distributions
- Train ML models
- Discover hidden data patterns
- Generate real-time predictions

### 03 MACHINE LEARNING PIPELINE
The system was designed to make machine learning workflows more interactive and visually interpretable.
Random Forest classification · Logistic Regression · K-Means clustering · PCA visualization · Model performance metrics

### 04 INTERACTIVE DASHBOARD
Built with Streamlit and Plotly, the platform provides a fintech-inspired interface for data exploration, model training, clustering analysis, and prediction workflows.

### 05 HIGHLIGHTS
- Income prediction system
- Interactive EDA workflows
- Supervised & unsupervised ML
- PCA & clustering visualization
- Real-time prediction engine
- Fintech-inspired dashboard

### 06 STACK
Python · Streamlit · Scikit-learn · Pandas · NumPy · Plotly Express

Links: Source Code https://github.com/Komalpreet2809/Earnomly

---

## 09 · Shadow Spies
Tactical stealth game with fog-of-war and trap-based strategy mechanics.
Card tags: Java · Swing · AWT · Maven · JUnit 5

### 01 THE IDEA
Shadow Spies is a local multiplayer stealth game where two rival agents compete to locate secret data, avoid detection, and escape the map before their opponent. The gameplay focuses on limited visibility, positioning, and tactical decision-making rather than direct combat.

### 02 STEALTH & STRATEGY
The game uses a fog-of-war system where players can only see within their immediate line of sight. The goal was to create tension through limited information and movement prediction.
- Plant hidden traps
- Track enemy movement
- Recover secret data
- Race toward extraction points
- Reveal opponents through triggered traps

### 03 GAME SYSTEMS
The architecture separates game-state logic from rendering systems for cleaner extensibility.
Grid-based movement · Visibility calculations · Score tracking · Trap interaction systems · Local multiplayer controls · Turn-independent gameplay loops

### 04 JAVA GAME ARCHITECTURE
Built using Java Swing and Maven, the project explores structured Java application design with automated builds, executable packaging, and modular game organization.

### 05 HIGHLIGHTS
- Fog-of-war visibility system
- Tactical trap mechanics
- Grid-based stealth gameplay
- Local multiplayer controls
- Score & extraction system
- Modular Java game architecture

### 06 STACK
Java · Swing · AWT · Maven · JUnit 5

Links: Source Code https://github.com/Komalpreet2809/Shadow-Spies

---

## 10 · Fact Flow
VS Code extension for interactive fun facts and status-bar microinteractions.
Card tags: TypeScript · VS Code Extension API · Node.js · node-fetch

### 01 THE IDEA
Coding sessions can become repetitive and mentally exhausting over long periods. Fact Flow adds lightweight moments of interaction inside VS Code by displaying animated random facts directly in the editor's status bar. The goal was to create a small but polished developer experience enhancement rather than a traditional productivity tool.

### 02 STATUS BAR EXPERIENCE
Facts are preloaded in the background to keep refreshes smooth and responsive.
Animated typewriter transitions · Emoji-based visual indicators · Auto-refresh workflows · Hover tooltips · Clipboard copy support

### 03 INTERACTIVE EXTENSION DESIGN
The project focuses heavily on UI polish and interaction quality inside the VS Code extension environment.
- Animated refresh states
- Configurable refresh intervals
- Status bar command integration
- Clipboard interaction workflows
- Lightweight state management

### 04 VS CODE EXTENSION SYSTEM
Built using TypeScript and the VS Code Extension API, Fact Flow explores extension lifecycle management, command registration, status bar rendering, and real-time UI updates inside the editor environment.

### 05 HIGHLIGHTS
- VS Code status-bar extension
- Animated typewriter interactions
- Auto-refresh fact pipeline
- Clipboard copy workflows
- Configurable extension settings
- Lightweight developer UX system

### 06 STACK
TypeScript · VS Code Extension API · Node.js · node-fetch · ESLint

Links: Source Code https://github.com/Komalpreet2809/FactFlow

---

## 11 · Women Safe
Crime analytics dashboard for women's safety trends across India.
Card tags: Power BI · DAX · Power Query · M Query

### 01 THE IDEA
Understanding long-term crime patterns requires more than static reports and spreadsheets. Women Safe was built as an interactive analytics dashboard for exploring two decades of crime data against women across India. The goal was to surface geographic trends, high-risk regions, and actionable insights through visual analytics.

### 02 DATA MODELING & ANALYTICS
The dashboard uses a star-schema architecture with fact and dimension tables optimized for large-scale filtering and interactive reporting workflows.
YoY growth analysis · Severity index calculations · Geographic hotspot detection · Trend-based ranking systems · Interactive temporal filtering

### 03 INTERACTIVE VISUALIZATION
The interface was designed to support both high-level monitoring and deeper investigative analysis.
Heatmaps · Decomposition trees · Ribbon charts · Animated scatter plots · Smart narrative generation

### 04 POWER BI WORKFLOW
The project explores end-to-end analytics workflows including data cleaning with Power Query, schema modeling, DAX computations, dashboard optimization, and responsive report design.

### 05 HIGHLIGHTS
- Crime analytics dashboard
- Star-schema data modeling
- DAX-based trend analysis
- Geographic hotspot visualization
- Interactive Power BI workflows
- Multi-year temporal analysis

### 06 STACK
Power BI · DAX · Power Query · M Query · CSV Analytics Pipeline

Links: Source Code https://github.com/Komalpreet2809/WomenSafe

---

## 12 · Hospital ER Dashboard
Emergency room analytics dashboard for patient flow and operational monitoring.
Card tags: Power BI · DAX · Excel

### 01 THE IDEA
Emergency rooms generate large volumes of operational data that can be difficult to monitor in real time. This dashboard was built to analyze ER performance, patient flow, wait times, and admission trends through interactive healthcare analytics. The goal was to help identify bottlenecks and improve operational visibility.

### 02 HEALTHCARE ANALYTICS
The system supports both real-time monitoring and historical performance analysis.
Patient volume · Average wait times · Admission rates · Satisfaction scores · Departmental distribution · Demographic segmentation

### 03 INTERACTIVE REPORTING
Interactive slicers allow deeper exploration across different operational dimensions.
- Monthly and yearly drill-downs
- Patient flow analysis
- Age-group segmentation
- Departmental workload visualization
- Trend-based KPI tracking

### 04 DATA VISUALIZATION WORKFLOW
The project explores healthcare-focused analytics workflows using Power BI, DAX measures, and structured reporting systems designed for high-density operational dashboards.

### 05 HIGHLIGHTS
- ER operations dashboard
- Patient flow analytics
- Wait-time monitoring
- Healthcare KPI tracking
- Interactive drill-down reporting
- Demographic segmentation analysis

### 06 STACK
Power BI · DAX · Excel · Healthcare Analytics Pipeline

(No source link.)

---

## 13 · CultureCompass
AI-powered cultural etiquette and global customs assistant.
Card tags: JavaScript · Groq API · LLaMA 3.1 · HTML5 · CSS3

### 01 THE IDEA
Cultural norms and etiquette vary widely across different regions, making travel and communication challenging without local context. CultureCompass was built as an AI-powered guide for exploring global customs, traditions, and social etiquette. The goal was to make cultural learning more conversational and accessible.

### 02 AI-POWERED CULTURAL GUIDANCE
The system uses Groq-hosted LLaMA 3.1 models to generate real-time responses. Users can explore cultures through both conversational chat and quick-access topic navigation.
Dining etiquette · Greetings & gestures · Business customs · Festivals & traditions · Region-specific cultural norms

### 03 INTERACTIVE CHAT EXPERIENCE
The interface was designed to feel lightweight, fast, and approachable for casual cultural exploration.
- Region-based exploration
- Quick-topic shortcuts
- Animated typing indicators
- Formatted AI responses
- Responsive conversational UI

### 04 LIGHTWEIGHT AI WEB APP
Built using vanilla JavaScript and Groq APIs, the project explores client-side AI interaction workflows, conversational UI design, and real-time response rendering without heavy frontend frameworks.

### 05 HIGHLIGHTS
- AI-powered cultural assistant
- Real-time conversational guidance
- Region & topic-based exploration
- Lightweight chat interface
- Responsive conversational UI
- Groq-powered inference pipeline

### 06 STACK
HTML5 · CSS3 · JavaScript · Groq API · LLaMA 3.1

Links: Source Code https://github.com/Komalpreet2809/CultureCompass

---

## 14 · Customer Churn Prediction
Machine learning system for telecom customer churn prediction.
Card tags: Python · Flask · Scikit-learn · Pandas

### 01 THE IDEA
Customer retention is one of the biggest challenges in telecom services. This project was built to predict whether a customer is likely to churn based on service usage, billing patterns, and contract information. The goal was to turn customer behavior data into actionable retention insights.

### 02 CHURN PREDICTION PIPELINE
The system uses a Random Forest classifier trained on telecom customer datasets. Predictions are generated in real time with confidence scoring.
Tenure · Monthly charges · Contract type · Internet services · Payment methods · Usage patterns

### 03 INTERACTIVE WEB APPLICATION
The interface was designed to make model predictions understandable for non-technical users.
- Customer data input forms
- Real-time ML inference
- Confidence visualization
- Automated preprocessing
- Encoded feature handling
- Probability-based churn reporting

### 04 ML-POWERED FLASK SYSTEM
Built using Flask and Scikit-learn, the project explores end-to-end machine learning workflows including model training, serialization, preprocessing pipelines, and deployment-oriented prediction systems.

### 05 HIGHLIGHTS
- Telecom churn prediction
- Random Forest classification
- Real-time ML inference
- Confidence score visualization
- Automated preprocessing pipeline
- Interactive Flask application

### 06 STACK
Python · Flask · Scikit-learn · Pandas · NumPy · HTML · CSS

Links: Source Code https://github.com/Komalpreet2809/Customer-churn-prediction

---

# MY STACK

- **LLM & Generative AI** — LangChain, LangGraph, RAG, Vector DBs, Knowledge Graphs, Prompt Engineering
- **AI Systems & Infrastructure** — Tokenization, KV Caching, Continuous Batching, Model Serving, GPU Inference, CUDA
- **Machine Learning** — PyTorch, TensorFlow, Scikit-learn, Hugging Face Transformers, SpeechBrain, NLP
- **Programming** — Python, Java, C++, Bash, SQL
- **Backend & APIs** — FastAPI, REST APIs, Model Deployment, WebSockets
- **Frontend** — React, Next.js, JavaScript, HTML, CSS
- **Databases** — ChromaDB, Neo4j, SQLite, NoSQL
- **DevOps, Automation & Cloud** — Docker, Git, GitHub Actions, CI/CD, AWS, Azure, Vercel

---

# CONTACT

## WHAT IF WE WORKED TOGETHER?

That's it, you've reached the end of my portfolio. Thanks for visiting :) If you enjoyed the journey, let's make the sequel together. You're the 39,112th visitor.

Links: LinkedIn https://www.linkedin.com/in/komalpreetkaur-k/ · Github https://github.com/Komalpreet2809 · X https://x.com/komalpreet2809 · Resume ↗ resume.pdf?v=1.2

Schedule a call ↗ https://cal.com/komalpreet/30min
Email: kaurkomalpreetsohal@gmail.com

GETINTOUCH!

2026 © EDITION

## RESUME

Download: resume.pdf?v=1.2
