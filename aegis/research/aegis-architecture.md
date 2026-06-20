# AEGIS — Autonomous Enterprise Governance & Infrastructure Steward

> Deep-research architecture brief. Compiled 2026-06-20 from 5 parallel research streams (≈90 cross-verified, source-cited claims). Confidence tags: **[P]** primary-source verified, **[C]** corroborated across ≥2 sources, **[V]** vendor-reported (treat as directional).

---

## 0. TL;DR

Every open-source agent framework (LangGraph, AutoGen, CrewAI, Semantic Kernel, OpenAI Agents SDK) is a *reasoning* substrate with **governance bolted on as an afterthought** — and the 2025–2026 CVE record proves it. Meanwhile, two enterprise problems that are *structurally the same problem* (continuous compliance posture, and license/resource waste) are solved by two disjoint tool ecosystems (Prowler/OPA/Vanta vs. Cloud Custodian/Komiser/Zylo) that **never arbitrate against each other**. AEGIS is the missing control plane: a governed, sandbox-first multi-agent runtime whose defining primitive is a **Pareto-arbitration orchestrator** that resolves security-vs-cost conflicts as a first-class, auditable decision.

---

## 1. PHASE 1 — Market & Gap Analysis

### 1.1 Landscape baseline

| Framework | Lang | Orchestration model | Built-in governance |
|---|---|---|---|
| LangGraph | Python | Graph / stateful state-machine | None — "on you unless paired with platforms" **[C]** |
| AutoGen → MS Agent Framework | Python/.NET | Conversational group-chat + manager | Docker *recommended, not enforced* **[P]** |
| CrewAI | Python | Role-based crews / hierarchical process | RBAC + hash-chained audit **paywalled** (AMP tier) **[V]** |
| Semantic Kernel | C#/Python | Plugin/planner | Maintenance mode; Azure RBAC governs API, *not what agents read* **[C]** |
| OpenAI Agents SDK | Python | Handoff primitive (Mar 2025) | Guardrails = I/O "tripwires", not a policy engine **[P]** |

All mature frameworks are **Python-first**; Go (Eino/CloudWeGo, LangChainGo) and Rust (Rig, Kalosm) ecosystems exist but trail in coverage — this is the performance/safety opening for a compiled core. **[C]**

### 1.2 The three critical gaps

**GAP 1 — Governance is bolted on, and it is failing in the field.**
The 2025–2026 CVE record is damning, not anecdotal:
- LangChain core **CVE-2025-68664 "LangGrinch"** (CVSS 9.3): deserialization leaks API keys/secrets. **[C]**
- LangGraph **CVE-2025-67644** (7.3): SQLi in the SQLite checkpointer. **[C]**
- LangChain **CVE-2024-8309** (9.8): prompt-injection → Cypher/SQL injection; dangerous behavior **shipped by default**, fix was an opt-out flag. **[C]**
- LlamaIndex **CVE-2025-1793** (9.8) SQLi across 8+ vector stores; **CVE-2025-1753** RCE via `os.system`. **[C]**
- CrewAI **CVE-2026-2275/2285/2286**: Code Interpreter **silently falls back** from Docker to a weak `SandboxPython` → RCE/SSRF/file-read, chainable via prompt injection. **[C]**
- Unit 42: unsandboxed interpreters let payloads reach filesystems, networks, and **cloud metadata services**; most agent vulns are application-layer design failures the frameworks don't prevent. **[C]**
- OWASP shipped a dedicated **Top 10 for Agentic Applications (2026)** — autonomy, tool integration, and persistent state are *new* vulnerability classes. **[P]**
- Gartner: by 2027, **>40% of agentic AI projects canceled**, partly from "inadequate risk controls"; ~40% of enterprises will demote/decommission agents over governance gaps found *after* production incidents. **[C]**

**GAP 2 — Compliance and FinOps are two silos that never talk.**
- Compliance side: Prowler (multi-cloud, maps CIS/NIST/PCI/SOC2), Trivy, OPA/Rego (CNCF-graduated), Powerpipe (5,000+ controls), Vanta (1,200+ tests). **[C]**
- FinOps side: Cloud Custodian (CNCF-incubating; the *closest* single tool to overlap security+cost+governance), Komiser, Infracost, AWS Compute Optimizer (idle recs since Nov 2024), Zylo/Productiv/Torii. **[C]**
- **No tool arbitrates** between them. FinOps literature explicitly keeps them *separate* ("cost management should not introduce security gaps") rather than co-optimizing. Cloud Custodian *enforces* policy but does **not** arbitrate competing security-vs-cost objectives. **[C]**

