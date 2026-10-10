import type { IconName } from "./icons";

export type Tier = {
  id: string;
  label: string;
  name: string;
  chance: number;
  value: number;
  hue: number;
  rainbow?: boolean;
  color: string;
  particles: number;
  drama: 0 | 1 | 2 | 3 | 4;
  effect: string;
};

export const TIERS: Tier[] = [
  { id: "common", label: "COMMON", name: "Clover", chance: 1, value: 1, hue: 131, color: "#5df25f", particles: 12, drama: 0, effect: "The original four-leaf lucky charm" },
  { id: "uncommon", label: "UNCOMMON", name: "Mint Clover", chance: 4, value: 4, hue: 162, color: "#3ff2c0", particles: 14, drama: 0, effect: "Dewdrop jewels and etched mint veins" },
  { id: "rare", label: "RARE", name: "Frost Clover", chance: 18, value: 18, hue: 199, color: "#73d7ff", particles: 16, drama: 1, effect: "Frozen branches and crystalline ice shards" },
  { id: "epic", label: "EPIC", name: "Void Clover", chance: 60, value: 70, hue: 272, color: "#c07bff", particles: 18, drama: 1, effect: "Fractured leaves around a dark vortex" },
  { id: "legendary", label: "LEGENDARY", name: "Golden Clover", chance: 180, value: 240, hue: 45, color: "#ffd23f", particles: 22, drama: 2, effect: "A pixel crown, gold filigree and a royal gleam" },
  { id: "mythic", label: "MYTHIC", name: "Ruby Clover", chance: 450, value: 750, hue: 352, color: "#ff6782", particles: 24, drama: 2, effect: "A faceted ruby core with ember sparks" },
  { id: "divine", label: "DIVINE", name: "Seraph Clover", chance: 900, value: 1800, hue: 32, color: "#ffcc92", particles: 28, drama: 3, effect: "An ivory sun rune and a floating halo" },
  { id: "cosmic", label: "COSMIC", name: "Nebula Clover", chance: 1800, value: 4200, hue: 232, color: "#9bb3ff", particles: 30, drama: 3, effect: "A star-speckled nebula and orbiting stardust" },
  { id: "eclipse", label: "ECLIPSE", name: "Eclipse Clover", chance: 3500, value: 9500, hue: 292, color: "#e7a1ff", particles: 32, drama: 3, effect: "Shadowed leaves encircled by a violet corona" },
  { id: "aurora", label: "AURORA", name: "Aurora Clover", chance: 6500, value: 20000, hue: 176, color: "#80ffe0", particles: 34, drama: 4, effect: "Northern-light ribbons with a luminous crystal core" },
  { id: "singularity", label: "SINGULARITY", name: "Singularity Clover", chance: 11000, value: 45000, hue: 258, color: "#c6acff", particles: 36, drama: 4, effect: "A black-hole core and an orbiting accretion disc" },
  { id: "prismatic", label: "PRISMATIC", name: "Prism Clover", chance: 18000, value: 100000, hue: 0, rainbow: true, color: "#ffffff", particles: 40, drama: 4, effect: "Four gemstone leaves, prismatic shards and a rainbow sheen" },
  { id: "solar", label: "SOLAR", name: "Solar Clover", chance: 26000, value: 150000, hue: 38, color: "#ffd23f", particles: 40, drama: 3, effect: "Sunray flares spill gold across four petals" },
  { id: "moonlit", label: "MOONLIT", name: "Moonlit Clover", chance: 40000, value: 230000, hue: 222, color: "#dfe9ff", particles: 42, drama: 3, effect: "A silver crescent bitten from every leaf" },
  { id: "tidal", label: "TIDAL", name: "Tidal Clover", chance: 60000, value: 350000, hue: 192, color: "#7ff0ff", particles: 44, drama: 3, effect: "Rolling waves carved into wet green leaves" },
  { id: "inferno", label: "INFERNO", name: "Inferno Clover", chance: 90000, value: 520000, hue: 16, color: "#ff8a4a", particles: 46, drama: 4, effect: "Stepped flame tongues licking every leaf" },
  { id: "glacier", label: "GLACIER", name: "Glacier Clover", chance: 140000, value: 800000, hue: 205, color: "#9fe2ff", particles: 48, drama: 4, effect: "A hollow ring of ice with cracked, glassy leaves" },
  { id: "sakura", label: "SAKURA", name: "Sakura Clover", chance: 220000, value: 1300000, hue: 330, color: "#ffb3d6", particles: 50, drama: 4, effect: "Bloom-shaped petals drifting with pixel blossoms" },
  { id: "thunder", label: "THUNDER", name: "Thunder Clover", chance: 340000, value: 2100000, hue: 56, color: "#fff36b", particles: 52, drama: 4, effect: "Diamond-cut leaves split by lightning streaks" },
  { id: "verdant", label: "VERDANT", name: "Verdant Clover", chance: 520000, value: 3200000, hue: 118, color: "#9dff8a", particles: 54, drama: 4, effect: "Teardrop leaves wrapped in climbing vines" },
  { id: "obsidian", label: "OBSIDIAN", name: "Obsidian Clover", chance: 800000, value: 5000000, hue: 270, color: "#b48cff", particles: 56, drama: 4, effect: "Squared black glass with violet facets" },
  { id: "celestial", label: "CELESTIAL", name: "Celestial Clover", chance: 1200000, value: 7500000, hue: 240, color: "#c8d8ff", particles: 58, drama: 4, effect: "Four-point star leaves scattered with starlight" },
  { id: "chrono", label: "CHRONO", name: "Chrono Clover", chance: 1800000, value: 12000000, hue: 35, color: "#e0a84e", particles: 60, drama: 4, effect: "Gear-toothed leaves that turn the clock back" },
  { id: "infinite", label: "INFINITE", name: "Infinite Clover", chance: 4000000, value: 30000000, hue: 290, color: "#ffe27a", particles: 64, drama: 4, effect: "A figure-eight of light carved into every leaf" },
];

