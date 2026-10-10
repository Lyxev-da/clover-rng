/**
 * Pixel-art 3D four-leaf clover renderer.
 *
 * Every clover shares the same bevel, shine and solid extrusion treatment as
 * the original green clover, but each rarity now has its OWN leaf silhouette
 * (round, pointed, spiky, blocky, gem-cut, scalloped, chamfered, serrated...)
 * plus its own palette ramp and surface pattern. Everything is drawn on
 * integer cells, so there is no smoothing or blur.
 * A real image at `src/assets/clover.(png|webp|jpg|jpeg)` replaces the common one.
 */

const supplied = Object.values(
  import.meta.glob<string>("./assets/clover.{png,webp,jpg,jpeg}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
)[0];

export type CloverPaint = { hue: number; rainbow?: boolean };

type HSL = [number, number, number];
type Role =
  | "slit" | "shine" | "rim" | "right" | "down" | "ul" | "ur" | "dl" | "dr"
  | "innerLit" | "innerShadow" | "face";

type Cell = {
  x: number; y: number;
  dx: number; dy: number;
  u: number; v: number;
  d: number;
  q: number;
  role: Role;
  interior: boolean;
  gloss: boolean;
  base: HSL;
};
type CellColor = string | HSL | undefined;

/** Tests a leaf-local pixel (u, v >= 0): does this leaf include it? */
type LeafShape = (u: number, v: number) => boolean;

type Style = {
  hue: number;
  rainbow?: boolean;
  hueShift?: number;
  sat?: number;
  lightAdd?: number;
  face?: [number, number];
  faceSat?: [number, number];
  roles?: Partial<Record<Role, HSL>>;
  side?: [HSL, HSL];
  /** This rarity's own leaf silhouette. Falls back to the original clover. */
  shape?: LeafShape;
  cell?: (c: Cell) => CellColor;
};

const GRID = 23;
const CENTER = 11;
const DEPTH_X = 2.4;
const DEPTH_Y = 3.1;
const OUTLINE = 1.05;
const QUAD_HUES = [335, 48, 188, 268];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const shade = (c: HSL, dl: number): HSL => [c[0], c[1], clamp(c[2] + dl, 3, 98)];
const css = (c: string | HSL) =>
  typeof c === "string"
    ? c
    : `hsl(${((c[0] % 360) + 360) % 360},${clamp(c[1], 0, 100).toFixed(1)}%,${clamp(c[2], 0, 100).toFixed(1)}%)`;

const hash = (x: number, y: number) => {
  let h = Math.imul(x + 101, 374761393) ^ Math.imul(y + 211, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
};

/** [saturation, lightness] for each shading role, tuned from the original green clover. */
const ROLES: Record<Exclude<Role, "face">, [number, number]> = {
  shine: [100, 94], rim: [100, 80], right: [87, 67], down: [77, 37],
  ul: [92, 73], ur: [80, 62], dl: [72, 43], dr: [76, 37],
  innerLit: [88, 67], innerShadow: [72, 46], slit: [89, 25],
};

/* ------------------------------------------------------------------ */
/*  Leaf silhouettes — one per rarity                                  */
/*  Each is a superellipse variant, a cut, or a scallop on the edge.   */
/* ------------------------------------------------------------------ */

const BASE_LEAF: LeafShape = (u, v) => u ** 3 + v ** 3 <= 11.4 ** 3;

const LEAVES: Record<string, LeafShape> = {
  // Mint: a perfectly round, chunky leaf.
  mint: (u, v) => u * u + v * v <= 11.9 ** 2,
  // Frost: sharpened into a diamond point along the leaf diagonal.
  frost: (u, v) => u + v <= 13.4,
  // Void: serrated spiky edge, every third boundary pixel removed.
  void: (u, v) => {
    if (!BASE_LEAF(u, v)) return false;
    return u ** 3 + v ** 3 <= 8.2 ** 3 || (u + v) % 3 !== 0;
  },
  // Gold: a regal blocky leaf with softly rounded corners.
  gold: (u, v) => u <= 9.8 && v <= 9.8 && u * v <= 46,
  // Ruby: a chamfered gem octagon.
  ruby: (u, v) => u <= 9.6 && v <= 9.6 && u + v <= 15.2,
  // Seraph: scalloped feather edges, like layered plumage.
  seraph: (u, v) => BASE_LEAF(u, v) && (Math.hypot(u, v) <= 8.6 || (u + v) % 2 === 0),
  // Nebula: a broad, soft, slightly squarer-than-round leaf.
  nebula: (u, v) => u ** 2.6 + v ** 2.6 <= 12 ** 2.6,
  // Eclipse: the far corner is sliced off, like a bitten moon.
  eclipse: (u, v) => BASE_LEAF(u, v) && !(u > 7.4 && v > 7.4),
  // Aurora: a serrated, wave-swept leaf edge.
  aurora: (u, v) => BASE_LEAF(u, v) && (u + v <= 14.6 || (u + v) % 4 < 2),
  // Singularity: a stretched leaf, pulled by gravity.
  singularity: (u, v) => u * u + (v * 1.22) ** 2 <= 11.9 ** 2,
  // Prism: a pointed diamond-cut leaf.
  prism: (u, v) => u + v <= 15.2 && u <= 10.2 && v <= 10.2,
};

function inLeafWith(x: number, y: number, lobe: LeafShape) {
  if (x < 0 || y < 0 || x >= GRID || y >= GRID) return false;
  const u = Math.abs(x - CENTER);
  const v = Math.abs(y - CENTER);
  if (!lobe(u, v)) return false;
  if (u === 0 && v >= 8) return false;
  if (u <= 1 && v >= 10) return false;
  if (v === 0 && u >= 8) return false;
  if (v <= 1 && u >= 10) return false;
  return true;
}

function isSlitWith(x: number, y: number, lobe: LeafShape) {
  if (!inLeafWith(x, y, lobe)) return false;
  const u = Math.abs(x - CENTER);
  const v = Math.abs(y - CENTER);
  return (u === 0 && v >= 3 && v <= 7) || (v === 0 && u >= 3 && u <= 7);
}

function roleOf(x: number, y: number, lobe: LeafShape): Role {
  if (isSlitWith(x, y, lobe)) return "slit";
  const empty = (ax: number, ay: number) => !inLeafWith(ax, ay, lobe) || isSlitWith(ax, ay, lobe);
  const up = empty(x, y - 1);
  const left = empty(x - 1, y);
  if (up && left) return "shine";
  if (up || left) return "rim";
  if (empty(x + 1, y)) return "right";
  if (empty(x, y + 1)) return "down";
  if (empty(x - 1, y - 1)) return "ul";
  if (empty(x + 1, y - 1)) return "ur";
  if (empty(x - 1, y + 1)) return "dl";
  if (empty(x + 1, y + 1)) return "dr";
  if (empty(x - 2, y) || empty(x, y - 2)) return "innerLit";
  if (empty(x + 2, y) || empty(x, y + 2)) return "innerShadow";
  return "face";
}

type StaticCell = Omit<Cell, "base">;
type CellSet = {
  cells: StaticCell[];
  paths: Map<string, { outline: Path2D; quads: Path2D[] }>;
};

function buildCells(lobe: LeafShape): StaticCell[] {
  const cells: StaticCell[] = [];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      if (!inLeafWith(x, y, lobe)) continue;
      const role = roleOf(x, y, lobe);
      const empty = (ax: number, ay: number) => !inLeafWith(ax, ay, lobe) || isSlitWith(ax, ay, lobe);
      const dx = x - CENTER;
      const dy = y - CENTER;
      cells.push({
        x, y, dx, dy,
        u: Math.abs(dx), v: Math.abs(dy),
        d: Math.hypot(dx, dy),
        q: (x < CENTER ? 0 : 1) + (y < CENTER ? 0 : 2),
        role,
        interior: role === "face" || role === "innerLit" || role === "innerShadow",
        gloss: role !== "slit" && empty(x, y - 1) && !empty(x - 1, y),
      });
    }
  }
  return cells;
}

