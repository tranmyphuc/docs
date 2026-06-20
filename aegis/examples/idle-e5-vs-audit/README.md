# Example: idle E5 reclamation vs. audit-log retention

200 idle Microsoft 365 E5 seats are detected. 40 belong to a regulated cohort
that ISO 27001:2022 **A.8.15 (Logging)** requires to retain E5-tier audit logging.

```bash
cargo run -p aegis-cli -- simulate
```

AEGIS recommends reclaiming the 160 general seats ($9,120/mo) and **vetoes** the 40
regulated seats — surfacing exactly which control blocked the cheaper plan and the
$2,280/mo deliberately forfeited for compliance.

This is the whole thesis in one command: cost and security, arbitrated as one decision.