/* ---------------- variants ---------------- */

export type Variant = "normal" | "shiny" | "crystal";
export const VARIANTS: Variant[] = ["normal", "shiny", "crystal"];

export const SHINY_VALUE = 5;
export const BASE_SHINY = 1 / 50;
/** Crystal: 25x the clovers, 500x harder than shiny to roll. */
export const CRYSTAL_VALUE = 25;
export const CRYSTAL_RARITY = 500;
export const CRYSTAL_REBIRTHS = 5;

export const TOTAL_ENTRIES = TIERS.length * VARIANTS.length;
export const MANUAL_COOLDOWN = 900;
export const MIN_ROLL_INTERVAL = 550;
export const DISCOVERY_LIMIT = 180;

/* ---------------- rebirth ---------------- */

export const REBIRTH_BASE_COST = 250000;
export const REBIRTH_COST_GROWTH = 2.2;
export const REBIRTH_MAX = 50;
/** +35% luck and +25% clover value per rebirth, forever. */
export const REBIRTH_LUCK = 0.35;
export const REBIRTH_VALUE = 0.25;

export const rebirthCost = (rebirths: number) => Math.round(REBIRTH_BASE_COST * REBIRTH_COST_GROWTH ** rebirths);
export const rebirthLuck = (rebirths: number) => 1 + REBIRTH_LUCK * rebirths;
export const rebirthValue = (rebirths: number) => 1 + REBIRTH_VALUE * rebirths;

/* ---------------- quests ---------------- */

export type QuestCategory = "rolling" | "rarity" | "discovery" | "variant" | "upgrade" | "rebirth" | "wealth" | "special";

export type QuestDef = {
  id: string;
  name: string;
  blurb: string;
  icon: IconName;
  /** Pixel text burned into the icon's lower plate, e.g. "x50". Optional so tinted stars stay clean. */
  stamp?: string;
  /** Rarity tier id: the icon takes that rarity's lettering colours. */
  tint?: string;
  category: QuestCategory;
  goal: number;
  reward: number;
  progress: (s: Save) => number;
};

export const QUEST_CATEGORIES: Array<{ id: QuestCategory; label: string }> = [
  { id: "rolling", label: "ROLLING" },
  { id: "rarity", label: "RARITY MILESTONES" },
  { id: "discovery", label: "DISCOVERY" },
  { id: "variant", label: "SHINY & CRYSTAL" },
  { id: "upgrade", label: "UPGRADES" },
  { id: "rebirth", label: "REBIRTH" },
  { id: "wealth", label: "WEALTH" },
  { id: "special", label: "SPECIAL" },
];

/* ---------------- save ---------------- */

export type UpgradeId = "luck" | "auto" | "multi" | "shiny" | "value" | "crit" | "quick" | "pity";
export type Upgrades = Record<UpgradeId, number>;

export type OfflineReward = {
  id: string;
  amount: number;
  awayMs: number;
  creditedMs: number;
  capped: boolean;
  createdAt: number;
};

