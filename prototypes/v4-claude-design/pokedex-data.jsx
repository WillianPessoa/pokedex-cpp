// Pokémon dataset — Gen 1 selection covering FireRed/LeafGreen routes.
// Bilingual EN/PT-BR. Names kept in original (PT-BR retains EN names) but
// genus / descriptions / abilities translated.

const TYPES = [
  'normal','fire','water','electric','grass','ice',
  'fighting','poison','ground','flying','psychic','bug',
  'rock','ghost','dragon','dark','steel','fairy'
];

const TYPE_LABEL = {
  en: { normal:'Normal', fire:'Fire', water:'Water', electric:'Electric', grass:'Grass', ice:'Ice', fighting:'Fighting', poison:'Poison', ground:'Ground', flying:'Flying', psychic:'Psychic', bug:'Bug', rock:'Rock', ghost:'Ghost', dragon:'Dragon', dark:'Dark', steel:'Steel', fairy:'Fairy' },
  pt: { normal:'Normal', fire:'Fogo', water:'Água', electric:'Elétrico', grass:'Planta', ice:'Gelo', fighting:'Lutador', poison:'Veneno', ground:'Terra', flying:'Voador', psychic:'Psíquico', bug:'Inseto', rock:'Pedra', ghost:'Fantasma', dragon:'Dragão', dark:'Sombrio', steel:'Aço', fairy:'Fada' },
};

// Effectiveness chart (defender's perspective). Values: 0 immune, 0.5 resists, 2 weak.
// Only weaknesses/resistances/immunities — neutral omitted.
const TYPE_CHART = {
  normal:    { fighting:2, ghost:0 },
  fire:      { water:2, ground:2, rock:2, fire:0.5, grass:0.5, ice:0.5, bug:0.5, steel:0.5, fairy:0.5 },
  water:     { electric:2, grass:2, fire:0.5, water:0.5, ice:0.5, steel:0.5 },
  electric:  { ground:2, electric:0.5, flying:0.5, steel:0.5 },
  grass:     { fire:2, ice:2, poison:2, flying:2, bug:2, water:0.5, electric:0.5, grass:0.5, ground:0.5 },
  ice:       { fire:2, fighting:2, rock:2, steel:2, ice:0.5 },
  fighting:  { flying:2, psychic:2, fairy:2, bug:0.5, rock:0.5, dark:0.5 },
  poison:    { ground:2, psychic:2, grass:0.5, fighting:0.5, poison:0.5, bug:0.5, fairy:0.5 },
  ground:    { water:2, grass:2, ice:2, poison:0.5, rock:0.5, electric:0 },
  flying:    { electric:2, ice:2, rock:2, grass:0.5, fighting:0.5, bug:0.5, ground:0 },
  psychic:   { bug:2, ghost:2, dark:2, fighting:0.5, psychic:0.5 },
  bug:       { fire:2, flying:2, rock:2, grass:0.5, fighting:0.5, ground:0.5 },
  rock:      { water:2, grass:2, fighting:2, ground:2, steel:2, normal:0.5, fire:0.5, poison:0.5, flying:0.5 },
  ghost:     { ghost:2, dark:2, poison:0.5, bug:0.5, normal:0, fighting:0 },
  dragon:    { ice:2, dragon:2, fairy:2, fire:0.5, water:0.5, electric:0.5, grass:0.5 },
  dark:      { fighting:2, bug:2, fairy:2, ghost:0.5, dark:0.5, psychic:0 },
  steel:     { fire:2, fighting:2, ground:2, normal:0.5, grass:0.5, ice:0.5, flying:0.5, psychic:0.5, bug:0.5, rock:0.5, dragon:0.5, steel:0.5, fairy:0.5, poison:0 },
  fairy:     { poison:2, steel:2, fighting:0.5, bug:0.5, dark:0.5, dragon:0 },
};

// Compute defender effectiveness multipliers for a dual-typed mon
function effectivenessFor(types) {
  const result = {};
  for (const atk of TYPES) {
    let m = 1;
    for (const def of types) {
      const chart = TYPE_CHART[def] || {};
      if (atk in chart) m *= chart[atk];
    }
    if (m !== 1) result[atk] = m;
  }
  return result;
}

const HABITAT = {
  en: { forest:'Forest', mountain:'Mountain', urban:'Urban', cave:'Cave', water:'Water', grassland:'Grassland', rare:'Rare' },
  pt: { forest:'Floresta', mountain:'Montanha', urban:'Urbano', cave:'Caverna', water:'Água', grassland:'Campo', rare:'Raro' },
};

