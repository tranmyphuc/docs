# Security Policy

AEGIS is a security tool; we hold ourselves to a high bar.

- **Report privately:** open a GitHub Security Advisory (Security → Report a vulnerability) or email the maintainers. Do not file public issues for vulnerabilities.
- **Scope:** the arbitration kernel, sandbox capability layer, connectors, and CLI.
- **Design stance:** tool execution is deny-by-default; the sandbox must never silently fall back to an unsandboxed interpreter (cf. CVE-2026-2275).
