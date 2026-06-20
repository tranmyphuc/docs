<div align="center">

# 🛡️ AEGIS

### The autonomous control plane where security and cost finally agree.

[![CI](https://github.com/tranmyphuc/aegis/actions/workflows/ci.yml/badge.svg)](https://github.com/tranmyphuc/aegis/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Rust](https://img.shields.io/badge/core-Rust-orange.svg)](https://www.rust-lang.org/)
[![Status: MVP](https://img.shields.io/badge/status-v0.1%20MVP-yellow.svg)](research/aegis-build-loop.md)

**AEGIS** is a governed, sandbox-first multi-agent framework that continuously maps your
**InfoSec compliance posture** (ISO 27001 / SOC 2) *and* your **SaaS & cloud waste** — then
**arbitrates every security-vs-cost conflict as one cryptographically auditable decision.**

</div>

---

## The problem

Two enterprise problems are structurally the same — *"what is the right state for this resource?"* —
yet they're owned by two tool ecosystems that **never talk to each other**:

| Security says | FinOps says |
|---|---|
| "Keep the E5 audit logging." (Prowler, OPA, Vanta) | "Reclaim the 200 idle E5 seats." (Komiser, Zylo, Cloud Custodian) |

Nobody arbitrates the conflict. So the reclamation either silently breaks a control, or never happens.
Meanwhile agent frameworks bolt governance on as an afterthought — and [the 2025–2026 CVE record](research/aegis-architecture.md)
(LangGrinch, CrewAI silent-sandbox RCE, LlamaIndex SQLi) shows how that ends.

## The breakthrough

**Conflict is the product.** AEGIS models the tension as a constrained multi-objective problem:
maximize savings **and** control coverage, with mandatory compliance obligations as hard vetoes.
It returns the **Pareto frontier** and *tells you which control vetoed the cheaper option.*

```text
$ aegis simulate
AEGIS simulate — idle E5 reclamation vs. audit-log retention

Pareto frontier (feasible, non-dominated plans):
  [0] save $  9120.00/mo  coverage_loss=0  apply=["reclaim-e5-general"]

Binding constraints (why cost did not win outright):
  ✗ proposal 'reclaim-e5-regulated' on 'm365:e5:regulated' vetoed by
    mandatory control A.8.15 (E5-tier audit logging must be retained
    for the regulated cohort)

RECOMMENDED: save $9120.00/mo by applying ["reclaim-e5-general"]
Forfeited $2280.00/mo to honor mandatory compliance obligations.
```

## Quickstart (offline, < 2 min)

```bash
git clone https://github.com/tranmyphuc/aegis && cd aegis
cargo run -p aegis-cli -- simulate     # the flagship conflict, end-to-end
cargo test --workspace                 # the arbitration kernel test suite
```

No API keys, no cloud account — the demo runs against fixtures.

## Architecture

```
Connectors → Compliance Agent ─┐                  ┌─ obligations (vetoes/objectives)
(M365, AWS,   (ISO 27001 map)  ├─► ARBITRATION ───┤
 Prowler,    FinOps Agent ─────┘    KERNEL        └─ proposals ($ savings)
 STIX)       (idle/license)      Pareto + OPA veto + HITL
                                          │
                            hash-chained, OTel-shaped audit log
```

- **Compliance/Audit agent** — maps scanner findings → ISO 27001:2022 Annex A controls; parses STIX/TAXII threat intel.
- **FinOps/Asset agent** — detects idle M365 licenses (Graph usage reports) and idle cloud resources; models lifecycle/expiry.
- **Arbitration kernel** — Pareto frontier over (savings, coverage) with mandatory obligations as constraints. ([code](core/kernel/src/lib.rs))
- **Sandbox** — deny-by-default capability grants per tool call ([code](core/sandbox/src/lib.rs)); WASM/microVM backends in v0.2.

Full design + research citations: [`research/aegis-architecture.md`](research/aegis-architecture.md).
Build roadmap (28 verifiable tasks): [`research/aegis-build-loop.md`](research/aegis-build-loop.md).

## Tech stack

Rust core (Tokio + Rig) · Python tools via PyO3/gRPC · Wasmtime + Firecracker sandbox ·
Qdrant/pgvector memory · NATS + Temporal · OPA/Rego policy · MCP + A2A + OpenTelemetry.

## Status & roadmap

`v0.1 MVP` — working `simulate`, real Pareto+veto kernel, deny-by-default sandbox surface, green CI.
Next: live connectors (M365 Graph, Prowler), OPA/Rego gate, HITL + Temporal, hash-chained evidence bundles.
See [the build loop](research/aegis-build-loop.md) and `good first issue`s.

## License

Apache-2.0 © contributors. See [LICENSE](LICENSE).