// Sprite URL helper — using PokeAPI public sprites (fan-mirror).
const SPRITE = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
const ART = (id)    => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const POKEMON = [
  { id:1,  name:'Bulbasaur',  genus:{en:'Seed Pokémon',     pt:'Pokémon Semente'},     types:['grass','poison'], stats:[45,49,49,65,65,45], abilities:[{name:'Overgrow',hidden:false},{name:'Chlorophyll',hidden:true}], height:0.7, weight:6.9, gen:1, habitat:'grassland', evolves:[1,2,3] },
  { id:2,  name:'Ivysaur',    genus:{en:'Seed Pokémon',     pt:'Pokémon Semente'},     types:['grass','poison'], stats:[60,62,63,80,80,60], abilities:[{name:'Overgrow'},{name:'Chlorophyll',hidden:true}], height:1.0, weight:13.0, gen:1, habitat:'grassland', evolves:[1,2,3] },
  { id:3,  name:'Venusaur',   genus:{en:'Seed Pokémon',     pt:'Pokémon Semente'},     types:['grass','poison'], stats:[80,82,83,100,100,80], abilities:[{name:'Overgrow'},{name:'Chlorophyll',hidden:true}], height:2.0, weight:100.0, gen:1, habitat:'grassland', evolves:[1,2,3] },
  { id:4,  name:'Charmander', genus:{en:'Lizard Pokémon',   pt:'Pokémon Lagarto'},     types:['fire'], stats:[39,52,43,60,50,65], abilities:[{name:'Blaze'},{name:'Solar Power',hidden:true}], height:0.6, weight:8.5, gen:1, habitat:'mountain', evolves:[4,5,6] },
  { id:5,  name:'Charmeleon', genus:{en:'Flame Pokémon',    pt:'Pokémon Chama'},       types:['fire'], stats:[58,64,58,80,65,80], abilities:[{name:'Blaze'},{name:'Solar Power',hidden:true}], height:1.1, weight:19.0, gen:1, habitat:'mountain', evolves:[4,5,6] },
  { id:6,  name:'Charizard',  genus:{en:'Flame Pokémon',    pt:'Pokémon Chama'},       types:['fire','flying'], stats:[78,84,78,109,85,100], abilities:[{name:'Blaze'},{name:'Solar Power',hidden:true}], height:1.7, weight:90.5, gen:1, habitat:'mountain', evolves:[4,5,6] },
  { id:7,  name:'Squirtle',   genus:{en:'Tiny Turtle',      pt:'Tartaruguinha'},       types:['water'], stats:[44,48,65,50,64,43], abilities:[{name:'Torrent'},{name:'Rain Dish',hidden:true}], height:0.5, weight:9.0, gen:1, habitat:'water', evolves:[7,8,9] },
  { id:8,  name:'Wartortle',  genus:{en:'Turtle Pokémon',   pt:'Pokémon Tartaruga'},   types:['water'], stats:[59,63,80,65,80,58], abilities:[{name:'Torrent'},{name:'Rain Dish',hidden:true}], height:1.0, weight:22.5, gen:1, habitat:'water', evolves:[7,8,9] },
  { id:9,  name:'Blastoise',  genus:{en:'Shellfish Pokémon',pt:'Pokémon Concha'},      types:['water'], stats:[79,83,100,85,105,78], abilities:[{name:'Torrent'},{name:'Rain Dish',hidden:true}], height:1.6, weight:85.5, gen:1, habitat:'water', evolves:[7,8,9] },
  { id:10, name:'Caterpie',   genus:{en:'Worm Pokémon',     pt:'Pokémon Verme'},       types:['bug'], stats:[45,30,35,20,20,45], abilities:[{name:'Shield Dust'},{name:'Run Away',hidden:true}], height:0.3, weight:2.9, gen:1, habitat:'forest', evolves:[10,11,12] },
  { id:11, name:'Metapod',    genus:{en:'Cocoon Pokémon',   pt:'Pokémon Casulo'},      types:['bug'], stats:[50,20,55,25,25,30], abilities:[{name:'Shed Skin'}], height:0.7, weight:9.9, gen:1, habitat:'forest', evolves:[10,11,12] },
  { id:12, name:'Butterfree', genus:{en:'Butterfly Pokémon',pt:'Pokémon Borboleta'},   types:['bug','flying'], stats:[60,45,50,90,80,70], abilities:[{name:'Compound Eyes'},{name:'Tinted Lens',hidden:true}], height:1.1, weight:32.0, gen:1, habitat:'forest', evolves:[10,11,12] },
  { id:16, name:'Pidgey',     genus:{en:'Tiny Bird Pokémon',pt:'Pokémon Passarinho'},  types:['normal','flying'], stats:[40,45,40,35,35,56], abilities:[{name:'Keen Eye'},{name:'Tangled Feet'},{name:'Big Pecks',hidden:true}], height:0.3, weight:1.8, gen:1, habitat:'grassland', evolves:[16,17,18] },
  { id:17, name:'Pidgeotto',  genus:{en:'Bird Pokémon',     pt:'Pokémon Pássaro'},     types:['normal','flying'], stats:[63,60,55,50,50,71], abilities:[{name:'Keen Eye'},{name:'Tangled Feet'},{name:'Big Pecks',hidden:true}], height:1.1, weight:30.0, gen:1, habitat:'grassland', evolves:[16,17,18] },
  { id:18, name:'Pidgeot',    genus:{en:'Bird Pokémon',     pt:'Pokémon Pássaro'},     types:['normal','flying'], stats:[83,80,75,70,70,101], abilities:[{name:'Keen Eye'},{name:'Tangled Feet'},{name:'Big Pecks',hidden:true}], height:1.5, weight:39.5, gen:1, habitat:'grassland', evolves:[16,17,18] },
  { id:19, name:'Rattata',    genus:{en:'Mouse Pokémon',    pt:'Pokémon Camundongo'},  types:['normal'], stats:[30,56,35,25,35,72], abilities:[{name:'Run Away'},{name:'Guts'},{name:'Hustle',hidden:true}], height:0.3, weight:3.5, gen:1, habitat:'urban', evolves:[19,20] },
  { id:20, name:'Raticate',   genus:{en:'Mouse Pokémon',    pt:'Pokémon Roedor'},      types:['normal'], stats:[55,81,60,50,70,97], abilities:[{name:'Run Away'},{name:'Guts'},{name:'Hustle',hidden:true}], height:0.7, weight:18.5, gen:1, habitat:'urban', evolves:[19,20] },
  { id:25, name:'Pikachu',    genus:{en:'Mouse Pokémon',    pt:'Pokémon Camundongo'},  types:['electric'], stats:[35,55,40,50,50,90], abilities:[{name:'Static'},{name:'Lightning Rod',hidden:true}], height:0.4, weight:6.0, gen:1, habitat:'forest', evolves:[172,25,26], desc:{en:'When several gather, their electricity can cause lightning storms.', pt:'Quando se reúnem, sua eletricidade pode causar tempestades.'} },
  { id:26, name:'Raichu',     genus:{en:'Mouse Pokémon',    pt:'Pokémon Camundongo'},  types:['electric'], stats:[60,90,55,90,80,110], abilities:[{name:'Static'},{name:'Lightning Rod',hidden:true}], height:0.8, weight:30.0, gen:1, habitat:'forest', evolves:[172,25,26] },
  { id:74, name:'Geodude',    genus:{en:'Rock Pokémon',     pt:'Pokémon Pedra'},       types:['rock','ground'], stats:[40,80,100,30,30,20], abilities:[{name:'Rock Head'},{name:'Sturdy'},{name:'Sand Veil',hidden:true}], height:0.4, weight:20.0, gen:1, habitat:'cave', evolves:[74,75,76] },
  { id:75, name:'Graveler',   genus:{en:'Rock Pokémon',     pt:'Pokémon Pedra'},       types:['rock','ground'], stats:[55,95,115,45,45,35], abilities:[{name:'Rock Head'},{name:'Sturdy'}], height:1.0, weight:105.0, gen:1, habitat:'cave', evolves:[74,75,76] },
  { id:76, name:'Golem',      genus:{en:'Megaton Pokémon',  pt:'Pokémon Megaton'},     types:['rock','ground'], stats:[80,120,130,55,65,45], abilities:[{name:'Rock Head'},{name:'Sturdy'}], height:1.4, weight:300.0, gen:1, habitat:'cave', evolves:[74,75,76] },
  { id:95, name:'Onix',       genus:{en:'Rock Snake',       pt:'Cobra de Pedra'},      types:['rock','ground'], stats:[35,45,160,30,45,70], abilities:[{name:'Rock Head'},{name:'Sturdy'}], height:8.8, weight:210.0, gen:1, habitat:'cave', evolves:[95] },
  { id:129,name:'Magikarp',   genus:{en:'Fish Pokémon',     pt:'Pokémon Peixe'},       types:['water'], stats:[20,10,55,15,20,80], abilities:[{name:'Swift Swim'}], height:0.9, weight:10.0, gen:1, habitat:'water', evolves:[129,130] },
  { id:130,name:'Gyarados',   genus:{en:'Atrocious Pokémon',pt:'Pokémon Atroz'},       types:['water','flying'], stats:[95,125,79,60,100,81], abilities:[{name:'Intimidate'}], height:6.5, weight:235.0, gen:1, habitat:'water', evolves:[129,130] },
  { id:133,name:'Eevee',      genus:{en:'Evolution Pokémon',pt:'Pokémon Evolução'},    types:['normal'], stats:[55,55,50,45,65,55], abilities:[{name:'Run Away'},{name:'Adaptability'}], height:0.3, weight:6.5, gen:1, habitat:'urban', evolves:[133,134,135,136] },
  { id:134,name:'Vaporeon',   genus:{en:'Bubble Jet',       pt:'Pokémon Aquoso'},      types:['water'], stats:[130,65,60,110,95,65], abilities:[{name:'Water Absorb'}], height:1.0, weight:29.0, gen:1, habitat:'water', evolves:[133,134] },
  { id:135,name:'Jolteon',    genus:{en:'Lightning Pokémon',pt:'Pokémon Relâmpago'},   types:['electric'], stats:[65,65,60,110,95,130], abilities:[{name:'Volt Absorb'}], height:0.8, weight:24.5, gen:1, habitat:'urban', evolves:[133,135] },
  { id:136,name:'Flareon',    genus:{en:'Flame Pokémon',    pt:'Pokémon Chama'},       types:['fire'], stats:[65,130,60,95,110,65], abilities:[{name:'Flash Fire'}], height:0.9, weight:25.0, gen:1, habitat:'mountain', evolves:[133,136] },
  { id:35, name:'Clefairy',   genus:{en:'Fairy Pokémon',    pt:'Pokémon Fada'},        types:['fairy'], stats:[70,45,48,60,65,35], abilities:[{name:'Cute Charm'},{name:'Magic Guard'}], height:0.6, weight:7.5, gen:1, habitat:'cave', evolveLine:'clefairy' },
  { id:36, name:'Clefable',   genus:{en:'Fairy Pokémon',    pt:'Pokémon Fada'},        types:['fairy'], stats:[95,70,73,95,90,60], abilities:[{name:'Cute Charm'},{name:'Magic Guard'}], height:1.3, weight:40.0, gen:1, habitat:'cave', evolveLine:'clefairy' },
  { id:37, name:'Vulpix',     genus:{en:'Fox Pokémon',      pt:'Pokémon Raposa'},      types:['fire'], stats:[38,41,40,50,65,65], abilities:[{name:'Flash Fire'},{name:'Drought',hidden:true}], height:0.6, weight:9.9, gen:1, habitat:'grassland', evolveLine:'vulpix' },
  { id:38, name:'Ninetales',  genus:{en:'Fox Pokémon',      pt:'Pokémon Raposa'},      types:['fire'], stats:[73,76,75,81,100,100], abilities:[{name:'Flash Fire'},{name:'Drought',hidden:true}], height:1.1, weight:19.9, gen:1, habitat:'grassland', evolveLine:'vulpix' },
  { id:39, name:'Jigglypuff', genus:{en:'Balloon Pokémon',  pt:'Pokémon Balão'},       types:['normal','fairy'], stats:[115,45,20,45,25,20], abilities:[{name:'Cute Charm'},{name:'Competitive'}], height:0.5, weight:5.5, gen:1, habitat:'grassland', evolveLine:'jigglypuff' },
  { id:40, name:'Wigglytuff', genus:{en:'Balloon Pokémon',  pt:'Pokémon Balão'},       types:['normal','fairy'], stats:[140,70,45,85,50,45], abilities:[{name:'Cute Charm'},{name:'Competitive'}], height:1.0, weight:12.0, gen:1, habitat:'grassland', evolveLine:'jigglypuff' },
  { id:43, name:'Oddish',     genus:{en:'Weed Pokémon',     pt:'Pokémon Erva-daninha'},types:['grass','poison'], stats:[45,50,55,75,65,30], abilities:[{name:'Chlorophyll'}], height:0.5, weight:5.4, gen:1, habitat:'grassland', evolveLine:'oddish' },
  { id:44, name:'Gloom',      genus:{en:'Weed Pokémon',     pt:'Pokémon Erva-daninha'},types:['grass','poison'], stats:[60,65,70,85,75,40], abilities:[{name:'Chlorophyll'}], height:0.8, weight:8.6, gen:1, habitat:'grassland', evolveLine:'oddish' },
  { id:45, name:'Vileplume',  genus:{en:'Flower Pokémon',   pt:'Pokémon Flor'},        types:['grass','poison'], stats:[75,80,85,110,90,50], abilities:[{name:'Chlorophyll'}], height:1.2, weight:18.6, gen:1, habitat:'grassland', evolveLine:'oddish' },
  { id:50, name:'Diglett',    genus:{en:'Mole Pokémon',     pt:'Pokémon Toupeira'},    types:['ground'], stats:[10,55,25,35,45,95], abilities:[{name:'Sand Veil'},{name:'Arena Trap'}], height:0.2, weight:0.8, gen:1, habitat:'cave', evolveLine:'diglett' },
  { id:51, name:'Dugtrio',    genus:{en:'Mole Pokémon',     pt:'Pokémon Toupeira'},    types:['ground'], stats:[35,100,50,50,70,120], abilities:[{name:'Sand Veil'},{name:'Arena Trap'}], height:0.7, weight:33.3, gen:1, habitat:'cave', evolveLine:'diglett' },
  { id:54, name:'Psyduck',    genus:{en:'Duck Pokémon',     pt:'Pokémon Pato'},        types:['water'], stats:[50,52,48,65,50,55], abilities:[{name:'Damp'},{name:'Cloud Nine'}], height:0.8, weight:19.6, gen:1, habitat:'water', evolveLine:'psyduck' },
  { id:55, name:'Golduck',    genus:{en:'Duck Pokémon',     pt:'Pokémon Pato'},        types:['water'], stats:[80,82,78,95,80,85], abilities:[{name:'Damp'},{name:'Cloud Nine'}], height:1.7, weight:76.6, gen:1, habitat:'water', evolveLine:'psyduck' },
  { id:58, name:'Growlithe',  genus:{en:'Puppy Pokémon',    pt:'Pokémon Filhote'},     types:['fire'], stats:[55,70,45,70,50,60], abilities:[{name:'Intimidate'},{name:'Flash Fire'}], height:0.7, weight:19.0, gen:1, habitat:'grassland', evolveLine:'growlithe' },
  { id:59, name:'Arcanine',   genus:{en:'Legendary Pokémon',pt:'Pokémon Lendário'},    types:['fire'], stats:[90,110,80,100,80,95], abilities:[{name:'Intimidate'},{name:'Flash Fire'}], height:1.9, weight:155.0, gen:1, habitat:'grassland', evolveLine:'growlithe' },
  { id:63, name:'Abra',       genus:{en:'Psi Pokémon',      pt:'Pokémon Psi'},         types:['psychic'], stats:[25,20,15,105,55,90], abilities:[{name:'Synchronize'},{name:'Inner Focus'}], height:0.9, weight:19.5, gen:1, habitat:'urban', evolveLine:'abra' },
  { id:64, name:'Kadabra',    genus:{en:'Psi Pokémon',      pt:'Pokémon Psi'},         types:['psychic'], stats:[40,35,30,120,70,105], abilities:[{name:'Synchronize'},{name:'Inner Focus'}], height:1.3, weight:56.5, gen:1, habitat:'urban', evolveLine:'abra' },
  { id:65, name:'Alakazam',   genus:{en:'Psi Pokémon',      pt:'Pokémon Psi'},         types:['psychic'], stats:[55,50,45,135,95,120], abilities:[{name:'Synchronize'},{name:'Inner Focus'}], height:1.5, weight:48.0, gen:1, habitat:'urban', evolveLine:'abra' },
  { id:66, name:'Machop',     genus:{en:'Superpower Pokémon',pt:'Pokémon Super-Força'},types:['fighting'], stats:[70,80,50,35,35,35], abilities:[{name:'Guts'},{name:'No Guard'}], height:0.8, weight:19.5, gen:1, habitat:'mountain', evolveLine:'machop' },
  { id:67, name:'Machoke',    genus:{en:'Superpower Pokémon',pt:'Pokémon Super-Força'},types:['fighting'], stats:[80,100,70,50,60,45], abilities:[{name:'Guts'},{name:'No Guard'}], height:1.5, weight:70.5, gen:1, habitat:'mountain', evolveLine:'machop' },
  { id:68, name:'Machamp',    genus:{en:'Superpower Pokémon',pt:'Pokémon Super-Força'},types:['fighting'], stats:[90,130,80,65,85,55], abilities:[{name:'Guts'},{name:'No Guard'}], height:1.6, weight:130.0, gen:1, habitat:'mountain', evolveLine:'machop' },
  { id:92, name:'Gastly',     genus:{en:'Gas Pokémon',      pt:'Pokémon Gás'},         types:['ghost','poison'], stats:[30,35,30,100,35,80], abilities:[{name:'Levitate'}], height:1.3, weight:0.1, gen:1, habitat:'rare', evolveLine:'gastly' },
  { id:93, name:'Haunter',    genus:{en:'Gas Pokémon',      pt:'Pokémon Gás'},         types:['ghost','poison'], stats:[45,50,45,115,55,95], abilities:[{name:'Levitate'}], height:1.6, weight:0.1, gen:1, habitat:'rare', evolveLine:'gastly' },
  { id:94, name:'Gengar',     genus:{en:'Shadow Pokémon',   pt:'Pokémon Sombra'},      types:['ghost','poison'], stats:[60,65,60,130,75,110], abilities:[{name:'Cursed Body'}], height:1.5, weight:40.5, gen:1, habitat:'rare', evolveLine:'gastly' },
  { id:131,name:'Lapras',     genus:{en:'Transport Pokémon',pt:'Pokémon Transporte'},  types:['water','ice'], stats:[130,85,80,85,95,60], abilities:[{name:'Water Absorb'},{name:'Shell Armor'}], height:2.5, weight:220.0, gen:1, habitat:'water', evolveLine:'lapras' },
  { id:143,name:'Snorlax',    genus:{en:'Sleeping Pokémon', pt:'Pokémon Dorminhoco'},  types:['normal'], stats:[160,110,65,65,110,30], abilities:[{name:'Immunity'},{name:'Thick Fat'}], height:2.1, weight:460.0, gen:1, habitat:'rare', evolveLine:'snorlax' },
  { id:144,name:'Articuno',   genus:{en:'Freeze Pokémon',   pt:'Pokémon Congelar'},    types:['ice','flying'], stats:[90,85,100,95,125,85], abilities:[{name:'Pressure'}], height:1.7, weight:55.4, gen:1, habitat:'rare', evolveLine:'articuno' },
  { id:145,name:'Zapdos',     genus:{en:'Electric Pokémon', pt:'Pokémon Elétrico'},    types:['electric','flying'], stats:[90,90,85,125,90,100], abilities:[{name:'Pressure'}], height:1.6, weight:52.6, gen:1, habitat:'rare', evolveLine:'zapdos' },
  { id:146,name:'Moltres',    genus:{en:'Flame Pokémon',    pt:'Pokémon Chama'},       types:['fire','flying'], stats:[90,100,90,125,85,90], abilities:[{name:'Pressure'}], height:2.0, weight:60.0, gen:1, habitat:'rare', evolveLine:'moltres' },
  { id:150,name:'Mewtwo',     genus:{en:'Genetic Pokémon',  pt:'Pokémon Genético'},    types:['psychic'], stats:[106,110,90,154,90,130], abilities:[{name:'Pressure'},{name:'Unnerve',hidden:true}], height:2.0, weight:122.0, gen:1, habitat:'rare', evolveLine:'mewtwo' },
  { id:151,name:'Mew',        genus:{en:'New Species',      pt:'Espécie Nova'},        types:['psychic'], stats:[100,100,100,100,100,100], abilities:[{name:'Synchronize'}], height:0.4, weight:4.0, gen:1, habitat:'rare', evolveLine:'mew' },
];

