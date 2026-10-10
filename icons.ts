/**
 * True pixel-art icons: 16x16 hand-drawn grids, a 1px black outline and a solid
 * two-tone extrusion down-left, exactly like the clover. Each sprite is 20x20
 * native pixels and is shown with image-rendering: pixelated at 20/40/60px.
 */

export type IconName =
  | "bag" | "book" | "auto" | "lock" | "gem" | "dice" | "coin" | "star"
  | "gear" | "sparkle" | "dial" | "film" | "soundOn" | "soundOff" | "speed" | "log"
  | "rebirth" | "crystal" | "offline" | "quest"
  | "die1" | "dice2" | "flame" | "slots" | "bolt" | "lens" | "eye" | "map" | "crown"
  | "sparkles" | "arrowUp" | "crystals" | "medal" | "moneyBag" | "chest"
  | "calendar";

const PAL: Record<string, string> = {
  w: "#ffffff", l: "#e3eaef", g: "#a9b5bf", d: "#66737e", n: "#18222b",
  a: "#caffb2", G: "#4be866", M: "#22bd40", D: "#0e7b27",
  y: "#fff3a6", Y: "#ffcf3f", O: "#d08a16", B: "#855608",
  r: "#ffa9b7", R: "#ee4660", E: "#a51f39",
  p: "#ecd2ff", P: "#ac63ee", V: "#6531a6",
  c: "#c8f5ff", C: "#56c7f1", b: "#2b79be",
  f: "#ff7a2e", F: "#ffb13d", h: "#ffe98a", H: "#c0351c",
  i: "#eafcff", I: "#9fe6ff", J: "#5bb6f0", K: "#2e6fc7",
  s: "#ffc7dd", S: "#ff7fb0", T: "#ec2f8d", U: "#a80e5c",
  q: "#b8803a", Q: "#6e4614",
};

const SIDE = {
  green: ["#139a35", "#0a5f21"],
  gold: ["#c68412", "#7a4a08"],
  gray: ["#7b8892", "#3c4852"],
  purple: ["#7a3fc2", "#43207a"],
  cyan: ["#3b9fd0", "#1d5f8c"],
  fire: ["#c84a14", "#6f2208"],
  ice: ["#4d9fe0", "#245d9c"],
  pink: ["#a52866", "#571032"],
} as const;

const B = "................";

type IconDef = { rows: string[]; side: readonly [string, string] };