**GAP 3 — Decisions aren't optimization-aware or natively auditable.**
- Frameworks treat agent traces as **opaque plain text** → "cannot perform fine-grained privilege verification or data-flow auditing." **[C]**
- Immutable/hash-chained audit is an add-on (paid CrewAI AMP; 3rd-party toolkits), not native. **[C]**
- Observability requires bolt-on SDKs (LangSmith/Langfuse/AgentOps). OpenTelemetry GenAI agent spans (`invoke_agent`, `execute_tool`) remain **experimental** as of 2026. **[C]**
- Real enterprise decisions are **multi-objective** (Pareto fronts under constraints — CMOPs), yet no agent framework exposes Pareto/constraint reasoning as a primitive. **[C]**

### 1.3 Quantified pain (the "why now")

- Zylo 2025: orgs waste ~**$21M/yr** on unused SaaS (+14.2% YoY); **52.7%** of licenses idle. **[V]**
- Productiv: ~**40%** of ~100M analyzed licenses unused. **[V]**
- ISO/IEC 27001:2022 = **93 controls** in 4 themes (Org 37 / People 8 / Physical 14 / Tech 34); 11 new controls including **A.5.7 Threat Intelligence**. **[C]**
- M365 price increases land **July 1, 2026** (E3/E5/Business Standard up) — a hard deadline that makes license reclamation a board-level event. **[C]**

---

## 2. PHASE 2 — The Breakthrough Idea

### Project: **AEGIS**
**A**utonomous **E**nterprise **G**overnance & **I**nfrastructure **S**teward. *(repo: `aegis` / fallback `aegis-cp`)*

**Elevator pitch.** AEGIS is a governed, sandbox-first multi-agent control plane where a Compliance agent and a FinOps agent continuously map your enterprise posture — then a Pareto-arbitration orchestrator resolves every security-vs-cost conflict as a single, cryptographically auditable decision. It is the first open framework to treat "lock it down" and "reclaim the spend" as two objectives on one optimization frontier, not two products on two dashboards.

**Core innovation (paradigm shift).**
1. **Conflict is the product, not the bug.** Existing frameworks orchestrate *cooperating* agents (supervisor/handoff/group-chat). AEGIS's center of gravity is an **arbitration kernel** that ingests *competing* recommendations and returns a Pareto-optimal, constraint-respecting action with a recorded rationale.
2. **Governance is the substrate, not a wrapper.** Every tool call passes an **OPA/Rego decision** + runs in a **deny-by-default WASM/microVM sandbox** — addressing the exact CVE class (silent-fallback RCE, prompt-injected SQLi, metadata-service reach) that is sinking competitors.
3. **Audit is native and immutable.** Every agent decision emits a **hash-chained, OpenTelemetry-GenAI-shaped span** — auditable evidence that *is* the SOC 2 / ISO 27001 artifact, not a plain-text log you reconstruct later.

---

## 3. PHASE 3 — Technical Architecture

### 3.1 Topology

```
                         ┌──────────────────────────────────────┐
   Connectors (gRPC)     │            AEGIS CORE (Rust)          │
 ┌───────────────┐       │                                      │
 │ M365 Graph    │──────▶│  ┌────────────────────────────────┐  │
 │ AWS/Azure/GCP │       │  │  ARBITRATION KERNEL            │  │
 │ Prowler/Trivy │       │  │  • multi-objective (Pareto)   │  │
 │ STIX/TAXII    │       │  │  • OPA/Rego policy gate       │  │
 │ Snipe-IT/GLPI │       │  │  • HITL approval interrupts   │  │
 └───────────────┘       │  └───────────┬────────────────────┘  │
                         │              │ proposals/vetoes        │
                         │   ┌──────────┴──────────┐             │
                         │   ▼                     ▼             │
                         │ COMPLIANCE AGENT     FINOPS AGENT      │
                         │ (posture map)        (license/idle)    │
                         │   │  Python tools (PyO3 / gRPC)        │
                         │   ▼                     ▼             │
                         │  WASM (Wasmtime) ── microVM (Firecracker)
                         │  deny-by-default capability sandbox   │
                         └────────────┬─────────────────────────┘
                                      ▼
   Memory: Qdrant/LanceDB (vector) · Postgres+pgvector (state) · NATS JetStream (events)
   Durable workflows: Temporal · Audit: hash-chained OTel-GenAI spans
```

