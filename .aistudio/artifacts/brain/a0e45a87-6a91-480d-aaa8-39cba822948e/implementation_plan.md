# Manjuel Loop Runner: Standalone Recursive Self-Improvement Engine (through Atlas v0.2.6 with Secondbrain Notes Cache & Scratchpad)

A dedicated, standalone desktop application that executes **Manjuel's recursive self-improvement loops** through **Atlas release v0.2.6** specifications, utilizing your **Secondbrain app's notes system as a live contextual cache and scratchpad**. As the autonomous loop iterates ($N \to N+1$), it draws contextual memory from your notes, writes intermediate hypotheses and invariant telemetry to a live scratchpad note, and produces verified, self-refined architectural patches.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The architectural scope has been refined to incorporate Secondbrain Notes as the core memory layer:
>
> - **Secondbrain Notes as Contextual Cache & Scratchpad**:
>   - **Contextual Cache**: Secondbrain serves existing notes, architectural decisions, and previous pass reflections directly to Manjuel to ground recursive reasoning.
>   - **Live Scratchpad**: During each recursive pass, Manjuel dynamically reads and writes to a live working scratchpad note (e.g. `scratchpad.md` / `iteration-pass.md`) to formulate hypotheses, draft code snippets, log invariant evaluations, and carry memory across iteration boundaries.
> - **Atlas v0.2.6 as Ground-Truth Specification**: All recursive passes are bounded and validated against Atlas release v0.2.6 (`https://github.com/thebrotherscarr-bit/Atlas/releases/tag/v0.2.6`) schemas, flow topologies, and contract models.
> - **Manjuel as the Recursive Executor**: Drives multi-pass iterations ($N \to N+1$), querying Secondbrain notes for context, generating code patches via local Ollama models, verifying invariants, and refining passes until convergence.
> - **Local Ollama Desktop Serving**: Interfaces with your local Ollama desktop app (`http://localhost:11434` with installed models such as `qwen2.5-coder:7b`, `deepseek-coder:6.7b`) for completely private, zero-telemetry local iteration, with optional Gemini 3.8 Flash acceleration.
> - **Manual Apply Gate**: Enforces user approval with an interactive evolutionary diff viewer before any changes are written to disk via Secondbrain MCP or dispatched as a GitHub Pull Request.

---

### 1. Overview & Core Concept

- **What It Does**: A standalone control deck for running Manjuel's recursive self-improvement loops through Atlas v0.2.6 schemas, with Secondbrain Notes serving as the active working memory. When you start an improvement cycle:
  1. **Secondbrain Cache Ingestion**: Secondbrain serves relevant contextual notes (architectural principles, past decisions, domain definitions) to prime the loop.
  2. **Pass 1 — Atlas Schema Inspection & Scratchpad Initialization**: Manjuel inspects Atlas v0.2.6 contracts, identifies drift or enhancement targets, and writes the baseline problem breakdown into the live Secondbrain scratchpad.
  3. **Pass 2 — Synthesis & Generation**: Uses local Ollama (e.g., `qwen2.5-coder:7b`) to synthesize architectural diffs, noting trade-offs on the scratchpad.
  4. **Pass 3 — Simulated Verification**: Evaluates the patch against Jesster invariants in a virtual sandbox, logging test assertions and failure/pass logs to the scratchpad.
  5. **Pass 4 — Recursive Refinement ($N \to N+1$)**: Manjuel re-reads the scratchpad notes, refines residual edge cases or type mismatches, and outputs a tighter iteration pass.
  6. **Pass 5 — Convergence & Apply Gate**: Once invariants pass and the loop converges, presents an evolutionary diff and allows one-click applying via Secondbrain MCP or opening a GitHub PR.
- **Target Persona**: Kyle Carr (`thebrotherscarr-bit`), building an autonomous self-recursive OS where Secondbrain notes, Atlas schemas, and Manjuel execution form a closed self-improving loop.
- **Key Value**: Manjuel is not operating in a vacuum—its recursive reasoning is continuously anchored in and recorded by your Secondbrain notes system.

---

### 2. User Experience & Visual Design

