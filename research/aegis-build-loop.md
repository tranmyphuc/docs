# AEGIS Build Loop — Task Ledger

> A resumable, loop-driven build plan. **One iteration = pick the top unchecked task → implement → verify with the exact command → commit & push → check the box.** Never check a box without a green verification. Each task is atomic and shippable; the repo is demo-able after *every* iteration.
>
> Goal: a comprehensive, trend-worthy repo (GitHub "Repo of the Day" / trending #1).

## Definition of Done (global gates — apply to every box)
- `cargo build --workspace` succeeds (or task is docs/launch only).
- The task's stated **Verify** command exits 0.
- Change is committed and pushed; ledger box checked in the same commit.
- No secrets, no network required for the demo path (use fixtures).

---

## L0 — Genesis & Identity  *(makes the repo look alive)*
- [x] **L0.1** `README.md` hero: one-line pitch, problem, the `aegis simulate` teaser, badges placeholder. **Verify:** `grep -q "security and cost finally agree" README.md`
- [x] **L0.2** `LICENSE` = Apache-2.0; `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`. **Verify:** `test -f LICENSE && test -f SECURITY.md`
- [ ] **L0.3** Repo metadata: topics (`ai-agents`, `finops`, `compliance`, `iso27001`, `rust`), About blurb, social-preview note. **Verify:** manual checklist in `LAUNCH.md`
- [x] **L0.4** `.github/` issue + PR templates, `good first issue` label set, `CHANGELOG.md`. **Verify:** `test -d .github/ISSUE_TEMPLATE`

## L1 — Core Scaffold  *(it compiles & runs)*
- [x] **L1.1** Cargo workspace: `core/kernel`, `core/sandbox`, `cli/aegis`, `bindings/py`. **Verify:** `cargo build --workspace`
- [x] **L1.2** `aegis` CLI with `clap`: `scan`, `simulate`, `arbitrate`, `evidence` (stubs). **Verify:** `cargo run -p aegis -- --help`
- [x] **L1.3** `docker-compose.yml` (nats, postgres+pgvector, qdrant, temporal) + `make up`. **Verify:** `docker compose config -q`
- [x] **L1.4** `Makefile` targets: `build`, `test`, `demo`, `up`, `down`. **Verify:** `make -n demo`

## L2 — Connectors (offline fixtures)  *(real data shape, no creds)*
- [x] **L2.1** M365 idle-license connector: parse a fixture `getOffice365ActiveUserDetail` CSV → idle E5 list (`lastSignInDateTime` + `lastNonInteractiveSignInDateTime`). **Verify:** unit test asserts N idle seats from fixture.
- [x] **L2.2** Prowler→ISO 27001:2022 mapper: fixture findings JSON → Annex A control IDs. **Verify:** test maps a finding to `A.5.7`/`A.8.x`.
- [ ] **L2.3** Connector trait + gRPC/PyO3 boundary so Python tools feed the Rust core. **Verify:** round-trip test.

## L3 — Agents  *(the two viewpoints)*
- [x] **L3.1** Compliance Agent → emits **obligations** (control id, severity mandatory/soft, affected resource). **Verify:** test emits ≥1 mandatory obligation from L2.2 output.
- [x] **L3.2** FinOps Agent → emits **proposals** (action, $ delta, affected resource) from L2.1 output. **Verify:** test emits a reclaim proposal with $ value.

## L4 — Arbitration Kernel  *(THE differentiator)*
- [x] **L4.1** CMOP model: obligations-as-constraints, cost+coverage objectives; return **Pareto front**. **Verify:** test returns ≥2 non-dominated options.
- [x] **L4.2** OPA/Rego veto gate (`policy/arbitrate.rego`): mandatory severity → hard veto. **Verify:** test shows a reclaim vetoed by an audit-retention obligation.
- [x] **L4.3** Weighted-scalar fallback flag (de-risks L4.1 slip). **Verify:** `aegis arbitrate --strategy weighted` runs.

## L5 — Human-in-the-Loop + Durability
- [ ] **L5.1** HITL interrupt on high-blast-radius actions; snapshot + resume. **Verify:** test pauses then resumes on approve.
- [ ] **L5.2** Temporal durable workflow wrapping a scan→arbitrate→act cycle. **Verify:** workflow replays from event history in test.

## L6 — Audit / Evidence  *(the enterprise hook)*
- [ ] **L6.1** Hash-chained decision log, OTel-GenAI span shape (`invoke_agent`/`execute_tool`). **Verify:** test detects tamper (broken hash chain).
- [ ] **L6.2** `aegis evidence --control A.8.x` emits a control-mapped bundle. **Verify:** command produces JSON with control id + decision hashes.

## L7 — KILLER DEMO  *(the thing people screenshot)*
- [x] **L7.1** `aegis simulate` end-to-end: idle-200×E5 vs. audit-retention → prints Pareto frontier + the **binding constraint that vetoed reclamation**. **Verify:** `make demo` exits 0 and prints the veto rationale.
- [ ] **L7.2** Record `asciinema`/GIF of the demo → embed in README hero. **Verify:** `test -f docs/demo.gif` (or `.cast`).

## L8 — Tests & Green CI  *(trust signals)*
- [ ] **L8.1** CI: `cargo test --workspace`, `clippy -D warnings`, `cargo audit`, fmt check. **Verify:** CI green on PR.
- [ ] **L8.2** Coverage + badges in README (build, license, coverage, discord/issues). **Verify:** badges render.

## L9 — Docs  *(reuse the Mintlify repo)*
- [ ] **L9.1** Quickstart page (5-min path), architecture page (diagram), concepts (arbitration). **Verify:** `docs.json` nav updated, builds.
- [x] **L9.2** `examples/` dir: the idle-E5 scenario + a second (S3 public-bucket vs. cost). **Verify:** each example README runs.

## L10 — Launch Kit  *(coordinated, timed)*
- [x] **L10.1** `LAUNCH.md`: Show HN title+body, r/devops + r/rust posts, X/LinkedIn thread, dev.to article draft. **Verify:** file complete, links checked.
- [x] **L10.2** Timing plan (Tue–Thu, ~13:00 UTC), pre-seeded FAQ, comparison table vs. Cloud Custodian/Prowler/Vanta. **Verify:** checklist in LAUNCH.md.

## L11 — Community Polish  *(sustain the spike)*
- [ ] **L11.1** Seed 8–12 `good first issue`s mapped to `v0.2` (Azure/GCP, STIX feeds, A2A). **Verify:** issues created with labels.
- [ ] **L11.2** GitHub Discussions on, roadmap pinned, Discord/forum link. **Verify:** manual checklist.

---

### Progress
`18 / 28` tasks complete (foundational drop: L0, L1, kernel arbitration L4.1/L4.2, simulate demo L7.1, example L9.2, launch kit L10). Remaining: live connectors (L2), agent wiring (L3), HITL+Temporal (L5), evidence bundles (L6), demo GIF (L7.2), CI badges (L8), docs site (L9.1), community polish (L11).

> **Build location note:** built under `aegis/` in `tranmyphuc/docs` because this session is scoped to that repo and a standalone `tranmyphuc/aegis` could not be created (403). Migrate the `aegis/` tree to the standalone private repo before launch (see `aegis/LAUNCH.md`).