const ICONS: Record<string, IconDef> = {
  bag: {
    side: SIDE.green,
    rows: [
      ".....gggggg.....",
      "....lg....dg....",
      "....lg....dg....",
      "....lg....dg....",
      ".aaaaaaaaaaaaaa.",
      ".aGGGGGGGGGGGGM.",
      ".aGGGGGGGGGGGGM.",
      ".aGGGGwwGwwGGGM.",
      ".aGGGwwwwwwwGGM.",
      ".aGGGwwwnwwwGGM.",
      ".aGGGwwwwwwwGGM.",
      ".aGGGGwwGwwGGGM.",
      ".aGGGGGGGGGGGMM.",
      ".MMMMMMMMMMMMMM.",
      ".DDDDDDDDDDDDDD.",
      "..DDDDDDDDDDDD..",
    ],
  },
  book: {
    side: SIDE.purple,
    rows: [
      ".pppppppppppppp.",
      ".pVPPPPPPPPPPPV.",
      ".pVPPPPPPPPPPPV.",
      ".pVPPPGGPGGPPPV.",
      ".pVPPGGGGGGGPPV.",
      ".pVPPGGGDGGGPPV.",
      ".pVPPGGGGGGGPPV.",
      ".pVPPPGGPGGPPPV.",
      ".pVPPPPPPPPPPPV.",
      ".pVPPPPPPPPPPPV.",
      ".pVPPYYYYYYYPPV.",
      ".pVPPPPPPPPPPPV.",
      ".pVVVVVVVVVVVVV.",
      "..wwwwwwwwwwwwl.",
      "..llllllllllllg.",
      "...gggggggggggd.",
    ],
  },
  auto: {
    side: SIDE.green,
    rows: [
      B, B,
      "..aG.....aG.....",
      "..aGG....aGG....",
      "..aGGM...aGGM...",
      "..aGGGM..aGGGM..",
      "..aGGGGM.aGGGGM.",
      "..aGGGGM.aGGGGM.",
      "..aGGMMD.aGGMMD.",
      "..aGMMMD.aGMMMD.",
      "..aMMMD..aMMMD..",
      "..aMMD...aMMD...",
      "..aMD....aMD....",
      "..MD.....MD.....",
      B, B,
    ],
  },
  lock: {
    side: SIDE.gold,
    rows: [
      ".....llllll.....",
      "....ll....gg....",
      "....ll....gg....",
      "....ll....gg....",
      "....ll....gg....",
      "....ll....gg....",
      "..yyyyyyyyyyyy..",
      "..yYYYYYYYYYYO..",
      "..yYYYYYYYYYYO..",
      "..yYYYnnnnYYYO..",
      "..yYYYnnnnYYYO..",
      "..yYYYYnnYYYYO..",
      "..yYYYYnnYYYYO..",
      "..YYYYYYYYYYOO..",
      "..OOOOOOOOOOOO..",
      "..OOOOOOOOOOOO..",
    ],
  },
  gem: {
    side: SIDE.cyan,
    rows: [
      B, B, B,
      "....wwccccCC....",
      "...wwcccccCCC...",
      "..wwccccccCCCb..",
      ".wwcccccccCCCbb.",
      ".ccccccCCCCCCbb.",
      "..cccccCCCCCbb..",
      "...ccccCCCCbb...",
      "....cccCCCbb....",
      ".....ccCCbb.....",
      "......cCbb......",
      ".......Cb.......",
      B, B,
    ],
  },
  dice: {
    side: SIDE.gray,
    rows: [
      B,
      "..wwwwwwwwwwww..",
      ".wwwwwwwwwwwwwl.",
      ".wwnnwwwwwwnnwl.",
      ".wwnnwwwwwwnnwl.",
      ".wwwwwwwwwwwwwl.",
      ".wwwwwwwwwwwwwl.",
      ".wwwwwwnnwwwwwl.",
      ".wwwwwwnnwwwwwl.",
      ".wwwwwwwwwwwwwl.",
      ".wwwwwwwwwwwwwl.",
      ".wwnnwwwwwwnnwl.",
      ".wwnnwwwwwwnnwl.",
      ".lllllllllllllg.",
      "..gggggggggggg..",
      B,
    ],
  },
  coin: {
    side: SIDE.gold,
    rows: [
      B,
      ".....yyyYYY.....",
      "...yyYYYYYYOO...",
      "..yYYYYYYYYYYO..",
      ".yYYYYYYYYYYYYO.",
      ".yYYYYYBBYYYYYO.",
      ".yYYYYBBBBYYYYO.",
      ".yYYYBBBBBBYYYO.",
      ".yYYYBBBBBBYYYO.",
      ".yYYYYBBBBYYYYO.",
      ".yYYYYYBBYYYYYO.",
      ".YYYYYYYYYYYOOO.",
      "..YYYYYYYYOOOO..",
      "...YYYYYOOOOO...",
      ".....OOOOOO.....",
      B,
    ],
  },
  star: {
    side: SIDE.gold,
    rows: [
      B,
      ".......wO.......",
      ".......yO.......",
      "......yyOO......",
      "......yyOO......",
      ".yyyyyyyOOOOOOO.",
      "..yyyyyyOOOOOO..",
      "...yyyyyOOOOO...",
      "....yyyyOOOO....",
      "....yyyyOOOO....",
      "...yyyyyOOOOO...",
      "...yyyy..OOOO...",
      "..yyyy....OOOO..",
      "..yyy......OOO..",
      ".yyy........OOO.",
      B,
    ],
  },
  gear: {
    side: SIDE.gray,
    rows: [
      "......llgg......",
      "..ll..llgg..gd..",
      "...lllllgggdd...",
      "...lllllgggdd...",
      "..lllllggggddd..",
      "..lllllggggddd..",
      "llllllnnnngddddd",
      "llllllnnnngddddd",
      "llggggnnnndddddd",
      "llggggnnnndddddd",
      "..ggggdddddddd..",
      "..ggggdddddddd..",
      "...gggddddddd...",
      "...gddddddddd...",
      "..gd..dddd..dd..",
      "......dddd......",
    ],
  },
  sparkle: {
    side: SIDE.cyan,
    rows: [
      ".......wc.......",
      ".......wc.......",
      ".......wc.......",
      "......wwcc......",
      "......wwcc......",
      ".....wwwccc.....",
      "...wwwwwccccc...",
      ".wwwwwwwcccccCC.",
      ".wwwwwwwcccCCCC.",
      "...wwwwcccCCC...",
      ".....wwcCCC.....",
      "......wcCC......",
      "......wcCC......",
      ".......cC.......",
      ".......CC.......",
      ".......CC.......",
    ],
  },
  dial: {
    side: SIDE.green,
    rows: [
      B,
      ".....aaaGGG.....",
      "...aaGGGGGGMM...",
      "..aannnGGnnnMM..",
      ".aanGnnnnnnYnMM.",
      ".aannnnnnnYnnMM.",
      ".aaGnnnnnYnnnMM.",
      ".aannnnwwnnnGMM.",
      ".GGnnnnwwnnnnDD.",
      ".GGnnnnnnnnnnDD.",
      ".GGnGnnnnnnnnDD.",
      ".GGnnnnnnnnnnDD.",
      "..GGnnnnnnnnDD..",
      "...GGMMMMMMDD...",
      ".....GMMMDD.....",
      B,
    ],
  },
  film: {
    side: SIDE.gray,
    rows: [
      B, B,
      ".lllllllllllllg.",
      ".lnlnnnnnnnnlng.",
      ".lllnnannnnnlgg.",
      ".lnlnnaannnnlng.",
      ".lllnnaaannnlgg.",
      ".lnlnnaaaannlng.",
      ".lllnnaaaannlgg.",
      ".lnlnnaaannnlng.",
      ".lllnnaannnnlgg.",
      ".lnlnnannnnnlng.",
      ".lllnnnnnnnnlgg.",
      ".gggggggggggggd.",
      B, B,
    ],
  },
  soundOn: {
    side: SIDE.gray,
    rows: [
      B, B, B,
      ".......wl...G...",
      "......wll....G..",
      ".....wwll.G..G..",
      ".wwwwwwwl..G..G.",
      ".wwwwwwwl..G..G.",
      ".wwwwwwlg..G..G.",
      ".llllllgg..G..G.",
      ".....llgg.G..G..",
      "......lgg....G..",
      ".......gg...G...",
      B, B, B,
    ],
  },
  soundOff: {
    side: SIDE.gray,
    rows: [
      B, B, B,
      ".......wl.......",
      "......wll.......",
      ".....wwll.......",
      ".wwwwwwwl.R...R.",
      ".wwwwwwwl..R.R..",
      ".wwwwwwlg...R...",
      ".llllllgg..R.R..",
      ".....llgg.R...R.",
      "......lgg.......",
      ".......gg.......",
      B, B, B,
    ],
  },
  speed: {
    side: SIDE.gold,
    rows: [
      ".......wyYYO....",
      "......yyYYO.....",
      ".....yyYYO......",
      "....yyYYO.......",
      "...yyyyyyYYYYO..",
      ".......yyYYYO...",
      "......yyYYYO....",
      ".....yyYYYO.....",
      ".....yYYYO......",
      "....yYYYO.......",
      "....yYYO........",
      "...yYYO.........",
      "...yYO..........",
      "..yYO...........",
      "..YO............",
      B,
    ],
  },
  log: {
    side: SIDE.gray,
    rows: [
      B,
      "..wwwwwwwwwwww..",
      "..wwwwwwwwwwwl..",
      "..wwGGwdddddwl..",
      "..wwGGwdddddwl..",
      "..wwwwwwwwwwwl..",
      "..wwCCwdddddwl..",
      "..wwCCwdddddwl..",
      "..wwwwwwwwwwwl..",
      "..wwPPwdddddwl..",
      "..wwPPwdddddwl..",
      "..wwwwwwwwwwwl..",
      "..wwYYwdddddwl..",
      "..wwYYwdddddwl..",
      "..llllllllllgg..",
      B,
    ],
  },
  // classic circular "refresh / rebirth" arrows chasing clockwise:
  // the top arrow sweeps right and points down, the bottom arrow sweeps left and points up
  rebirth: {
    side: SIDE.pink,
    rows: [
      "................",
      ".......ws.......",
      "....wssSSsss....",
      "...sSSSTTSSSs...",
      "..sSSST..TSSSs..",
      ".........SSSSSss",
      "..........TSSTT.",
      "...S.......TST..",
      "..STS.......T...",
      ".STTTS..........",
      "STTTTTS.........",
      "..TTTTT..SSSST..",
      "...TTTTSSTTTU...",
      "....UUUTTUUU....",
      ".......UU.......",
      "................",
    ],
  },
  // a cut crystal shard with white facet lines
  crystal: {
    side: SIDE.ice,
    rows: [
      ".......ii.......",
      "......iiIi......",
      "......iIII......",
      ".....iiIIIJ.....",
      ".....iIIIJJ.....",
      "....iiIIIJJJ....",
      "....iIIiIJJJ....",
      "...iiIIiIJJJK...",
      "...iIIIiIJJJK...",
      "..iiIIIiIJJJKK..",
      "..iIIIIiIJJJKK..",
      "..iIIIIiIJJKKK..",
      "...IIIIiIJKKK...",
      "....IIIiJKKK....",
      ".....IIiKKK.....",
      "......IiKK......",
    ],
  },
  // A clean gold-rimmed clock: white face, tick marks, hands at 3 o'clock, red pivot.
  offline: {
    side: SIDE.gold,
    rows: [
      ".....yyyyyy.....",
      "...yyYYYYYYOO...",
      "..yYwwwdwwwwYO..",
      ".yYwwwwnwwwwwlO.",
      ".yYwwwwnwwwwwlO.",
      "yYwwwwwnwwwwwwlO",
      "yYwwwwwnwwwwwwlO",
      "yYdwwwwRnnnwwdlO",
      "yYwwwwwwwwwwwwlO",
      "yYwwwwwwwwwwwllO",
      ".yYwwwwwwwwwwlO.",
      ".yYwwwwwwwwwllO.",
      "..yYwwwdwwwllOO.",
      "...YYllllllOO...",
      ".....OOOOOO.....",
      B,
    ],
  },
  // A gold achievement badge with a bold white "!" quest mark.
  quest: {
    side: SIDE.gold,
    rows: [
      "......YYYY......",
      "....YYyyyyYY....",
      "...YyyGGGGyyY...",
      "..YyGGGGGGGGyY..",
      ".YyGGGGwwGGGGyY.",
      ".YGGGGGwwGGGGGY.",
      "YGGGGGGwwGGGGGGY",
      "YGGGGGGwwGGGGGGY",
      "YGGGGGGGGGGGGGGY",
      ".YGGGGGGGGGGGGY.",
      ".YyGGGGwwGGGGyY.",
      "..YyGGGGGGGGyY..",
      "...YyyGGGGyyY...",
      "....YYyyyyYY....",
      "......YYYY......",
      B,
    ],
  },
};

