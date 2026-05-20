/* global React, ReactDOM, PokedexData */
const { useState, useEffect, useMemo, useRef, useCallback } = React;
const D = window.PokedexData;
const { TYPES, TYPE_LABEL, HABITAT, SPRITE, ART, POKEMON, POKEMON_BY_ID, MOVES, ROUTES, CITIES, MAP_REGIONS, EVOLUTION_LINES, UI, STAT_LABEL, effectivenessFor, offensiveMultiplier } = D;

// ───────────────────────────────────────────────────────── Utils
const cls = (...xs) => xs.filter(Boolean).join(' ');
const pad = (n) => String(n).padStart(4, '0');
const bst = (s) => s.reduce((a,b)=>a+b,0);
const STAT_MAX = 200;

// ───────────────────────────────────────────────────────── Type badge
function TypeBadge({ type, lang, size='sm' }) {
  return (
    <span className={cls('tbadge', `tbadge--${type}`, size==='lg' && 'tbadge--lg', size==='xs' && 'tbadge--xs')}>
      <i className={`tdot tdot--${type}`} aria-hidden="true"></i>
      {TYPE_LABEL[lang][type]}
    </span>
  );
}

// ───────────────────────────────────────────────────────── Sprite
function Sprite({ id, art=false, size=64, alt='' }) {
  const [err, setErr] = useState(false);
  const url = art ? ART(id) : SPRITE(id);
  return (
    <div className="sprite" style={{ width:size, height:size }}>
      {err ? <div className="sprite__fallback">#{pad(id)}</div>
           : <img src={url} alt={alt} loading="lazy" onError={()=>setErr(true)} />}
    </div>
  );
}