#### The Standalone Loop Cockpit Layout
1. **Loop Controller & Parameters (Top Strip)**:
   - **Improvement Directive Input**: Direct prompt (e.g. `"Harmonize ThoughtNodeSchema v0.2.6 with Manjuel pipeline workers and record invariant invariants in scratchpad"`).
   - **Recursion Budget**: Iteration selector ($N = 1, 2, 3, \text{or } 5$ passes) to enforce bounded cycles.
   - **Engine Selector**: Local Ollama Desktop (serving `qwen2.5-coder:7b`, `deepseek-coder:6.7b`, etc.) vs. Cloud Gemini 3.8 Flash.
   - **Execution Controls**: `Start Recursive Loop`, `Pause`, `Step Next Pass`, `Sync Scratchpad`.

2. **Dual-Pane Recursive Canvas (Center Workspace)**:
   - **Left Pane: Secondbrain Scratchpad & Contextual Cache**:
     - Live editor/viewer showing the active scratchpad note being updated in real-time by the loop.
     - Section for *Contextual Cache Ingestion* (notes pulled from Secondbrain vault, tagged concepts, wikilinks).
     - Section for *Working Hypotheses & Invariant Logs* (live agent notes across Pass 1 $\to$ Pass 2 $\to$ Pass 3).
     - "Save Note to Secondbrain Vault" button.
   - **Right Pane: Multi-Pass Iteration Timeline & Evolutionary Diff**:
     - Horizontal iteration progress bar ($N = 1, 2, 3 \dots$) with phase indicators (Analyzing $\to$ Synthesizing $\to$ Invariants Verified $\to$ Converged).
     - Real-time telemetry: Invariants evaluated (22/22 Passing), Blast radius score, Code delta (+/- lines), Convergence confidence.
     - Interactive split/unified diff viewer showing the code evolving pass-over-pass.

3. **Bottom Action Dock (Manual Apply Gate)**:
   - **Apply Converged Patch to Local Workspace**: Dispatches `fs.apply_patch` via Secondbrain MCP.
   - **Open GitHub PR**: Dispatches commit to a new branch on `thebrotherscarr-bit/Atlas` or `Manjuel`.
   - **Rollback / Discard**: Revert to any earlier pass in the timeline.

#### Visual Identity & Theme
- **Aesthetic Direction**: High-precision engineering cockpit with dark utilitarian styling, disciplined typography, crisp hairline borders, and zero ornamental clutter.
- **Color Palette (60-30-10 Rule)**:
  - *Dominant Canvas (60%)*: Neutral deep slate (`#090D16` / `#0D1117`).
  - *Structural Surfaces (30%)*: Muted container backgrounds (`#161B22` / `#1C2128`), hairline dividers (`border-slate-800`), muted typography (`text-slate-400`).
  - *Accent Budget (10%)*: Precision Emerald (`#10B981`) for converged/verified states, Cyber Cyan (`#06B6D4`) for active loop synthesis, and Note Amber (`#F59E0B`) for live scratchpad updates.
- **Typography & Hierarchy**:
  - *Display / Headings*: `Plus Jakarta Sans` or `Outfit` for modern structural authority.
  - *Body Prose & Notes*: `DM Sans` / `Public Sans` for dense, clean legibility.
  - *Code, Diffs & Telemetry*: `JetBrains Mono` / monospace with strict `font-variant-numeric: tabular-nums`.
- **Top Bar Contract**:
  - Left: Brand title `Manjuel Loop Runner` + quiet subtitle `Atlas v0.2.6 · Secondbrain Notes Cache & Scratchpad`.
  - Center: 3 clean single-line nav tabs: `Active Loop Cockpit`, `Scratchpad & Context Cache`, `Atlas v0.2.6 Schemas`.
  - Right: Engine badge (`Ollama 11434` / `Gemini`) + MCP Status + Settings modal button.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Notes as the Contextual Cache & Scratchpad (User Specified)**:
  - *Chosen Approach*: Secondbrain serves existing notes as prompt context and exposes a dedicated live scratchpad document where Manjuel writes intermediate thoughts, invariant results, and planned diffs during the loop.
  - *Why*: Solves context amnesia across recursive iterations; grounds model synthesis in your real project notes while providing a human-readable audit trail of why the loop made specific decisions.

- **Decision 2: Atlas v0.2.6 as the Structural Invariant Anchor**:
  - *Chosen Approach*: Ground all recursive code mutations in the schemas, contracts, and flow topologies published in Atlas v0.2.6 (`https://github.com/thebrotherscarr-bit/Atlas/releases/tag/v0.2.6`).
  - *Why*: Guarantees that iterative improvements remain strictly compatible with your ecosystem's foundation.

