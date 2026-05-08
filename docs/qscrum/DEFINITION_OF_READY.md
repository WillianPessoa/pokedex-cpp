# Definition of Ready (DoR)

> Toda issue precisa atender estes critérios **antes** de entrar em sprint.

Uma issue está pronta para ser puxada quando:

- [ ] **Título imperativo** + 1 frase de contexto no corpo
- [ ] **User story** ou JTBD: `Como <persona>, quero <objetivo>, para <benefício>` ou `Quando <situação>, eu quero <motivação>, para <resultado>`
- [ ] **Critérios de aceite verificáveis** em formato Given/When/Then (ou checklist binário)
- [ ] **Ligação com brief / IA / persona aplicável** (link para seção do `DESIGN_BRIEF.md` ou `INFORMATION_ARCHITECTURE.md`)
- [ ] **Estimativa relativa**: P (≤2h), M (meio dia), G (1 dia), GG (>1 dia — quebrar)
- [ ] **Dependências mapeadas** (link para issues bloqueadoras) ou marcadas explicitamente como sem dependências
- [ ] **Definition of Done** referenciado (link para [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md))

## Anti-padrões (issue NÃO está ready se):

- Critério de aceite vago ("funcionar bem", "ficar bonito") — refazer em termos verificáveis
- Tamanho GG sem quebra — quebrar em vertical slices
- Nenhum link para brief/IA — significa que a justificativa não está clara
