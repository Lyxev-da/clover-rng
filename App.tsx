import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { warmCloverSprites } from "./clover";
import {
  CRYSTAL_REBIRTHS, TIERS, TOTAL_ENTRIES, TOTAL_QUESTS, UPGRADES, autoInterval, canRebirth, claimQuest,
  claimableQuestCount, claimedQuestCount, clearSave, crystalUnlocked, discoveredCount, doRebirth, fmt, getLuck, newSave,
  rebirthCost, rollBatch, rollCooldown, rollsPerClick, valueMult,
  addLifetime, claimDaily, dailyStatus,
  type RollResult, type UpgradeId,
} from "./game/data";
import { useGameSession } from "./game/useGameSession";
import { sfx } from "./game/sound";
import { Block, BlockButton, CloverImg, PixelIcon, RarityText, variantPrefix } from "./components/ui";
import { DailyModal, IndexModal, Modal, OfflineModal, QuestsModal, RebirthCutscene, RebirthModal, RevealBanner, SettingsModal, ShopModal, type RevealData } from "./components/panels";
import { Cutscene } from "./components/Cutscene";
import { ParticleCanvas, type ParticleHandle } from "./components/ParticleCanvas";
import { RollHistory } from "./components/RollHistory";

type ModalName = "shop" | "index" | "settings" | "history" | "rebirth" | "offline" | "quests" | "daily";
/** Hot-pink hue shared by the rebirth icon and every rebirth panel/button. */
const REBIRTH_HUE = 330;
type CutState = { data: RevealData; phase: "charge" | "reveal"; drama: number };
const FEED_LIMIT = 60;