/* =========================================================
   DRAWING TOOLKIT
   Sprites are built from exact primitives on the 16x16 grid,
   so every shape is crisp, symmetric and intentional. A pixel
   at (x, y) is tested at its centre (x + 0.5, y + 0.5).
   ========================================================= */

type Grid = string[][];
type Shape = (px: number, py: number) => boolean;

const newGrid = (): Grid => Array.from({ length: 16 }, () => Array<string>(16).fill("."));

const put = (g: Grid, x: number, y: number, c: string) => {
  if (x >= 0 && x < 16 && y >= 0 && y < 16) g[y][x] = c;
};

/** Inclusive pixel-index rectangle. */
const area = (x0: number, y0: number, x1: number, y1: number): Shape =>
  (px, py) => px >= x0 && px <= x1 + 1 && py >= y0 && py <= y1 + 1;

const disc = (cx: number, cy: number, r: number): Shape =>
  (px, py) => (px - cx) ** 2 + (py - cy) ** 2 <= r * r;

const ellipse = (cx: number, cy: number, rx: number, ry: number): Shape =>
  (px, py) => ((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 <= 1;

const poly = (pts: Array<[number, number]>): Shape =>
  (px, py) => {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i];
      const [xj, yj] = pts[j];
      if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };

const and = (...shapes: Shape[]): Shape => (px, py) => shapes.every((s) => s(px, py));
const not = (shape: Shape): Shape => (px, py) => !shape(px, py);
const ring = (outer: Shape, inner: Shape): Shape => and(outer, not(inner));

/** Four-point glint: thin arms plus a small diamond core. */
const sparkle = (cx: number, cy: number, R: number, arm: number): Shape =>
  (px, py) => {
    const dx = Math.abs(px - cx);
    const dy = Math.abs(py - cy);
    return (dx <= arm && dy <= R) || (dy <= arm && dx <= R) || dx + dy <= R * 0.45;
  };

/** Paints every pixel whose centre passes the shape. */
const fill = (g: Grid, shape: Shape, c: string) => {
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (shape(x + 0.5, y + 0.5)) g[y][x] = c;
};
/** Recolours pixels that are already drawn and pass the shape. */
const over = (g: Grid, shape: Shape, c: string) => {
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (g[y][x] !== "." && shape(x + 0.5, y + 0.5)) g[y][x] = c;
};
const box = (g: Grid, x0: number, y0: number, x1: number, y1: number, c: string) => fill(g, area(x0, y0, x1, y1), c);
const toRows = (g: Grid): string[] => g.map((row) => row.join(""));

/* ---------------------------------------------------------
   Rarity tints. Each rarity's icon takes the colours of its
   rarity lettering, so the star matches the text exactly.
   --------------------------------------------------------- */

export type IconTint = { map?: Record<string, string>; side?: readonly [string, string]; rainbow?: boolean };

export const TIER_TINTS: Record<string, IconTint> = {
  uncommon: { map: { y: "#7dffe0", Y: "#3ff2c0", O: "#12806b", w: "#e6fff8" }, side: ["#1fae92", "#0b5e4e"] },
  rare: { map: { y: "#e2f8ff", Y: "#73d7ff", O: "#2f7fb8", w: "#ffffff" }, side: ["#4aa9dc", "#1f5f8f"] },
  epic: { map: { y: "#eedcff", Y: "#c07bff", O: "#5b2c8f", w: "#ffffff" }, side: ["#9250d6", "#43207a"] },
  legendary: { map: { y: "#fff3b0", Y: "#ffd23f", O: "#b77a0c", w: "#fff9d8" }, side: ["#d89a14", "#7a4a08"] },
  mythic: { map: { y: "#ffc2cf", Y: "#ff6782", O: "#a3203f", w: "#ffe6ec" }, side: ["#d23a5e", "#6b1028"] },
  divine: { map: { y: "#fff5dc", Y: "#ffcc92", O: "#b8763a", w: "#ffffff" }, side: ["#e6a062", "#7a4a1e"] },
  cosmic: { map: { y: "#dbe6ff", Y: "#9bb3ff", O: "#4d5fb8", w: "#ffffff" }, side: ["#6f85e0", "#2f3d86"] },
  eclipse: { map: { y: "#fbdcff", Y: "#c86bff", O: "#4a2a6e", w: "#fff1fb" }, side: ["#9b4fd6", "#3b1d5c"] },
  aurora: { map: { y: "#80ffbb", Y: "#64f0ef", O: "#4f7fd0", w: "#e9ffe3" }, side: ["#3fb8c9", "#23548f"] },
  singularity: { map: { y: "#dfd1ff", Y: "#9b82e0", O: "#50416e", w: "#faf2ff" }, side: ["#7c5fd0", "#3a2a66"] },
  prismatic: { rainbow: true, side: ["#a690ff", "#4e3a8a"] },
  solar: { map: { y: "#fff3b0", Y: "#ffb13d", O: "#9c4a0a", w: "#fffbe0" }, side: ["#e88a14", "#7a3e06"] },
  moonlit: { map: { y: "#f2f6ff", Y: "#c3d2ea", O: "#4a5a7a", w: "#ffffff" }, side: ["#9fb4d6", "#3d4f70"] },
  tidal: { map: { y: "#c9fbff", Y: "#3fb8c9", O: "#1b5f78", w: "#eafcff" }, side: ["#2a9fb3", "#124a5c"] },
  inferno: { map: { y: "#ffe98a", Y: "#ff7a2e", O: "#7a2508", w: "#fff3b0" }, side: ["#e0501a", "#6f2208"] },
  glacier: { map: { y: "#eafcff", Y: "#4d9fe0", O: "#245d9c", w: "#ffffff" }, side: ["#4d9fe0", "#1f4f85"] },
  sakura: { map: { y: "#ffe0ee", Y: "#ff9ac8", O: "#8a2a5e", w: "#ffffff" }, side: ["#e0649c", "#6a1e46"] },
  thunder: { map: { y: "#fffbe0", Y: "#fff36b", O: "#8a6a00", w: "#ffffff" }, side: ["#e8c81a", "#7a5c06"] },
  verdant: { map: { y: "#e6ffe0", Y: "#7dff7a", O: "#1f5f2a", w: "#f4fff2" }, side: ["#3fb84a", "#1a5a24"] },
  obsidian: { map: { y: "#ded0ff", Y: "#9250d6", O: "#2a1450", w: "#f2eaff" }, side: ["#5a2c9a", "#1c0d33"] },
  celestial: { map: { y: "#e8efff", Y: "#c8d8ff", O: "#2a3a7a", w: "#ffffff" }, side: ["#8aa2e0", "#2a3a6e"] },
  chrono: { map: { y: "#fff1cf", Y: "#e0a84e", O: "#5a3a10", w: "#fff9ec" }, side: ["#b8842e", "#5a3a10"] },
  infinite: { map: { y: "#fff6c2", Y: "#ffe27a", O: "#b5307a", w: "#ffffff" }, side: ["#d6a13a", "#7a2a5c"] },
};

/** Colour for one letter of a sprite, after any rarity tint. */
const colorFor = (letter: string, x: number, y: number, tint?: IconTint): string | undefined => {
  const base = PAL[letter];
  if (!base) return undefined;
  if (tint?.rainbow && "yYwO".includes(letter)) {
    const hue = (x * 26 + y * 17) % 360;
    const light = letter === "w" ? 94 : letter === "y" ? 80 : letter === "Y" ? 62 : 40;
    return `hsl(${hue} 95% ${light}%)`;
  }
  return tint?.map?.[letter] ?? base;
};

/* ---------------------------------------------------------
   Sprites
   --------------------------------------------------------- */

/** Gold star with a lit upper-left face, a bright rim, and a dark lower-right rim. */
function drawStar(): string[] {
  const g = newGrid();
  const cx = 7.5, cy = 8, R = 7.4, r = 3.3;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)]);
  }
  fill(g, poly(pts), "Y");
  over(g, (px, py) => px + py < 15.2, "y");
  const solid = (x: number, y: number) => x >= 0 && x < 16 && y >= 0 && y < 16 && g[y][x] !== ".";
  const edges: Array<[number, number, string]> = [];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      if (!solid(x, y)) continue;
      if (!solid(x - 1, y) || !solid(x, y - 1)) edges.push([x, y, "w"]);
      else if (!solid(x + 1, y) || !solid(x, y + 1)) edges.push([x, y, "O"]);
    }
  }
  for (const [x, y, c] of edges) g[y][x] = c;
  return toRows(g);
}

