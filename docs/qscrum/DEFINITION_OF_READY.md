# Definition of Ready (DoR)

> Every issue must meet these criteria **before** entering a sprint.

An issue is ready to be pulled when:

- [ ] **Imperative title** + one sentence of context in the body
- [ ] **User story** or JTBD: `As a <persona>, I want <goal>, so that <benefit>` or `When <situation>, I want <motivation>, so I can <outcome>`
- [ ] **Verifiable acceptance criteria** in Given/When/Then form (or a binary checklist)
- [ ] **Linked to brief / IA / persona** when applicable (link to a section of `DESIGN_BRIEF.md` or `INFORMATION_ARCHITECTURE.md`)
- [ ] **Relative estimate**: S (≤2h), M (half day), L (1 day), XL (>1 day — split it)
- [ ] **Dependencies mapped** (link to blocking issues) or explicitly marked as having none
- [ ] **Definition of Done** referenced (link to [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md))

## Anti-patterns (issue is NOT ready when):

- Vague acceptance criterion ("works well", "looks nice") — rewrite in verifiable terms
- XL with no breakdown — split into vertical slices
- No link to brief/IA — means rationale isn't clear
