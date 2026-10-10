/**
 * Themed reveal cutscenes, one per clover.
 *
 * Each theme sets the charge-up line, the tagline on the reveal card, the pixel
 * motif that fills the screen and the palette (primary, light, deep). A theme
 * plays the first time its clover is unlocked, and for every crystal.
 */

export type Motif = "burst" | "rise" | "fall" | "orbit" | "vortex" | "twinkle" | "bolt" | "spin";

export type CutTheme = {
  word: string;
  line: string;
  motif: Motif;
  hue: number;
  colors: [string, string, string];
};

export const CUT_THEMES: Record<string, CutTheme> = {
  common: { word: "A LUCKY START", line: "Every legend begins with one little clover.", motif: "twinkle", hue: 131, colors: ["#5df25f", "#c8ffd0", "#0a7a22"] },
  uncommon: { word: "FRESH DEW", line: "Dewdrops gather on a cool mint leaf.", motif: "rise", hue: 162, colors: ["#3ff2c0", "#e2fff5", "#0b5e4e"] },
  rare: { word: "THE COLD BITES", line: "Frost creeps across every leaf.", motif: "fall", hue: 199, colors: ["#73d7ff", "#eafbff", "#1f5f8f"] },
  epic: { word: "THE VOID STIRS", line: "Darkness folds around the leaves.", motif: "vortex", hue: 272, colors: ["#c07bff", "#f0e0ff", "#43207a"] },
  legendary: { word: "THE CROWN AWAKENS", line: "Gold runs through every leaf.", motif: "burst", hue: 45, colors: ["#ffd23f", "#fff9d8", "#7a4a08"] },
  mythic: { word: "EMBERS CATCH FIRE", line: "A ruby heart ignites.", motif: "rise", hue: 352, colors: ["#ff6782", "#ffe6ec", "#6b1028"] },
  divine: { word: "A HALO DESCENDS", line: "Light falls from somewhere above.", motif: "fall", hue: 40, colors: ["#ffe9a3", "#fffef4", "#7a4a1e"] },
  cosmic: { word: "THE STARS ALIGN", line: "A nebula blooms in the dark.", motif: "twinkle", hue: 232, colors: ["#9bb3ff", "#ffffff", "#2f3d86"] },
  eclipse: { word: "TOTALITY", line: "The sun vanishes behind the leaves.", motif: "vortex", hue: 292, colors: ["#e7a1ff", "#fbdcff", "#3b1d5c"] },
  aurora: { word: "THE SKY SINGS", line: "Northern lights ripple through the leaves.", motif: "rise", hue: 168, colors: ["#80ffe0", "#e9ffe3", "#23548f"] },
  singularity: { word: "GRAVITY COLLAPSES", line: "Everything is pulled inward, then reborn.", motif: "vortex", hue: 258, colors: ["#c6acff", "#faf2ff", "#3a2a66"] },
  prismatic: { word: "EVERY COLOR AT ONCE", line: "Four gems catch the light together.", motif: "burst", hue: 300, colors: ["#ff9ac8", "#ffe58f", "#8defff"] },
  solar: { word: "THE SUN RISES", line: "Sunrays pour across the four petals.", motif: "burst", hue: 38, colors: ["#ffb13d", "#fff3a6", "#9c4a0a"] },
  moonlit: { word: "MOONLIGHT FALLS", line: "Silver light settles on the leaves.", motif: "twinkle", hue: 222, colors: ["#dfe9ff", "#ffffff", "#2f3f66"] },
  tidal: { word: "THE TIDE TURNS", line: "Waves wash over the clover.", motif: "rise", hue: 192, colors: ["#3fb8c9", "#c9fbff", "#23548f"] },
  inferno: { word: "THE FLAMES ROAR", line: "Fire wraps around every leaf.", motif: "rise", hue: 16, colors: ["#ff7a2e", "#ffe98a", "#6f2208"] },
  glacier: { word: "THE ICE CRACKS", line: "A glacier forms in a single breath.", motif: "fall", hue: 205, colors: ["#4d9fe0", "#eafcff", "#245d9c"] },
  sakura: { word: "PETALS DRIFT", line: "Cherry blossoms fall in silence.", motif: "fall", hue: 330, colors: ["#ff9ac8", "#ffe0ee", "#8a2a5e"] },
  thunder: { word: "THE SKY CRACKS", line: "Lightning splits the clover in two.", motif: "bolt", hue: 56, colors: ["#fff36b", "#ffffff", "#8a6a00"] },
  verdant: { word: "THE FOREST WAKES", line: "Vines curl up from the roots.", motif: "rise", hue: 118, colors: ["#7dff7a", "#e6ffe0", "#1f5f2a"] },
  obsidian: { word: "THE GLASS DARKENS", line: "Black glass hums with violet light.", motif: "vortex", hue: 268, colors: ["#9250d6", "#ded0ff", "#14091f"] },
  celestial: { word: "THE HEAVENS OPEN", line: "Stars pour down from the sky.", motif: "twinkle", hue: 236, colors: ["#c8d8ff", "#ffffff", "#2a3a7a"] },
  chrono: { word: "TIME STOPS", line: "Gears turn backwards through the leaves.", motif: "spin", hue: 34, colors: ["#e0a84e", "#fff1cf", "#5a3a10"] },
  infinite: { word: "ABSOLUTE LUCK", line: "Infinity itself bends toward you.", motif: "burst", hue: 290, colors: ["#ffffff", "#ffe27a", "#ff6fd8"] },
};

export const cutThemeFor = (id: string): CutTheme => CUT_THEMES[id] ?? CUT_THEMES.common;
