//! AEGIS CLI — the control plane entrypoint.
//!
//! v0.1 ships a working `simulate` that runs the flagship conflict
//! (idle E5 reclamation vs. mandatory audit-log retention) through the real
//! arbitration kernel. `scan`, `arbitrate`, and `evidence` are scaffolded.

use aegis_kernel::{arbitrate, Obligation, Proposal};
use std::env;
use std::process::ExitCode;

const HELP: &str = "\
aegis — autonomous control plane where security and cost finally agree

USAGE:
    aegis <COMMAND>

COMMANDS:
    scan        Ingest connector findings into obligations + proposals  (stub)
    simulate    Dry-run the security-vs-cost conflict and print the Pareto frontier
    arbitrate   Resolve a conflict and emit the recommended plan         (stub)
    evidence    Emit a control-mapped, hash-chained evidence bundle      (stub)
    help        Show this message

EXAMPLE:
    aegis simulate
";

fn main() -> ExitCode {
    let cmd = env::args().nth(1).unwrap_or_else(|| "help".into());
    match cmd.as_str() {
        "simulate" => {
            simulate();
            ExitCode::SUCCESS
        }
        "scan" | "arbitrate" | "evidence" => {
            println!("`aegis {cmd}` is scaffolded for v0.1 — see research/aegis-build-loop.md.");
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

    let result = arbitrate(&proposals, &obligations);

    println!("AEGIS simulate — idle E5 reclamation vs. audit-log retention\n");
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