### 3.2 The three agents (deliverable-mapped)

**① Compliance / Audit Agent — continuous posture mapping.**
- Ingests scanner output (Prowler, Trivy, AWS IAM Access Analyzer unused-access) and **maps findings → ISO 27001:2022 Annex A controls** (93-control taxonomy) and SOC 2 Trust Services Criteria. **[C]**
- Parses threat intel via **STIX 2.1 / TAXII 2.1** feeds and MISP, satisfying new control **A.5.7**. **[C]**
- Access governance: flags over-permissive IAM roles via Access Analyzer's unused-access window (1–180d, default 90). **[P]**
- Output = **policy obligations** ("role X must lose write to bucket Y"), each with a control citation.

**② FinOps / Asset Agent — license optimization & cost-saving logic.**
- M365: pulls **Graph `getOffice365ActiveUserDetail`** (D7/D30/D90/D180) + evaluates `lastSignInDateTime` **and** `lastNonInteractiveSignInDateTime` to avoid misclassifying idle users. **[C]**
- License lifecycle/expiration: Snipe-IT-style threshold alerts (e.g., 60d pre-expiry); models the **July 2026 M365 price step** as a reclamation deadline. **[C]**
- Idle reallocation: AWS Compute Optimizer (14-day window) + Cloud Custodian off-hours/GC policies. **[C]**
- Aligns to **FinOps Framework 2025** (Domains/Capabilities/Scopes; now spans SaaS + GenAI spend). **[P]**
- Output = **reclamation/rightsizing proposals**, each with $ delta.

**③ Core Orchestrator — conflict resolution.**
- Receives Compliance *obligations* (often "spend more / keep it") and FinOps *proposals* (often "reclaim / shrink"). These collide: e.g., FinOps wants to reclaim 200 idle E5 licenses; Compliance requires E5-tier audit logging for a regulated cohort.
- **Arbitration logic:** model as a **constrained multi-objective problem (CMOP)** — minimize cost, maximize control coverage — and return the **Pareto front**, not a collapsed scalar. **[C]**
- Hard security obligations enter as **constraints** (non-negotiable); soft ones as objectives. An **OPA/Rego policy** encodes which obligations are vetoes vs. tradeable (RBAC/ABAC/ReBAC supported). **[C]**
- Acts as an **arbitrator** (binding decision) not merely a mediator; ambiguous/high-blast-radius actions trigger a **HITL interrupt** that snapshots state and resumes on approve/modify/reject (LangGraph-style checkpoint semantics). **[C]**

### 3.3 Core engine components
- **Sandbox tiers (deny-by-default):** Tier-1 **WASM/Wasmtime + WASI** capability model for fast in-process tool code; Tier-2 **Firecracker microVM** (~125 ms boot, jailer+seccomp+cgroups) or **gVisor** for arbitrary/untrusted execution. Directly closes the CrewAI silent-fallback class. **[C]**
- **Memory:** Qdrant **or** embedded LanceDB (both Rust, HNSW) for semantic agent memory; **pgvector** when consolidating on Postgres. **[P]**
- **Policy gate:** embedded **OPA** (Rego), Git-versioned, tested in CI. **[P]**
- **Eventing/durability:** **NATS JetStream** backbone; **Temporal** durable workflows (replayable event history = built-in audit substrate); Redis for ephemeral state. **[C]**
- **Audit layer:** hash-chained decision log shaped to **OpenTelemetry GenAI** spans (`invoke_agent`/`execute_tool`). **[C]**
- **Interfaces:** **MCP** (Anthropic, JSON-RPC) for tool/connector plug-ins; **A2A** (Linux Foundation, since Jun 2025) for cross-agent interop. **[C]**

### 3.4 Tech stack (recommended)