export type Save = {
  clovers: number;
  totalEarned: number;
  rolls: number;
  upgrades: Upgrades;
  found: Record<string, number>;
  best: number;
  rebirths: number;
  sound: boolean;
  auto: boolean;
  cutscenes: boolean;
  performance: boolean;
  luckScale: number;
  discoveryPity: number;
  lastActiveAt: number;
  offlineReward: OfflineReward | null;
  totalOfflineEarned: number;
  questsClaimed: string[];
  lifetime: Lifetime;
  daily: DailyState;
};

export function autoDelay(level: number): number {
  return level <= 0 ? 0 : Math.max(MIN_ROLL_INTERVAL, Math.round(1500 * 0.91 ** (level - 1)));
}

export type UpgradeDef = {
  id: UpgradeId;
  name: string;
  blurb: string;
  max: number;
  cost: (level: number) => number;
  effect: (level: number) => string;
};

const luckMultiplier = (level: number) => 1.09 ** level;

export const UPGRADES: UpgradeDef[] = [
  { id: "luck", name: "LUCK BOOST", blurb: "Compounding luck for the rarest finds", max: 60, cost: (l) => Math.round(15 * 1.3 ** l), effect: (l) => `x${luckMultiplier(l).toFixed(2)}` },
  { id: "value", name: "CLOVER VALUE", blurb: "A permanent boost to every payout", max: 50, cost: (l) => Math.round(40 * 1.33 ** l), effect: (l) => `x${(1 + 0.4 * l).toFixed(1)}` },
  { id: "multi", name: "MULTI ROLL", blurb: "More clovers in one paced roll", max: 40, cost: (l) => Math.round(150 * 1.33 ** l), effect: (l) => `${l + 1} ROLL${l === 0 ? "" : "S"}` },
  { id: "auto", name: "AUTO ROLL", blurb: "Steady rolling without repeated clicks", max: 12, cost: (l) => Math.round(60 * 1.48 ** l), effect: (l) => l === 0 ? "OFF" : `${(autoDelay(l) / 1000).toFixed(2)}s` },
  { id: "shiny", name: "SHINY CHARM", blurb: "Discover shimmering, 5x-value variants", max: 25, cost: (l) => Math.round(250 * 1.42 ** l), effect: (l) => `${Math.round(BASE_SHINY * (1 + 0.3 * l) * 100)}%` },
  { id: "crit", name: "CRIT ROLL", blurb: "A chance for a 10x-value payout", max: 20, cost: (l) => Math.round(600 * 1.42 ** l), effect: (l) => `${l * 3}%` },
  { id: "quick", name: "QUICK HANDS", blurb: "Shorter cooldown between manual rolls", max: 15, cost: (l) => Math.round(180 * 1.45 ** l), effect: (l) => `${(manualCooldown(l) / 1000).toFixed(2)}s` },
  { id: "pity", name: "PITY BREAKER", blurb: "New clovers are guaranteed sooner", max: 10, cost: (l) => Math.round(800 * 1.5 ** l), effect: (l) => `${discoveryLimit(l)} PULLS` },
];

/* ---------------- lifetime stats + daily streak ---------------- */

/** Stats that survive rebirths, so they are a true all-time record. */
export type Lifetime = {
  rolls: number;
  shinies: number;
  crystals: number;
  crits: number;
  discoveries: number;
  rebirths: number;
  biggest: number;
  rarest: { tier: number; variant: Variant } | null;
  dailyClaims: number;
  bestStreak: number;
  playMs: number;
};

export type DailyState = { streak: number; lastClaim: string | null };

export type DailyStatus = { claimedToday: boolean; streak: number; reward: number; milestone: boolean };

export function newLifetime(): Lifetime {
  return {
    rolls: 0, shinies: 0, crystals: 0, crits: 0, discoveries: 0, rebirths: 0, biggest: 0,
    rarest: null, dailyClaims: 0, bestStreak: 0, playMs: 0,
  };
}

/** Higher is rarer. Crystals beat any plain tier; shinies beat plain at the same tier. */
const rarityScore = (x: { tier: number; variant: Variant }) =>
  (x.variant === "crystal" ? 1000 : 0) + x.tier * 10 + (x.variant === "shiny" ? 5 : 0);

export function addLifetime(s: Save, results: RollResult[]): Save {
  const l: Lifetime = { ...s.lifetime };
  l.rolls += results.length;
  for (const r of results) {
    if (r.variant === "shiny") l.shinies++;
    if (r.variant === "crystal") l.crystals++;
    if (r.crit) l.crits++;
    if (r.isNew) l.discoveries++;
    if (r.value > l.biggest) l.biggest = r.value;
    if (!l.rarest || rarityScore(r) > rarityScore(l.rarest)) l.rarest = { tier: r.tier, variant: r.variant };
  }
  return { ...s, lifetime: l };
}