/** One white die with a single red pip. */
function drawDie1(): string[] {
  const g = newGrid();
  box(g, 2, 0, 13, 10, "w");
  box(g, 12, 0, 13, 8, "l");
  box(g, 2, 9, 13, 10, "g");
  box(g, 7, 4, 8, 5, "R");
  return toRows(g);
}

/** Two dice: a shaded back die and a bordered front die. */
function drawDice2(): string[] {
  const g = newGrid();
  box(g, 1, 0, 8, 7, "l");
  box(g, 1, 6, 8, 7, "g");
  box(g, 2, 1, 3, 2, "d");
  box(g, 2, 4, 3, 5, "d");
  box(g, 5, 1, 15, 10, "d");
  box(g, 6, 2, 14, 9, "w");
  box(g, 13, 2, 14, 9, "l");
  box(g, 6, 8, 14, 9, "l");
  box(g, 8, 3, 9, 4, "n");
  box(g, 11, 3, 12, 4, "n");
  box(g, 8, 6, 9, 7, "n");
  box(g, 11, 6, 12, 7, "n");
  return toRows(g);
}

/** Flame with a dark right flank, an amber body and a yellow core. */
function drawFlame(): string[] {
  const g = newGrid();
  const outer = poly([[8, 0], [11, 3], [12, 6], [11, 9], [5, 9], [4, 6], [5, 3]]);
  fill(g, outer, "f");
  over(g, and(outer, (px) => px > 9.5), "H");
  fill(g, poly([[8, 3], [10, 6], [10, 8], [6, 8], [6, 6]]), "F");
  fill(g, poly([[8, 5], [9, 7], [7, 7]]), "h");
  return toRows(g);
}

