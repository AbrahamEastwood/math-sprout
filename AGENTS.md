# Repository guidance

Before making a change that affects application structure, data flow, persistence, runtime dependencies, or deployment, read [`docs/architecture.md`](docs/architecture.md).

If a requested change appears to require departing from the documented architecture, stop before implementing that departure. Explain the proposed change, why it is needed, and its main tradeoffs, then ask the user whether it is allowed. Proceed with the architectural change only after the user confirms. If approved, update `docs/architecture.md` in the same change to describe the resulting implementation.

Keep the architecture document aligned with other material architectural changes as well. Do not mechanically rewrite it for every release or routine UI change; describe verified implementation, not planned or inferred behavior.
