.PHONY: build test demo up down lint fmt
build:    ; cargo build --workspace
test:     ; cargo test --workspace
lint:     ; cargo clippy --workspace -- -D warnings
fmt:      ; cargo fmt --all
demo:     ; cargo run -p aegis-cli -- simulate
up:       ; docker compose up -d
down:     ; docker compose down