// Add evolveLine to existing entries (line key = root pokemon en-name lowercased)
[
  [1,'bulbasaur'],[2,'bulbasaur'],[3,'bulbasaur'],
  [4,'charmander'],[5,'charmander'],[6,'charmander'],
  [7,'squirtle'],[8,'squirtle'],[9,'squirtle'],
  [10,'caterpie'],[11,'caterpie'],[12,'caterpie'],
  [16,'pidgey'],[17,'pidgey'],[18,'pidgey'],
  [19,'rattata'],[20,'rattata'],
  [25,'pikachu'],[26,'pikachu'],
  [74,'geodude'],[75,'geodude'],[76,'geodude'],
  [95,'onix'],
  [129,'magikarp'],[130,'magikarp'],
  [133,'eevee'],[134,'eevee'],[135,'eevee'],[136,'eevee'],
].forEach(([id, line]) => { const p = POKEMON.find(x => x.id===id); if (p) p.evolveLine = line; });

// Branching evolution lines — graph form
const EVOLUTION_LINES = {
  bulbasaur: { root:1,   transitions:[{from:1,to:2,via:'Lv 16'},{from:2,to:3,via:'Lv 32'}] },
  charmander:{ root:4,   transitions:[{from:4,to:5,via:'Lv 16'},{from:5,to:6,via:'Lv 36'}] },
  squirtle:  { root:7,   transitions:[{from:7,to:8,via:'Lv 16'},{from:8,to:9,via:'Lv 36'}] },
  caterpie:  { root:10,  transitions:[{from:10,to:11,via:'Lv 7'},{from:11,to:12,via:'Lv 10'}] },
  pidgey:    { root:16,  transitions:[{from:16,to:17,via:'Lv 18'},{from:17,to:18,via:'Lv 36'}] },
  rattata:   { root:19,  transitions:[{from:19,to:20,via:'Lv 20'}] },
  pikachu:   { root:172, transitions:[{from:172,to:25,via:'High Friendship'},{from:25,to:26,via:'Thunder Stone'}] },
  geodude:   { root:74,  transitions:[{from:74,to:75,via:'Lv 25'},{from:75,to:76,via:'Trade'}] },
  onix:      { root:95,  transitions:[] },
  magikarp:  { root:129, transitions:[{from:129,to:130,via:'Lv 20'}] },
  eevee:     { root:133, transitions:[
    {from:133,to:134,via:'Water Stone'},
    {from:133,to:135,via:'Thunder Stone'},
    {from:133,to:136,via:'Fire Stone'},
  ] },
  clefairy:  { root:35,  transitions:[{from:35,to:36,via:'Moon Stone'}] },
  vulpix:    { root:37,  transitions:[{from:37,to:38,via:'Fire Stone'}] },
  jigglypuff:{ root:39,  transitions:[{from:39,to:40,via:'Moon Stone'}] },
  oddish:    { root:43,  transitions:[{from:43,to:44,via:'Lv 21'},{from:44,to:45,via:'Leaf Stone'}] },
  diglett:   { root:50,  transitions:[{from:50,to:51,via:'Lv 26'}] },
  psyduck:   { root:54,  transitions:[{from:54,to:55,via:'Lv 33'}] },
  growlithe: { root:58,  transitions:[{from:58,to:59,via:'Fire Stone'}] },
  abra:      { root:63,  transitions:[{from:63,to:64,via:'Lv 16'},{from:64,to:65,via:'Trade'}] },
  machop:    { root:66,  transitions:[{from:66,to:67,via:'Lv 28'},{from:67,to:68,via:'Trade'}] },
  gastly:    { root:92,  transitions:[{from:92,to:93,via:'Lv 25'},{from:93,to:94,via:'Trade'}] },
  lapras:    { root:131, transitions:[] },
  snorlax:   { root:143, transitions:[] },
  articuno:  { root:144, transitions:[] },
  zapdos:    { root:145, transitions:[] },
  moltres:   { root:146, transitions:[] },
  mewtwo:    { root:150, transitions:[] },
  mew:       { root:151, transitions:[] },
};