/** Slot machine: red cabinet, three reels with symbols, and a lever. */
function drawSlots(): string[] {
  const g = newGrid();
  box(g, 1, 3, 13, 9, "R");
  box(g, 13, 3, 13, 9, "E");
  box(g, 1, 9, 13, 9, "E");
  box(g, 1, 1, 13, 2, "Y");
  box(g, 2, 1, 12, 1, "y");
  box(g, 1, 10, 13, 11, "d");
  box(g, 1, 10, 13, 10, "g");
  for (const [x0, sym] of [[2, "C"], [6, "G"], [10, "Y"]] as const) {
    box(g, x0, 5, x0 + 2, 6, "w");
    box(g, x0, 7, x0 + 2, 7, "l");
    put(g, x0 + 1, 6, sym);
  }
  box(g, 14, 4, 14, 9, "g");
  box(g, 14, 2, 15, 3, "R");
  return toRows(g);
}

/** Lightning bolt with a lit upper-left face. */
function drawBolt(): string[] {
  const g = newGrid();
  const shape = poly([[10, 0], [4, 5], [8, 5], [5, 9], [12, 4], [8, 4], [11, 0]]);
  fill(g, shape, "y");
  over(g, and(shape, (px) => px > 8.5), "Y");
  over(g, and(shape, (px, py) => px < 7 && py < 3.5), "w");
  return toRows(g);
}