export const dayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/** Day 1 pays 1,500 and grows 30% a day; every 7th day pays triple. */
export const dailyReward = (streak: number) =>
  Math.round(1500 * 1.3 ** Math.min(streak - 1, 20) * (streak % 7 === 0 ? 3 : 1));

export function dailyStatus(s: Save, now = new Date()): DailyStatus {
  const today = dayKey(now);
  const yesterday = dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
  const claimedToday = s.daily.lastClaim === today;
  const streak = (s.daily.lastClaim === yesterday ? s.daily.streak : 0) + 1;
  const shown = claimedToday ? s.daily.streak : streak;
  return { claimedToday, streak: shown, reward: dailyReward(shown), milestone: shown % 7 === 0 };
}

export function claimDaily(s: Save, now = new Date()): Save {
  const status = dailyStatus(s, now);
  if (status.claimedToday) return s;
  return {
    ...s,
    clovers: s.clovers + status.reward,
    totalEarned: s.totalEarned + status.reward,
    daily: { streak: status.streak, lastClaim: dayKey(now) },
    lifetime: {
      ...s.lifetime,
      dailyClaims: s.lifetime.dailyClaims + 1,
      bestStreak: Math.max(s.lifetime.bestStreak, status.streak),
    },
  };
}

/* ---------------- upgrade curves ---------------- */

/** Discovery guarantee: 180 pulls at level 0, down to 40 at level 10. */
export const discoveryLimit = (pityLevel: number) => Math.max(40, DISCOVERY_LIMIT - 14 * pityLevel);

/** Manual cooldown: 900ms at level 0, down to 300ms at level 15. */
export const manualCooldown = (quickLevel: number) => Math.max(300, Math.round(MANUAL_COOLDOWN * 0.92 ** quickLevel));

export const newSave = (): Save => ({
  clovers: 0,
  totalEarned: 0,
  rolls: 0,
  upgrades: { luck: 0, auto: 0, multi: 0, shiny: 0, value: 0, crit: 0, quick: 0, pity: 0 },
  found: {},
  best: 0,
  rebirths: 0,
  sound: true,
  auto: false,
  cutscenes: true,
  performance: false,
  luckScale: 1,
  discoveryPity: 0,
  lastActiveAt: Date.now(),
  offlineReward: null,
  totalOfflineEarned: 0,
  questsClaimed: [],
  lifetime: newLifetime(),
  daily: { streak: 0, lastClaim: null },
});

export const LUCK_SCALES = [
  { v: 1, label: "FULL" },
  { v: 0.5, label: "/2" },
  { v: 0.2, label: "/5" },
  { v: 0.05, label: "/20" },
  { v: 0.01, label: "/100" },
  { v: 0.001, label: "/1K" },
];

/* ---------------- derived stats ---------------- */

export const crystalUnlocked = (s: Save) => s.rebirths >= CRYSTAL_REBIRTHS;
export const discoveredCount = (s: Save) => Object.values(s.found).filter((n) => n > 0).length;
export const indexBonus = (s: Save) => 0.1 * discoveredCount(s);
export const baseLuck = (s: Save) => luckMultiplier(s.upgrades.luck) * (1 + indexBonus(s)) * rebirthLuck(s.rebirths);
export const getLuck = (s: Save) => baseLuck(s) * s.luckScale;
export const getShinyChance = (s: Save) => Math.min(0.5, BASE_SHINY * (1 + 0.3 * s.upgrades.shiny));
export const getCrystalChance = (s: Save) => crystalUnlocked(s) ? getShinyChance(s) / CRYSTAL_RARITY : 0;
export const rollsPerClick = (s: Save) => 1 + s.upgrades.multi;
export const valueMult = (s: Save) => (1 + 0.4 * s.upgrades.value) * rebirthValue(s.rebirths);
export const critChance = (s: Save) => Math.min(0.6, s.upgrades.crit * 0.03);
export const autoInterval = (s: Save) => autoDelay(s.upgrades.auto);
export const rollCooldown = (s: Save) => s.upgrades.auto > 0 ? Math.min(manualCooldown(s.upgrades.quick), autoDelay(s.upgrades.auto)) : manualCooldown(s.upgrades.quick);
export const canRebirth = (s: Save) => s.rebirths < REBIRTH_MAX && s.clovers >= rebirthCost(s.rebirths);

