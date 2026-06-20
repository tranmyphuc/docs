//! Connectors + agents: turn raw posture/usage data into the kernel's currency
//! (obligations and proposals). v0.1 reads CSV fixtures so everything builds and
//! tests offline; the data *shapes* mirror Microsoft Graph and Prowler.

pub mod agents;
pub mod m365;
pub mod prowler;

pub use agents::{compliance_obligations, finops_proposals};
pub use m365::IdleSeat;
pub use prowler::Finding;