export default function App() {
  const { save, saveRef, commit, ownerRef, status, storageEnabled, saveError, persistNow, claimOffline, retrySession } = useGameSession();
  const worldRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glyphRef = useRef<HTMLSpanElement>(null);
  const particleRef = useRef<ParticleHandle>(null);
  const pointerBounds = useRef<DOMRect | null>(null);
  const ids = useRef(0);
  const [lastRoll, setLastRoll] = useState<{ tier: number; variant: RollResult["variant"] }>({ tier: 0, variant: "normal" });
  const queuedBurst = useRef<RollResult | null>(null);
  const burstTimer = useRef<number | undefined>(undefined);
  const shownOfflineReceipt = useRef<string | null>(null);
  const [offlineClaimError, setOfflineClaimError] = useState(false);
  const readyAt = useRef(0);
  const cooldownTimer = useRef<number | undefined>(undefined);
  const bannerTimer = useRef<number | undefined>(undefined);
  const cutTimers = useRef<number[]>([]);
  const lastCutAt = useRef(-Infinity);
  const glyphAnimation = useRef<Animation | null>(null);
  const [cooldown, setCooldown] = useState({ active: false, duration: 900, token: 0 });
  const [feed, setFeed] = useState<RollResult[]>([]);
  const [banner, setBanner] = useState<RevealData | null>(null);
  const [cut, setCut] = useState<CutState | null>(null);
  const cutRef = useRef<CutState | null>(null);
  const [rebirthScene, setRebirthScene] = useState<{ rebirths: number; crystals: boolean } | null>(null);
  const rebirthSceneRef = useRef(false);
  const [modal, setModal] = useState<ModalName | null>(null);
  const modalRef = useRef<ModalName | null>(null);
  const [visible, setVisible] = useState(() => !document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  const effects = !save.performance && !reducedMotion;
  const effectsRef = useRef(effects);
  effectsRef.current = effects;
  const luck = getLuck(save);
  const found = discoveredCount(save);
  const shownTier = TIERS[lastRoll.tier];
  const shownCrystal = lastRoll.variant === "crystal";
  const cutActive = cut !== null || rebirthScene !== null;
  const sessionBlocked = status !== "active";
  const uiBlocked = !!modal || cutActive || sessionBlocked;
  const canAfford = UPGRADES.some((upgrade) => save.upgrades[upgrade.id] < upgrade.max && save.clovers >= upgrade.cost(save.upgrades[upgrade.id]));
  const rebirthReady = canRebirth(save);
  const crystals = crystalUnlocked(save);
  const daily = dailyStatus(save);

  // All-time play time: counted every 15 seconds while the tab is visible and we own the save.
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!ownerRef.current || document.hidden) return;
      const current = saveRef.current;
      commit({ ...current, lifetime: { ...current.lifetime, playMs: current.lifetime.playMs + 15000 } });
    }, 15000);
    return () => window.clearInterval(timer);
  }, [commit, ownerRef, saveRef]);

  useEffect(() => { sfx.enabled = save.sound; }, [save.sound]);
  useEffect(() => warmCloverSprites(TIERS, crystals), [crystals]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReducedMotion(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    const visibility = () => {
      setVisible(!document.hidden);
      if (document.hidden) sfx.stopAll();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);

  useEffect(() => {
    const reward = save.offlineReward;
    if (sessionBlocked || !visible || cutActive || !reward || shownOfflineReceipt.current === reward.id) return;
    shownOfflineReceipt.current = reward.id;
    setOfflineClaimError(false);
    modalRef.current = "offline";
    setModal("offline");
    particleRef.current?.clear();
  }, [save.offlineReward, sessionBlocked, visible, cutActive]);

  const beginCooldown = useCallback((duration: number, now = performance.now()) => {
    readyAt.current = now + duration;
    window.clearTimeout(cooldownTimer.current);
    setCooldown((previous) => ({ active: true, duration, token: previous.token + 1 }));
    cooldownTimer.current = window.setTimeout(() => setCooldown((previous) => ({ ...previous, active: false })), duration);
  }, []);

  const clearCutTimers = useCallback(() => {
    cutTimers.current.forEach((timer) => window.clearTimeout(timer));
    cutTimers.current = [];
  }, []);

  const putCut = useCallback((next: CutState | null) => {
    cutRef.current = next;
    setCut(next);
  }, []);

  const burstFor = useCallback((result: RollResult, value: number) => {
    if (!effectsRef.current) return;
    const world = worldRef.current?.getBoundingClientRect();
    const button = buttonRef.current?.getBoundingClientRect();
    if (!world || !button) return;
    particleRef.current?.burst({
      x: button.left + button.width / 2 - world.left,
      y: button.top + button.height / 2 - world.top,
      tier: result.tier,
      variant: result.variant,
      value,
    });
  }, []);

  const endCutscene = useCallback(() => {
    if (!cutRef.current) return;
    clearCutTimers();
    sfx.stopAll();
    putCut(null);
    beginCooldown(220);
    const burst = queuedBurst.current;
    queuedBurst.current = null;
    if (burst) burstTimer.current = window.setTimeout(() => burstFor(burst, burst.value), 80);
    cutTimers.current.push(window.setTimeout(() => {
      if (!modalRef.current && !cutRef.current) buttonRef.current?.focus({ preventScroll: true });
    }, 240));
  }, [beginCooldown, burstFor, clearCutTimers, putCut]);

  const startCutscene = useCallback((data: RevealData, drama: number) => {
    clearCutTimers();
    window.clearTimeout(bannerTimer.current);
    setBanner(null);
    particleRef.current?.clear();
    const chargeMs = effectsRef.current ? (drama >= 4 ? 1900 : drama >= 3 ? 1200 : 750) : 250;
    const holdMs = drama >= 4 ? 5000 : 3000;
    lastCutAt.current = performance.now();
    putCut({ data, phase: "charge", drama });
    sfx.charge(drama, chargeMs / 1000);
    cutTimers.current.push(window.setTimeout(() => {
      if (cutRef.current?.data.key !== data.key) return;
      putCut({ data, phase: "reveal", drama });
      if (!document.hidden) {
        sfx.impact(drama);
        sfx.roll(data.tier, data.variant === "shiny", data.crit, data.variant === "crystal");
      }
    }, chargeMs));
    cutTimers.current.push(window.setTimeout(endCutscene, chargeMs + holdMs));
  }, [clearCutTimers, endCutscene, putCut]);

  const doRoll = useCallback(() => {
    const now = performance.now();
    // Extra input is rejected before any RNG, sound, DOM or state work happens.
    if (!ownerRef.current || now < readyAt.current || cutRef.current || rebirthSceneRef.current || modalRef.current || document.hidden) return;
    const current = saveRef.current;
    beginCooldown(rollCooldown(current), now);
    const batch = rollBatch(current, () => ++ids.current);
    if (!commit(addLifetime(batch.next, batch.results))) return;
    setFeed((previous) => [...batch.results.slice().reverse(), ...previous].slice(0, FEED_LIMIT));

    if (effectsRef.current) {
      glyphAnimation.current?.cancel();
      glyphAnimation.current = glyphRef.current?.animate([
        { transform: "scale(1) rotate(0deg)" },
        { transform: "scale(0.91) rotate(-3deg)", offset: 0.25 },
        { transform: "scale(1.045) rotate(2deg)", offset: 0.65 },
        { transform: "scale(1) rotate(0deg)" },
      ], { duration: 360, easing: "ease-out" }) ?? null;
    }

    const best = batch.best;
    setLastRoll({ tier: best.tier, variant: best.variant });
    const crystal = best.variant === "crystal";
    const data: RevealData = { key: best.id, tier: best.tier, variant: best.variant, crit: best.crit, value: best.value, isNew: best.isNew, guaranteed: best.guaranteed };
    // crystals always get the full cinematic treatment
    // First unlock of any clover (beyond the starter) gets its own themed cutscene.
    const firstUnlock = best.isNew && best.variant === "normal" && best.tier > 0;
    const drama = crystal ? Math.max(3, TIERS[best.tier].drama) : firstUnlock ? Math.max(2, TIERS[best.tier].drama) : TIERS[best.tier].drama;
    const cinematic = current.cutscenes && (crystal || firstUnlock || (drama >= 2 && best.tier >= 9 && now - lastCutAt.current > 14000));
    if (cinematic) {
      queuedBurst.current = { ...best, value: batch.gained };
      startCutscene(data, drama);
      return;
    }

    sfx.roll(best.tier, best.variant === "shiny", best.crit, crystal);
    if (drama >= 1 || best.variant !== "normal" || best.isNew || best.guaranteed) {
      window.clearTimeout(bannerTimer.current);
      setBanner(data);
      bannerTimer.current = window.setTimeout(() => setBanner(null), 1800);
    }
    burstFor(best, batch.gained);
  }, [beginCooldown, burstFor, commit, startCutscene, ownerRef, saveRef]);

  // Auto roll shares the same cooldown, so it can never out-pace a manual roll.
  useEffect(() => {
    if (sessionBlocked || !save.auto || !autoInterval(save) || modal || cutActive || !visible) return;
    let timer = 0;
    const tick = () => {
      doRoll();
      timer = window.setTimeout(tick, Math.max(autoInterval(saveRef.current), readyAt.current - performance.now() + 4));
    };
    timer = window.setTimeout(tick, Math.max(autoInterval(save), readyAt.current - performance.now() + 4));
    return () => window.clearTimeout(timer);
  }, [save.auto, save.upgrades.auto, modal, cutActive, visible, doRoll, sessionBlocked, saveRef]);

  const finishRebirthScene = useCallback(() => {
    rebirthSceneRef.current = false;
    setRebirthScene(null);
    sfx.stopAll();
    beginCooldown(300);
  }, [beginCooldown]);

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (!ownerRef.current) return;
      if (event.code === "Escape") {
        if (modalRef.current) { modalRef.current = null; setModal(null); }
        else if (cutRef.current) endCutscene();
        else if (rebirthSceneRef.current) finishRebirthScene();
        return;
      }
      if (event.code !== "Space" || modalRef.current) return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
      if (target instanceof HTMLElement && target.closest("button") && target !== buttonRef.current && !cutRef.current && !rebirthSceneRef.current) return;
      event.preventDefault();
      if (event.repeat) return; // holding Space never repeats
      if (cutRef.current) { endCutscene(); return; }
      if (rebirthSceneRef.current) { finishRebirthScene(); return; }
      doRoll();
    };
    window.addEventListener("keydown", keyDown);
    return () => window.removeEventListener("keydown", keyDown);
  }, [doRoll, endCutscene, finishRebirthScene, ownerRef]);

  useEffect(() => () => {
    window.clearTimeout(cooldownTimer.current);
    window.clearTimeout(bannerTimer.current);
    window.clearTimeout(burstTimer.current);
    clearCutTimers();
    glyphAnimation.current?.cancel();
    sfx.stopAll();
  }, [clearCutTimers]);

  const closeModal = () => { modalRef.current = null; setModal(null); };
  const openModal = (name: ModalName) => { if (!ownerRef.current) return; sfx.open(); modalRef.current = name; setModal(name); if (name === "offline") setOfflineClaimError(false); particleRef.current?.clear(); };

  const buy = (id: UpgradeId, max = false) => {
    if (!ownerRef.current) return;
    const current = saveRef.current;
    const upgrade = UPGRADES.find((item) => item.id === id)!;
    let level = current.upgrades[id];
    let wallet = current.clovers;
    let purchased = 0;
    while (level < upgrade.max && wallet >= upgrade.cost(level)) {
      wallet -= upgrade.cost(level++);
      purchased++;
      if (!max) break;
    }
    if (!purchased) return sfx.deny();
    if (!commit({ ...current, clovers: wallet, upgrades: { ...current.upgrades, [id]: level }, auto: id === "auto" && current.upgrades.auto === 0 ? true : current.auto })) return;
    persistNow();
    sfx.buy();
  };

  const toggleAuto = () => {
    if (!ownerRef.current) return;
    const current = saveRef.current;
    if (!current.upgrades.auto) return openModal("shop");
    sfx.click();
    commit({ ...current, auto: !current.auto });
    persistNow();
  };

  const rebirth = () => {
    if (!ownerRef.current) return;
    const current = saveRef.current;
    if (!canRebirth(current)) return sfx.deny();
    if (!window.confirm(`Rebirth now for ${fmt(rebirthCost(current.rebirths))} clovers?\n\nThis wipes your clovers and upgrades. Your index and settings stay.`)) return;
    const next = doRebirth(current);
    const unlockedCrystals = !crystalUnlocked(current) && crystalUnlocked(next);
    if (!commit(next)) return;
    persistNow();
    setFeed([]);
    setLastRoll({ tier: 0, variant: "normal" });
    queuedBurst.current = null;
    window.clearTimeout(burstTimer.current);
    setBanner(null);
    particleRef.current?.clear();
    window.clearTimeout(bannerTimer.current);
    closeModal();
    sfx.rebirth();
    rebirthSceneRef.current = true;
    setRebirthScene({ rebirths: next.rebirths, crystals: unlockedCrystals });
  };

  const reset = () => {
    if (!window.confirm("Reset all clovers, upgrades, rebirths and discoveries?")) return;
    if (!ownerRef.current) return;
    const old = saveRef.current;
    if (!commit({ ...newSave(), sound: old.sound, cutscenes: old.cutscenes, performance: old.performance })) return;
    clearSave();
    persistNow();
    setFeed([]);
    setLastRoll({ tier: 0, variant: "normal" });
    queuedBurst.current = null;
    window.clearTimeout(burstTimer.current);
    setBanner(null);
    particleRef.current?.clear();
    window.clearTimeout(bannerTimer.current);
    closeModal();
  };

  const collectOffline = () => {
    const receipt = saveRef.current.offlineReward;
    if (!receipt) return closeModal();
    const collected = claimOffline(receipt.id);
    if (collected === null) { setOfflineClaimError(true); return; }
    setOfflineClaimError(false);
    closeModal();
    sfx.collectOffline();
    beginCooldown(220);
  };

  const claimDailyReward = () => {
    if (!ownerRef.current) return;
    const current = saveRef.current;
    const next = claimDaily(current);
    if (next === current) return sfx.deny();
    if (!commit(next)) return;
    persistNow();
    sfx.collectOffline();
  };

  const claimQuestReward = (id: string) => {
    if (!ownerRef.current) return;
    const current = saveRef.current;
    const next = claimQuest(current, id);
    if (next === current) return sfx.deny();
    if (!commit(next)) return;
    persistNow();
    sfx.buy();
  };

  return (
    <main className={`world${!effects ? " low-effects" : ""}${uiBlocked || !visible ? " is-paused" : ""}`} ref={worldRef}>
      <div className="world-grid" aria-hidden="true" />
      <div className="world-glow" aria-hidden="true" />

      {/* ---------- TOP HUD ---------- */}
      <header className="hud-top" inert={uiBlocked}>
        <div className="hud-logo">
          <CloverImg tier={0} size="sm" className="logo-clover" />
          <span className="logo-copy">
            <span className="tx-stroke logo-title">CLOVER <em>RNG</em></span>
            <span className="tx-label logo-sub">ROLL FOR RARITY</span>
          </span>
        </div>

        <div className="hud-stats">
          <Block className="stat" faceClassName="stat-face">
            <CloverImg tier={0} size="sm" className="stat-icon" />
            <span className="stat-copy">
              <span className="tx-stroke stat-value">{fmt(save.clovers)}</span>
              <span className="tx-label">CLOVERS</span>
            </span>
          </Block>
          <Block className="stat" faceClassName="stat-face">
            <PixelIcon name="gem" className="stat-gem" />
            <span className="stat-copy">
              <span className={`tx-stroke stat-value is-gold${save.luckScale < 1 ? " is-dimmed" : ""}`}>x{luck < 0.01 ? luck.toFixed(3) : luck.toFixed(2)}</span>
              <span className="tx-label">LUCK</span>
            </span>
          </Block>
          {save.rebirths > 0 && (
            <Block tone="dark" className="stat stat-rebirth" faceClassName="stat-face">
              <PixelIcon name="rebirth" className="stat-gem" />
              <span className="stat-copy">
                <span className="tx-stroke stat-value is-fire">{save.rebirths}</span>
                <span className="tx-label">REBIRTHS</span>
              </span>
            </Block>
          )}
        </div>

        <div className="hud-actions">
          <div className="offline-action">
            <BlockButton tone={daily.claimedToday ? "dark" : "green"} className="settings-btn daily-btn" faceClassName="settings-face" onClick={() => openModal("daily")} aria-label={daily.claimedToday ? "Daily reward claimed today" : "Daily reward ready to claim"} title="Daily reward">
              <PixelIcon name="calendar" />
            </BlockButton>
            {!daily.claimedToday && <Block tone="red" className="offline-badge" faceClassName="offline-badge-face"><span className="tx-stroke">!</span></Block>}
          </div>
          <div className="offline-action">
            <BlockButton tone={save.offlineReward ? "gold" : "metal"} className="settings-btn offline-btn" faceClassName="settings-face" onClick={() => openModal("offline")} aria-label={save.offlineReward ? `${fmt(save.offlineReward.amount)} offline clovers ready to collect` : "View offline earnings"} title="Offline earnings">
              <PixelIcon name="offline" />
            </BlockButton>
            {save.offlineReward && <Block tone="green" className="offline-badge" faceClassName="offline-badge-face"><span className="tx-stroke">+</span></Block>}
          </div>
          <BlockButton className="settings-btn" faceClassName="settings-face" onClick={() => openModal("settings")} aria-label="Open settings">
            <PixelIcon name="gear" />
          </BlockButton>
        </div>
      </header>

      {/* ---------- LEFT DOCK ---------- */}
      <nav className="dock" aria-label="Game menu" inert={uiBlocked}>
        <div className="dock-item">
          <BlockButton className="dock-btn" faceClassName="dock-face" onClick={() => openModal("shop")} aria-label="Open shop">
            <PixelIcon name="bag" className="dock-icon" />
            <span className="tx-stroke dock-label">SHOP</span>
          </BlockButton>
          {canAfford && <Block tone="red" className="dock-badge" faceClassName="dock-badge-face"><span className="tx-stroke">!</span></Block>}
        </div>

        <div className="dock-item">
          <BlockButton className="dock-btn" faceClassName="dock-face" onClick={() => openModal("index")} aria-label={`Open index, ${found} of ${TOTAL_ENTRIES} discovered`}>
            <PixelIcon name="book" className="dock-icon" />
            <span className="tx-stroke dock-label">INDEX</span>
          </BlockButton>
          <Block tone="tint" className="dock-badge is-wide" faceClassName="dock-badge-face" style={{ "--h": 272 } as CSSProperties}>
            <span className="tx-stroke">{found}/{TOTAL_ENTRIES}</span>
          </Block>
        </div>

        <div className="dock-item">
          <BlockButton tone={rebirthReady ? "tint" : "metal"} style={rebirthReady ? ({ "--h": REBIRTH_HUE } as CSSProperties) : undefined} className={`dock-btn rebirth-dock${rebirthReady ? " is-ready" : ""}`} faceClassName="dock-face" onClick={() => openModal("rebirth")} aria-label={rebirthReady ? "Rebirth is ready" : "Open rebirth"}>
            <PixelIcon name="rebirth" className="dock-icon" />
            <span className="tx-stroke dock-label">REBIRTH</span>
          </BlockButton>
          {rebirthReady ? (
            <Block tone="tint" className="dock-badge" faceClassName="dock-badge-face" style={{ "--h": REBIRTH_HUE } as CSSProperties}><span className="tx-stroke">!</span></Block>
          ) : save.rebirths > 0 ? (
            <Block tone="dark" className="dock-badge is-wide" faceClassName="dock-badge-face"><span className="tx-stroke">{save.rebirths}</span></Block>
          ) : null}
        </div>

        <div className="dock-item">
          <BlockButton className="dock-btn" faceClassName="dock-face" onClick={() => openModal("quests")} aria-label={`Open quests, ${claimedQuestCount(save)} of ${TOTAL_QUESTS} completed`}>
            <PixelIcon name="quest" className="dock-icon" />
            <span className="tx-stroke dock-label">QUESTS</span>
          </BlockButton>
          {claimableQuestCount(save) > 0 ? (
            <Block tone="red" className="dock-badge" faceClassName="dock-badge-face"><span className="tx-stroke">!</span></Block>
          ) : (
            <Block tone="dark" className="dock-badge is-wide" faceClassName="dock-badge-face"><span className="tx-stroke">{claimedQuestCount(save)}/{TOTAL_QUESTS}</span></Block>
          )}
        </div>

        <div className="dock-item history-dock">
          <BlockButton className="dock-btn" faceClassName="dock-face" onClick={() => openModal("history")} aria-label="Open recent rolls">
            <PixelIcon name="log" className="dock-icon" />
            <span className="tx-stroke dock-label">LOG</span>
          </BlockButton>
        </div>
      </nav>

      {/* ---------- RIGHT FEED ---------- */}
      <aside className="feed" aria-label="Recent rolls" inert={uiBlocked}>
        <Block faceClassName="feed-face">
          <span className="tx-stroke feed-title">RECENT ROLLS</span>
          <RollHistory feed={feed} />
        </Block>
      </aside>

      {/* ---------- CENTER STAGE ---------- */}
      <section className="play-space" aria-label="Clover roller" inert={uiBlocked}>
        <div className={`stage stage-${shownTier.id}${shownCrystal ? " is-crystal-stage" : ""}`} style={{ "--h": shownCrystal ? 203 : shownTier.hue } as CSSProperties}>
          <div className="stage-light" aria-hidden="true" />

          <button
            ref={buttonRef}
            className={`luck-button${cooldown.active ? " is-cooling" : ""}`}
            type="button"
            disabled={cooldown.active || cutActive || sessionBlocked}
            onPointerDown={() => {
              if (cooldown.active || cutActive || sessionBlocked) return;
              sfx.press();
              if (navigator.vibrate) navigator.vibrate(8);
            }}
            onClick={doRoll}
            onKeyDown={(event) => { if (event.repeat && (event.code === "Enter" || event.code === "Space")) event.preventDefault(); }}
            onKeyUp={(event) => { if (event.code === "Space") event.preventDefault(); }}
            onPointerEnter={(event) => { pointerBounds.current = event.currentTarget.getBoundingClientRect(); }}
            onPointerMove={(event) => {
              if (!effects || event.pointerType !== "mouse" || !pointerBounds.current) return;
              const rect = pointerBounds.current;
              const x = clampUnit((event.clientX - rect.left) / rect.width - 0.5);
              const y = clampUnit((event.clientY - rect.top) / rect.height - 0.5);
              // The tilt snaps to blocky 4-degree steps, like the pixel edges.
              const ry = Math.round(x * 3) * 4;
              const rx = Math.round(-y * 3) * 4;
              event.currentTarget.style.setProperty("--ry", `${ry}deg`);
              event.currentTarget.style.setProperty("--rx", `${rx}deg`);
            }}
            onPointerLeave={(event) => {
              event.currentTarget.style.setProperty("--ry", "0deg");
              event.currentTarget.style.setProperty("--rx", "0deg");
              pointerBounds.current = null;
            }}
            aria-label={`Roll for a clover. Last roll: ${variantPrefix(lastRoll.variant).toLowerCase()}${shownTier.name}. Luck x${luck.toFixed(2)}.`}
            aria-keyshortcuts="Space Enter"
          >
            <span className="hex-frame" aria-hidden="true">
              <span className="hex-face">
                <span ref={glyphRef} className="clover-pop">
                  <CloverImg tier={lastRoll.tier} variant={lastRoll.variant} size="lg" className="hero-clover" animated={effects && !modal && !cutActive} effects={effects} />
                </span>
              </span>
            </span>
            <span className="button-shadow" aria-hidden="true" />
          </button>

          <span className="stage-spark stage-spark-one" aria-hidden="true" />
          <span className="stage-spark stage-spark-two" aria-hidden="true" />
          <span className="stage-spark stage-spark-three" aria-hidden="true" />
          <span className="stage-spark stage-spark-four" aria-hidden="true" />
        </div>

        <div className="play-copy">
          <p className="tx-stroke roll-cta">CLICK TO ROLL!</p>

          <div className="cool-row">
            <div className={`cool${cooldown.active ? " is-active" : ""}`}>
              <span className="tx-label">COOLDOWN</span>
              <span className="cooldown-track px">
                <i key={cooldown.token} className={cooldown.active ? "is-filling" : ""} style={{ "--roll-duration": `${cooldown.duration}ms` } as CSSProperties} />
              </span>
              <span className={`tx-stroke cool-state${cooldown.active ? "" : " is-ready"}`}>{cooldown.active ? "WAIT" : "READY"}</span>
            </div>
            <BlockButton
              tone={save.auto ? "green" : "metal"}
              className="auto-btn"
              faceClassName="auto-btn-face"
              onClick={toggleAuto}
              aria-pressed={save.auto}
              aria-label={save.upgrades.auto ? "Toggle auto roll" : "Unlock auto roll in the shop"}
            >
              <PixelIcon name={save.upgrades.auto ? "auto" : "lock"} muted={!!save.upgrades.auto && !save.auto} className="auto-btn-icon" />
              <span className="tx-stroke auto-btn-label">AUTO</span>
              <span className="tx-label auto-btn-state">{save.upgrades.auto === 0 ? "LOCKED" : save.auto ? "ON" : "OFF"}</span>
            </BlockButton>
          </div>

          <div className="roll-chips">
            <Block tone="dark" className="chip chip-last-roll" faceClassName="chip-face">
              <CloverImg tier={lastRoll.tier} variant={lastRoll.variant} size="sm" sparkles={false} effects={false} className="chip-clover" />
              <span className="tx-label">LAST</span>
              <RarityText tier={lastRoll.tier} crystal={shownCrystal} animated={effects} className="chip-name">{variantPrefix(lastRoll.variant)}{shownTier.label}</RarityText>
            </Block>
            <Block tone="dark" className="chip" faceClassName="chip-face">
              <PixelIcon name="dice" className="chip-icon" />
              <span className="tx-stroke chip-value">x{rollsPerClick(save)}</span>
              <span className="tx-label">PER CLICK</span>
            </Block>
            <Block tone="dark" className="chip" faceClassName="chip-face">
              <PixelIcon name="coin" className="chip-icon" />
              <span className="tx-stroke chip-value">x{valueMult(save).toFixed(1)}</span>
              <span className="tx-label">VALUE</span>
            </Block>
            <Block tone="dark" className="chip" faceClassName="chip-face">
              <PixelIcon name="log" className="chip-icon" />
              <span className="tx-stroke chip-value">{fmt(save.rolls)}</span>
              <span className="tx-label">ROLLS</span>
            </Block>
            {crystals && (
              <Block tone="tint" className="chip chip-crystal" faceClassName="chip-face" style={{ "--h": 203 } as CSSProperties}>
                <PixelIcon name="crystal" className="chip-icon" />
                <span className="tx-stroke chip-value">CRYSTALS ON</span>
              </Block>
            )}
          </div>

          <p className="tx-label space-hint">{save.rebirths >= 1 && !crystals ? `OR PRESS SPACE / ${CRYSTAL_REBIRTHS - save.rebirths} MORE REBIRTH${CRYSTAL_REBIRTHS - save.rebirths === 1 ? "" : "S"} TO UNLOCK CRYSTALS` : "OR PRESS SPACE"}</p>
        </div>
      </section>

      {/* ---------- FX ---------- */}
      <ParticleCanvas ref={particleRef} enabled={effects} paused={uiBlocked || !visible} />
      {banner && !cutActive && !modal && !sessionBlocked && <RevealBanner key={banner.key} data={banner} />}
      {cut && <Cutscene key={cut.data.key} data={cut.data} phase={cut.phase} drama={cut.drama} effects={effects} onDismiss={endCutscene} />}
      {rebirthScene && <RebirthCutscene rebirths={rebirthScene.rebirths} crystalsJustUnlocked={rebirthScene.crystals} onDone={finishRebirthScene} />}

      {modal === "shop" && <ShopModal save={save} onBuy={(id) => buy(id)} onBuyMax={(id) => buy(id, true)} onClose={closeModal} />}
      {modal === "index" && <IndexModal save={save} onClose={closeModal} />}
      {modal === "rebirth" && <RebirthModal save={save} onRebirth={rebirth} onClose={closeModal} />}
      {modal === "quests" && <QuestsModal save={save} onClaim={claimQuestReward} onClose={closeModal} />}
      {modal === "daily" && <DailyModal save={save} status={daily} onClaim={claimDailyReward} onClose={closeModal} />}
      {modal === "offline" && !sessionBlocked && <OfflineModal save={save} effects={effects} storageEnabled={storageEnabled} claimError={offlineClaimError} onClaim={collectOffline} onEnableAuto={() => { if (commit({ ...saveRef.current, auto: true })) { persistNow(); sfx.click(); closeModal(); } }} onOpenShop={() => openModal("shop")} onClose={closeModal} />}
      {modal === "history" && (
        <Modal title="RECENT ROLLS" headTone="tint" headHue={199} icon="log" onClose={closeModal}>
          <RollHistory feed={feed} />
        </Modal>
      )}
      {modal === "settings" && (
        <SettingsModal
          save={save}
          onToggleSound={() => { const next = !saveRef.current.sound; sfx.enabled = next; commit({ ...saveRef.current, sound: next }); if (next) sfx.click(); }}
          onToggleCutscenes={() => { sfx.click(); commit({ ...saveRef.current, cutscenes: !saveRef.current.cutscenes }); }}
          onTogglePerformance={() => { sfx.click(); commit({ ...saveRef.current, performance: !saveRef.current.performance }); }}
          onLuckScale={(scale) => { sfx.click(); commit({ ...saveRef.current, luckScale: scale }); }}
          onReset={reset}
          onClose={closeModal}
        />
      )}
      {sessionBlocked && visible && <Modal title={status === "other-tab" ? "ONE SAVE. ONE SESSION." : "LOADING YOUR SAVE"} headTone="gold" icon="offline" onClose={retrySession} dismissible={false} className="session-modal">
        <div className="session-notice">
          <PixelIcon name="offline" className="session-icon" />
          <span className="tx-stroke">{status === "other-tab" ? "YOUR CLOVERS ARE SAFE" : "JUST A MOMENT..."}</span>
          <p>{status === "other-tab" ? "This game is active in another tab. Close or switch away from that tab to continue here. Your rewards can only be collected once." : "Checking your saved progress and offline rewards."}</p>
          {status === "other-tab" && <BlockButton tone="green" className="session-retry" faceClassName="session-retry-face" onClick={retrySession}><span className="tx-stroke">TRY AGAIN</span></BlockButton>}
          {saveError && <p className="offline-error">Browser storage could not be accessed. Please check your browser settings.</p>}
        </div>
      </Modal>}
    </main>
  );
}

const clampUnit = (n: number) => Math.max(-0.5, Math.min(0.5, n));