export const variantValue = (variant: Variant) => variant === "crystal" ? CRYSTAL_VALUE : variant === "shiny" ? SHINY_VALUE : 1;
export const variantBaseOdds = (variant: Variant) => variant === "crystal" ? CRYSTAL_RARITY / BASE_SHINY : variant === "shiny" ? 1 / BASE_SHINY : 1;
export const variantChance = (s: Save, variant: Variant) => variant === "crystal" ? getCrystalChance(s) : variant === "shiny" ? getShinyChance(s) : 1;

export const foundKey = (tier: number, variant: Variant) => `${TIERS[tier].id}${variant === "normal" ? "" : `:${variant}`}`;

/** Everything a rebirth wipes, and everything it keeps. */
export function doRebirth(s: Save): Save {
  if (!canRebirth(s)) return s;
  const fresh = newSave();
  return {
    ...fresh,
    rebirths: s.rebirths + 1,
    totalEarned: s.totalEarned,
    found: s.found,
    best: s.best,
    sound: s.sound,
    cutscenes: s.cutscenes,
    performance: s.performance,
    totalOfflineEarned: s.totalOfflineEarned,
    offlineReward: s.offlineReward,
    lastActiveAt: Math.max(s.lastActiveAt, fresh.lastActiveAt),
    questsClaimed: s.questsClaimed,
    // all-time stats survive a rebirth; the rebirth itself is counted
    lifetime: { ...s.lifetime, rebirths: s.lifetime.rebirths + 1 },
    daily: s.daily,
  };
}

/* ---------------- rolling ---------------- */

export type RollResult = {
  id: number;
  tier: number;
  variant: Variant;
  crit: boolean;
  value: number;
  isNew: boolean;
  guaranteed: boolean;
};

export function tierProbabilities(luck: number): number[] {
  const probabilities = new Array<number>(TIERS.length).fill(0);
  let remaining = 1;
  for (let i = TIERS.length - 1; i >= 1; i--) {
    const chance = Math.min(0.4, Math.max(0, luck) / TIERS[i].chance);
    probabilities[i] = remaining * chance;
    remaining -= probabilities[i];
  }
  probabilities[0] = remaining;
  return probabilities;
}

export function drawTier(probabilities: number[]): number {
  let random = Math.random();
  for (let i = probabilities.length - 1; i >= 1; i--) {
    random -= probabilities[i];
    if (random < 0) return i;
  }
  return 0;
}

export const effectiveOdds = (tier: number, luck: number) => 1 / Math.max(1e-12, tierProbabilities(luck)[tier]);

/** Crystal entries only count as "undiscovered" once crystals can actually drop. */
export function nextUndiscovered(found: Record<string, number>, crystals: boolean): { tier: number; variant: Variant } | null {
  for (const variant of VARIANTS) {
    if (variant === "crystal" && !crystals) continue;
    for (let tier = 0; tier < TIERS.length; tier++) {
      if (!(found[foundKey(tier, variant)] > 0)) return { tier, variant };
    }
  }
  return null;
}

export function rollBatch(s: Save, nextId: () => number) {
  const found = { ...s.found };
  const probabilities = tierProbabilities(getLuck(s));
  const shinyChance = getShinyChance(s);
  const crystalChance = getCrystalChance(s);
  const crits = critChance(s);
  const multiplier = valueMult(s);
  const crystals = crystalUnlocked(s);
  const results: RollResult[] = [];
  let pity = s.discoveryPity;
  let gained = 0;
  let best: RollResult | null = null;
  let bestTier = s.best;

  for (let i = 0; i < rollsPerClick(s); i++) {
    const guarantee = pity >= discoveryLimit(s.upgrades.pity) - 1 ? nextUndiscovered(found, crystals) : null;
    const tier = guarantee?.tier ?? drawTier(probabilities);
    let variant: Variant = "normal";
    if (guarantee) variant = guarantee.variant;
    else {
      const r = Math.random();
      if (r < crystalChance) variant = "crystal";
      else if (r < crystalChance + shinyChance) variant = "shiny";
    }
    const crit = Math.random() < crits;
    const key = foundKey(tier, variant);
    const isNew = !(found[key] > 0);
    found[key] = (found[key] ?? 0) + 1;
    pity = isNew ? 0 : Math.min(DISCOVERY_LIMIT - 1, pity + 1);
    bestTier = Math.max(bestTier, tier);
    const value = Math.round(TIERS[tier].value * variantValue(variant) * (crit ? 10 : 1) * multiplier);
    const result: RollResult = { id: nextId(), tier, variant, crit, value, isNew, guaranteed: !!guarantee };
    gained += value;
    results.push(result);
    if (!best || rank(result) > rank(best)) best = result;
  }

  return {
    next: { ...s, clovers: s.clovers + gained, totalEarned: s.totalEarned + gained, rolls: s.rolls + results.length, found, best: bestTier, discoveryPity: pity },
    results,
    best: best!,
    gained,
  };
}

