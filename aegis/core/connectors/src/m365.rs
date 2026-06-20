//! Microsoft 365 idle-license connector (L2.1).
//!
//! Mirrors the shape of Graph `getOffice365ActiveUserDetail`. A seat is idle
//! only when BOTH `lastSignInDateTime` and `lastNonInteractiveSignInDateTime`
//! are older than the cutoff (or empty) — relying on interactive sign-ins
//! alone misclassifies users (per Microsoft guidance). ISO-8601 timestamps
//! sort lexicographically, so string comparison is a valid recency test.

/// An idle licensed seat detected from a usage report.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct IdleSeat {
    pub upn: String,
    pub tier: String,
    /// Cohort tag used to bind compliance obligations (e.g. "regulated").
    pub cohort: String,
}

/// Parse a CSV usage report into the list of idle seats.
///
/// Expected header: `upn,tier,cohort,lastSignInDateTime,lastNonInteractiveSignInDateTime`.
/// `cutoff` is an ISO-8601 instant; a blank timestamp counts as "never".
pub fn parse_idle(csv: &str, cutoff: &str) -> Vec<IdleSeat> {
    let mut out = Vec::new();
    for line in csv.lines().skip(1).filter(|l| !l.trim().is_empty()) {
        let f: Vec<&str> = line.split(',').map(|s| s.trim()).collect();
        if f.len() < 5 {
            continue;
        }
        let (upn, tier, cohort, last_i, last_ni) = (f[0], f[1], f[2], f[3], f[4]);
        let idle = is_stale(last_i, cutoff) && is_stale(last_ni, cutoff);
        if idle {
            out.push(IdleSeat {
                upn: upn.into(),
                tier: tier.into(),
                cohort: cohort.into(),
            });
        }
    }
    out
}

/// A timestamp is stale if blank/"never" or strictly before the cutoff.
fn is_stale(ts: &str, cutoff: &str) -> bool {
    ts.is_empty() || ts.eq_ignore_ascii_case("never") || ts < cutoff
}

#[cfg(test)]
mod tests {
    use super::*;

    const FIXTURE: &str = "\
upn,tier,cohort,lastSignInDateTime,lastNonInteractiveSignInDateTime
alice@corp.com,E5,general,2024-01-02T00:00:00Z,2024-01-02T00:00:00Z
bob@corp.com,E5,regulated,,
carol@corp.com,E5,general,2026-06-01T00:00:00Z,2026-06-10T00:00:00Z
dave@corp.com,E5,regulated,2026-06-15T00:00:00Z,
";

    #[test]
    fn detects_only_fully_idle_seats() {
        // Cutoff: 90 days before "now" (~2026-03-22). Alice (old) + Bob (never)
        // are idle. Carol is active. Dave has a recent interactive sign-in.
        let idle = parse_idle(FIXTURE, "2026-03-22T00:00:00Z");
        let upns: Vec<&str> = idle.iter().map(|s| s.upn.as_str()).collect();
        assert_eq!(upns, vec!["alice@corp.com", "bob@corp.com"]);
    }

    #[test]
    fn non_interactive_signin_prevents_false_idle() {
        // Dave's interactive sign-in is recent → not idle even with blank non-interactive.
        let idle = parse_idle(FIXTURE, "2026-03-22T00:00:00Z");
        assert!(!idle.iter().any(|s| s.upn == "dave@corp.com"));
    }
}
