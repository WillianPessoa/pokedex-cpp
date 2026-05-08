# Definition of Done (DoD)

> Every issue must meet these criteria **before** it's closed.

An issue is done when:

- [ ] **All acceptance criteria** (from DoR) are green
- [ ] **Code reviewed** — self-review with checklist; peer-reviewed when someone is available
- [ ] **Tests** when applicable: at least one test per code feature (unit/integration/UI as appropriate)
- [ ] **Documentation updated**:
  - `CONTEXT.md` if new vocabulary was introduced
  - ADR in `docs/adr/` for any architectural decision
  - `QML_PORT_NOTES.md` if the HTML↔QML bridge was touched
- [ ] **Clean build** — no new warnings
- [ ] **Issue closed via PR/commit**, not manually — preserves traceability

## Anti-patterns (issue is NOT done when):

- "Works on my machine" with no reproducible test
- Acceptance criterion written in non-verifiable terms was checked off without evidence
- Documentation deferred to "later"
- New warnings suppressed without an ADR justifying it
