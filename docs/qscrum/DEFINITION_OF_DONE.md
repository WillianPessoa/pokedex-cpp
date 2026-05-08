# Definition of Done (DoD)

> Toda issue precisa atender estes critérios **antes de ser fechada**.

Uma issue está done quando:

- [ ] **Todos os critérios de aceite** (DoR) verdes
- [ ] **Código revisto** — auto-revisão com checklist; pares quando houver alguém disponível
- [ ] **Testes** quando aplicável: ao menos um teste por feature de código (unit/integration/UI conforme natureza)
- [ ] **Documentação atualizada**:
  - `CONTEXT.md` se introduziu vocabulário novo
  - ADR em `docs/adr/` se decisão arquitetural
  - `QML_PORT_NOTES.md` se mexeu na ponte HTML↔QML
- [ ] **Build limpo** — sem warnings novos
- [ ] **Issue fechada via PR/commit**, não manualmente — rastreabilidade

## Anti-padrões (issue NÃO está done se):

- "Funciona na minha máquina" sem teste reproduzível
- Critério de aceite escrito em termos não-verificáveis foi marcado como atendido sem evidência
- Documentação adiada para "depois"
- Warnings novos suprimidos sem ADR justificando