- **Decision 3: Local Ollama Desktop Serving**:
  - *Chosen Approach*: Serve local models (`qwen2.5-coder:7b`, `deepseek-coder:6.7b`, etc.) on `http://localhost:11434` via backend proxy.
  - *Why*: Complete code and notes privacy, zero cloud API fees, and instant response times for fast recursive iterations.

- **Decision 4: Step-by-Step Inspectability ($N \to N+1$) with Manual Apply**:
  - *Chosen Approach*: Every iteration pass is recorded in the timeline with its own diff snapshot and scratchpad entry. The user can inspect the pass-by-pass evolution and must explicitly click to apply.
  - *Why*: Eliminates runaway recursion risks and gives you total control over what enters your codebase.

---

### 4. Technical Architecture & System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                       Manjuel Loop Runner Standalone Desktop Cockpit                        │
└──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                               │
             ┌─────────────────────────────────┴─────────────────────────────────┐
             ▼                                                                   ▼
┌───────────────────────────────┐                               ┌───────────────────────────────┐
│     Atlas v0.2.6 Foundation   │                               │    Secondbrain Notes System   │
├───────────────────────────────┤                               ├───────────────────────────────┤
│ • ThoughtNodeSchema v0.2.6    │                               │ • Contextual Cache Ingestion  │
│ • Flow Topologies & Pipelines │                               │ • Live Working Scratchpad     │
│ • Invariant Contracts         │                               │ • Iteration Notes Storage     │
└───────────────┬───────────────┘                               └───────────────┬───────────────┘
                │                                                               │
                └───────────────────────────────┬───────────────────────────────┘
                                                │
                                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   Recursive Iteration Canvas                                │
│        [Ingest Context] ──► [Write Scratchpad] ──► [Synthesize Diff] ──► [Simulate Invariants]│
│                                       ▲                                    │                 │
│                                       └────── Refine Pass (N -> N+1) ──────┘                 │
└──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                               │
             ┌─────────────────────────────────┴─────────────────────────────────┐
             ▼                                                                   ▼
┌───────────────────────────────┐                               ┌───────────────────────────────┐
│      Local Ollama Desktop     │                               │      Manual Apply Gate        │
│       (localhost:11434)       │                               │   (MCP Local / GitHub PR)     │
├───────────────────────────────┤                               ├───────────────────────────────┤
│ • qwen2.5-coder:7b            │                               │ • Secondbrain MCP fs.apply    │
│ • deepseek-coder:6.7b         │                               │ • thebrotherscarr-bit PR      │
│ • nomic-embed-text            │                               │ • Commit Scratchpad to Notes  │
└───────────────────────────────┘                               └───────────────────────────────┘
```

#### Data Entities & State Stores
1. **Secondbrain Notes & Scratchpad State**:
   - `ScratchpadDocument`: Active note content (markdown), title, current pass timestamp, sections (`# Objective`, `## Context Cache`, `## Working Hypotheses`, `## Invariant Assertion Log`, `## Proposed Diffs`).
   - `ContextCacheEntry`: Sourced notes from Secondbrain vault, relevance score, extracted entities and wikilinks.
2. **Loop Execution Model**:
   - `LoopSession`: Session ID, directive, status (`idle`, `running`, `paused`, `converged`, `failed`), current iteration, max iterations.
   - `IterationPass`: Pass number ($1, 2, \dots$), phase (`audit`, `synthesis`, `verification`, `refinement`), reasoning log, generated patches, invariant evaluation score, blast radius score.
3. **Atlas v0.2.6 Schema State**:
   - `AtlasSchemaSpec`: Schema ID, version (`0.2.6`), entity type, field specifications, invariant rules.
4. **Evolutionary Patch Set**:
   - `PatchHistory`: Snapshot of file modifications across consecutive iterations with diff comparison between passes.

---

### Verification & Testing Plan
1. **Secondbrain Notes Cache & Scratchpad**: Verify real-time reading and writing to the live scratchpad note during recursive passes.
2. **Recursive Loop Execution**: Test running multi-pass iterations where Pass 2 references the scratchpad notes generated in Pass 1.
3. **Atlas v0.2.6 Grounding**: Confirm synthesized diffs adhere to Atlas v0.2.6 schemas and Jesster invariant assertions.
4. **Local Ollama Inference**: Confirm connection to `http://localhost:11434` with model selector (`qwen2.5-coder:7b`, `deepseek-coder:6.7b`).
5. **Compilation & Build**: Run `compile_applet` and `lint_applet` to ensure clean TypeScript compilation.