| Layer | Choice | Why |
|---|---|---|
| Core engine | **Rust** + Tokio | Memory-safe, fearless concurrency; the safety story competitors lack **[P]** |
| LLM/agent layer | **Rig** (`rig-core`, MIT) | 20+ providers, 10+ vector stores, native Rust **[P]** |
| Py interop | **PyO3 + maturin** | Reuse Python tool/scanner ecosystem in-process **[P]** |
| Out-of-proc IPC | **gRPC + Protobuf** | Language-agnostic core↔Python↔connectors **[P]** |
| Sandbox | **Wasmtime** + **Firecracker**/**gVisor** | Tiered isolation **[C]** |
| Vector mem | **Qdrant** / **LanceDB** | Rust, HNSW **[P]** |
| State | **Postgres + pgvector** | Relational + embeddings together **[P]** |
| Events/wf | **NATS JetStream** + **Temporal** | Durable, replayable, auditable **[C]** |
| Policy | **OPA / Rego** | CNCF-graduated, production-proven **[P]** |
| Protocols | **MCP** + **A2A** + **OTel-GenAI** | Standards-aligned, future-proof **[C]** |

> Avoid the archived `rustformers/llm` crate (unmaintained; README redirects to Candle/Mistral.rs). **[P]**

### 3.5 Three killer features (star-bait)
1. **`aegis simulate` — the conflict dry-run.** Replays a real posture against a proposed reclamation and prints the **Pareto frontier + the binding constraint that vetoed option B**. No other tool shows you *why* security beat cost (or vice-versa).
2. **Sandbox-by-default tool calls.** Every tool runs in WASM/microVM with an explicit capability grant; the "silent Docker fallback → RCE" failure mode is structurally impossible.
3. **Audit-grade by construction.** `aegis evidence --control A.8.2` emits a hash-chained, control-mapped evidence bundle straight from the decision log — the SOC 2/ISO artifact auditors actually accept.

---

## 4. PHASE 4 — MVP Roadmap (strict 4-week core + launch)

**Principle:** vertical slice first — one connector (M365 Graph), one scanner (Prowler), one real conflict (idle E5 vs. audit-retention obligation), arbitrated and audited end-to-end.

- **Week 1 — Foundation & engine.** Cargo workspace; gRPC/Protobuf schema for agent proposals; NATS + Postgres/pgvector via Docker Compose; OTel + hash-chained decision-log skeleton.
- **Week 2 — Agents & sandbox.** Compliance agent (Prowler→ISO 27001 mapper) + FinOps agent (M365 Graph idle-license detector) as Python tools over PyO3/gRPC; Wasmtime tool sandbox with capability manifests.
- **Week 3 — Arbitration kernel & API.** Rego policy gate (veto vs. tradeable); CMOP/Pareto solver returning the frontier; HITL interrupt + Temporal durable resume; `aegis` CLI (`scan`, `simulate`, `arbitrate`).
- **Week 4 — Evidence, docs, launch.** `aegis evidence` control-mapped bundles; quickstart + the "idle-E5-vs-audit" demo; CI (test/clippy/audit); examples; README/architecture; tag `v0.1.0`, Show HN / r/devops launch.

### Scaffold — run now

```bash
# 0. Workspace
mkdir aegis && cd aegis && git init -b main
cargo new --lib core/kernel        # Rust arbitration kernel
cargo new --lib core/sandbox       # Wasmtime/Firecracker wrappers
cargo new --bin  cli/aegis         # CLI entrypoint
cargo init --lib   bindings/py     # PyO3 surface

# 1. Cargo workspace manifest
cat > Cargo.toml <<'EOF'
[workspace]
resolver = "2"
members = ["core/kernel", "core/sandbox", "cli/aegis", "bindings/py"]
EOF

# 2. Core deps
cargo add -p kernel tokio --features full
cargo add -p kernel rig-core tonic prost serde serde_json opentelemetry
cargo add -p sandbox wasmtime wasmtime-wasi
cargo add -p aegis  clap --features derive

# 3. Python tool layer (scanners/connectors) + PyO3 build
python -m venv .venv && . .venv/bin/activate
pip install maturin prowler msgraph-sdk opa-python-client
maturin init --bindings pyo3 bindings/py

# 4. Policy + infra
mkdir -p policy && cat > policy/arbitrate.rego <<'EOF'
package aegis.arbitrate
default veto := false
# hard control obligations are non-negotiable constraints
veto if { input.obligation.severity == "mandatory" }
EOF

cat > docker-compose.yml <<'EOF'
services:
  nats:     { image: nats:latest, command: ["-js"], ports: ["4222:4222"] }
  postgres: { image: pgvector/pgvector:pg16, environment: { POSTGRES_PASSWORD: aegis }, ports: ["5432:5432"] }
  qdrant:   { image: qdrant/qdrant, ports: ["6333:6333"] }
  temporal: { image: temporalio/auto-setup, ports: ["7233:7233"] }
EOF

# 5. CI + first commit
mkdir -p .github/workflows && cat > .github/workflows/ci.yml <<'EOF'
name: ci
on: [push, pull_request]
jobs:
  rust:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cargo test --workspace && cargo clippy -- -D warnings
EOF
git add -A && git commit -m "scaffold: AEGIS workspace, kernel, sandbox, policy, infra"
```

---

## 5. Risk & validation notes
- **Market-gap holds.** Cloud Custodian is the nearest overlap (security+cost+governance, YAML rules) but **enforces** policy — it does **not** arbitrate competing objectives via Pareto/constraints. The arbitration kernel is the defensible wedge. **[C]**
- **Verify before publishing numbers:** Zylo/Productiv waste %s and Vanta test counts are **vendor-reported [V]**; Firecracker ~125 ms boot and Rig "20+ providers" drift across releases — re-confirm against live sources.
- **Hardest engineering risk:** the CMOP solver + Rego veto semantics (Week 3). De-risk by shipping a weighted-scalar fallback if the full Pareto solver slips.

---

## Sources
**Frameworks & gaps:** autogen code-executors docs · kb.cert.org/vuls/id/221883 · thaicert (CrewAI CVEs) · securityweek CrewAI · unit42.paloaltonetworks.com/agentic-ai-threats · thehackernews LangGrinch · CSA LangChain/LangGraph note · GHSA-45pg-36p6-83v9 · sentinelone CVE-2025-1793 / -1753 · gravitee.io agent-management · gartner 2025-06-25 & 2026-05-26 · openai-agents-python guardrails + issue 2775 · genai.owasp.org Top-10 Agentic 2026 · langfuse/langflow observability · semantic-kernel maintenance-mode.
**Compliance/GRC:** isms.online Annex A 2022 · hightable.io controls · secureframe SOC2 TSC · cncf.io OPA · github.com/open-policy-agent/opa · prowler-cloud/prowler · aquasecurity/trivy · cloud-custodian · steampipe.io · turbot/powerpipe · vanta automated-compliance · oasis STIX/TAXII 2.1 · MISP/MISP · aws.amazon.com/iam/access-analyzer · opengovern/opensecurity.
**FinOps/ITAM:** learn.microsoft.com getOffice365ActiveUserDetail · o365reports inactive-user · exelegent M365 pricing · swktech July-2026 increase · finops.org 2025-framework + /framework · zylo 2025 & 2024 SMI · mi-3 (Productiv 40%) · toriihq · snipeitapp.com + readme alerts · cloudquery GLPI/OCS · docs.aws compute-optimizer · komiser · infracost.
**Stack:** github 0xPlaygrounds/rig · floneum · rustformers/llm (archived) · tokio-rs/tokio · pyo3.rs · PyO3/pyo3 · cloudwego/eino · go.dev/blog/llmpowered · datacamp crewai-vs-langgraph-vs-autogen · docs.wasmtime.dev · bytecodealliance/wasmtime · firecracker-microvm · google/gvisor · qdrant · lancedb · pgvector · nats.io · temporal.io · grpc · protobuf.dev · redis.
**Orchestration/arbitration:** kore.ai · paiteq · tetrate.io · augmentcode · developers.googleblog A2A · apxml multi-agent-conflict-resolution · galileo.ai · emergentmind Pareto · link.springer CMOP · arxiv 2102.01353 · wiz.io OPA · openpolicyagent.org · osohq · permit.io · docs.langchain.com HITL · anthropic.com/news/model-context-protocol · blog.modelcontextprotocol.io · linuxfoundation.org A2A · opentelemetry.io gen-ai-agent-spans.