/** A crystal of any tier out-ranks a plain higher tier; it's the rarer find. */
const rank = (r: RollResult) => (r.variant === "crystal" ? 1000 : 0) + r.tier * 10 + (r.variant === "shiny" ? 5 : 0) + (r.isNew ? 1 : 0);

/* ---------------- quest helpers + list ---------------- */

export const shinyFoundCount = (s: Save) => TIERS.reduce((sum, _t, i) => sum + (s.found[foundKey(i, "shiny")] ?? 0), 0);
export const crystalFoundCount = (s: Save) => TIERS.reduce((sum, _t, i) => sum + (s.found[foundKey(i, "crystal")] ?? 0), 0);
export const hasMaxedUpgrade = (s: Save) => UPGRADES.some((u) => s.upgrades[u.id] >= u.max);

const tierQuest = (tierIndex: number, reward: number): QuestDef => {
  const t = TIERS[tierIndex];
  return {
    id: `reach-${t.id}`,
    name: `${t.label} FIND`,
    blurb: `Roll a ${t.name.toLowerCase()} or better`,
    icon: "star",
    tint: t.id,
    category: "rarity",
    goal: 1,
    reward,
    progress: (s) => (s.best >= tierIndex ? 1 : 0),
  };
};

export const QUESTS: QuestDef[] = [
  // rolling
  { id: "rolls-1", name: "FIRST ROLL", blurb: "Click the clover once", icon: "die1", stamp: "1", category: "rolling", goal: 1, reward: 10, progress: (s) => s.rolls },
  { id: "rolls-50", name: "WARMING UP", blurb: "Roll 50 clovers", icon: "dice2", stamp: "50", category: "rolling", goal: 50, reward: 150, progress: (s) => s.rolls },
  { id: "rolls-500", name: "ON A ROLL", blurb: "Roll 500 clovers", icon: "flame", stamp: "500", category: "rolling", goal: 500, reward: 1500, progress: (s) => s.rolls },
  { id: "rolls-5000", name: "ROLL MACHINE", blurb: "Roll 5,000 clovers", icon: "slots", stamp: "5K", category: "rolling", goal: 5000, reward: 20000, progress: (s) => s.rolls },
  { id: "rolls-50000", name: "UNSTOPPABLE", blurb: "Roll 50,000 clovers", icon: "bolt", stamp: "50K", category: "rolling", goal: 50000, reward: 400000, progress: (s) => s.rolls },

  // rarity milestones, one per tier above common (stamped with its rarity number)
  ...TIERS.slice(1).map((_, i) => tierQuest(i + 1, Math.round(40 * 5.2 ** Math.min(i, 10) * 2 ** Math.max(0, i - 10)))),

  // discovery
  { id: "discover-1", name: "FIRST DISCOVERY", blurb: "Add 1 entry to the index", icon: "book", stamp: "1", category: "discovery", goal: 1, reward: 20, progress: discoveredCount },
  { id: "discover-6", name: "BUDDING COLLECTOR", blurb: "Discover 6 index entries", icon: "lens", stamp: "6", category: "discovery", goal: 6, reward: 800, progress: discoveredCount },
  { id: "discover-12", name: "KEEN EYE", blurb: "Discover 12 index entries", icon: "eye", stamp: "12", category: "discovery", goal: 12, reward: 8000, progress: discoveredCount },
  { id: "discover-24", name: "FULL SET", blurb: "Discover every normal and shiny clover", icon: "map", stamp: "48", category: "discovery", goal: TIERS.length * 2, reward: 150000, progress: discoveredCount },
  { id: "discover-36", name: "TRUE COMPLETIONIST", blurb: "Discover every clover, crystals included", icon: "crown", stamp: "72", category: "discovery", goal: TOTAL_ENTRIES, reward: 3000000, progress: discoveredCount },

  // shiny & crystal
  { id: "shiny-1", name: "FIRST SHINE", blurb: "Find 1 shiny clover", icon: "sparkle", stamp: "1", category: "variant", goal: 1, reward: 100, progress: shinyFoundCount },
  { id: "shiny-25", name: "SHINY COLLECTOR", blurb: "Find 25 shiny clovers", icon: "sparkles", stamp: "25", category: "variant", goal: 25, reward: 15000, progress: shinyFoundCount },
  { id: "crystal-1", name: "CRYSTAL CLEAR", blurb: "Find 1 crystal clover", icon: "crystal", stamp: "1", category: "variant", goal: 1, reward: 75000, progress: crystalFoundCount },

  // upgrades
  { id: "upgrade-1", name: "FIRST UPGRADE", blurb: "Buy any upgrade in the shop", icon: "arrowUp", stamp: "1", category: "upgrade", goal: 1, reward: 50, progress: (s) => (Object.values(s.upgrades).some((l) => l > 0) ? 1 : 0) },
  { id: "upgrade-max", name: "MAXED OUT", blurb: "Max out any single upgrade", icon: "gear", stamp: "MAX", category: "upgrade", goal: 1, reward: 25000, progress: (s) => (hasMaxedUpgrade(s) ? 1 : 0) },

  // rebirth
  { id: "rebirth-1", name: "REBORN", blurb: "Rebirth for the first time", icon: "rebirth", stamp: "1", category: "rebirth", goal: 1, reward: 60000, progress: (s) => s.rebirths },
  { id: "rebirth-5", name: "CRYSTAL AWAKENING", blurb: "Rebirth 5 times", icon: "crystals", stamp: "5", category: "rebirth", goal: 5, reward: 600000, progress: (s) => s.rebirths },
  { id: "rebirth-10", name: "VETERAN", blurb: "Rebirth 10 times", icon: "medal", stamp: "10", category: "rebirth", goal: 10, reward: 6000000, progress: (s) => s.rebirths },

  // wealth
  { id: "wealth-100k", name: "NEST EGG", blurb: "Earn 100,000 clovers in total", icon: "coin", stamp: "100K", category: "wealth", goal: 100000, reward: 8000, progress: (s) => s.totalEarned },
  { id: "wealth-10m", name: "SMALL FORTUNE", blurb: "Earn 10,000,000 clovers in total", icon: "moneyBag", stamp: "10M", category: "wealth", goal: 10000000, reward: 800000, progress: (s) => s.totalEarned },
  { id: "wealth-1b", name: "CLOVER TYCOON", blurb: "Earn 1,000,000,000 clovers in total", icon: "chest", stamp: "1B", category: "wealth", goal: 1000000000, reward: 80000000, progress: (s) => s.totalEarned },

  // special
  { id: "offline-1", name: "AWAY GAINS", blurb: "Collect an offline earnings reward", icon: "offline", stamp: "1", category: "special", goal: 1, reward: 500, progress: (s) => s.totalOfflineEarned },
];

