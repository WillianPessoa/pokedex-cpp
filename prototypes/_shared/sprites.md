# Prototype Sprite Strategy

> Phase 4 prototypes are throwaway. The production app (Sprint 1+, C++/QML) bundles sprites per ADR 0002.

## Decision

Prototypes reference Pokémon sprites from PokéAPI's public sprite repository on GitHub:

```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png
```

`{id}` is the national Pokédex number (e.g. `25` for Pikachu).

## Why this works for prototypes

- No download/build pipeline needed — paste URL, see sprite.
- Allows the prototype to look real to reviewers in Phase 5 testing.
- Cross-browser tested.
- Free.

## Why this is NOT acceptable for production

- Depends on GitHub uptime and PokéAPI's repo policy.
- No offline support.
- No cache eviction strategy.
- Tied to whatever PokéAPI publishes (no shiny / no animated for some Pokémon).

Production uses the bundled-catalog approach in [docs/adr/0002-data-strategy.md](../../docs/adr/0002-data-strategy.md) and the `SpriteCache` module in PRD #1.

## Sample Pokémon used across prototype mockups

The 10 Pokémon below provide enough visual variety (single-type / dual-type / colors) without requiring a full Gen 1–9 dataset.

| ID  | Name       | Types               | Sprite URL                                                                            |
| --- | ---------- | ------------------- | ------------------------------------------------------------------------------------- |
| 1   | Bulbasaur  | Grass, Poison       | https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png        |
| 4   | Charmander | Fire                | https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png        |
| 7   | Squirtle   | Water               | https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png        |
| 16  | Pidgey     | Normal, Flying      | https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png       |
| 19  | Rattata    | Normal              | https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png       |
| 25  | Pikachu    | Electric            | https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png       |
| 74  | Geodude    | Rock, Ground        | https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png       |
| 95  | Onix       | Rock, Ground        | https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png       |
| 129 | Magikarp   | Water               | https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png      |
| 133 | Eevee      | Normal              | https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png      |

For higher-resolution artwork, swap `sprites/pokemon/{id}.png` with `sprites/pokemon/other/official-artwork/{id}.png` (≈475×475).

## HTML pattern

Always include `loading="lazy"` and an `alt` text. Examples:

```html
<img
  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  alt="Pikachu"
  loading="lazy"
  width="96"
  height="96"
/>
```

For decorative use (where a label already names the Pokémon), use `alt=""` and `aria-hidden="true"`:

```html
<img
  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  alt=""
  aria-hidden="true"
  loading="lazy"
/>
```

## Offline fallback

CSS provides a placeholder fill while the image loads or fails:

```css
.sprite {
  width: 96px;
  height: 96px;
  background-color: var(--color-bg-tertiary);
  border-radius: var(--border-radius-md);
}
.sprite img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
```

If the user is offline, the `<img>` will fail silently and the background-colored container remains visible — preferable to a broken-image icon.
