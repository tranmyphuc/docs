# AEGIS Launch Kit

> Migration note: this tree was built in `tranmyphuc/docs` (session scope limit).
> Before launch, move it into the standalone repo:
> `git subtree split` or copy `aegis/` → fresh `tranmyphuc/aegis`, then `git init`.

## Pre-launch checklist
- [ ] Repo public; topics: `ai-agents` `finops` `compliance` `iso27001` `rust` `security`
- [ ] Social-preview image set (Settings → General)
- [ ] Demo GIF/asciinema embedded in README hero
- [ ] CI green; release `v0.1.0` tagged
- [ ] 8–12 `good first issue`s seeded; Discussions enabled

## Show HN
**Title:** `Show HN: AEGIS – an agent framework that arbitrates security vs. cost`
**Body:** Lead with the conflict (idle E5 vs. mandatory audit retention), paste the
`aegis simulate` output, link the architecture + research citations, end with "what we got wrong?".

## r/devops · r/rust · r/sysadmin
Angle per sub: devops→FinOps+compliance silo, rust→zero-dep offline kernel, sysadmin→M365 July-2026 price hike.

## X / LinkedIn thread (7 posts)
1. Hook: "Your security tools and your cost tools disagree. Nobody arbitrates. We built the arbiter."
2–5. The conflict → Pareto frontier → veto rationale → CVE/governance gap.
6. Stack + offline demo. 7. Repo link + call for contributors.

## Comparison table (pin in README/discussions)
| | Prowler | Cloud Custodian | Vanta | **AEGIS** |
|---|---|---|---|---|
| Compliance posture | ✅ | partial | ✅ | ✅ |
| Cost/license optimization | ❌ | ✅ | ❌ | ✅ |
| **Arbitrates the conflict** | ❌ | ❌ | ❌ | **✅** |

## Timing
Tue–Thu, ~13:00 UTC (US morning + EU afternoon). Post HN first, seed others within 30 min.
