//! AEGIS arbitration kernel.
//!
//! The differentiator: existing tools either *enforce* security policy
//! (Cloud Custodian, OPA) or *report* cost waste (FinOps platforms). None
//! arbitrate between the two as a single decision. This kernel models the
//! tension as a constrained multi-objective problem (CMOP):
//!
//! * **Objectives** — maximize monthly savings, maximize control coverage.
//! * **Constraints** — a `Mandatory` compliance obligation is a hard veto:
//!   no feasible plan may apply a proposal that erodes coverage of a resource
//!   bound by a mandatory obligation.
//!
//! [`arbitrate`] returns the Pareto frontier of feasible plans plus the
//! binding constraint that vetoed the maximum-savings plan — so the operator
//! sees *why* security beat cost (or did not).

pub mod model;

pub use model::{Obligation, Plan, Proposal, Severity};

/// Outcome of an arbitration run.
#[derive(Debug, Clone, PartialEq)]
pub struct Arbitration {
    /// Non-dominated feasible plans (the Pareto front), best-savings first.
    pub frontier: Vec<Plan>,
    /// The recommended plan: the feasible plan with the highest savings.
    pub recommended: Plan,
    /// Human-readable rationale for why the unconstrained plan was not chosen.
    pub veto_rationale: Vec<String>,
    /// Savings forfeited (USD/mo) by respecting mandatory obligations.
    pub savings_forfeited_usd: f64,
}

/// Returns true if a proposal is vetoed by any mandatory obligation: it erodes
/// control coverage of a resource that a mandatory obligation protects.
fn is_vetoed(p: &Proposal, obligations: &[Obligation]) -> Option<String> {
    if !p.reduces_control_coverage {
        return None;
    }
    obligations
        .iter()
        .find(|o| o.severity == Severity::Mandatory && o.resource == p.resource)
        .map(|o| {
            format!(
                "proposal '{}' on '{}' vetoed by mandatory control {} ({})",
                p.id, p.resource, o.control_id, o.note
            )
        })
}

/// `a` dominates `b` iff it is at least as good on every objective and strictly
/// better on at least one. Objectives: savings (↑), coverage_loss (↓).
fn dominates(a: &Plan, b: &Plan) -> bool {
    let ge = a.monthly_savings_usd >= b.monthly_savings_usd && a.coverage_loss <= b.coverage_loss;
    let gt = a.monthly_savings_usd > b.monthly_savings_usd || a.coverage_loss < b.coverage_loss;
    ge && gt
}

/// Arbitrate a set of FinOps proposals against compliance obligations.
///
/// Enumerates feasible subsets (capped at 2^20 candidates) and returns the
/// Pareto-optimal frontier. Proposals vetoed by a mandatory obligation are
/// excluded from every candidate plan.
pub fn arbitrate(proposals: &[Proposal], obligations: &[Obligation]) -> Arbitration {
    assert!(
        proposals.len() <= 20,
        "subset enumeration capped at 20 proposals; use the weighted-scalar strategy for larger inputs"
    );

    // Partition into feasible vs. vetoed.
    let mut feasible: Vec<&Proposal> = Vec::new();
    let mut veto_rationale: Vec<String> = Vec::new();
    for p in proposals {
        match is_vetoed(p, obligations) {
            Some(reason) => veto_rationale.push(reason),
            None => feasible.push(p),
        }
    }

    // Enumerate every subset of feasible proposals into a candidate plan.
    let n = feasible.len();
    let mut candidates: Vec<Plan> = Vec::with_capacity(1 << n);
    for mask in 0u32..(1u32 << n) {
        let mut plan = Plan::empty();
        for (i, p) in feasible.iter().enumerate() {
            if mask & (1 << i) != 0 {
                plan.apply(p);
            }
        }
        candidates.push(plan);
    }

    // Pareto filter.
    let mut frontier: Vec<Plan> = candidates
        .iter()
        .filter(|c| !candidates.iter().any(|o| dominates(o, c)))
        .cloned()
        .collect();
    frontier.sort_by(|a, b| {
        b.monthly_savings_usd
            .partial_cmp(&a.monthly_savings_usd)
            .unwrap()
    });
    frontier.dedup();

    let recommended = frontier.first().cloned().unwrap_or_else(Plan::empty);

    // Savings forfeited = what the (infeasible) all-proposals plan would have
    // saved, minus what the recommended feasible plan saves.
    let unconstrained: f64 = proposals.iter().map(|p| p.monthly_savings_usd).sum();
    let savings_forfeited_usd = (unconstrained - recommended.monthly_savings_usd).max(0.0);

    Arbitration {
        frontier,
        recommended,
        veto_rationale,
        savings_forfeited_usd,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn scenario() -> (Vec<Proposal>, Vec<Obligation>) {
        let proposals = vec![
            // Reclaim 160 idle E5 seats outside the regulated cohort — safe.
            Proposal::reclaim("reclaim-e5-general", "m365:e5:general", 9_120.0)
                .erodes_coverage(false),
            // Reclaim 40 idle E5 seats in the regulated cohort — erodes audit coverage.
            Proposal::reclaim("reclaim-e5-regulated", "m365:e5:regulated", 2_280.0)
                .erodes_coverage(true),
        ];
        let obligations = vec![Obligation::mandatory(
            "A.8.15",
            "m365:e5:regulated",
            "E5-tier audit logging must be retained for the regulated cohort",
        )];
        (proposals, obligations)
    }

    #[test]
    fn mandatory_obligation_vetoes_unsafe_reclaim() {
        let (p, o) = scenario();
        let result = arbitrate(&p, &o);
        assert_eq!(result.veto_rationale.len(), 1);
        assert!(result.veto_rationale[0].contains("A.8.15"));
    }

    #[test]
    fn recommends_safe_savings_only() {
        let (p, o) = scenario();
        let result = arbitrate(&p, &o);
        // Best feasible plan reclaims only the general cohort.
        assert!((result.recommended.monthly_savings_usd - 9_120.0).abs() < 1e-6);
        assert!((result.savings_forfeited_usd - 2_280.0).abs() < 1e-6);
    }

    #[test]
    fn frontier_is_non_dominated() {
        let (p, o) = scenario();
        let result = arbitrate(&p, &o);
        for a in &result.frontier {
            for b in &result.frontier {
                assert!(!dominates(a, b) || a == b);
            }
        }
    }

    #[test]
    fn no_obligations_reclaims_everything() {
        let (p, _) = scenario();
        let result = arbitrate(&p, &[]);
        assert!((result.recommended.monthly_savings_usd - 11_400.0).abs() < 1e-6);
        assert_eq!(result.savings_forfeited_usd, 0.0);
    }
}