const MOVES = {
  25: [
    { lvl:1,  name:'Thunder Shock', type:'electric', cat:'special',  pow:40,  acc:100 },
    { lvl:1,  name:'Growl',         type:'normal',   cat:'status',   pow:null,acc:100 },
    { lvl:8,  name:'Quick Attack',  type:'normal',   cat:'physical', pow:40,  acc:100 },
    { lvl:15, name:'Thunder Wave',  type:'electric', cat:'status',   pow:null,acc:100 },
    { lvl:22, name:'Spark',         type:'electric', cat:'physical', pow:65,  acc:100 },
    { lvl:29, name:'Thunderbolt',   type:'electric', cat:'special',  pow:90,  acc:100 },
    { lvl:36, name:'Slam',          type:'normal',   cat:'physical', pow:80,  acc:75 },
    { lvl:43, name:'Thunder',       type:'electric', cat:'special',  pow:110, acc:70 },
    { lvl:50, name:'Agility',       type:'psychic',  cat:'status',   pow:null,acc:null },
  ],
  4: [
    { lvl:1,  name:'Scratch',       type:'normal', cat:'physical', pow:40, acc:100 },
    { lvl:1,  name:'Growl',         type:'normal', cat:'status',   pow:null, acc:100 },
    { lvl:7,  name:'Ember',         type:'fire',   cat:'special',  pow:40, acc:100 },
    { lvl:13, name:'Smokescreen',   type:'normal', cat:'status',   pow:null, acc:100 },
    { lvl:19, name:'Dragon Breath', type:'dragon', cat:'special',  pow:60, acc:100 },
    { lvl:25, name:'Fire Fang',     type:'fire',   cat:'physical', pow:65, acc:95 },
    { lvl:31, name:'Slash',         type:'normal', cat:'physical', pow:70, acc:100 },
    { lvl:37, name:'Flamethrower',  type:'fire',   cat:'special',  pow:90, acc:100 },
  ],
  1: [
    { lvl:1,  name:'Tackle',        type:'normal', cat:'physical', pow:40, acc:100 },
    { lvl:1,  name:'Growl',         type:'normal', cat:'status',   pow:null, acc:100 },
    { lvl:7,  name:'Vine Whip',     type:'grass',  cat:'physical', pow:45, acc:100 },
    { lvl:13, name:'Leech Seed',    type:'grass',  cat:'status',   pow:null, acc:90 },
    { lvl:20, name:'Razor Leaf',    type:'grass',  cat:'physical', pow:55, acc:95 },
    { lvl:27, name:'Sweet Scent',   type:'normal', cat:'status',   pow:null, acc:100 },
    { lvl:34, name:'Sleep Powder',  type:'grass',  cat:'status',   pow:null, acc:75 },
    { lvl:41, name:'Solar Beam',    type:'grass',  cat:'special',  pow:120, acc:100 },
  ],
  7: [
    { lvl:1,  name:'Tackle',        type:'normal', cat:'physical', pow:40, acc:100 },
    { lvl:1,  name:'Tail Whip',     type:'normal', cat:'status',   pow:null, acc:100 },
    { lvl:5,  name:'Water Gun',     type:'water',  cat:'special',  pow:40, acc:100 },
    { lvl:12, name:'Bite',          type:'dark',   cat:'physical', pow:60, acc:100 },
    { lvl:19, name:'Aqua Tail',     type:'water',  cat:'physical', pow:90, acc:90 },
    { lvl:26, name:'Protect',       type:'normal', cat:'status',   pow:null, acc:null },
    { lvl:33, name:'Hydro Pump',    type:'water',  cat:'special',  pow:110, acc:80 },
    { lvl:40, name:'Skull Bash',    type:'normal', cat:'physical', pow:130, acc:100 },
  ],
  133: [
    { lvl:1,  name:'Tackle',        type:'normal', cat:'physical', pow:40, acc:100 },
    { lvl:1,  name:'Tail Whip',     type:'normal', cat:'status',   pow:null, acc:100 },
    { lvl:8,  name:'Quick Attack',  type:'normal', cat:'physical', pow:40, acc:100 },
    { lvl:15, name:'Bite',          type:'dark',   cat:'physical', pow:60, acc:100 },
    { lvl:22, name:'Sand Attack',   type:'ground', cat:'status',   pow:null, acc:100 },
    { lvl:29, name:'Take Down',     type:'normal', cat:'physical', pow:90, acc:85 },
    { lvl:36, name:'Last Resort',   type:'normal', cat:'physical', pow:140, acc:100 },
  ],
  150:[
    { lvl:1,  name:'Confusion',     type:'psychic',cat:'special',  pow:50, acc:100 },
    { lvl:1,  name:'Disable',       type:'normal', cat:'status',   pow:null, acc:100 },
    { lvl:14, name:'Psybeam',       type:'psychic',cat:'special',  pow:65, acc:100 },
    { lvl:22, name:'Recover',       type:'normal', cat:'status',   pow:null, acc:null },
    { lvl:33, name:'Psychic',       type:'psychic',cat:'special',  pow:90, acc:100 },
    { lvl:44, name:'Aura Sphere',   type:'fighting',cat:'special', pow:80, acc:100 },
    { lvl:55, name:'Future Sight',  type:'psychic',cat:'special',  pow:120, acc:100 },
    { lvl:70, name:'Psystrike',     type:'psychic',cat:'special',  pow:100, acc:100 },
  ],
  94: [
    { lvl:1,  name:'Lick',          type:'ghost',  cat:'physical', pow:30, acc:100 },
    { lvl:1,  name:'Hypnosis',      type:'psychic',cat:'status',   pow:null, acc:60 },
    { lvl:8,  name:'Mean Look',     type:'normal', cat:'status',   pow:null, acc:null },
    { lvl:15, name:'Night Shade',   type:'ghost',  cat:'special',  pow:0, acc:100 },
    { lvl:23, name:'Shadow Ball',   type:'ghost',  cat:'special',  pow:80, acc:100 },
    { lvl:32, name:'Sludge Bomb',   type:'poison', cat:'special',  pow:90, acc:100 },
    { lvl:42, name:'Dream Eater',   type:'psychic',cat:'special',  pow:100, acc:100 },
  ],
};