const cellSets = new WeakMap<LeafShape, CellSet>();

function cellSetFor(style: Style): CellSet {
  const lobe = style.shape ?? BASE_LEAF;
  let set = cellSets.get(lobe);
  if (!set) {
    set = { cells: buildCells(lobe), paths: new Map() };
    cellSets.set(lobe, set);
  }
  return set;
}

function pathsFor(set: CellSet, S: number, pad: number) {
  const key = `${S}:${pad}`;
  let paths = set.paths.get(key);
  if (!paths) {
    const outline = new Path2D();
    const quads = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
    for (const c of set.cells) {
      outline.rect(c.x * S - pad, c.y * S - pad, S + pad * 2, S + pad * 2);
      quads[c.q].rect(c.x * S, c.y * S, S, S);
    }
    paths = { outline, quads };
    set.paths.set(key, paths);
  }
  return paths;
}

function baseColor(style: Style, c: StaticCell): HSL {
  const override = style.roles?.[c.role];
  if (override) return override;
  const hue = style.rainbow ? QUAD_HUES[c.q] : style.hue;
  let s: number;
  let l: number;
  if (c.role === "face") {
    const t = (c.x + c.y) / ((GRID - 1) * 2);
    const fs = style.faceSat ?? [86, 79];
    const fl = style.face ?? [58, 42];
    s = lerp(fs[0], fs[1], t);
    l = lerp(fl[0], fl[1], t);
  } else {
    [s, l] = ROLES[c.role];
    l = clamp(l + (style.lightAdd ?? 0), 4, 99);
  }
  s = clamp(s * (style.sat ?? 1), 0, 100);
  return [hue + (style.hueShift ?? 0) * ((l - 55) / 45), s, l];
}