/** Magnifying glass: dark metal ring, icy lens, wood handle. */
function drawLens(): string[] {
  const g = newGrid();
  const outer = disc(7.5, 6.5, 5.6);
  const inner = disc(7.5, 6.5, 3.9);
  fill(g, ring(outer, inner), "d");
  over(g, and(ring(outer, inner), (px, py) => px < 7.5 && py < 6.5), "l");
  fill(g, inner, "c");
  over(g, and(inner, (px, py) => px > 7.5 && py > 6.5), "C");
  put(g, 5, 4, "w");
  put(g, 4, 5, "w");
  for (const [x, y] of [[11, 9], [12, 9], [12, 10], [13, 10], [13, 11], [14, 11], [14, 12], [15, 12], [15, 13]]) put(g, x, y, "q");
  put(g, 14, 12, "Q");
  put(g, 15, 13, "Q");
  return toRows(g);
}

/** Almond eye with a blue iris, a black pupil and a glint. */
function drawEye(): string[] {
  const g = newGrid();
  const outer = ellipse(7.5, 6.5, 7.6, 4.8);
  const sclera = ellipse(7.5, 6.5, 6.6, 3.9);
  fill(g, outer, "d");
  fill(g, sclera, "w");
  over(g, and(sclera, (_, py) => py > 8.6), "l");
  const iris = disc(7.5, 6.5, 3.1);
  fill(g, iris, "C");
  over(g, and(iris, (_, py) => py > 6.5), "b");
  fill(g, disc(7.5, 6.5, 1.5), "n");
  put(g, 6, 5, "w");
  return toRows(g);
}

/** Parchment map with fold lines, a red route and an X marker. */
function drawMap(): string[] {
  const g = newGrid();
  box(g, 1, 1, 14, 9, "y");
  box(g, 1, 1, 14, 1, "Y");
  box(g, 1, 9, 14, 9, "O");
  box(g, 1, 1, 1, 9, "Y");
  box(g, 5, 2, 5, 8, "Y");
  box(g, 10, 2, 10, 8, "Y");
  for (const [x, y] of [[2, 8], [3, 7], [4, 7], [6, 6], [7, 6], [8, 5]]) put(g, x, y, "R");
  for (const [x, y] of [[11, 3], [13, 3], [12, 4], [11, 5], [13, 5]]) put(g, x, y, "R");
  return toRows(g);
}

/** Three-spike gold crown with a band and jewels. */
function drawCrown(): string[] {
  const g = newGrid();
  const shape = poly([[2, 4], [5, 7], [8, 2], [11, 7], [14, 4], [14, 9], [2, 9]]);
  fill(g, shape, "y");
  over(g, and(shape, (_, py) => py > 7.5), "Y");
  over(g, and(shape, (px, py) => px > 10 && py < 7.5), "Y");
  box(g, 2, 9, 14, 9, "O");
  put(g, 8, 5, "R");
  put(g, 5, 8, "C");
  put(g, 11, 8, "C");
  put(g, 7, 5, "w");
  put(g, 8, 4, "w");
  return toRows(g);
}

/** One large sparkle with a white core, plus two small gold sparkles. */
function drawSparkles(): string[] {
  const g = newGrid();
  fill(g, sparkle(7.5, 6.5, 5.8, 1), "y");
  fill(g, sparkle(7.5, 6.5, 2, 1), "w");
  fill(g, sparkle(2.5, 2.5, 2.6, 0.6), "Y");
  fill(g, sparkle(13.5, 3.5, 2.2, 0.6), "Y");
  return toRows(g);
}

/** Green up-arrow with a lit left face and a dark shaft. */
function drawArrowUp(): string[] {
  const g = newGrid();
  const shape = poly([[8, 0], [14, 6], [10, 6], [10, 10], [6, 10], [6, 6], [2, 6]]);
  fill(g, shape, "G");
  over(g, and(shape, (px) => px > 8), "M");
  over(g, and(shape, (_, py) => py > 8.5), "D");
  over(g, and(shape, (px, py) => px < 7.5 && py < 5), "a");
  return toRows(g);
}

/** A cluster of three ice crystals. */
function drawCrystals(): string[] {
  const g = newGrid();
  const left = poly([[2, 4], [5, 6], [5, 10], [1, 9]]);
  const right = poly([[12, 3], [14, 6], [13, 10], [11, 9]]);
  const center = poly([[8, 0], [11, 4], [10, 10], [6, 10], [5, 4]]);
  fill(g, left, "I");
  over(g, and(left, (px) => px > 3.5), "J");
  fill(g, right, "J");
  over(g, and(right, (px) => px > 13), "K");
  fill(g, center, "i");
  over(g, and(center, (px) => px > 8.5), "I");
  over(g, and(center, (px, py) => px > 9 && py > 6), "J");
  put(g, 7, 2, "w");
  put(g, 7, 3, "w");
  put(g, 6, 5, "w");
  return toRows(g);
}

