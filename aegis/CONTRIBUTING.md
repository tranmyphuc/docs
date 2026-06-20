# Contributing to AEGIS

Thanks for helping build the security-vs-cost arbitration layer.

## Dev loop
```bash
make build && make test && make lint && make demo
```
- The arbitration kernel (`core/kernel`) must stay **dependency-free and offline-buildable**.
- Every PR keeps `cargo test --workspace` and `cargo clippy -- -D warnings` green.
- New behavior ships with a test. New tool calls ship with an explicit capability grant.

## Where to start
See the [build loop ledger](research/aegis-build-loop.md) and issues labeled `good first issue`.
