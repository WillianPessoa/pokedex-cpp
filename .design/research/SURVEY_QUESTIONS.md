# Formulário de Pesquisa — Personas do Nuzlocke

## Objetivo

Mapear quem são os jogadores de Pokémon em relação ao Nuzlocke: desde quem nunca ouviu falar até quem completa runs com frequência. O formulário tem fluxo condicional — cada perfil vê apenas as perguntas relevantes para sua experiência.

---

## Fluxo geral

```
[Q0] Você joga Pokémon?
├── Não → encerra
└── Sim
    └── [Q1] Você já ouviu falar em Nuzlocke?
        ├── Nunca ouvi falar       → Bloco A + Bloco B + Bloco C + encerra
        ├── Ouvi mas nunca tentei  → Bloco A + Bloco B + Bloco C + Bloco F + encerra
        ├── Tentei mas não completei → Bloco A + B + C + D + E + G + encerra
        └── Completei pelo menos uma run → Bloco A + B + C + D + E + H + encerra
```

---

## Perguntas de triagem

### Q0 — Porta de entrada
**Você joga ou já jogou Pokémon?**
- Sim, jogo atualmente
- Já joguei, mas faz tempo que não jogo
- Não, nunca joguei
> *Se "Não": encerra o formulário.*

### Q1 — Ramificação principal
**Qual das opções melhor descreve sua relação com o Nuzlocke?**
- Nunca ouvi falar em Nuzlocke
- Já ouvi falar, mas nunca tentei
- Já tentei, mas nunca completei uma run
- Já completei pelo menos uma run

---

## Bloco A — Demografia
*Aplicável a todos os perfis*

**A1. Qual é a sua faixa etária?**
- Menos de 13 anos
- 13–17 anos
- 18–24 anos
- 25–34 anos
- 35–44 anos
- 45 anos ou mais
> *Traz: segmentação geracional — permite cruzar com quando começou no Pokémon*

**A2. Quando você começou a jogar Pokémon?**
- Antes de 2000 — Geração 1 (Red, Blue, Yellow)
- 2000–2005 — Geração 2–3 (Gold, Silver, Ruby, Emerald)
- 2006–2010 — Geração 4–5 (Diamond, Pearl, Black, White)
- 2011–2016 — Geração 6–7 (X, Y, Sun, Moon)
- 2017–2022 — Geração 8 (Sword, Shield)
- 2023 em diante — Geração 9 (Scarlet, Violet)
- Não lembro ao certo
> *Traz: geração de entrada na franquia — revela se o Nuzlocke é nostalgia ou descoberta recente*

---

## Bloco B — Dispositivos
*Aplicável a todos os perfis*

**B1. Em quais dispositivos você costuma jogar Pokémon atualmente?** *(múltipla escolha)*
- Celular (Pokémon Go, Masters, emulador Android/iOS)
- Emulador no computador (PC ou Mac)
- Nintendo Switch
- Nintendo 3DS / 2DS
- Game Boy Advance / DS (cartucho original)
- Outro: ________
> *Traz: plataforma dominante — impacta quais jogos e versões de Nuzlocke são viáveis*

**B2. Em qual dispositivo você geralmente faz seus Nuzlockes?** *(escolha única)*
- Celular (emulador)
- Emulador no computador
- Nintendo Switch
- Nintendo 3DS / 2DS
- Game Boy Advance / DS (cartucho original)
- Outro: ________
> *Aplicável apenas a: tentou ou completou Nuzlocke*
> *Traz: distingue onde jogam Pokémon no geral de onde fazem o desafio especificamente*

**B3. Você joga ou já jogou algum ROM hack de Pokémon?**
- Não, nunca joguei ROM hack
- Sim, mas prefiro os jogos oficiais
- Jogo os dois igualmente
- Prefiro ROM hacks
> *Aplicável a: todos os perfis*
> *Traz: penetração dos ROM hacks no público geral de Pokémon — permite cruzar com quem faz Nuzlocke*

**B4. Quais ROM hacks você já usou?** *(múltipla escolha)*
- Radical Red
- Pokémon Unbound
- Emerald Kaizo
- Renegade Platinum
- Blaze Black / Volt White
- Pokémon Gaia
- Pokémon Glazed
- Pokémon Insurgence
- Outro: ________
> *Aplicável a: quem respondeu que joga ROM hacks em B3*
> *Traz: quais títulos têm mais tração — útil para entender o ecossistema*

---

## Bloco C — Frequência
*Aplicável a todos os perfis*

**C1. Com que frequência você joga Pokémon atualmente?**
- Todo dia
- Algumas vezes por semana
- Algumas vezes por mês
- Raramente
- Só jogo quando estou numa run de Nuzlocke
> *Traz: jogador ativo vs. ocasional — o Nuzlocke pode ser o próprio gatilho de engajamento*

**C2. Quando você está numa run de Nuzlocke, quanto tempo por sessão costuma jogar?**
- Menos de 30 minutos
- 30 minutos – 1 hora
- 1 hora – 2 horas
- Mais de 2 horas
- Depende muito do momento da run
> *Aplicável apenas a: tentou ou completou Nuzlocke*
> *Traz: intensidade de sessão — ajuda a entender o ritmo de engajamento*

---

## Bloco D — Motivação e estilo
*Aplicável apenas a: tentou ou completou Nuzlocke*

**D1. O que te motivou a tentar um Nuzlocke pela primeira vez?**
- Vi alguém jogando (stream ou YouTube)
- Queria mais desafio no Pokémon
- Recomendação de amigo
- Curiosidade sobre as regras
- Queria reviver um jogo antigo de forma nova
- Outro: ________
> *Traz: canal de aquisição e gatilho inicial*