// Routes — FireRed Kanto subset
const ROUTES = [
  { id:'r1', name:'Route 1', region:'Kanto', terrain:'grassland', x:50,  y:88, neighbors:['pallet','viridian'],
    encounters:[
      { pid:16, method:'Grass',      lvl:[2,5], rate:50 },
      { pid:19, method:'Grass',      lvl:[2,5], rate:50 },
      { pid:25, method:'Grass·rare', lvl:[3,5], rate:5  },
    ]
  },
  { id:'viridian-forest', name:'Viridian Forest', region:'Kanto', terrain:'forest', x:50, y:62, neighbors:['r2','pewter'],
    encounters:[
      { pid:10, method:'Tall Grass', lvl:[3,5], rate:40 },
      { pid:11, method:'Tall Grass', lvl:[4,6], rate:20 },
      { pid:13, method:'Tall Grass', lvl:[3,5], rate:20 },
      { pid:25, method:'Tall Grass·rare', lvl:[3,5], rate:5 },
    ]
  },
  { id:'r2', name:'Route 2', region:'Kanto', terrain:'grassland', x:50, y:75, neighbors:['viridian','pewter'],
    encounters:[
      { pid:16, method:'Grass', lvl:[3,5], rate:45 },
      { pid:19, method:'Grass', lvl:[3,5], rate:45 },
      { pid:10, method:'Grass', lvl:[4,5], rate:10 },
    ]
  },
  { id:'mt-moon', name:'Mt. Moon', region:'Kanto', terrain:'cave', x:36, y:48, neighbors:['r3','r4'],
    encounters:[
      { pid:74, method:'Cave', lvl:[7,10], rate:60 },
      { pid:41, method:'Cave', lvl:[7,9],  rate:30 },
      { pid:35, method:'Cave', lvl:[8,10], rate:10 },
    ]
  },
  { id:'r3', name:'Route 3', region:'Kanto', terrain:'mountain', x:46, y:55, neighbors:['pewter','mt-moon'],
    encounters:[
      { pid:16, method:'Grass', lvl:[6,8],  rate:35 },
      { pid:19, method:'Grass', lvl:[6,8],  rate:35 },
      { pid:21, method:'Grass', lvl:[6,8],  rate:30 },
    ]
  },
  { id:'r4', name:'Route 4', region:'Kanto', terrain:'mountain', x:30, y:48, neighbors:['mt-moon','cerulean'],
    encounters:[
      { pid:21, method:'Grass', lvl:[8,12], rate:40 },
      { pid:23, method:'Grass', lvl:[6,10], rate:25 },
      { pid:19, method:'Grass', lvl:[8,12], rate:35 },
    ]
  },
  { id:'cerulean', name:'Cerulean City', region:'Kanto', terrain:'water', x:24, y:42, neighbors:['r4','r24'],
    encounters:[
      { pid:129, method:'Surf', lvl:[5,15], rate:90 },
      { pid:54,  method:'Surf', lvl:[10,20], rate:10 },
    ]
  },
  { id:'r24', name:'Route 24', region:'Kanto', terrain:'grassland', x:24, y:32, neighbors:['cerulean','r25'],
    encounters:[
      { pid:10, method:'Grass', lvl:[7,9],  rate:40 },
      { pid:13, method:'Grass', lvl:[6,8],  rate:30 },
      { pid:25, method:'Grass·rare', lvl:[8,12], rate:5 },
      { pid:64, method:'Grass', lvl:[10,12], rate:25 },
    ]
  },
  { id:'power-plant', name:'Power Plant', region:'Kanto', terrain:'urban', x:14, y:50, neighbors:['r10'],
    encounters:[
      { pid:25,  method:'Building', lvl:[22,26], rate:35 },
      { pid:81,  method:'Building', lvl:[20,25], rate:30 },
      { pid:100, method:'Building', lvl:[20,25], rate:25 },
      { pid:125, method:'Building·rare', lvl:[24,28], rate:10 },
    ]
  },
  { id:'cerulean-cave', name:'Cerulean Cave', region:'Kanto', terrain:'cave', x:18, y:38, neighbors:['cerulean'], postgame:true,
    encounters:[
      { pid:150, method:'Endgame', lvl:[70,70], rate:1 },
      { pid:42,  method:'Cave',    lvl:[55,60], rate:30 },
      { pid:64,  method:'Cave',    lvl:[55,60], rate:25 },
    ]
  },
];