// ───────────────────────────────────────────────────────── App shell
function Shell({ lang, theme, route, setRoute, onCmd, onToggleTheme, onToggleLang, t }) {
  const navItems = [
    { id:'routes',    label:t.routes,    icon:'M3 12 12 4l9 8M5 11v9h14v-9' },
    { id:'pokemon',   label:t.pokemon,   icon:'M3 12h18M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z' },
    { id:'team',      label:t.team,      icon:'M4 7h4v10H4zM10 7h4v10h-4zM16 7h4v10h-4z' },
    { id:'compare',   label:t.compare,   icon:'M3 6h7v12H3zM14 6h7v12h-7z' },
    { id:'favorites', label:t.favorites, icon:'M12 3l2.7 6 6.6.6-5 4.5 1.5 6.5L12 17l-5.8 3.6L7.7 14 2.7 9.6l6.6-.6z' },
  ];
  const active = route.screen;
  return (
    <div className={cls('shell', `shell--${theme}`)}>
      <aside className="shell__rail">
        <div className="shell__brand">
          <span className="shell__brand__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.4"/><line x1="2" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1.4"/><circle cx="16" cy="16" r="4.5" fill="var(--bg-1)" stroke="currentColor" strokeWidth="1.4"/></svg>
          </span>
          <div className="shell__brand__txt">
            <em>{t.catalogTitle}</em>
            <span>{t.catalogSub}</span>
          </div>
        </div>

        <button className="shell__cmdbtn" onClick={onCmd} aria-label="Open command palette">
          <span className="shell__cmdbtn__ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="6.5"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>
          </span>
          <span className="shell__cmdbtn__lbl">{t.search}</span>
          <kbd className="shell__cmdbtn__kbd">⌘K</kbd>
        </button>

        <nav className="shell__nav">
          {navItems.map(n => (
            <button key={n.id}
              className={cls('shell__nav__item', active===n.id && 'is-active')}
              onClick={() => setRoute({ screen:n.id })}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d={n.icon}/></svg>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        <div className="shell__game">
          <span className="shell__game__lbl">{t.activeGame}</span>
          <span className="shell__game__name">FireRed</span>
          <button className="shell__game__change">{t.change}</button>
        </div>

        <div className="shell__foot">
          <button className="shell__chip" onClick={onToggleTheme} aria-label={t.theme}>
            {theme==='dark' ? '☾' : '☀'} <span>{theme==='dark' ? t.dark : t.light}</span>
          </button>
          <button className="shell__chip" onClick={onToggleLang} aria-label={t.language}>
            <span className="shell__chip__lang">{lang==='en'?'EN':'PT'}</span>
          </button>
        </div>
      </aside>

      <BottomNav items={navItems} active={active} setRoute={setRoute} onCmd={onCmd} />
    </div>
  );
}

function BottomNav({ items, active, setRoute, onCmd }) {
  return (
    <nav className="bottomnav">
      {items.slice(0,2).map(n => (
        <button key={n.id} className={cls('bottomnav__item', active===n.id && 'is-active')} onClick={()=>setRoute({screen:n.id})}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d={n.icon}/></svg>
          <span>{n.label}</span>
        </button>
      ))}
      <button className="bottomnav__item bottomnav__cmd" onClick={onCmd}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="6.5"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>
      </button>
      {items.slice(2).map(n => (
        <button key={n.id} className={cls('bottomnav__item', active===n.id && 'is-active')} onClick={()=>setRoute({screen:n.id})}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d={n.icon}/></svg>
          <span>{n.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ───────────────────────────────────────────────────────── Routes screen
function RoutesScreen({ t, lang, setRoute }) {
  const [view, setView] = useState('map'); // map | list
  return (
    <div className="page">
      <div className="page__head">
        <div className="page__head__crumbs">
          <span className="num">01</span>
          <span>{t.routes} · Kanto</span>
        </div>
        <h1 className="page__title">
          <em>Atlas</em><span> of encounters</span>
          <small>{ROUTES.length} {t.routes.toLowerCase()} · FireRed</small>
        </h1>
        <div className="seg">
          <button className={cls('seg__btn', view==='map'&&'is-on')} onClick={()=>setView('map')}>◐ {t.viewMap}</button>
          <button className={cls('seg__btn', view==='list'&&'is-on')} onClick={()=>setView('list')}>≡ {t.viewList}</button>
        </div>
      </div>

      {view==='map' ? <KantoMap t={t} lang={lang} setRoute={setRoute}/> : <RoutesList t={t} lang={lang} setRoute={setRoute}/>}
    </div>
  );
}

function KantoMap({ t, lang, setRoute }) {
  const [hover, setHover] = useState(null);
  const allNodes = [...ROUTES, ...CITIES.map(c => ({...c, isCity:true}))];
  const edges = [];
  ROUTES.forEach(r => (r.neighbors||[]).forEach(nb => {
    const n = allNodes.find(x=>x.id===nb);
    if (n) edges.push([r,n]);
  }));
  const terrainColor = {
    grassland:'var(--terrain-grassland)', forest:'var(--terrain-forest)', water:'var(--terrain-water)',
    cave:'var(--terrain-cave)', mountain:'var(--terrain-mountain)', urban:'var(--terrain-urban)',
    rare:'var(--terrain-cave)'
  };
  const hovered = hover ? ROUTES.find(r=>r.id===hover) : null;

  return (
    <div className="map">
      <div className="map__frame">
        <svg viewBox="0 0 100 100" className="map__svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="gridp" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M5 0H0V5" stroke="var(--border-2)" strokeWidth="0.15" fill="none"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#gridp)"/>
          {/* terrain regions painted under nodes */}
          <g className="map__terrain">
            {MAP_REGIONS.map(r => (
              <path key={r.id} d={r.d} fill={terrainColor[r.terrain]} opacity="0.55"
                stroke="var(--ink-1)" strokeWidth="0.12" strokeOpacity="0.18"/>
            ))}
          </g>
          {/* compass */}
          <g transform="translate(92 8)" opacity="0.55">
            <circle r="3.5" fill="none" stroke="currentColor" strokeWidth="0.2"/>
            <text textAnchor="middle" y="-1.5" fontSize="2" fill="currentColor">N</text>
          </g>
          {/* edges */}
          {edges.map(([a,b],i)=>(
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="var(--ink-3)" strokeWidth="0.3" strokeDasharray="0.8 0.6" opacity="0.55"/>
          ))}
          {/* cities */}
          {CITIES.map(c => (
            <g key={c.id} transform={`translate(${c.x} ${c.y})`}>
              <rect x="-1.4" y="-1.4" width="2.8" height="2.8" fill="var(--bg-1)" stroke="var(--ink-1)" strokeWidth="0.25"/>
              <text y="-2.4" fontSize="1.7" textAnchor="middle" fill="var(--ink-2)" fontStyle="italic">{c.name}</text>
            </g>
          ))}
          {/* routes */}
          {ROUTES.map(r => (
            <g key={r.id} className={cls('map__node', hover===r.id && 'is-hover')}
               transform={`translate(${r.x} ${r.y})`}
               onMouseEnter={()=>setHover(r.id)} onMouseLeave={()=>setHover(null)}
               onClick={()=>setRoute({screen:'routeDetail', id:r.id})}
               style={{cursor:'pointer'}}>
              <circle r="3.2" fill={terrainColor[r.terrain]} stroke="var(--ink-1)" strokeWidth="0.3"/>
              <circle r="1.4" fill="var(--bg-1)" stroke="var(--ink-1)" strokeWidth="0.2"/>
              <text y="0.6" fontSize="1.6" textAnchor="middle" fontWeight="700" fill="var(--ink-1)">{r.encounters.length}</text>
              <text y={r.y > 70 ? 6 : -4.2} fontSize="2" textAnchor="middle" fontWeight="600" fill="var(--ink-1)">{r.name}</text>
            </g>
          ))}
        </svg>
      </div>
      <aside className="map__inspector">
        <div className="map__inspector__head">
          <span className="cap">{hovered ? hovered.region : 'Kanto'}</span>
          <h2><em>{hovered ? hovered.name : 'Hover a node'}</em></h2>
          {hovered && <span className="cap cap--terrain">{hovered.terrain}</span>}
        </div>
        {hovered ? (
          <>
            <div className="map__inspector__count">
              <span className="num">{hovered.encounters.length}</span>
              <span>{t.distinct}</span>
            </div>
            <ul className="map__inspector__list">
              {hovered.encounters.map((e,i) => {
                const p = POKEMON_BY_ID[e.pid];
                return (
                  <li key={i}>
                    <Sprite id={e.pid} size={28}/>
                    <span className="m-name">{p?.name || `#${e.pid}`}</span>
                    <span className="m-rate num">{e.rate}%</span>
                  </li>
                );
              })}
            </ul>
            <button className="btn btn--primary" onClick={()=>setRoute({screen:'routeDetail',id:hovered.id})}>Open route →</button>
          </>
        ) : (
          <p className="map__inspector__hint">{lang==='pt' ? 'Passe o mouse sobre um nó da rota para ver os encontros.' : 'Hover a route node to peek encounters. Click to open.'}</p>
        )}
        <div className="map__legend">
          {Object.entries(terrainColor).map(([k,v])=>(
            <div key={k} className="map__legend__item">
              <i style={{background:v}}/><span>{k}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function RoutesList({ t, lang, setRoute }) {
  return (
    <div className="rlist">
      {ROUTES.map(r => {
        const types = [...new Set(r.encounters.flatMap(e => POKEMON_BY_ID[e.pid]?.types || []))];
        return (
          <button key={r.id} className="rcard" onClick={()=>setRoute({screen:'routeDetail',id:r.id})}>
            <div className="rcard__num">№{r.id.replace(/\D/g,'').padStart(2,'0') || '··'}</div>
            <div className="rcard__body">
              <div className="rcard__head">
                <h3><em>{r.name}</em></h3>
                <span className="cap">{r.terrain}</span>
              </div>
              <div className="rcard__sprites">
                {r.encounters.slice(0,5).map((e,i)=> <Sprite key={i} id={e.pid} size={36}/>)}
              </div>
              <div className="rcard__types">
                {types.slice(0,4).map(ty => <TypeBadge key={ty} type={ty} lang={lang} size="xs"/>)}
              </div>
            </div>
            <div className="rcard__meta">
              <span className="num">{r.encounters.length}</span>
              <span>{t.distinct}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────── Route detail
function RouteDetailScreen({ id, t, lang, setRoute }) {
  const route = ROUTES.find(r => r.id === id);
  const [firstOnly, setFirstOnly] = useState(false);
  const [hideCaught, setHideCaught] = useState(false);
  if (!route) return <div className="page">Not found</div>;
  let list = [...route.encounters].sort((a,b)=>b.rate-a.rate);
  if (firstOnly) list = list.slice(0,1);
  return (
    <div className="page">
      <button className="page__back" onClick={()=>setRoute({screen:'routes'})}>← {t.routes}</button>
      <div className="page__head">
        <div className="page__head__crumbs"><span className="num">{(ROUTES.indexOf(route)+1).toString().padStart(2,'0')}</span><span>{route.region} · {route.terrain}</span></div>
        <h1 className="page__title"><em>{route.name}</em><small>{route.encounters.length} {t.encounters} · FireRed</small></h1>
      </div>
      <div className="filters-row">
        <Toggle on={firstOnly} setOn={setFirstOnly} label={t.firstOnly}/>
        <Toggle on={hideCaught} setOn={setHideCaught} label={t.hideCaught}/>
      </div>
      <ol className="enclist">
        {list.map((e,i) => {
          const p = POKEMON_BY_ID[e.pid] || { name:`#${e.pid}`, types:[] };
          return (
            <li key={i} className="enc" onClick={()=>setRoute({screen:'mon',id:e.pid})}>
              <span className="enc__rank num">{i+1}</span>
              <Sprite id={e.pid} size={64}/>
              <div className="enc__body">
                <div className="enc__name">{p.name}</div>
                <div className="enc__meta">
                  <span className="cap">{e.method}</span>
                  <span className="dot"/>
                  <span className="num">Lv {e.lvl[0]}–{e.lvl[1]}</span>
                </div>
                <div className="enc__types">{p.types.map(ty => <TypeBadge key={ty} type={ty} lang={lang} size="xs"/>)}</div>
              </div>
              <div className="enc__rate">
                <span className="num">{e.rate}</span><span className="enc__rate__pct">%</span>
                <div className="enc__bar"><span style={{width:`${e.rate}%`}}/></div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Toggle({ on, setOn, label }) {
  return (
    <button className={cls('tog', on && 'is-on')} aria-pressed={on} onClick={()=>setOn(!on)}>
      <span className="tog__box">{on && <span className="tog__check">✓</span>}</span>
      <span>{label}</span>
    </button>
  );
}

// ───────────────────────────────────────────────────────── Pokémon browser
function PokemonScreen({ t, lang, setRoute, compare, setCompare }) {
  const [activeTypes, setActiveTypes] = useState([]);
  const [minBst, setMinBst] = useState(0);
  const [maxBst, setMaxBst] = useState(700);
  const [habitat, setHabitat] = useState('all');
  const [query, setQuery] = useState('');
  const [hoverId, setHoverId] = useState(null);
  const [layout, setLayout] = useState('grid'); // grid | gallery

  const filtered = useMemo(() => POKEMON.filter(p => {
    if (activeTypes.length && !activeTypes.some(ty => p.types.includes(ty))) return false;
    const total = bst(p.stats);
    if (total < minBst || total > maxBst) return false;
    if (habitat !== 'all' && p.habitat !== habitat) return false;
    if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && String(p.id) !== query) return false;
    return true;
  }), [activeTypes, minBst, maxBst, habitat, query]);

  const hovered = hoverId ? POKEMON_BY_ID[hoverId] : null;

  return (
    <div className="page">
      <div className="page__head">
        <div className="page__head__crumbs"><span className="num">02</span><span>{t.pokemon} · Gen 1</span></div>
        <h1 className="page__title"><em>Bestiary</em><small>{filtered.length} / {POKEMON.length} entries</small></h1>
      </div>

      <div className="bestiary">
        <aside className="bestiary__filters">
          <div className="filter-block">
            <label className="filter-block__lbl">{t.search}</label>
            <input className="filter-block__input" placeholder="Pikachu / 025…" value={query} onChange={e=>setQuery(e.target.value)}/>
          </div>
          <div className="filter-block">
            <label className="filter-block__lbl">{t.filterByType}</label>
            <div className="filter-block__chips">
              {TYPES.map(ty => (
                <button key={ty} className={cls('tchip', `tchip--${ty}`, activeTypes.includes(ty) && 'is-on')}
                  onClick={()=>setActiveTypes(a => a.includes(ty) ? a.filter(x=>x!==ty) : [...a,ty])}>
                  <i className={`tdot tdot--${ty}`}/>{TYPE_LABEL[lang][ty]}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-block">
            <label className="filter-block__lbl">{t.filterByStat} (BST)</label>
            <div className="rangepair">
              <RangeInput v={minBst} setV={setMinBst} min={0} max={700} step={10} label={t.minBst}/>
              <RangeInput v={maxBst} setV={setMaxBst} min={0} max={700} step={10} label={t.maxBst}/>
            </div>
            <div className="rangetrack">
              <span style={{left:`${(minBst/700)*100}%`, right:`${100-(maxBst/700)*100}%`}}/>
            </div>
          </div>
          <div className="filter-block">
            <label className="filter-block__lbl">{t.filterByHabitat}</label>
            <select className="filter-block__select" value={habitat} onChange={e=>setHabitat(e.target.value)}>
              <option value="all">{t.filterAll}</option>
              {Object.entries(HABITAT[lang]).map(([k,v])=> <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="filter-block">
            <label className="filter-block__lbl">Layout</label>
            <div className="seg seg--sm">
              <button className={cls('seg__btn', layout==='grid'&&'is-on')} onClick={()=>setLayout('grid')}>▦ Grid</button>
              <button className={cls('seg__btn', layout==='gallery'&&'is-on')} onClick={()=>setLayout('gallery')}>▤ Plates</button>
            </div>
          </div>
        </aside>

        <main className={cls('bestiary__grid', `bestiary__grid--${layout}`)}>
          {filtered.length === 0 && <div className="empty"><span>{t.noResults}</span></div>}
          {filtered.map(p => (
            <PokemonCard key={p.id} p={p} layout={layout} lang={lang}
              onOpen={()=>setRoute({screen:'mon',id:p.id})}
              onHover={setHoverId}
              compareActive={compare.includes(p.id)}
              onToggleCompare={()=>setCompare(c => c.includes(p.id) ? c.filter(x=>x!==p.id) : c.length<2 ? [...c,p.id] : [c[1], p.id])}/>
          ))}
        </main>

        <aside className="bestiary__preview">
          {hovered ? <HoverCard p={hovered} lang={lang} t={t}/> : <div className="hint">{lang==='pt'?'Passe o mouse para pré-visualizar.':'Hover any creature to preview.'}</div>}
        </aside>
      </div>

      {compare.length>0 && (
        <div className="compare-tray">
          <span>{t.compare}: </span>
          {compare.map(id => {
            const p = POKEMON_BY_ID[id];
            return <span key={id} className="compare-tray__chip"><Sprite id={id} size={24}/> {p?.name} <button onClick={()=>setCompare(c=>c.filter(x=>x!==id))}>✕</button></span>;
          })}
          {compare.length===2 && <button className="btn btn--primary" onClick={()=>setRoute({screen:'compare'})}>{t.compare} →</button>}
        </div>
      )}
    </div>
  );
}

function RangeInput({ v, setV, min, max, step, label }) {
  return (
    <label className="ri">
      <span>{label}</span>
      <input type="number" min={min} max={max} step={step} value={v} onChange={e=>setV(+e.target.value)} className="num"/>
    </label>
  );
}

function PokemonCard({ p, layout, lang, onOpen, onHover, compareActive, onToggleCompare }) {
  const total = bst(p.stats);
  return (
    <article className={cls('pcard', `pcard--${layout}`, compareActive && 'is-cmp')}
      onMouseEnter={()=>onHover(p.id)} onMouseLeave={()=>onHover(null)}
      onClick={onOpen}>
      <div className="pcard__id num">№{pad(p.id)}</div>
      <button className={cls('pcard__cmp', compareActive && 'is-on')} onClick={(e)=>{e.stopPropagation(); onToggleCompare();}} aria-label="Compare">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="6" width="7" height="12"/><rect x="14" y="6" width="7" height="12"/></svg>
      </button>
      <div className={cls('pcard__sprite', `pcard__sprite--${p.types[0]}`)}>
        <Sprite id={p.id} size={layout==='gallery'?96:80}/>
      </div>
      <div className="pcard__body">
        <h3 className="pcard__name">{p.name}</h3>
        <span className="pcard__genus"><em>{p.genus[lang]}</em></span>
        <div className="pcard__types">
          {p.types.map(ty => <TypeBadge key={ty} type={ty} lang={lang} size="xs"/>)}
        </div>
        <div className="pcard__bst">
          <span className="cap">BST</span>
          <span className="num">{total}</span>
          <span className="pcard__bst__bar"><span style={{width:`${Math.min(100, total/720*100)}%`}}/></span>
        </div>
      </div>
    </article>
  );
}

function HoverCard({ p, lang, t }) {
  const total = bst(p.stats);
  return (
    <div className="hover">
      <div className="hover__head">
        <Sprite id={p.id} art size={120}/>
        <div className="hover__id num">№{pad(p.id)}</div>
        <h3>{p.name}</h3>
        <span className="hover__genus"><em>{p.genus[lang]}</em></span>
        <div className="hover__types">{p.types.map(ty => <TypeBadge key={ty} type={ty} lang={lang}/>)}</div>
      </div>
      <div className="hover__stats">
        {p.stats.map((v,i) => (
          <div key={i} className="hover__stat">
            <span>{STAT_LABEL[lang][i]}</span>
            <span className="num">{v}</span>
            <span className="hover__stat__bar"><span style={{width:`${(v/STAT_MAX)*100}%`, background:`var(--type-${p.types[0]})`}}/></span>
          </div>
        ))}
      </div>
      <div className="hover__meta">
        <div><span className="cap">{t.height}</span> <span className="num">{p.height}m</span></div>
        <div><span className="cap">{t.weight}</span> <span className="num">{p.weight}kg</span></div>
        <div><span className="cap">BST</span> <span className="num">{total}</span></div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────── Pokémon detail
function MonScreen({ id, t, lang, setRoute }) {
  const p = POKEMON_BY_ID[id];
  const [tab, setTab] = useState('info');
  if (!p) return <div className="page">Not found</div>;
  return (
    <div className="page mon">
      <button className="page__back" onClick={()=>setRoute({screen:'pokemon'})}>← {t.pokemon}</button>
      <header className={cls('mon__hero', `mon__hero--${p.types[0]}`)}>
        <div className="mon__hero__bgnum num" aria-hidden="true">{pad(p.id)}</div>
        <div className="mon__hero__art">
          <Sprite id={p.id} art size={220}/>
        </div>
        <div className="mon__hero__txt">
          <span className="cap">№{pad(p.id)} · Gen {p.gen}</span>
          <h1><em>{p.name}</em></h1>
          <span className="mon__hero__genus"><em>{p.genus[lang]}</em></span>
          <div className="mon__hero__types">{p.types.map(ty => <TypeBadge key={ty} type={ty} lang={lang} size="lg"/>)}</div>
          <dl className="mon__hero__dl">
            <div><dt>{t.height}</dt><dd className="num">{p.height} m</dd></div>
            <div><dt>{t.weight}</dt><dd className="num">{p.weight} kg</dd></div>
            <div><dt>BST</dt><dd className="num">{bst(p.stats)}</dd></div>
            <div><dt>{t.habitat}</dt><dd>{HABITAT[lang][p.habitat]}</dd></div>
          </dl>
        </div>
      </header>

      <nav className="tabs">
        {['info','moves','locations','evolution'].map(k => (
          <button key={k} className={cls('tabs__item', tab===k && 'is-on')} onClick={()=>setTab(k)}>{t[k]}</button>
        ))}
      </nav>

      {tab==='info' && <MonInfo p={p} t={t} lang={lang}/>}
      {tab==='moves' && <MonMoves p={p} t={t} lang={lang}/>}
      {tab==='locations' && <MonLocations p={p} t={t} lang={lang} setRoute={setRoute}/>}
      {tab==='evolution' && <MonEvolution p={p} t={t} lang={lang} setRoute={setRoute}/>}
    </div>
  );
}

function MonInfo({ p, t, lang }) {
  const eff = effectivenessFor(p.types);
  const buckets = { 4:[], 2:[], 0.5:[], 0.25:[], 0:[] };
  Object.entries(eff).forEach(([ty,m]) => { if (buckets[m]) buckets[m].push(ty); });
  const total = bst(p.stats);
  return (
    <div className="mongrid">
      <section className="card">
        <h2 className="card__title">{t.baseStats}</h2>
        <div className="stats">
          {p.stats.map((v,i) => (
            <div key={i} className="stat">
              <span className="stat__lbl">{STAT_LABEL[lang][i]}</span>
              <span className="stat__num num">{v}</span>
              <span className="stat__bar"><span style={{width:`${(v/STAT_MAX)*100}%`, background:`var(--type-${p.types[0]})`}}/></span>
            </div>
          ))}
          <div className="stat stat--total">
            <span className="stat__lbl">{t.total}</span>
            <span className="stat__num num">{total}</span>
            <span className="stat__bar"><span style={{width:`${(total/720)*100}%`}}/></span>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">{t.abilities}</h2>
        <ul className="abilities">
          {p.abilities.map((a,i) => (
            <li key={i} className="ability">
              <span className="ability__name">{a.name}</span>
              {a.hidden && <span className="ability__hidden">{t.hidden}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="card card--span">
        <h2 className="card__title">{t.typeEffectiveness}</h2>
        <div className="eff">
          <EffRow label={`×4 ${t.weakTo}`} types={buckets[4]} kind="x4" lang={lang}/>
          <EffRow label={`×2 ${t.weakTo}`} types={buckets[2]} kind="x2" lang={lang}/>
          <EffRow label={`½× ${t.resists}`} types={buckets[0.5]} kind="r2" lang={lang}/>
          <EffRow label={`¼× ${t.resists}`} types={buckets[0.25]} kind="r4" lang={lang}/>
          <EffRow label={`0× ${t.immuneTo}`} types={buckets[0]} kind="im" lang={lang}/>
        </div>
      </section>
    </div>
  );
}

function EffRow({ label, types, kind, lang }) {
  if (!types.length) return null;
  return (
    <div className={`eff__row eff__row--${kind}`}>
      <span className="eff__row__lbl">{label}</span>
      <div className="eff__row__list">{types.map(ty => <TypeBadge key={ty} type={ty} lang={lang} size="xs"/>)}</div>
    </div>
  );
}

function MonMoves({ p, t, lang }) {
  const list = MOVES[p.id] || [];
  return (
    <div className="card">
      <h2 className="card__title">{t.moves} · level-up</h2>
      {list.length === 0 ? <p className="hint">No move data for this entry.</p> :
      <table className="movetbl">
        <thead><tr><th>Lv</th><th>Move</th><th>Type</th><th>Cat.</th><th>Pow</th><th>Acc</th></tr></thead>
        <tbody>
          {list.map((m,i) => (
            <tr key={i}>
              <td className="num">{m.lvl}</td>
              <td className="movetbl__name">{m.name}</td>
              <td><TypeBadge type={m.type} lang={lang} size="xs"/></td>
              <td><span className={`cat cat--${m.cat}`}>{m.cat}</span></td>
              <td className="num">{m.pow ?? '—'}</td>
              <td className="num">{m.acc ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  );
}

function MonLocations({ p, t, lang, setRoute }) {
  const found = ROUTES.filter(r => r.encounters.some(e => e.pid === p.id));
  return (
    <div className="card">
      <h2 className="card__title">{t.seenIn} · FireRed</h2>
      {found.length === 0 ? <p className="hint">{lang==='pt'?'Não aparece em nenhuma rota deste guia.':'Not observed in any route in this guide.'}</p> :
      <ul className="locs">
        {found.map(r => {
          const e = r.encounters.find(x => x.pid === p.id);
          return (
            <li key={r.id} className="loc" onClick={()=>setRoute({screen:'routeDetail',id:r.id})}>
              <span className="loc__name"><em>{r.name}</em></span>
              <span className="cap">{e.method}</span>
              <span className="num">Lv {e.lvl[0]}–{e.lvl[1]}</span>
              <span className="loc__rate num">{e.rate}%</span>
            </li>
          );
        })}
      </ul>}
    </div>
  );
}

function MonEvolution({ p, t, lang, setRoute }) {
  const lineKey = p.evolveLine;
  const line = lineKey ? EVOLUTION_LINES[lineKey] : null;
  if (!line) {
    return (
      <div className="card">
        <h2 className="card__title">{t.evolution}</h2>
        <p className="hint">{lang==='pt'?'Esta criatura não evolui.':'This creature does not evolve.'}</p>
      </div>
    );
  }
  // Build adjacency: from -> [{to,via}]
  const out = {};
  line.transitions.forEach(tr => { (out[tr.from] = out[tr.from] || []).push(tr); });
  // Compute stages BFS from root
  const stages = [];
  let frontier = [line.root];
  const seen = new Set();
  while (frontier.length) {
    stages.push(frontier);
    frontier.forEach(id => seen.add(id));
    const next = [];
    frontier.forEach(id => (out[id]||[]).forEach(tr => { if (!seen.has(tr.to)) next.push(tr.to); }));
    frontier = [...new Set(next)];
  }
  const arrowsBetween = (fromIds) => fromIds.flatMap(id => out[id]||[]);

  return (
    <div className="card">
      <h2 className="card__title">{t.evolution}</h2>
      <div className="evotree">
        {stages.map((ids, si) => (
          <React.Fragment key={si}>
            <ul className={cls('evotree__col', ids.length>1 && 'evotree__col--branched')}>
              {ids.map(id => {
                const c = POKEMON_BY_ID[id];
                if (!c) return null;
                return (
                  <li key={id} className={cls('evotree__node', id===p.id && 'is-self')}
                      onClick={()=>setRoute({screen:'mon',id})}>
                    <Sprite id={id} size={88}/>
                    <span className="evo__num num">№{pad(id)}</span>
                    <span className="evo__name">{c.name}</span>
                    <div className="evo__types">{c.types.map(ty => <TypeBadge key={ty} type={ty} lang={lang} size="xs"/>)}</div>
                  </li>
                );
              })}
            </ul>
            {si < stages.length-1 && (
              <ul className="evotree__arrows">
                {arrowsBetween(ids).map((tr,i) => (
                  <li key={i} className="evotree__arrow">
                    <span className="evotree__arrow__line" aria-hidden="true">→</span>
                    <span className="evotree__arrow__via">{tr.via}</span>
                  </li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────── Compare
function CompareScreen({ compare, t, lang, setRoute }) {
  if (compare.length < 2) return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title"><em>Compare</em></h1>
      </div>
      <div className="empty empty--lg"><span>{t.selectBoth}</span><button className="btn" onClick={()=>setRoute({screen:'pokemon'})}>{t.browseAll}</button></div>
    </div>
  );
  const [a,b] = compare.map(id => POKEMON_BY_ID[id]);
  return (
    <div className="page">
      <div className="page__head"><h1 className="page__title"><em>Compare</em><small>{a.name} vs {b.name}</small></h1></div>
      <div className="cmp">
        {[a,b].map((p,i) => (
          <div key={p.id} className={cls('cmp__col', `cmp__col--${i}`)}>
            <div className={`cmp__hero cmp__hero--${p.types[0]}`}><Sprite id={p.id} art size={160}/></div>
            <div className="cmp__id num">№{pad(p.id)}</div>
            <h2>{p.name}</h2>
            <div>{p.types.map(ty => <TypeBadge key={ty} type={ty} lang={lang}/>)}</div>
          </div>
        ))}
        <div className="cmp__stats">
          {STAT_LABEL[lang].map((lbl,i) => {
            const va = a.stats[i], vb = b.stats[i];
            const max = Math.max(va,vb,1);
            return (
              <div key={i} className="cmp__row">
                <span className={cls('cmp__v cmp__v--a num', va>vb&&'is-win')}>{va}</span>
                <span className="cmp__lbl">{lbl}</span>
                <span className={cls('cmp__v cmp__v--b num', vb>va&&'is-win')}>{vb}</span>
                <div className="cmp__bars">
                  <span className="cmp__bar cmp__bar--a"><span style={{width:`${(va/STAT_MAX)*100}%`, background:`var(--type-${a.types[0]})`}}/></span>
                  <span className="cmp__bar cmp__bar--b"><span style={{width:`${(vb/STAT_MAX)*100}%`, background:`var(--type-${b.types[0]})`}}/></span>
                </div>
              </div>
            );
          })}
          <div className="cmp__row cmp__row--total">
            <span className={cls('cmp__v num', bst(a.stats)>bst(b.stats)&&'is-win')}>{bst(a.stats)}</span>
            <span className="cmp__lbl">BST</span>
            <span className={cls('cmp__v num', bst(b.stats)>bst(a.stats)&&'is-win')}>{bst(b.stats)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────── Team Builder
function TeamBuilder({ team, setTeam, t, lang, setRoute }) {
  const [pickerSlot, setPickerSlot] = useState(null);
  const [q, setQ] = useState('');
  const filled = team.map(id => id ? POKEMON_BY_ID[id] : null);
  const members = filled.filter(Boolean);

  const typeStats = useMemo(() => {
    const stats = {};
    TYPES.forEach(atk => {
      const vals = members.map(p => effectivenessFor(p.types)[atk] ?? 1);
      stats[atk] = {
        weak4: vals.filter(v => v >= 4).length,
        weak2: vals.filter(v => v === 2).length,
        neutral: vals.filter(v => v === 1).length,
        resist: vals.filter(v => v > 0 && v < 1).length,
        immune: vals.filter(v => v === 0).length,
      };
    });
    return stats;
  }, [members.map(p=>p.id).join(',')]);

  const avgBst = members.length ? Math.round(members.reduce((s,p)=>s+bst(p.stats),0)/members.length) : 0;
  const totalStats = STAT_LABEL[lang].map((_, i) => members.reduce((s,p)=>s+p.stats[i],0));
  const maxRollup = Math.max(...totalStats, 1);

  const filteredPicks = useMemo(() => {
    const ql = q.toLowerCase();
    return POKEMON.filter(p => !q || p.name.toLowerCase().includes(ql) || String(p.id).includes(ql));
  }, [q]);

  function pick(id) {
    const next = [...team]; next[pickerSlot] = id; setTeam(next);
    setPickerSlot(null); setQ('');
  }
  function clearSlot(i) { const next=[...team]; next[i]=null; setTeam(next); }

  return (
    <div className="page">
      <div className="page__head">
        <div className="page__head__crumbs"><span className="num">04</span><span>{t.team} · FireRed</span></div>
        <h1 className="page__title"><em>{t.teamBuilder}</em><small>{t.teamHint}</small></h1>
      </div>

      <div className="team">
        <section className="team__roster">
          {filled.map((p, i) => (
            <article key={i} className={cls('teamslot', p && `teamslot--${p.types[0]}`, !p && 'is-empty')}
                     onClick={()=> p ? setRoute({screen:'mon',id:p.id}) : setPickerSlot(i)}>
              <span className="teamslot__num num">0{i+1}</span>
              {p ? (
                <>
                  <Sprite id={p.id} art size={96}/>
                  <h3 className="teamslot__name">{p.name}</h3>
                  <span className="teamslot__id num">№{pad(p.id)}</span>
                  <div className="teamslot__types">{p.types.map(ty => <TypeBadge key={ty} type={ty} lang={lang} size="xs"/>)}</div>
                  <div className="teamslot__bst"><span className="cap">BST</span> <span className="num">{bst(p.stats)}</span></div>
                  <button className="teamslot__x" onClick={(e)=>{e.stopPropagation(); clearSlot(i);}} aria-label="Remove">✕</button>
                </>
              ) : (
                <>
                  <span className="teamslot__plus" aria-hidden="true">+</span>
                  <span className="teamslot__hint">{t.teamEmpty}</span>
                </>
              )}
            </article>
          ))}
        </section>

        <section className="team__metrics">
          <div className="team__metric">
            <span className="cap">{t.teamAvg}</span>
            <span className="team__metric__big num">{avgBst || '—'}</span>
          </div>
          <div className="team__metric">
            <span className="cap">{lang==='pt'?'Membros':'Members'}</span>
            <span className="team__metric__big num">{members.length}/6</span>
          </div>
          <div className="team__metric team__metric--wide">
            <span className="cap">{lang==='pt'?'Distribuição de atributos':'Stat distribution'}</span>
            <div className="team__radar">
              {totalStats.map((v, i) => (
                <div key={i} className="team__radar__row">
                  <span className="team__radar__lbl">{STAT_LABEL[lang][i]}</span>
                  <span className="team__radar__bar"><span style={{width:`${(v/maxRollup)*100}%`}}/></span>
                  <span className="num">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="team__matrix">
          <header className="team__matrix__head">
            <h2 className="card__title">{t.teamCoverage}</h2>
            <p className="hint">{lang==='pt'
              ? 'Cada coluna é uma vaga. Cor = como cada membro reage a um ataque desse tipo.'
              : 'Each column is a slot. Cell color = how each member reacts to that attacking type.'}</p>
          </header>
          <div className="matrix">
            <div className="matrix__corner"/>
            {filled.map((p, i) => (
              <div key={i} className="matrix__col-h">{p ? <Sprite id={p.id} size={28}/> : <span className="matrix__col-h__empty">·</span>}</div>
            ))}
            {TYPES.map(atk => (
              <React.Fragment key={atk}>
                <div className="matrix__row-h"><TypeBadge type={atk} lang={lang} size="xs"/></div>
                {filled.map((p, i) => {
                  if (!p) return <div key={i} className="matrix__cell matrix__cell--empty"/>;
                  const m = effectivenessFor(p.types)[atk] ?? 1;
                  const cls2 = m===0?'im':m===0.25?'r4':m===0.5?'r2':m===2?'x2':m===4?'x4':'n1';
                  return <div key={i} className={`matrix__cell matrix__cell--${cls2}`} title={`${atk} ×${m}`}>
                    {m!==1 && <span className="num">{m===0.25?'¼':m===0.5?'½':m===0?'∅':m+'×'}</span>}
                  </div>;
                })}
              </React.Fragment>
            ))}
          </div>

          <footer className="team__matrix__rollup">
            <h3 className="cap">{lang==='pt'?'Por tipo de ataque (toda a equipe)':'Per attack type (whole team)'}</h3>
            <ol className="rollup">
              {TYPES.map(atk => {
                const s = typeStats[atk];
                const danger = s.weak4 > 0 || s.weak2 >= 3;
                const safe = (s.resist + s.immune) >= members.length && members.length>0;
                return (
                  <li key={atk} className={cls('rollup__row', danger && 'is-danger', safe && 'is-safe')}>
                    <TypeBadge type={atk} lang={lang} size="xs"/>
                    <span className="rollup__bar">
                      {s.weak4>0 && <span className="rollup__seg rollup__seg--x4" style={{flex:s.weak4}}/>}
                      {s.weak2>0 && <span className="rollup__seg rollup__seg--x2" style={{flex:s.weak2}}/>}
                      {s.neutral>0 && <span className="rollup__seg rollup__seg--n1" style={{flex:s.neutral}}/>}
                      {s.resist>0 && <span className="rollup__seg rollup__seg--r2" style={{flex:s.resist}}/>}
                      {s.immune>0 && <span className="rollup__seg rollup__seg--im" style={{flex:s.immune}}/>}
                    </span>
                    <span className="rollup__nums">
                      {s.weak4>0 && <span className="rollup__chip rollup__chip--x4 num">×4·{s.weak4}</span>}
                      {s.weak2>0 && <span className="rollup__chip rollup__chip--x2 num">×2·{s.weak2}</span>}
                      {s.resist>0 && <span className="rollup__chip rollup__chip--r2 num">½·{s.resist}</span>}
                      {s.immune>0 && <span className="rollup__chip rollup__chip--im num">0·{s.immune}</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
          </footer>
        </section>
      </div>

      {pickerSlot !== null && (
        <div className="picker" onClick={()=>setPickerSlot(null)}>
          <div className="picker__panel" onClick={e=>e.stopPropagation()}>
            <header className="picker__head">
              <h2><em>{t.teamPick}</em></h2>
              <span className="cap">{t.teamSlot} {pickerSlot+1}</span>
              <button className="picker__close" onClick={()=>setPickerSlot(null)}>✕</button>
            </header>
            <input className="picker__search" autoFocus placeholder={t.search} value={q} onChange={e=>setQ(e.target.value)}/>
            <ul className="picker__list">
              {filteredPicks.map(p => (
                <li key={p.id} className="picker__item" onClick={()=>pick(p.id)}>
                  <Sprite id={p.id} size={40}/>
                  <span className="picker__name">{p.name}</span>
                  <span className="picker__id num">№{pad(p.id)}</span>
                  <div className="picker__types">{p.types.map(ty => <TypeBadge key={ty} type={ty} lang={lang} size="xs"/>)}</div>
                  <span className="picker__bst num">BST {bst(p.stats)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────── Favorites screen
function FavoritesScreen({ t, lang, favs, setRoute }) {
  const list = favs.map(id => POKEMON_BY_ID[id]).filter(Boolean);
  return (
    <div className="page">
      <div className="page__head"><h1 className="page__title"><em>{t.favorites}</em><small>{list.length} entries</small></h1></div>
      {list.length===0 ? <div className="empty empty--lg"><span>{lang==='pt'?'Nenhum favorito ainda.':'No favourites yet.'}</span></div> :
      <div className="bestiary__grid bestiary__grid--gallery">
        {list.map(p => <PokemonCard key={p.id} p={p} layout="gallery" lang={lang} onOpen={()=>setRoute({screen:'mon',id:p.id})} onHover={()=>{}} compareActive={false} onToggleCompare={()=>{}}/>)}
      </div>}
    </div>
  );
}

// ───────────────────────────────────────────────────────── Command palette
function CmdPalette({ open, onClose, t, lang, setRoute, onToggleTheme, onToggleLang }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inp = useRef();
  useEffect(() => { if (open) { setQ(''); setSel(0); setTimeout(()=>inp.current?.focus(), 50); }}, [open]);

  const items = useMemo(() => {
    const out = [];
    out.push({ k:'nav-routes', cat:'nav', label:t.routes, do:()=>setRoute({screen:'routes'}) });
    out.push({ k:'nav-mon', cat:'nav', label:t.pokemon, do:()=>setRoute({screen:'pokemon'}) });
    out.push({ k:'nav-cmp', cat:'nav', label:t.compare, do:()=>setRoute({screen:'compare'}) });
    out.push({ k:'act-theme', cat:'action', label:t.actions.toggleTheme, do:onToggleTheme });
    out.push({ k:'act-lang', cat:'action', label:t.actions.toggleLang, do:onToggleLang });
    out.push({ k:'act-map', cat:'action', label:t.actions.openMap, do:()=>setRoute({screen:'routes'}) });
    POKEMON.forEach(p => out.push({ k:`mon-${p.id}`, cat:'mon', label:p.name, sub:`№${pad(p.id)} · ${p.types.map(ty=>TYPE_LABEL[lang][ty]).join('/')}`, pid:p.id, do:()=>setRoute({screen:'mon',id:p.id}) }));
    ROUTES.forEach(r => out.push({ k:`route-${r.id}`, cat:'route', label:r.name, sub:`${r.terrain} · ${r.encounters.length} ${t.encounters}`, do:()=>setRoute({screen:'routeDetail',id:r.id}) }));
    if (!q) return out.slice(0, 30);
    const ql = q.toLowerCase();
    return out.filter(x => x.label.toLowerCase().includes(ql) || (x.sub||'').toLowerCase().includes(ql)).slice(0, 30);
  }, [q, lang, t]);

  useEffect(() => { setSel(0); }, [q]);

  function handleKey(e) {
    if (e.key === 'Escape') { onClose(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(items.length-1, s+1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setSel(s => Math.max(0, s-1)); }
    else if (e.key === 'Enter') { items[sel]?.do(); onClose(); }
  }

  if (!open) return null;
  return (
    <div className="cmd" onClick={onClose}>
      <div className="cmd__panel" onClick={e=>e.stopPropagation()}>
        <div className="cmd__head">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="6.5"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>
          <input ref={inp} value={q} onChange={e=>setQ(e.target.value)} onKeyDown={handleKey} placeholder={t.cmdPalette}/>
          <kbd>esc</kbd>
        </div>
        <ul className="cmd__list">
          {items.map((x,i) => (
            <li key={x.k} className={cls('cmd__item', i===sel && 'is-on')} onMouseEnter={()=>setSel(i)} onClick={()=>{x.do(); onClose();}}>
              <span className={`cmd__cat cmd__cat--${x.cat}`}>{t.cmdCategory[x.cat]}</span>
              {x.pid && <Sprite id={x.pid} size={20}/>}
              <span className="cmd__lbl">{x.label}</span>
              {x.sub && <span className="cmd__sub">{x.sub}</span>}
              {i===sel && <span className="cmd__hint">↵</span>}
            </li>
          ))}
          {items.length===0 && <li className="cmd__empty">{t.noResults}</li>}
        </ul>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────── App
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "warm-paper",
  "fontPair": "newsreader-jakarta",
  "density": "comfortable",
  "showCompass": true
}/*EDITMODE-END*/;

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('pdex.theme') || 'light');
  const [lang, setLang] = useState(() => localStorage.getItem('pdex.lang') || 'pt');
  const [route, setRoute] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pdex.route')) || { screen:'routes' }; }
    catch { return { screen:'routes' }; }
  });
  const [cmdOpen, setCmdOpen] = useState(false);
  const [compare, setCompare] = useState([]);
  const [favs, setFavs] = useState([]);
  const [team, setTeam] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pdex.team') || '[null,null,null,null,null,null]'); }
    catch { return [null,null,null,null,null,null]; }
  });
  useEffect(() => { localStorage.setItem('pdex.team', JSON.stringify(team)); }, [team]);
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);

  const t = UI[lang];

  useEffect(() => { localStorage.setItem('pdex.theme', theme); document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { localStorage.setItem('pdex.lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('pdex.route', JSON.stringify(route)); }, [route]);

  useEffect(() => { document.documentElement.dataset.palette = tweaks.palette; document.documentElement.dataset.font = tweaks.fontPair; document.documentElement.dataset.density = tweaks.density; }, [tweaks]);

  // Cmd-K
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(true); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Tweaks listener
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setShowTweaks(true);
      if (e.data?.type === '__deactivate_edit_mode') setShowTweaks(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({type:'__edit_mode_available'},'*');
    return () => window.removeEventListener('message', handler);
  }, []);
  const [showTweaks, setShowTweaks] = useState(false);

  function setTweak(k, v) {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({type:'__edit_mode_set_keys', edits:{[k]:v}},'*');
  }

  const onToggleTheme = () => setTheme(th => th==='dark'?'light':'dark');
  const onToggleLang = () => setLang(l => l==='en'?'pt':'en');

  return (
    <>
      <Shell lang={lang} theme={theme} route={route} setRoute={setRoute}
             onCmd={()=>setCmdOpen(true)} onToggleTheme={onToggleTheme} onToggleLang={onToggleLang} t={t}/>
      <main className="main">
        <div key={route.screen + (route.id||'')} className="main__inner main__inner--enter">
          {route.screen==='routes'      && <RoutesScreen t={t} lang={lang} setRoute={setRoute}/>}
          {route.screen==='routeDetail' && <RouteDetailScreen id={route.id} t={t} lang={lang} setRoute={setRoute}/>}
          {route.screen==='pokemon'     && <PokemonScreen t={t} lang={lang} setRoute={setRoute} compare={compare} setCompare={setCompare}/>}
          {route.screen==='mon'         && <MonScreen id={route.id} t={t} lang={lang} setRoute={setRoute}/>}
          {route.screen==='compare'     && <CompareScreen compare={compare} t={t} lang={lang} setRoute={setRoute}/>}
          {route.screen==='favorites'   && <FavoritesScreen t={t} lang={lang} favs={favs} setRoute={setRoute}/>}
          {route.screen==='team'        && <TeamBuilder team={team} setTeam={setTeam} t={t} lang={lang} setRoute={setRoute}/>}
        </div>
      </main>
      <CmdPalette open={cmdOpen} onClose={()=>setCmdOpen(false)} t={t} lang={lang} setRoute={setRoute}
                  onToggleTheme={onToggleTheme} onToggleLang={onToggleLang}/>

      {showTweaks && window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection title="Aesthetic">
            <window.TweakRadio label="Palette" value={tweaks.palette} onChange={v=>setTweak('palette',v)}
              options={[
                {value:'warm-paper', label:'Warm paper'},
                {value:'cold-slate', label:'Cold slate'},
                {value:'arcade', label:'Arcade'},
              ]}/>
            <window.TweakRadio label="Type pair" value={tweaks.fontPair} onChange={v=>setTweak('fontPair',v)}
              options={[
                {value:'newsreader-jakarta', label:'Newsreader + Jakarta'},
                {value:'fraktur-mono', label:'Display + Mono'},
                {value:'all-mono', label:'All mono'},
              ]}/>
            <window.TweakRadio label="Density" value={tweaks.density} onChange={v=>setTweak('density',v)}
              options={[{value:'cozy',label:'Cozy'},{value:'comfortable',label:'Comfortable'},{value:'dense',label:'Dense'}]}/>
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
