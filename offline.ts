import {
  CRYSTAL_VALUE, SHINY_VALUE, TIERS, autoInterval, critChance, getCrystalChance,
  getLuck, getShinyChance, rollsPerClick, tierProbabilities, valueMult,
  type OfflineReward, type Save,
} from "./data";

export const OFFLINE_EFFICIENCY = 0.25;
export const OFFLINE_CAP_MS = 8 * 60 * 60 * 1000;
export const OFFLINE_MIN_MS = 30 * 1000;
const MAX = Number.MAX_SAFE_INTEGER;

export function hasOfflineEarnings(save: Save): boolean {
  return save.auto && save.upgrades.auto > 0;
}

// Exact expected payout of one ordinary pull, including rounding, crits and variants.
// No replay of rolls, pity, discoveries, particles, or audio is needed on return.
export function expectedCloverPayout(save: Save): number {
  const probabilities = tierProbabilities(getLuck(save));
  const shiny = getShinyChance(save);
  const crystal = getCrystalChance(save);
  const crit = critChance(save);
  const multiplier = valueMult(save);
  const variants = [
    { chance: Math.max(0, 1 - shiny - crystal), value: 1 },
    { chance: shiny, value: SHINY_VALUE },
    { chance: crystal, value: CRYSTAL_VALUE },
  ];
  let payout = 0;
  for (let tier = 0; tier < TIERS.length; tier++) {
    for (const variant of variants) {
      const ordinary = Math.round(TIERS[tier].value * variant.value * multiplier);
      const critical = Math.round(TIERS[tier].value * variant.value * multiplier * 10);
      payout += probabilities[tier] * variant.chance * ((1 - crit) * ordinary + crit * critical);
    }
  }
  return Number.isFinite(payout) ? payout : 0;
}

export function offlineCloversPerSecond(save: Save): number {
  const interval = autoInterval(save);
  if (!hasOfflineEarnings(save) || interval <= 0) return 0;
  return expectedCloverPayout(save) * rollsPerClick(save) * (1000 / interval) * OFFLINE_EFFICIENCY;
}

export function settleOfflineEarnings(save: Save, now: number): Save {
  if (!Number.isFinite(now) || now <= 0) return save;
  const previous = Number.isFinite(save.lastActiveAt) && save.lastActiveAt > 0 ? save.lastActiveAt : now;
  const awayMs = Math.max(0, now - previous);
  const next: Save = { ...save, lastActiveAt: Math.max(previous, now) };
  if (awayMs < OFFLINE_MIN_MS || !hasOfflineEarnings(save)) return next;

  const pending = save.offlineReward;
  const remaining = Math.max(0, OFFLINE_CAP_MS - (pending?.creditedMs ?? 0));
  const creditedMs = Math.min(remaining, awayMs);
  const amount = Math.min(MAX, Math.floor(offlineCloversPerSecond(save) * creditedMs / 1000));
  if (amount < 1 && !pending) return next;

  const reward: OfflineReward = {
    id: amount > 0 ? `offline:${previous}:${now}` : pending!.id,
    amount: Math.min(MAX, (pending?.amount ?? 0) + amount),
    awayMs: Math.min(365 * 86400000, (pending?.awayMs ?? 0) + awayMs),
    creditedMs: Math.min(OFFLINE_CAP_MS, (pending?.creditedMs ?? 0) + creditedMs),
    capped: pending?.capped === true || awayMs > remaining,
    createdAt: now,
  };
  return { ...next, offlineReward: reward };
}

export function redeemOfflineReward(save: Save, receiptId: string, now = Date.now()): Save {
  const reward = save.offlineReward;
  if (!reward || reward.id !== receiptId) return save;
  return {
    ...save,
    clovers: Math.min(Number.MAX_VALUE, save.clovers + reward.amount),
    totalEarned: Math.min(Number.MAX_VALUE, save.totalEarned + reward.amount),
    totalOfflineEarned: Math.min(Number.MAX_VALUE, save.totalOfflineEarned + reward.amount),
    offlineReward: null,
    lastActiveAt: Math.max(save.lastActiveAt, now),
  };
}

export function formatAwayTime(ms: number): string {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor(seconds / 3600) % 24;
  const minutes = Math.floor(seconds / 60) % 60;
  if (days > 0) return `${days}d${hours > 0 ? ` ${hours}h` : ""}`;
  if (hours > 0) return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  if (minutes > 0) return `${minutes}m${seconds % 60 > 0 ? ` ${seconds % 60}s` : ""}`;
  return `${seconds}s`;
}