// Cities (non-encounter map points for the route map)
const CITIES = [
  { id:'pallet',    name:'Pallet Town',   x:50, y:96 },
  { id:'viridian',  name:'Viridian City', x:50, y:70 },
  { id:'pewter',    name:'Pewter City',   x:42, y:52 },
  { id:'cerulean-city', name:'Cerulean',  x:24, y:42 },
  { id:'lavender',  name:'Lavender Town', x:60, y:50 },
];

// MAP_REGIONS — terrain polygons painted on the Kanto map.
// Coordinates in 0-100 SVG space; rendered behind nodes.
const MAP_REGIONS = [
  // Sea — full eastern + southern band
  { id:'sea-east',     terrain:'water', d:'M70 0 L100 0 L100 100 L78 100 L72 86 L75 70 L68 56 L72 38 L66 22 L70 8 Z' },
  { id:'sea-south',    terrain:'water', d:'M0 88 L20 92 L40 90 L60 94 L80 92 L100 96 L100 100 L0 100 Z' },
  { id:'sea-west',     terrain:'water', d:'M0 30 L10 28 L8 50 L12 70 L4 88 L0 92 Z' },
  // Mt. Moon range — west of pewter
  { id:'mountains',    terrain:'mountain', d:'M22 38 L40 40 L48 50 L40 58 L26 60 L18 52 Z' },
  // Viridian Forest
  { id:'viridian-forest', terrain:'forest', d:'M40 56 L60 56 L62 70 L56 76 L46 76 L40 70 Z' },
  // Grasslands south of Viridian
  { id:'grass-south',  terrain:'grassland', d:'M38 76 L62 76 L64 92 L40 94 L36 88 Z' },
  // Plains route 4 area
  { id:'grass-north',  terrain:'grassland', d:'M14 28 L36 28 L40 38 L30 42 L18 40 Z' },
  // Urban — Cerulean & Lavender areas
  { id:'urban-cerulean', terrain:'urban', d:'M16 38 L30 38 L30 48 L18 50 L14 44 Z' },
  { id:'urban-lavender', terrain:'urban', d:'M54 44 L66 44 L68 56 L56 58 L52 50 Z' },
  // Cave dark patch (Cerulean Cave entrance)
  { id:'cave-mt-moon', terrain:'cave', d:'M28 42 L42 44 L44 52 L34 54 L26 50 Z' },
];

