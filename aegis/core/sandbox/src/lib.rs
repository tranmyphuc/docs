//! Deny-by-default tool execution sandbox.
//!
//! Tier-1 (WASM/Wasmtime + WASI capabilities) and Tier-2 (Firecracker microVM
//! / gVisor) backends land in v0.2. v0.1 defines the capability-grant surface
//! so every tool call must declare exactly what it may touch — closing the
//! "silent fallback to an unsandboxed interpreter" CVE class (cf. CVE-2026-2275).

/// A capability a tool must be explicitly granted. Absence == denied.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Capability {
    ReadPath(String),
    WritePath(String),
    NetEgress(String),
    EnvVar(String),
}

/// An explicit grant for a single tool invocation.
#[derive(Debug, Default, Clone)]
pub struct Grant {
    pub allowed: Vec<Capability>,
}

impl Grant {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn allow(mut self, cap: Capability) -> Self {
        self.allowed.push(cap);
        self
    }

    /// Deny-by-default check: a capability is permitted only if explicitly granted.
    pub fn permits(&self, cap: &Capability) -> bool {
        self.allowed.contains(cap)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn deny_by_default() {
        let grant = Grant::new().allow(Capability::ReadPath("/fixtures".into()));
        assert!(grant.permits(&Capability::ReadPath("/fixtures".into())));
        assert!(!grant.permits(&Capability::NetEgress("169.254.169.254".into())));
        assert!(!grant.permits(&Capability::WritePath("/etc".into())));
    }
}