**D2. O que te faz continuar jogando Nuzlockes?** *(múltipla escolha)*
- A tensão de não poder perder
- O vínculo com os Pokémons
- A sensação de conquista ao terminar
- É uma forma de rejogabilidade
- Compartilhar a experiência com outros
- Outro: ________
> *Traz: loop de retenção — o que mantém engajado*

**D3. Você usa regras extras além das básicas (permadeath + first encounter)?**
- Não, só as regras básicas
- Sim, adiciono algumas regras próprias
- Sim, crio meus próprios rulesets
- Uso rulesets prontos de terceiros
> *Traz: perfil de customização — casual vs. hardcore*

**D4. Como você reage quando perde um Pokémon importante?**
- Reinicio a run do zero
- Fico chateado mas continuo
- Encaro como parte natural do jogo
- Arquivo a save e começo uma nova run
> *Traz: tolerância à perda — diferencia quem joga pelo desafio de quem joga pelo apego emocional*

**D5. Você nomeia todos os seus Pokémons nas runs?**
- Sempre
- Às vezes, só os favoritos
- Raramente
- Nunca
> *Traz: nível de apego emocional à regra de nickname*

---

## Bloco E — Compartilhamento e conteúdos auxiliares
*Aplicável apenas a: tentou ou completou Nuzlocke*

**E1. Você costuma registrar ou compartilhar o progresso das suas runs?** *(múltipla escolha)*
- Não costumo registrar
- Anoto pra mim mesmo (caderno, planilha, bloco de notas)
- Compartilho com amigos pelo WhatsApp ou Telegram
- Posto em grupos do Facebook
- Posto no Reddit (r/nuzlocke ou similares)
- Compartilho no Instagram, TikTok ou Twitter/X
- Faço stream ou gravo vídeos
- Outro: ________
> *Traz: perfil de compartilhamento e canais usados — onde a comunidade vive*

**E2. Você usa algum conteúdo de apoio durante suas runs?** *(múltipla escolha)*
- Não costumo usar nada externo
- Universidade Nuzlocke (guias de tier por geração)
- Bulbapedia (dados gerais de Pokémon)
- Serebii (dados e localizações)
- Smogon (análises aplicadas ao Nuzlocke)
- Calculadora de dano
- Guias no YouTube
- Tier lists específicas de Nuzlocke
- Grupos no Discord com dicas
- Outro: ________
> *Traz: nível de preparação estratégica e quais recursos têm mais penetração*

**E3. Com que frequência você consulta esses materiais durante uma run?**
- Raramente, só quando trava em algo
- Às vezes, para confirmar alguma informação
- Frequentemente, me preparo antes de cada área
- Sempre, pesquiso tudo antes de tomar uma decisão
> *Traz: estilo de decisão — improvisa vs. planeja*

---

## Bloco F — Barreira de entrada
*Aplicável apenas a: conhece mas nunca tentou*

**F1. Por que você ainda não tentou um Nuzlocke?** *(múltipla escolha)*
- Parece difícil demais
- Não quero me apegar aos Pokémons e os perder
- Nunca tive tempo
- Não achei que seria divertido
- Pretendo tentar em breve
- Não conheço bem as regras
- Outro: ________
> *Traz: barreiras de entrada — o que impede a conversão de jogadores de Pokémon em jogadores de Nuzlocke*

---

## Bloco G — Abandono de run
*Aplicável apenas a: tentou mas nunca completou*

**G1. O que geralmente te faz abandonar uma run?**
- Perdi um Pokémon muito importante e não quis continuar
- A run ficou difícil demais
- Perdi o interesse no jogo
- Comecei uma nova run em outro jogo
- Vida real (falta de tempo)
- Outro: ________
> *Traz: pontos de abandono — onde a experiência quebra*

---

## Bloco H — Conclusão de run
*Aplicável apenas a: completou pelo menos uma run*

**H1. Você já postou seu Hall da Fama ou registro de conclusão em algum lugar?**
- Sim, costumo postar
- Já postei, mas raramente
- Não posto, mas guardo pra mim
- Nunca pensei em registrar
> *Traz: comportamento de celebração — o Hall da Fama é um ritual no Nuzlocke*

**H2. Você tem algum Pokémon perdido numa run que ainda lembra hoje?**
- Campo aberto para contar a história
> *Traz: dado qualitativo rico — memórias marcantes revelam o que gera valor emocional na experiência*

---

## Resumo dos perfis e blocos

| Perfil | Blocos |
|---|---|
| Joga Pokémon, nunca ouviu falar em Nuzlocke | A, B (B1 + B3 + B4 cond.), C (só C1) |
| Conhece Nuzlocke, mas nunca tentou | A, B (B1 + B3 + B4 cond.), C (só C1), F |
| Tentou Nuzlocke, mas nunca completou | A, B, C, D, E, G |
| Completou pelo menos uma run | A, B, C, D, E, H |

> B4 é condicional em todos os perfis: aparece somente se B3 indicar uso de ROM hacks.
> B2 (dispositivo específico para Nuzlocke) aparece apenas para quem tentou ou completou.

---

## Contagem de perguntas por perfil

| Perfil | Nº de perguntas |
|---|---|
| Nunca ouviu falar | 6–7 |
| Conhece mas nunca tentou | 9–10 |
| Tentou mas não completou | 18–19 |
| Completou pelo menos uma run | 19–20 |