/* ------------------------------------------------------------------ */
/*  Per-tier surface patterns                                          */
/* ------------------------------------------------------------------ */

const nebulaField = (x: number, y: number) =>
  Math.sin(x * 0.62 + 1.1) + Math.cos(y * 0.55) + Math.sin((x + y) * 0.37);

const COSMIC_STARS: Array<[number, number]> = [[5, 4], [17, 5], [4, 16], [18, 17]];
const AURORA: HSL[] = [
  [158, 78, 50], [154, 88, 56], [168, 90, 64], [190, 92, 62],
  [212, 92, 66], [250, 86, 70], [282, 82, 68],
];

const BASE_STYLES: Record<string, Style> = {
  // The original clover, unchanged.
  common: { hue: 131 },

  // Mint: round leaf, cool ramp, grooved leaf veins and dewdrops.
  uncommon: {
    hue: 163, hueShift: 18, sat: 0.95, lightAdd: 3, shape: LEAVES.mint,
    side: [[165, 62, 42], [172, 78, 17]],
    cell: (c) => {
      if (!c.interior) return;
      if (c.u === c.v && c.u >= 3 && c.u <= 9) return "#e2fff5";
      if (Math.abs(c.u - c.v) === 1 && c.u + c.v >= 6 && c.u + c.v <= 18) return shade(c.base, -13);
      if ((c.u === 8 && c.v === 4) || (c.u === 4 && c.v === 8)) return "#ffffff";
      if (
        (c.u === 9 && c.v === 4) || (c.u === 8 && c.v === 5) ||
        (c.u === 5 && c.v === 8) || (c.u === 4 && c.v === 9)
      ) return "#8cf0dc";
    },
  },

  // Frost: pointed leaf, icy ramp, a pixel snowflake in every leaf.
  rare: {
    hue: 200, hueShift: 14, sat: 0.9, lightAdd: 7, shape: LEAVES.frost,
    face: [70, 52], faceSat: [80, 85],
    roles: { shine: [190, 100, 98], rim: [192, 95, 90] },
    side: [[205, 70, 50], [214, 85, 26]],
    cell: (c) => {
      if (!c.interior) return;
      const du = c.u - 6;
      const dv = c.v - 6;
      if (Math.abs(du) <= 2 && Math.abs(dv) <= 2 && (du === 0 || dv === 0 || Math.abs(du) === Math.abs(dv))) {
        return du === 0 && dv === 0 ? "#ffffff" : "#e4fbff";
      }
      const h = hash(c.x, c.y);
      if (h % 17 === 0) return "#ffffff";
      if (h % 7 === 0) return shade(c.base, 7);
    },
  },

  // Void: spiky leaf, dark violet leaves, a black vortex core and star glints.
  epic: {
    hue: 272, hueShift: -8, sat: 0.9, lightAdd: -10, shape: LEAVES.void,
    face: [44, 26], faceSat: [70, 75],
    roles: { shine: [285, 100, 92], rim: [280, 100, 78] },
    side: [[272, 55, 26], [270, 70, 9]],
    cell: (c) => {
      if (c.role === "slit") return;
      const s = c.u + c.v;
      if (s <= 1) return "#07020f";
      if (s === 2) return "#1d0840";
      if (s === 3) return "#a35bf0";
      if (!c.interior) return;
      const du = c.u - 7;
      const dv = c.v - 7;
      if (du === 0 && dv === 0) return "#ffffff";
      if (Math.abs(du) + Math.abs(dv) === 1) return "#e6ccff";
      const h = hash(c.x, c.y);
      if (h % 23 === 0) return "#ffffff";
      if (h % 9 === 0) return shade(c.base, 9);
    },
  },

  // Gold: blocky royal leaf, ruby center, bright ring and polka studs.
  legendary: {
    hue: 44, hueShift: 20, sat: 1, lightAdd: 1, shape: LEAVES.gold,
    face: [60, 45],
    roles: { shine: [52, 100, 96], rim: [50, 100, 82] },
    side: [[40, 85, 46], [30, 90, 22]],
    cell: (c) => {
      if (c.role === "slit") return;
      const s = c.u + c.v;
      if (s <= 2) {
        const t = c.dx + c.dy;
        return t < 0 ? "#ffa3ae" : t === 0 ? "#f0344a" : "#9d1027";
      }
      if (s === 3) return "#fff4b0";
      if (c.interior && c.u % 4 === 2 && c.v % 4 === 2) return "#fff8cf";
      if (c.interior && c.u % 4 === 3 && c.v % 4 === 3) return shade(c.base, -11);
    },
  },

  // Ruby: chamfered gem leaf, every leaf split into light and dark facets.
  mythic: {
    hue: 349, hueShift: 16, sat: 0.95, lightAdd: -5, shape: LEAVES.ruby,
    face: [50, 32], faceSat: [90, 85],
    roles: { shine: [350, 100, 94], rim: [352, 100, 80] },
    side: [[348, 72, 38], [340, 85, 14]],
    cell: (c) => {
      if (c.role === "slit") return;
      const s = c.u + c.v;
      if (s <= 2) {
        const t = c.dx + c.dy;
        return t < 0 ? "#fff0f4" : t === 0 ? "#ffc4d1" : "#ff7c96";
      }
      if (s === 3) return "#ffd6df";
      if (!c.interior) return;
      if (c.u === c.v) return "#ffc2d0";
      if (hash(c.x, c.y) % 31 === 0) return "#ffb067";
      return c.u > c.v ? shade(c.base, 9) : shade(c.base, -10);
    },
  },

  // Seraph: scalloped feather leaf, ivory with a golden halo ring.
  divine: {
    hue: 40, hueShift: 14, sat: 0.55, lightAdd: 20, shape: LEAVES.seraph,
    face: [90, 76], faceSat: [65, 60],
    roles: {
      shine: [48, 100, 99], rim: [46, 95, 94], right: [40, 70, 84], down: [34, 78, 56],
      ul: [44, 80, 92], ur: [40, 70, 86], dl: [36, 72, 66], dr: [34, 78, 56],
      innerLit: [44, 85, 92], innerShadow: [38, 70, 70], slit: [32, 75, 40],
    },
    side: [[38, 60, 64], [34, 72, 38]],
    cell: (c) => {
      if (c.role === "slit") return;
      if (c.d < 1.7) return "#fffef4";
      if (c.d < 2.8) return "#f3c75a";
      if (c.d >= 5.3 && c.d < 6.7) return c.dx + c.dy < 0 ? "#ffe9a3" : "#e3a529";
      if (c.interior && hash(c.x, c.y) % 19 === 0) return "#ffffff";
    },
  },

  // Nebula: extra-large soft leaf, deep space, dithered clouds and stars.
  cosmic: {
    hue: 232, hueShift: -12, sat: 0.85, lightAdd: -14, shape: LEAVES.nebula,
    face: [34, 20], faceSat: [70, 75],
    roles: { shine: [215, 100, 90], rim: [222, 95, 78] },
    side: [[232, 55, 22], [232, 68, 8]],
    cell: (c) => {
      if (!c.interior) return;
      for (const [sx, sy] of COSMIC_STARS) {
        const dist = Math.abs(c.x - sx) + Math.abs(c.y - sy);
        if (dist === 0) return "#ffffff";
        if (dist === 1) return "#c9dcff";
      }
      const n = nebulaField(c.x, c.y);
      if (n > 1.5) return "#d46de6";
      if (n > 0.95) return (c.x + c.y) & 1 ? "#8a52dd" : "#6a3fc9";
      if (n < -1.6) return "#0c1346";
      const h = hash(c.x, c.y);
      if (h % 11 === 0) return "#ffffff";
      if (h % 17 === 1) return "#9fc0ff";
    },
  },

  // Eclipse: bitten leaf corner, near-black leaves, glowing violet rim.
  eclipse: {
    hue: 288, hueShift: 6, sat: 0.9, shape: LEAVES.eclipse,
    face: [16, 9], faceSat: [60, 55],
    roles: {
      shine: [305, 100, 90], rim: [300, 100, 70], right: [292, 90, 44], down: [285, 75, 22],
      ul: [300, 95, 62], ur: [295, 85, 48], dl: [288, 80, 34], dr: [285, 75, 24],
      innerLit: [296, 90, 36], innerShadow: [282, 65, 13], slit: [280, 70, 6],
    },
    side: [[290, 60, 22], [288, 70, 7]],
    cell: (c) => {
      if (c.role === "slit") return;
      if (c.d < 3.2) return "#04010a";
      if (c.d < 4.5) return c.dx + c.dy < 0 ? "#ffe3ff" : "#d95bff";
      if (c.d < 5.4) return "#6b2596";
      if (!c.interior) return;
      const h = hash(c.x, c.y);
      if (h % 17 === 0) return "#c15bf0";
      if (h % 41 === 3) return "#ffffff";
    },
  },

  // Aurora: serrated wave-swept leaf with northern-light bands.
  aurora: {
    hue: 168, hueShift: 22, sat: 0.95, lightAdd: 2, shape: LEAVES.aurora,
    roles: { shine: [150, 100, 95], rim: [160, 95, 84] },
    side: [[178, 72, 34], [205, 82, 13]],
    cell: (c) => {
      if (c.role === "slit" || !c.interior) return;
      const t = clamp((c.y * 0.8 + Math.sin(c.x * 0.5) * 2.4 + c.x * 0.3) / 24, 0, 0.999);
      const scaled = t * AURORA.length;
      const idx = Math.floor(scaled);
      const frac = scaled - idx;
      const band = frac > 0.62 && (c.x + c.y) & 1 ? AURORA[Math.min(idx + 1, AURORA.length - 1)] : AURORA[idx];
      if (hash(c.x, c.y) % 15 === 0) return "#f4fffb";
      return shade(band, c.role === "innerLit" ? 8 : c.role === "innerShadow" ? -12 : 0);
    },
  },

  // Singularity: stretched leaf, a black hole and a tilted accretion disc.
  singularity: {
    hue: 262, hueShift: 8, sat: 0.9, shape: LEAVES.singularity,
    face: [12, 7], faceSat: [55, 50],
    roles: {
      shine: [275, 100, 90], rim: [270, 95, 72], right: [264, 85, 40], down: [258, 70, 20],
      ul: [272, 92, 60], ur: [266, 82, 44], dl: [260, 75, 30], dr: [258, 70, 22],
      innerLit: [268, 85, 32], innerShadow: [256, 60, 12], slit: [255, 60, 4],
    },
    side: [[262, 55, 18], [258, 65, 5]],
    cell: (c) => {
      if (c.role === "slit") return;
      if (c.d < 2.8) return "#000000";
      const rx = c.dx * 0.906 - c.dy * 0.423;
      const ry = c.dx * 0.423 + c.dy * 0.906;
      const e = (rx / 10.4) ** 2 + (ry / 2.5) ** 2;
      if (e <= 1 && e >= 0.2) {
        if (e < 0.42) return "#ffffff";
        const t = (rx + 10) / 20;
        return t < 0.28 ? "#fff3ff" : t < 0.5 ? "#e2bcff" : t < 0.75 ? "#a96cf4" : "#6d33c6";
      }
      if (c.interior && hash(c.x, c.y) % 21 === 0) return "#bba6ff";
    },
  },

  // Prism: pointed diamond-cut leaf, four gem colors and a white prism core.
  prismatic: {
    hue: 0, rainbow: true, sat: 1, lightAdd: 2, shape: LEAVES.prism,
    cell: (c) => {
      if (c.role === "slit") return;
      const s = c.u + c.v;
      if (s <= 2) return "#ffffff";
      if (s === 3) return ["#ff9ac8", "#ffe58f", "#8defff", "#b8a6ff"][c.q];
      if (!c.interior) return;
      if (c.u === c.v) return "#ffffff";
      if (hash(c.x, c.y) % 13 === 0) return "#ffffff";
      return c.u > c.v ? shade(c.base, 9) : shade(c.base, -9);
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Crystal pass                                                       */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Twelve more rarities: their own silhouettes, palettes and patterns */
/* ------------------------------------------------------------------ */

const LEAVES_EXTRA: Record<string, LeafShape> = {
  // Solar: four flared plus-shaped leaves, like sun flares.
  solar: (u, v) => BASE_LEAF(u, v) && (u <= 5.6 || v <= 5.6 || u + v <= 8.5),
  // Moonlit: a round crescent bitten from the outer corner of every leaf.
  moonlit: (u, v) => BASE_LEAF(u, v) && (u - 11) ** 2 + (v - 11) ** 2 > 25,
  // Tidal: an outer edge that rolls in waves.
  tidal: (u, v) => u ** 3 + v ** 3 <= 11.4 ** 3 && v <= 9.6 + 1.4 * Math.sin(u * 1.1),
  // Inferno: a stepped, flame-tongued outline.
  inferno: (u, v) => BASE_LEAF(u, v) && u + v <= 13.5 - (Math.floor(v / 3) % 2) * 2,
  // Glacier: a hollow ring of ice with an open heart.
  glacier: (u, v) => BASE_LEAF(u, v) && u * u + v * v >= 18,
  // Sakura: petals that bulge diagonally, like five-petal blossoms.
  sakura: (u, v) => Math.hypot(u, v) <= 9.4 + 1.8 * Math.abs(Math.sin(Math.atan2(v, u) * 2)),
  // Thunder: a sharp diamond cut.
  thunder: (u, v) => u + v <= 12.6 && u <= 10.5 && v <= 10.5,
  // Verdant: a teardrop leaf that narrows toward the stem.
  verdant: (u, v) => BASE_LEAF(u, v) && u + v >= 5,
  // Obsidian: a squared gem with clipped corners.
  obsidian: (u, v) => u <= 10.2 && v <= 10.2 && !(u >= 8.5 && v >= 8.5),
  // Celestial: a four-point star leaf whose tips reach for the sky.
  celestial: (u, v) => u * v <= 9 + 0.5 * (u + v) && u <= 10.4 && v <= 10.4,
  // Chrono: gear-toothed edges, teeth every 30 degrees.
  chrono: (u, v) => {
    const teeth = Math.floor((Math.atan2(v, u) * 6) / Math.PI) % 2;
    return u * u + v * v <= (9 + teeth * 1.5) ** 2;
  },
  // Infinite: a broad squircle, the most complete leaf of all.
  infinite: (u, v) => u ** 5 + v ** 5 <= 11.2 ** 5,
};

const STYLES_EXTRA: Record<string, Style> = {
  solar: {
    hue: 38, hueShift: 14, sat: 1.05, lightAdd: 4, shape: LEAVES_EXTRA.solar,
    face: [66, 52], faceSat: [96, 90],
    roles: { shine: [54, 100, 97], rim: [48, 100, 84] },
    side: [[34, 92, 50], [22, 95, 24]],
    cell: (c) => {
      if (c.role === "slit") return;
      if (c.d < 2) return "#fffbe0";
      if (c.interior && (c.u + c.v) % 4 === 0) return "#ffe066";
      if (c.interior && c.u === c.v) return "#ff9f1a";
    },
  },
  moonlit: {
    hue: 222, hueShift: -10, sat: 0.35, lightAdd: 6, shape: LEAVES_EXTRA.moonlit,
    face: [88, 74], faceSat: [28, 22],
    roles: { shine: [220, 40, 99], rim: [222, 30, 92] },
    side: [[220, 22, 56], [226, 30, 22]],
    cell: (c) => {
      if (!c.interior) return;
      const h = hash(c.x, c.y);
      if (h % 7 === 0 && c.d > 4) return shade(c.base, -14);
      if (c.d < 2.5) return "#ffffff";
      if (h % 19 === 0) return "#ffffff";
    },
  },
  tidal: {
    hue: 192, hueShift: 10, sat: 0.95, lightAdd: 2, shape: LEAVES_EXTRA.tidal,
    side: [[196, 70, 46], [206, 85, 18]],
    cell: (c) => {
      if (!c.interior) return;
      if ((c.x + (c.y >> 1)) % 4 === 0) return "#c9fbff";
      if (hash(c.x, c.y) % 23 === 0) return "#ffffff";
      if (c.y > 14 && (c.x + c.y) % 3 === 0) return shade(c.base, -12);
    },
  },
  inferno: {
    hue: 16, hueShift: -6, sat: 1.05, lightAdd: 2, shape: LEAVES_EXTRA.inferno,
    face: [60, 42], faceSat: [100, 90],
    roles: { shine: [48, 100, 92], rim: [40, 100, 78] },
    side: [[18, 90, 42], [8, 90, 16]],
    cell: (c) => {
      if (c.role === "slit") return;
      if (c.y <= 7 && c.interior && hash(c.x, c.y) % 2 === 0) return "#ffe98a";
      if (c.y >= 15) return "#c0351c";
      if (c.interior && c.u === c.v && c.d > 3) return "#ffb13d";
    },
  },
  glacier: {
    hue: 205, hueShift: 10, sat: 0.85, lightAdd: 8, shape: LEAVES_EXTRA.glacier,
    face: [72, 56], faceSat: [72, 70],
    roles: { shine: [200, 100, 98], rim: [200, 90, 90] },
    side: [[210, 62, 52], [222, 70, 22]],
    cell: (c) => {
      if (!c.interior) return;
      if ((c.x * c.y) % 11 === 0 || (c.x - c.y) % 13 === 0) return "#eafcff";
      if (hash(c.x, c.y) % 9 === 0) return shade(c.base, 6);
    },
  },
  sakura: {
    hue: 330, hueShift: 8, sat: 0.9, lightAdd: 8, shape: LEAVES_EXTRA.sakura,
    face: [78, 62], faceSat: [70, 60],
    roles: { shine: [330, 100, 97], rim: [330, 90, 88] },
    side: [[334, 62, 58], [330, 60, 26]],
    cell: (c) => {
      if (c.role === "slit") return;
      if (c.interior && c.u === c.v) return "#fff0f6";
      if (c.interior && hash(c.x, c.y) % 13 === 0) return "#ff9ac8";
    },
  },
  thunder: {
    hue: 56, hueShift: 6, sat: 1.05, lightAdd: 4, shape: LEAVES_EXTRA.thunder,
    face: [70, 56], faceSat: [100, 95],
    roles: { shine: [60, 100, 98], rim: [56, 100, 86] },
    side: [[50, 95, 46], [40, 90, 20]],
    cell: (c) => {
      if (c.role === "slit") return;
      if (c.interior && (c.x * 2 + c.y) % 9 === 0) return "#fffbe0";
      if (c.interior && (c.x * 2 + c.y) % 9 === 1) return "#fff36b";
    },
  },
  verdant: {
    hue: 118, hueShift: 14, sat: 0.9, lightAdd: 2, shape: LEAVES_EXTRA.verdant,
    side: [[124, 60, 40], [130, 70, 16]],
    cell: (c) => {
      if (!c.interior) return;
      if (Math.abs(c.u - c.v) === 2 && c.u + c.v > 5) return "#b8ff9a";
      if (c.u === c.v && c.u > 3) return shade(c.base, 10);
    },
  },
  obsidian: {
    hue: 268, hueShift: -8, sat: 0.7, lightAdd: -22, shape: LEAVES_EXTRA.obsidian,
    face: [30, 16], faceSat: [60, 55],
    roles: { shine: [270, 80, 74], rim: [268, 70, 56] },
    side: [[262, 40, 20], [262, 50, 5]],
    cell: (c) => {
      if (c.role === "slit" || !c.interior) return;
      if (c.u > c.v) return shade(c.base, 7);
      if (hash(c.x, c.y) % 19 === 0) return "#d8c4ff";
    },
  },
  celestial: {
    hue: 236, hueShift: 6, sat: 0.9, lightAdd: -6, shape: LEAVES_EXTRA.celestial,
    face: [46, 26], faceSat: [70, 70],
    roles: { shine: [230, 100, 92], rim: [232, 95, 80] },
    side: [[236, 50, 34], [240, 60, 12]],
    cell: (c) => {
      if (!c.interior) return;
      if (c.d < 1.5) return "#ffffff";
      const h = hash(c.x, c.y);
      if (h % 9 === 0) return "#ffffff";
      if (h % 13 === 1) return "#9fb8ff";
    },
  },
  chrono: {
    hue: 34, hueShift: 10, sat: 0.8, lightAdd: 0, shape: LEAVES_EXTRA.chrono,
    face: [58, 40], faceSat: [70, 60],
    roles: { shine: [40, 90, 96], rim: [38, 80, 80] },
    side: [[30, 60, 40], [26, 60, 14]],
    cell: (c) => {
      if (c.role === "slit") return;
      if (c.d > 4.2 && c.d < 4.9) return "#fff1cf";
      if (c.d < 1.8) return "#5a3a10";
      if (c.interior && (c.u + c.v) % 5 === 0) return shade(c.base, -10);
    },
  },
  infinite: {
    hue: 290, hueShift: 16, sat: 1, lightAdd: 6, shape: LEAVES_EXTRA.infinite,
    face: [70, 50], faceSat: [95, 90],
    roles: { shine: [50, 100, 97], rim: [46, 100, 84] },
    side: [[300, 80, 48], [330, 85, 20]],
    cell: (c) => {
      if (c.role === "slit" || !c.interior) return;
      // lemniscate of Bernoulli: a figure-eight traced across every leaf
      const f = (c.dx * c.dx + c.dy * c.dy) ** 2 - 16 * (c.dx * c.dx - c.dy * c.dy);
      if (Math.abs(f) < 40) return "#ffffff";
    },
  },
};

const STYLES: Record<string, Style> = { ...BASE_STYLES, ...STYLES_EXTRA };

const CRYSTAL_SIDE: [HSL, HSL] = [[196, 70, 70], [222, 60, 30]];

function crystalFacet(c: StaticCell): CellColor {
  if (c.role === "slit") return "#dff8ff";
  if (c.role === "shine") return "#ffffff";
  if (c.role === "rim") return "#f1fdff";
  if (c.interior && c.u === c.v) return "#ffffff";
  if (c.interior && Math.abs(c.u - c.v) === 4 && c.u + c.v <= 18) return "#eafbff";
  if (c.interior && c.u === 7 && c.v === 7) return "#ffffff";
  return undefined;
}

function crystallize(ctx: CanvasRenderingContext2D, S: number, cells: StaticCell[]) {
  for (const c of cells) {
    const t = (c.x + c.y) / ((GRID - 1) * 2);
    const facet = crystalFacet(c);
    if (facet) {
      ctx.fillStyle = css(facet);
      ctx.globalAlpha = c.role === "slit" ? 0.85 : 0.92;
      ctx.fillRect(c.x * S, c.y * S, S, S);
      ctx.globalAlpha = 1;
      continue;
    }
    const light = lerp(0.52, 0.22, t);
    ctx.globalAlpha = light;
    ctx.fillStyle = t < 0.5 ? "#c9f4ff" : "#4f8fe8";
    ctx.fillRect(c.x * S, c.y * S, S, S);
    if ((c.x + c.y) % 4 === 0) {
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(c.x * S, c.y * S, S, S);
    }
    ctx.globalAlpha = 1;
  }
  for (const c of cells) {
    const d = c.x + c.y;
    if ((d >= 9 && d <= 11) || d === 14) {
      ctx.globalAlpha = d === 14 ? 0.28 : 0.5;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(c.x * S, c.y * S, S, S);
    }
  }
  ctx.globalAlpha = 1;
}

/* ------------------------------------------------------------------ */
/*  Renderer                                                           */
/* ------------------------------------------------------------------ */

function renderClover(key: string, S: number): HTMLCanvasElement {
  const crystal = key.endsWith(":crystal");
  const tierKey = crystal ? key.slice(0, -":crystal".length) : key;
  const style = STYLES[tierKey] ?? STYLES.common;
  const { cells } = cellSetFor(style);
  const dxPx = DEPTH_X * S;
  const dyPx = DEPTH_Y * S;
  const extraX = Math.ceil(dxPx);
  const extraY = Math.ceil(dyPx);
  const steps = Math.max(8, Math.ceil(Math.max(dxPx, dyPx)));
  const pad = Math.ceil(OUTLINE * S);
  const w = GRID * S + extraX + pad * 2;
  const h = GRID * S + extraY + pad * 2;
  const size = Math.max(w, h) + 2;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;

  const ox = Math.round((size - w) / 2) + pad + extraX;
  const oy = Math.round((size - h) / 2) + pad;
  const { outline, quads } = pathsFor(cellSetFor(style), S, pad);
  const at = (f: number) =>
    ctx.setTransform(1, 0, 0, 1, ox - Math.round(f * dxPx), oy + Math.round(f * dyPx));

  // 1. one continuous black outline around face + extrusion
  ctx.fillStyle = "#040704";
  for (let k = 0; k <= steps; k++) {
    at(k / steps);
    ctx.fill(outline);
  }

  // 2. solid extrusion, far to near, shaded smoothly
  for (let k = steps; k >= 1; k--) {
    const f = k / steps;
    at(f);
    for (let q = 0; q < 4; q++) {
      const hue = style.rainbow ? QUAD_HUES[q] : style.hue;
      const near = crystal ? CRYSTAL_SIDE[0] : style.side?.[0] ?? [hue, 72, 52];
      const far = crystal ? CRYSTAL_SIDE[1] : style.side?.[1] ?? [hue, 88, 20];
      ctx.fillStyle = css([lerp(near[0], far[0], f), lerp(near[1], far[1], f), lerp(near[2], far[2], f)]);
      ctx.fill(quads[q]);
    }
  }

  // 3. front face: palette ramp, then the tier's own pixel pattern
  ctx.setTransform(1, 0, 0, 1, ox, oy);
  const gloss = Math.max(1, Math.round(S * 0.4) - 1);
  for (const sc of cells) {
    const cell: Cell = { ...sc, base: baseColor(style, sc) };
    const custom = style.cell?.(cell);
    ctx.fillStyle = css(custom ?? cell.base);
    ctx.fillRect(sc.x * S, sc.y * S, S, S);
    if (sc.gloss) {
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(sc.x * S, sc.y * S, S, gloss);
    }
  }

  // 4. crystal variant: glass tint, facets and highlight over the tier art
  if (crystal) crystallize(ctx, S, cells);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return canvas;
}

const canvases = new Map<string, HTMLCanvasElement>();
const urls = new Map<string, string>();

export function getCloverCanvas(key: string, _paint?: CloverPaint, detail = 8): HTMLCanvasElement {
  const cacheKey = `${key}:${detail}`;
  let sprite = canvases.get(cacheKey);
  if (!sprite) {
    sprite = renderClover(key, detail);
    canvases.set(cacheKey, sprite);
  }
  return sprite;
}

export function getCloverUrl(key: string, paint?: CloverPaint, detail = 8): string {
  if (supplied && key === "common") return supplied;
  const cacheKey = `${key}:${detail}`;
  let url = urls.get(cacheKey);
  if (!url) {
    url = getCloverCanvas(key, paint, detail).toDataURL("image/png");
    urls.set(cacheKey, url);
  }
  return url;
}

/** Pre-render sprites one per timer tick so the first rare reveal never stalls. */
export function warmCloverSprites(tiers: Array<{ id: string; hue: number; rainbow?: boolean }>, crystals = false): () => void {
  let stopped = false;
  let i = 0;
  let timer = 0;
  const keys = [...tiers.map((t) => t.id), ...(crystals ? tiers.map((t) => `${t.id}:crystal`) : [])];
  const next = () => {
    if (stopped || i >= keys.length) return;
    getCloverUrl(keys[i++], undefined, 8);
    timer = window.setTimeout(next, 70);
  };
  timer = window.setTimeout(next, 180);
  return () => {
    stopped = true;
    window.clearTimeout(timer);
  };
}
