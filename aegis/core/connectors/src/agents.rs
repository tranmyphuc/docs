//! The two agents that feed the arbitration kernel.
//!
//! * Compliance/Audit agent (L3.1): failing controls → mandatory obligations.
//! * FinOps/Asset agent (L3.2): idle seats → cost-saving proposals.

use crate::m365::IdleSeat;
use crate::prowler::Finding;
use aegis_kernel::{Obligation, Proposal};
use std::collections::BTreeMap;

/// Compliance agent: every failing control becomes a mandatory obligation that
/// binds its resource, so FinOps cannot erode coverage the org must keep.
pub fn compliance_obligations(findings: &[Finding]) -> Vec<Obligation> {
    findings
        .iter()
        .filter(|f| !f.passed)
        .map(|f| {
            Obligation::mandatory(
                &f.control_id,
                &f.resource,
                &format!("control {} failing on {}", f.control_id, f.resource),
            )
        })
        .collect()
}

/// Monthly list price (USD) per Microsoft 365 tier (pre-July-2026).
fn tier_price(tier: &str) -> f64 {
    match tier.to_ascii_uppercase().as_str() {
        "E5" => 57.0,
        "E3" => 36.0,
        "E1" => 10.0,
        _ => 0.0,
    }
}

/// FinOps agent: group idle seats by (tier, cohort) and propose reclaiming each
/// group. Reclaiming a `regulated`-cohort group erodes control coverage.
pub fn finops_proposals(idle: &[IdleSeat]) -> Vec<Proposal> {
    let mut groups: BTreeMap<(String, String), u32> = BTreeMap::new();
    for s in idle {
        *groups
            .entry((s.tier.clone(), s.cohort.clone()))
            .or_insert(0) += 1;
    }
    groups
        .into_iter()
        .map(|((tier, cohort), count)| {
            let resource = format!("m365:{}:{}", tier.to_ascii_lowercase(), cohort);
            let id = format!("reclaim-{}-{}", tier.to_ascii_lowercase(), cohort);
            Proposal::reclaim(&id, &resource, count as f64 * tier_price(&tier))
                .erodes_coverage(cohort.eq_ignore_ascii_case("regulated"))
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{m365, prowler};

    #[test]
    fn compliance_agent_emits_mandatory_obligation() {
        let findings = prowler::parse_findings(
            "status,check_id,resource\nFAIL,m365_audit_log_retention_enabled,m365:e5:regulated\n",
        );
        let obs = compliance_obligations(&findings);
        assert_eq!(obs.len(), 1);
        assert_eq!(obs[0].control_id, "A.8.15");
        assert_eq!(obs[0].resource, "m365:e5:regulated");
    }

    #[test]
    fn finops_agent_emits_priced_proposal() {
        let idle = m365::parse_idle(
            "upn,tier,cohort,lastSignInDateTime,lastNonInteractiveSignInDateTime\n\
             a@c.com,E5,general,,\nb@c.com,E5,general,,\n",
            "2026-03-22T00:00:00Z",
        );
        let proposals = finops_proposals(&idle);
        assert_eq!(proposals.len(), 1);
        assert_eq!(proposals[0].resource, "m365:e5:general");
        assert!((proposals[0].monthly_savings_usd - 114.0).abs() < 1e-6); // 2 × $57
    }
}
