//! AEGIS CLI — the control plane entrypoint.
//!
//! v0.1 ships a working `simulate` that runs the flagship conflict
//! (idle E5 reclamation vs. mandatory audit-log retention) through the real
//! arbitration kernel. `scan`, `arbitrate`, and `evidence` are scaffolded.

use aegis_connectors::{compliance_obligations, finops_proposals, m365, prowler};
use aegis_kernel::{arbitrate, arbitrate_weighted, Obligation, Proposal};
use std::env;
use std::process::ExitCode;

const HELP: &str = "\
aegis — autonomous control plane where security and cost finally agree

USAGE:
    aegis <COMMAND>

COMMANDS:
    scan        Run connectors → agents → arbitration over fixtures
    simulate    Dry-run the flagship security-vs-cost conflict
    arbitrate   Resolve the conflict (--strategy weighted for the linear fallback)
    evidence    Emit a control-mapped, hash-chained evidence bundle      (stub)
    help        Show this message

EXAMPLES:
    aegis simulate
    aegis scan
    aegis arbitrate --strategy weighted
";

fn main() -> ExitCode {
    let cmd = env::args().nth(1).unwrap_or_else(|| "help".into());
    match cmd.as_str() {
        "simulate" => {
            simulate();
            ExitCode::SUCCESS
        }
        "scan" => scan(),
        "arbitrate" => arbitrate_cmd(),
        "evidence" => {
            println!("`aegis evidence` is scaffolded for v0.1 — see research/aegis-build-loop.md.");
            ExitCode::SUCCESS
        }
        "help" | "-h" | "--help" => {
            print!("{HELP}");
            ExitCode::SUCCESS
        }
        other => {
            eprintln!("unknown command: {other}\n\n{HELP}");
            ExitCode::FAILURE
        }
    }
}

/// `aegis scan [usage.csv findings.csv]` — the full pipeline against fixtures:
/// connectors → agents → arbitration. Defaults to the bundled fixtures.
fn scan() -> ExitCode {
    let usage_path = env::args()
        .nth(2)
        .unwrap_or_else(|| "fixtures/m365_usage.csv".into());
    let findings_path = env::args()
        .nth(3)
        .unwrap_or_else(|| "fixtures/prowler_findings.csv".into());

    let usage = match std::fs::read_to_string(&usage_path) {
        Ok(s) => s,
        Err(e) => {
            eprintln!("cannot read {usage_path}: {e}");
            return ExitCode::FAILURE;
        }
    };
    let findings_csv = match std::fs::read_to_string(&findings_path) {
        Ok(s) => s,
        Err(e) => {
            eprintln!("cannot read {findings_path}: {e}");
            return ExitCode::FAILURE;
        }
    };

    // 90-day idle cutoff relative to a fixed "today" for reproducible output.
    let idle = m365::parse_idle(&usage, "2026-03-22T00:00:00Z");
    let findings = prowler::parse_findings(&findings_csv);
    let proposals = finops_proposals(&idle);
    let obligations = compliance_obligations(&findings);

    println!("AEGIS scan");
    println!("  idle seats:    {}", idle.len());
    println!("  FinOps proposals: {}", proposals.len());
    println!(
        "  compliance obligations (mandatory): {}\n",
        obligations.len()
    );

    render(&arbitrate(&proposals, &obligations));
    ExitCode::SUCCESS
}

/// The flagship demo: 200 idle E5 seats found; 40 are in a regulated cohort
/// that a mandatory ISO 27001 A.8.15 obligation requires to retain E5-tier
/// audit logging. Show the operator *why* full reclamation is vetoed.
fn simulate() {
    let proposals = vec![
        Proposal::reclaim("reclaim-e5-general", "m365:e5:general", 9_120.0).erodes_coverage(false),
        Proposal::reclaim("reclaim-e5-regulated", "m365:e5:regulated", 2_280.0)
            .erodes_coverage(true),
    ];
    let obligations = vec![Obligation::mandatory(
        "A.8.15",
        "m365:e5:regulated",
        "E5-tier audit logging must be retained for the regulated cohort",
    )];

    println!("AEGIS simulate — idle E5 reclamation vs. audit-log retention\n");
    render(&arbitrate(&proposals, &obligations));
}

/// `aegis arbitrate [--strategy weighted]` — resolve the bundled fixtures via
/// the Pareto strategy (default) or the linear weighted-scalar fallback.
fn arbitrate_cmd() -> ExitCode {
    let weighted = env::args().any(|a| a == "weighted");
    let proposals = vec![
        Proposal::reclaim("reclaim-e5-general", "m365:e5:general", 9_120.0).erodes_coverage(false),
        Proposal::reclaim("reclaim-e5-regulated", "m365:e5:regulated", 2_280.0)
            .erodes_coverage(true),
    ];
    let obligations = vec![Obligation::mandatory(
        "A.8.15",
        "m365:e5:regulated",
        "E5-tier audit logging must be retained for the regulated cohort",
    )];

    if weighted {
        let plan = arbitrate_weighted(&proposals, &obligations, 1.0, 0.0);
        println!("strategy=weighted");
        println!(
            "RECOMMENDED: save ${:.2}/mo by applying {:?}",
            plan.monthly_savings_usd, plan.applied
        );
    } else {
        println!("strategy=pareto");
        render(&arbitrate(&proposals, &obligations));
    }
    ExitCode::SUCCESS
}

/// Shared renderer for an arbitration result.
fn render(result: &aegis_kernel::Arbitration) {
    println!("Pareto frontier (feasible, non-dominated plans):");
    for (i, plan) in result.frontier.iter().enumerate() {
        println!(
            "  [{i}] save ${:>9.2}/mo  coverage_loss={}  apply={:?}",
            plan.monthly_savings_usd, plan.coverage_loss, plan.applied
        );
    }

    println!("\nBinding constraints (why cost did not win outright):");
    if result.veto_rationale.is_empty() {
        println!("  (none — full reclamation was safe)");
    } else {
        for r in &result.veto_rationale {
            println!("  ✗ {r}");
        }
    }

    println!(
        "\nRECOMMENDED: save ${:.2}/mo by applying {:?}",
        result.recommended.monthly_savings_usd, result.recommended.applied
    );
    println!(
        "Forfeited ${:.2}/mo to honor mandatory compliance obligations.",
        result.savings_forfeited_usd
    );
}