// Auto-fill missing pokemon refs (e.g. pid:13, 21, 23, 35, 41, 42, 54, 64, 81, 100, 125, 172) — minimal stubs
const STUB = (id, name, types) => ({ id, name, genus:{en:'',pt:''}, types, stats:[50,50,50,50,50,50], abilities:[], height:0, weight:0, gen:1, habitat:'forest', evolves:[id] });
const POKEMON_BY_ID = Object.fromEntries(POKEMON.map(p => [p.id, p]));
[
  [13,'Weedle',['bug','poison']],
  [21,'Spearow',['normal','flying']],
  [23,'Ekans',['poison']],
  [35,'Clefairy',['fairy']],
  [41,'Zubat',['poison','flying']],
  [42,'Golbat',['poison','flying']],
  [54,'Psyduck',['water']],
  [64,'Kadabra',['psychic']],
  [81,'Magnemite',['electric','steel']],
  [100,'Voltorb',['electric']],
  [125,'Electabuzz',['electric']],
  [172,'Pichu',['electric']],
].forEach(([id,name,t]) => { if (!POKEMON_BY_ID[id]) POKEMON_BY_ID[id] = STUB(id, name, t); });

const UI = {
  en: {
    routes:'Routes', pokemon:'Pokémon', favorites:'Favorites', settings:'Settings',
    activeGame:'Active Game', change:'Change', back:'Back', search:'Search',
    info:'Info', moves:'Moves', locations:'Locations', evolution:'Evolution',
    baseStats:'Base stats', total:'Total', abilities:'Abilities', hidden:'Hidden',
    typeEffectiveness:'Type effectiveness', weakTo:'Weak to', resists:'Resists', immuneTo:'Immune to',
    height:'Height', weight:'Weight', generation:'Generation', habitat:'Habitat',
    distinct:'distinct Pokémon', encounters:'encounters', firstOnly:'First encounter only',
    hideCaught:'Hide already caught', filterAll:'All', filterByType:'Filter by type',
    filterByGen:'Generation', filterByStat:'Stats', filterByHabitat:'Habitat',
    compareAdd:'Add to compare', compareWith:'Compare with…', compare:'Compare',
    light:'Light', dark:'Dark', language:'Language', theme:'Theme',
    cmdPalette:'Type a Pokémon, route, or command…', cmdHint:'⌘K to open',
    seenIn:'Seen in', noResults:'No results', viewMap:'View map', viewList:'View list',
    catalogTitle:'Field Guide', catalogSub:'Kanto Region · FireRed', browseAll:'Browse all',
    minBst:'Min BST', maxBst:'Max BST',
    selectBoth:'Select two Pokémon to compare',
    cmdCategory:{nav:'Navigate', mon:'Pokémon', route:'Routes', action:'Actions'},
    actions:{toggleTheme:'Toggle light/dark', toggleLang:'Switch to Português', openMap:'Open Kanto map', openTeam:'Open Team builder'},
    team:'Team', teamBuilder:'Team Builder', teamSlot:'Slot', teamEmpty:'Empty slot — click to pick',
    teamPick:'Pick a Pokémon', teamCoverage:'Defensive coverage', teamOffense:'Offensive reach',
    teamAvg:'Average BST', teamWeakDouble:'Doubly weak', teamCovered:'Resisted by ≥1', teamUncovered:'No resist',
    teamHint:'Six creatures · matchup-aware lineup',
    superEffective:'Super effective', notVeryEff:'Not very effective', noEffect:'No effect',
    pickFav:'Star to favorite',
  },
  pt: {
    routes:'Rotas', pokemon:'Pokémon', favorites:'Favoritos', settings:'Ajustes',
    activeGame:'Jogo ativo', change:'Trocar', back:'Voltar', search:'Buscar',
    info:'Info', moves:'Golpes', locations:'Locais', evolution:'Evolução',
    baseStats:'Atributos base', total:'Total', abilities:'Habilidades', hidden:'Oculta',
    typeEffectiveness:'Efetividade de tipo', weakTo:'Fraco contra', resists:'Resiste a', immuneTo:'Imune a',
    height:'Altura', weight:'Peso', generation:'Geração', habitat:'Habitat',
    distinct:'Pokémon distintos', encounters:'encontros', firstOnly:'Apenas 1º encontro',
    hideCaught:'Ocultar já capturados', filterAll:'Todos', filterByType:'Filtrar por tipo',
    filterByGen:'Geração', filterByStat:'Atributos', filterByHabitat:'Habitat',
    compareAdd:'Adicionar à comparação', compareWith:'Comparar com…', compare:'Comparar',
    light:'Claro', dark:'Escuro', language:'Idioma', theme:'Tema',
    cmdPalette:'Digite um Pokémon, rota ou comando…', cmdHint:'⌘K para abrir',
    seenIn:'Visto em', noResults:'Sem resultados', viewMap:'Ver mapa', viewList:'Ver lista',
    catalogTitle:'Guia de Campo', catalogSub:'Região de Kanto · FireRed', browseAll:'Ver todos',
    minBst:'BST mín.', maxBst:'BST máx.',
    selectBoth:'Selecione dois Pokémon para comparar',
    cmdCategory:{nav:'Navegar', mon:'Pokémon', route:'Rotas', action:'Ações'},
    actions:{toggleTheme:'Alternar claro/escuro', toggleLang:'Switch to English', openMap:'Abrir mapa de Kanto', openTeam:'Abrir construtor de time'},
    team:'Time', teamBuilder:'Construtor de Time', teamSlot:'Vaga', teamEmpty:'Vaga vazia — clique para escolher',
    teamPick:'Escolha um Pokémon', teamCoverage:'Cobertura defensiva', teamOffense:'Alcance ofensivo',
    teamAvg:'BST médio', teamWeakDouble:'Fraqueza dupla', teamCovered:'Resistido por ≥1', teamUncovered:'Sem resistência',
    teamHint:'Seis criaturas · time consciente de matchups',
    superEffective:'Super efetivo', notVeryEff:'Pouco efetivo', noEffect:'Sem efeito',
    pickFav:'Estrela favorita',
  }
};

const STAT_LABEL = {
  en: ['HP','Attack','Defense','Sp. Atk','Sp. Def','Speed'],
  pt: ['HP','Ataque','Defesa','Atq. Esp.','Def. Esp.','Velocidade'],
};

// Offensive effectiveness — what does an attacker of type `atk` do against defender of type `def`?
function offensiveMultiplier(atk, defTypes) {
  let m = 1;
  for (const def of defTypes) {
    const chart = TYPE_CHART[def] || {};
    if (atk in chart) m *= chart[atk];
  }
  return m;
}

window.PokedexData = {
  TYPES, TYPE_LABEL, TYPE_CHART, HABITAT, SPRITE, ART,
  POKEMON, POKEMON_BY_ID, MOVES, ROUTES, CITIES, MAP_REGIONS, EVOLUTION_LINES,
  UI, STAT_LABEL, effectivenessFor, offensiveMultiplier,
};
