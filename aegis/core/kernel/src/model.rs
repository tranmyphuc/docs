//! Core types shared across the Compliance agent, FinOps agent, and kernel.

/// Severity of a compliance obligation. `Mandatory` obligations are hard
/// constraints (vetoes); `Soft` obligations are tradeable objectives.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Severity {
    Mandatory,
    Soft,
}

/// A control obligation emitted by the Compliance/Audit agent.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Obligation {
    /// ISO 27001:2022 Annex A control id (e.g. "A.8.15") or SOC 2 criterion.
    pub control_id: String,
    /// Resource the obligation binds to (matched against proposal resources).
    pub resource: String,
    pub severity: Severity,
    pub note: String,
}

impl Obligation {
    pub fn mandatory(control_id: &str, resource: &str, note: &str) -> Self {
        Self {
            control_id: control_id.into(),
            resource: resource.into(),
            severity: Severity::Mandatory,
            note: note.into(),
        }
    }

    pub fn soft(control_id: &str, resource: &str, note: &str) -> Self {
        Self {
            control_id: control_id.into(),
            resource: resource.into(),
            severity: Severity::Soft,
            note: note.into(),
        }
    }
}

/// A cost-saving proposal emitted by the FinOps/Asset agent.
#[derive(Debug, Clone, PartialEq)]
pub struct Proposal {
    pub id: String,
    pub resource: String,
    pub monthly_savings_usd: f64,
    /// Whether applying this proposal reduces compliance control coverage of
    /// the resource (e.g. dropping an E5 tier removes audit-log retention).
    pub reduces_control_coverage: bool,
}

impl Proposal {
    pub fn reclaim(id: &str, resource: &str, monthly_savings_usd: f64) -> Self {
        Self {
            id: id.into(),
            resource: resource.into(),
            monthly_savings_usd,
            reduces_control_coverage: false,
        }
    }

    /// Builder: mark whether this proposal erodes control coverage.
    pub fn erodes_coverage(mut self, yes: bool) -> Self {
        self.reduces_control_coverage = yes;
        self
    }
}

/// A candidate plan: the set of proposals chosen to apply.
#[derive(Debug, Clone, PartialEq)]
pub struct Plan {
    pub applied: Vec<String>,
    pub monthly_savings_usd: f64,
    /// Number of applied proposals that erode coverage (objective to minimize).
    pub coverage_loss: u32,
}

impl Plan {
    pub fn empty() -> Self {
        Self {
            applied: Vec::new(),
            monthly_savings_usd: 0.0,
            coverage_loss: 0,
        }
    }

    pub fn apply(&mut self, p: &Proposal) {
        self.applied.push(p.id.clone());
        self.monthly_savings_usd += p.monthly_savings_usd;
        if p.reduces_control_coverage {
            self.coverage_loss += 1;
        }
    }
}
