//! Prowler → ISO 27001:2022 mapper (L2.2).
//!
//! Maps scanner findings to Annex A control IDs. v0.1 reads a CSV fixture
//! (`status,check_id,resource`); the mapping table is the part that matters and
//! transfers directly to real Prowler OCSF output.

/// A scanner finding.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Finding {
    pub passed: bool,
    pub check_id: String,
    pub resource: String,
    /// ISO 27001:2022 Annex A control this check maps to.
    pub control_id: String,
}

/// Map a Prowler check id to an ISO 27001:2022 Annex A control.
pub fn control_for(check_id: &str) -> &'static str {
    match check_id {
        "m365_audit_log_retention_enabled" => "A.8.15", // Logging
        "m365_purview_threat_intel_enabled" => "A.5.7", // Threat intelligence (new in 2022)
        "iam_unused_credentials_disabled" => "A.5.18",  // Access rights
        "iam_root_mfa_enabled" => "A.8.5",              // Secure authentication
        _ => "A.5.1",                                   // Policies for information security
    }
}

/// Parse a CSV findings fixture. Expected header: `status,check_id,resource`.
pub fn parse_findings(csv: &str) -> Vec<Finding> {
    let mut out = Vec::new();
    for line in csv.lines().skip(1).filter(|l| !l.trim().is_empty()) {
        let f: Vec<&str> = line.split(',').map(|s| s.trim()).collect();
        if f.len() < 3 {
            continue;
        }
        out.push(Finding {
            passed: f[0].eq_ignore_ascii_case("pass"),
            check_id: f[1].into(),
            resource: f[2].into(),
            control_id: control_for(f[1]).into(),
        });
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    const FIXTURE: &str = "\
status,check_id,resource
FAIL,m365_audit_log_retention_enabled,m365:e5:regulated
PASS,iam_root_mfa_enabled,aws:account:root
FAIL,m365_purview_threat_intel_enabled,m365:tenant
";

    #[test]
    fn maps_findings_to_iso_controls() {
        let f = parse_findings(FIXTURE);
        assert_eq!(f[0].control_id, "A.8.15");
        assert_eq!(f[2].control_id, "A.5.7"); // threat-intel control
    }

    #[test]
    fn unknown_check_falls_back_to_policy_control() {
        assert_eq!(control_for("some_new_check"), "A.5.1");
    }
}