export const TOTAL_QUESTS = QUESTS.length;
export const isQuestClaimed = (s: Save, id: string) => s.questsClaimed.includes(id);
export const isQuestComplete = (q: QuestDef, s: Save) => q.progress(s) >= q.goal;
export const claimedQuestCount = (s: Save) => s.questsClaimed.length;
export const claimableQuestCount = (s: Save) => QUESTS.reduce((n, q) => n + (!isQuestClaimed(s, q.id) && isQuestComplete(q, s) ? 1 : 0), 0);

/** Grants the reward and marks the quest claimed. Returns the same save if it can't be claimed. */
export function claimQuest(s: Save, id: string): Save {
  const quest = QUESTS.find((q) => q.id === id);
  if (!quest || isQuestClaimed(s, id) || !isQuestComplete(quest, s)) return s;
  return {
    ...s,
    clovers: s.clovers + quest.reward,
    totalEarned: s.totalEarned + quest.reward,
    questsClaimed: [...s.questsClaimed, id],
  };
}

/* ---------------- persistence ---------------- */

export const STORAGE_KEY = "clover-rng-save-v3";
const LEGACY_KEYS = ["clover-rng-save-v2", "clover-rng-save-v1"];
const nonnegative = (value: unknown, fallback = 0) => typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : fallback;