/** Medal on a red and white ribbon. */
function drawMedal(): string[] {
  const g = newGrid();
  fill(g, poly([[3, 0], [6, 0], [8, 5], [5, 5]]), "R");
  fill(g, poly([[10, 0], [13, 0], [11, 5], [8, 5]]), "E");
  fill(g, disc(7.5, 7.5, 4.6), "O");
  fill(g, disc(7.5, 7.5, 3.6), "y");
  over(g, and(disc(7.5, 7.5, 3.6), (px, py) => px > 7.5 && py > 7.5), "Y");
  fill(g, disc(7.5, 7.5, 1.4), "w");
  return toRows(g);
}

/** Money bag with a green body, a tied neck and a gold coin. */
function drawMoneyBag(): string[] {
  const g = newGrid();
  box(g, 5, 0, 10, 2, "M");
  box(g, 4, 2, 11, 3, "O");
  const body = disc(7.5, 9.5, 5.7);
  fill(g, body, "G");
  over(g, and(body, (px, py) => px > 8 && py > 8.5), "M");
  over(g, and(body, (px, py) => px < 6 && py < 9), "a");
  const coin = disc(7.5, 7.5, 2.4);
  fill(g, coin, "y");
  over(g, and(coin, (px, py) => px > 7.5 && py > 7.5), "Y");
  return toRows(g);
}

/** Treasure chest with metal bands, a lock and coins spilling from the lid. */
function drawChest(): string[] {
  const g = newGrid();
  box(g, 1, 4, 14, 10, "Q");
  box(g, 1, 1, 14, 4, "q");
  box(g, 1, 4, 14, 4, "Q");
  box(g, 1, 8, 14, 8, "q");
  box(g, 7, 1, 8, 10, "Y");
  box(g, 6, 5, 9, 7, "y");
  put(g, 7, 6, "n");
  put(g, 8, 6, "n");
  for (const [x, y] of [[3, 0], [4, 0], [7, 0], [8, 0], [10, 0], [11, 0]]) put(g, x, y, y === 0 && (x === 7 || x === 8) ? "Y" : "y");
  return toRows(g);
}

/** Calendar page: red header with binder rings, a grid of days, one ticked day. */
function drawCalendar(): string[] {
  const g = newGrid();
  box(g, 1, 2, 14, 14, "w");
  box(g, 1, 2, 14, 5, "R");
  box(g, 1, 14, 14, 14, "l");
  box(g, 4, 0, 5, 3, "n");
  box(g, 10, 0, 11, 3, "n");
  for (const [x, y] of [[3, 8], [6, 8], [9, 8], [12, 8], [3, 11], [6, 11], [12, 11]]) box(g, x, y, x + 1, y + 1, "g");
  box(g, 9, 11, 10, 12, "G");
  put(g, 10, 11, "w");
  return toRows(g);
}

const DRAWN: Record<string, IconDef> = {
  die1: { side: SIDE.gray, rows: drawDie1() },
  dice2: { side: SIDE.gray, rows: drawDice2() },
  flame: { side: SIDE.fire, rows: drawFlame() },
  slots: { side: ["#a8323f", "#5a1420"], rows: drawSlots() },
  bolt: { side: SIDE.gold, rows: drawBolt() },
  lens: { side: SIDE.gray, rows: drawLens() },
  eye: { side: SIDE.cyan, rows: drawEye() },
  map: { side: ["#c9a24a", "#6e4f1a"], rows: drawMap() },
  crown: { side: SIDE.gold, rows: drawCrown() },
  sparkles: { side: SIDE.gold, rows: drawSparkles() },
  arrowUp: { side: SIDE.green, rows: drawArrowUp() },
  crystals: { side: SIDE.ice, rows: drawCrystals() },
  medal: { side: SIDE.gold, rows: drawMedal() },
  moneyBag: { side: SIDE.green, rows: drawMoneyBag() },
  chest: { side: ["#8a5a1e", "#3d2404"], rows: drawChest() },
  star: { side: SIDE.gold, rows: drawStar() },
  calendar: { side: SIDE.gray, rows: drawCalendar() },
};
Object.assign(ICONS, DRAWN);

const W = 16;
const PAD = 1;
const OFFSETS: Array<[number, number, 0 | 1]> = [[-1, 0, 0], [-1, 1, 0], [-2, 1, 1], [-2, 2, 1]];
const SIZE = W + 2 + PAD * 2; // 20 native pixels

const cache = new Map<string, string>();

const toGray = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const v = Math.round((0.3 * r + 0.59 * g + 0.11 * b) * 0.88);
  const h = v.toString(16).padStart(2, "0");
  return `#${h}${h}${h}`;
};

function normalize(rows: string[]): string[] {
  const out = rows.map((row) => row.padEnd(W, ".").slice(0, W));
  while (out.length < W) out.push(".".repeat(W));
  return out.slice(0, W);
}

/* ---------------------------------------------------------
   Pixel type used to burn text straight into a sprite.
   Digits are 3px wide, some letters 4 or 5, all 5px tall.
   --------------------------------------------------------- */