export function loadSave(): Save {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? LEGACY_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);
    if (!raw) return newSave();
    const parsed = JSON.parse(raw) as Partial<Save>;
    const base = newSave();
    const upgrades = { ...base.upgrades };
    for (const definition of UPGRADES) {
      upgrades[definition.id] = Math.min(definition.max, Math.floor(nonnegative(parsed.upgrades?.[definition.id])));
    }
    const found: Record<string, number> = {};
    for (let tier = 0; tier < TIERS.length; tier++) {
      for (const variant of VARIANTS) {
        const key = foundKey(tier, variant);
        const legacyKey = TIERS[tier].id === "prismatic" && variant !== "crystal" ? `secret${variant === "shiny" ? ":shiny" : ""}` : key;
        const count = Math.floor(nonnegative(parsed.found?.[key] ?? parsed.found?.[legacyKey]));
        if (count > 0) found[key] = count;
      }
    }
    const rebirths = Math.min(REBIRTH_MAX, Math.floor(nonnegative(parsed.rebirths)));
    const save: Save = {
      ...base,
      clovers: nonnegative(parsed.clovers),
      totalEarned: nonnegative(parsed.totalEarned),
      rolls: Math.floor(nonnegative(parsed.rolls)),
      upgrades,
      found,
      best: Math.max(0, ...TIERS.map((_, i) => VARIANTS.some((v) => found[foundKey(i, v)]) ? i : 0)),
      rebirths,
      sound: parsed.sound !== false,
      auto: parsed.auto === true && upgrades.auto > 0,
      cutscenes: parsed.cutscenes !== false,
      performance: parsed.performance === true,
      luckScale: LUCK_SCALES.some((scale) => scale.v === parsed.luckScale) ? parsed.luckScale! : 1,
      discoveryPity: Math.min(DISCOVERY_LIMIT - 1, Math.floor(nonnegative(parsed.discoveryPity))),
      lastActiveAt: nonnegative(parsed.lastActiveAt, base.lastActiveAt) || base.lastActiveAt,
      offlineReward: null,
      totalOfflineEarned: nonnegative(parsed.totalOfflineEarned),
      questsClaimed: Array.isArray(parsed.questsClaimed)
        ? [...new Set(parsed.questsClaimed.filter((id): id is string => typeof id === "string" && QUESTS.some((q) => q.id === id)))]
        : [],
    };
    save.lifetime = sanitizeLifetime(parsed.lifetime);
    save.daily = sanitizeDaily(parsed.daily);
    const reward = parsed.offlineReward;
    if (reward && typeof reward.id === "string" && reward.id.length <= 160 && nonnegative(reward.amount) >= 1) {
      save.offlineReward = {
        id: reward.id,
        amount: Math.min(Number.MAX_SAFE_INTEGER, Math.floor(nonnegative(reward.amount))),
        awayMs: Math.min(365 * 86400000, nonnegative(reward.awayMs)),
        creditedMs: Math.min(8 * 3600000, nonnegative(reward.creditedMs)),
        capped: reward.capped === true,
        createdAt: nonnegative(reward.createdAt, base.lastActiveAt),
      };
    }
    return save;
  } catch {
    return newSave();
  }
}

/** Clamps stored lifetime stats so a damaged or hand-edited save can't break the UI. */
function sanitizeLifetime(raw: Partial<Lifetime> | undefined): Lifetime {
  const base = newLifetime();
  if (!raw || typeof raw !== "object") return base;
  const num = (value: unknown) => nonnegative(value);
  const rarest = raw.rarest;
  const validRarest =
    rarest && Number.isInteger(rarest.tier) && rarest.tier >= 0 && rarest.tier < TIERS.length && VARIANTS.includes(rarest.variant)
      ? { tier: rarest.tier, variant: rarest.variant }
      : null;
  return {
    rolls: num(raw.rolls),
    shinies: num(raw.shinies),
    crystals: num(raw.crystals),
    crits: num(raw.crits),
    discoveries: num(raw.discoveries),
    rebirths: num(raw.rebirths),
    biggest: num(raw.biggest),
    rarest: validRarest,
    dailyClaims: num(raw.dailyClaims),
    bestStreak: num(raw.bestStreak),
    playMs: num(raw.playMs),
  };
}

function sanitizeDaily(raw: Partial<DailyState> | undefined): DailyState {
  const streak = raw && typeof raw.streak === "number" && raw.streak > 0 ? Math.floor(raw.streak) : 0;
  const lastClaim = raw && typeof raw.lastClaim === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.lastClaim) ? raw.lastClaim : null;
  return { streak, lastClaim };
}

export function storeSave(s: Save): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    return true;
  } catch {
    // The game remains playable if storage is unavailable.
    return false;
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    for (const key of LEGACY_KEYS) localStorage.removeItem(key);
  } catch {
    // Ignore restricted storage.
  }
}

/* ---------------- formatting ---------------- */

const SUFFIXES = ["", "K", "M", "B", "T", "Qa", "Qi"];

export function fmt(n: number): string {
  if (!Number.isFinite(n)) return "MAX";
  if (n < 1000) return Math.floor(n).toLocaleString("en-US");
  let i = 0;
  let v = n;
  while (v >= 1000 && i < SUFFIXES.length - 1) {
    v /= 1000;
    i++;
  }
  return `${v >= 100 ? Math.floor(v) : v.toFixed(1).replace(/\.0$/, "")}${SUFFIXES[i]}`;
}

export function fmtOdds(n: number): string {
  return n < 1e6 ? Math.max(1, Math.round(n)).toLocaleString("en-US") : fmt(n);
}