const FONT: Record<string, string[]> = {
  "0": ["###", "#.#", "#.#", "#.#", "###"],
  "1": [".#.", ".##", ".#.", ".#.", "###"],
  "2": ["###", "..#", "###", "#..", "###"],
  "3": ["###", "..#", "###", "..#", "###"],
  "4": ["#.#", "#.#", "###", "..#", "..#"],
  "5": ["###", "#..", "###", "..#", "###"],
  "6": ["###", "#..", "###", "#.#", "###"],
  "7": ["###", "..#", "..#", "..#", "..#"],
  "8": ["###", "#.#", "###", "#.#", "###"],
  "9": ["###", "#.#", "###", "..#", "###"],
  A: [".##.", "#..#", "####", "#..#", "#..#"],
  B: ["###.", "#..#", "###.", "#..#", "###."],
  K: ["#..#", "#.#.", "##..", "#.#.", "#..#"],
  L: ["#..", "#..", "#..", "#..", "###"],
  M: ["#...#", "##.##", "#.#.#", "#...#", "#...#"],
  X: ["#...#", ".#.#.", "..#..", ".#.#.", "#...#"],
  D: ["###.", "#..#", "#..#", "#..#", "###."],
  V: ["#...#", "#...#", "#...#", ".#.#.", "..#.."],
  P: ["####", "#..#", "####", "#...", "#..."],
  S: ["####", "#...", "####", "...#", "####"],
  O: [".##.", "#..#", "#..#", "#..#", ".##."],
  C: [".##.", "#..#", "#...", "#..#", ".##."],
  T: ["#####", "..#..", "..#..", "..#..", "..#.."],
  U: ["#...#", "#...#", "#...#", "#...#", ".###."],
  // narrow multiplication mark, centred on the 5px baseline
  x: ["...", "#.#", ".#.", "#.#", "..."],
};

/** Burns `text` into the lower strip of a sprite on a dark plate. */
function stampText(rows: string[], text: string): string[] {
  const glyphs = text
    .split("")
    .map((c) => FONT[c] ?? FONT[c.toUpperCase()])
    .filter((g): g is string[] => Array.isArray(g));
  if (!glyphs.length) return rows;

  const textW = glyphs.reduce((sum, g) => sum + g[0].length, 0) + (glyphs.length - 1);
  const plateTop = 9;
  const plateH = 7; // rows 9..15, so the badge anchors to the bottom edge
  const plateW = Math.min(W, textW + 2);
  const plateX = Math.max(0, Math.floor((W - plateW) / 2));
  const textX = plateX + Math.max(0, Math.floor((plateW - textW) / 2));

  const out = rows.map((row) => row.split(""));
  for (let y = plateTop; y < Math.min(W, plateTop + plateH); y++) {
    for (let x = plateX; x < plateX + plateW; x++) out[y][x] = "n";
  }
  let x = textX;
  for (const glyph of glyphs) {
    for (let gy = 0; gy < glyph.length; gy++) {
      for (let gx = 0; gx < glyph[gy].length; gx++) {
        const tx = x + gx;
        if (glyph[gy][gx] === "#" && tx >= 0 && tx < W) out[plateTop + 1 + gy][tx] = "w";
      }
    }
    x += glyph[0].length + 1;
  }
  return out.map((row) => row.join(""));
}

/**
 * Returns a data URL for a 20x20 pixel sprite.
 * `muted` renders it in grayscale, `stamp` burns pixel text into the lower strip.
 */
export function getPixelIconUrl(name: IconName, muted = false, stamp?: string, tintId?: string): string {
  const key = `${name}:${muted ? 1 : 0}:${stamp ?? ""}:${tintId ?? ""}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const def = ICONS[name];
  const tintSpec = tintId ? TIER_TINTS[tintId] : undefined;
  const sideColors = tintSpec?.side ?? def.side;
  const plain = normalize(def.rows);
  const rows = stamp ? stampText(plain, stamp) : plain;
  const tint = (hex: string) => (muted ? toGray(hex) : hex);
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;

  const ox = PAD + 2;
  const oy = PAD;
  const cells: Array<[number, number, string]> = [];
  for (let y = 0; y < W; y++) {
    for (let x = 0; x < W; x++) {
      const letter = rows[y][x];
      const color = letter === "." ? undefined : colorFor(letter, x, y, tintSpec);
      if (color) cells.push([x, y, color]);
    }
  }

  // 1px black outline around the art plus its whole extrusion
  const mask = new Uint8Array(SIZE * SIZE);
  for (const [x, y] of cells) {
    for (const [dx, dy] of [[0, 0, 0] as const, ...OFFSETS]) {
      const cx = ox + x + dx;
      const cy = oy + y + dy;
      for (let ay = -1; ay <= 1; ay++) {
        for (let ax = -1; ax <= 1; ax++) mask[(cy + ay) * SIZE + cx + ax] = 1;
      }
    }
  }
  ctx.fillStyle = "#050a0e";
  for (let i = 0; i < mask.length; i++) {
    if (mask[i]) ctx.fillRect(i % SIZE, Math.floor(i / SIZE), 1, 1);
  }

  // solid extrusion, far to near
  for (let i = OFFSETS.length - 1; i >= 0; i--) {
    const [dx, dy, far] = OFFSETS[i];
    ctx.fillStyle = tint(sideColors[far]);
    for (const [x, y] of cells) ctx.fillRect(ox + x + dx, oy + y + dy, 1, 1);
  }

  // the lit front face
  for (const [x, y, color] of cells) {
    ctx.fillStyle = tint(color);
    ctx.fillRect(ox + x, oy + y, 1, 1);
  }

  const url = canvas.toDataURL("image/png");
  cache.set(key, url);
  return url;
}
