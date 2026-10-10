import { useEffect, useRef, type CSSProperties } from "react";
import { CRYSTAL_VALUE, TIERS, fmt, fmtOdds, variantBaseOdds } from "../game/data";
import { cutThemeFor, type Motif } from "../game/cutscenes";
import { Block, BlockButton, CloverImg, RarityText, variantPrefix } from "./ui";
import type { RevealData } from "./panels";

const CRYSTAL_COLORS: [string, string, string] = ["#dff8ff", "#8fd8ff", "#2e6fc7"];
const PARTICLES = 28;

/** Deterministic pseudo-random in [0, 1), so each clover's motif looks the same every time. */
const unit = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Stepped pixel particles, shaped and timed by the motif's CSS keyframes. */
function Motif({ kind, colors }: { kind: Motif; colors: readonly string[] }) {
  return (
    <div className={`cut-motif motif-${kind}`} aria-hidden="true">
      {Array.from({ length: PARTICLES }, (_, i) => {
        const angle = unit(i + 1) * Math.PI * 2;
        const style = {
          "--x": `${(Math.cos(angle) * (14 + unit(i + 7) * 30)).toFixed(2)}vmin`,
          "--y": `${(Math.sin(angle) * (14 + unit(i + 9) * 30)).toFixed(2)}vmin`,
          "--r": `${(16 + unit(i + 19) * 30).toFixed(1)}vmin`,
          "--a": `${((angle * 180) / Math.PI).toFixed(1)}deg`,
          "--sx": `${(unit(i + 3) * 96 + 2).toFixed(1)}%`,
          "--sy": `${(unit(i + 5) * 90 + 4).toFixed(1)}%`,
          "--d": `${(unit(i + 11) * 2.4).toFixed(2)}s`,
          "--s": `${6 + Math.floor(unit(i + 13) * 3) * 3}px`,
          "--c": colors[i % colors.length],
        } as CSSProperties;
        return <i key={i} style={style} />;
      })}
    </div>
  );
}

export function Cutscene({ data, phase, drama, onDismiss, effects }: {
  data: RevealData;
  phase: "charge" | "reveal";
  drama: number;
  onDismiss: () => void;
  effects: boolean;
}) {
  const t = TIERS[data.tier];
  const theme = cutThemeFor(t.id);
  const crystal = data.variant === "crystal";
  const colors = crystal ? CRYSTAL_COLORS : theme.colors;
  const hue = crystal ? 203 : theme.hue;
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.querySelector<HTMLButtonElement>(phase === "charge" ? ".cut-skip" : ".cut-continue")?.focus({ preventScroll: true });
  }, [phase]);

  const style = { "--h": hue, "--c1": colors[0], "--c2": colors[1], "--c3": colors[2] } as CSSProperties;

  return (
    <div
      ref={dialogRef}
      className={`cut cut-${crystal ? "crystal" : t.id} drama-${drama} phase-${phase}${data.isNew ? " is-first" : ""}`}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-label={`${variantPrefix(data.variant)}${t.label} clover reveal`}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }}
    >
      <div className="cut-dim" aria-hidden="true" />
      {effects && <Motif kind={crystal ? "twinkle" : theme.motif} colors={colors} />}
      {drama >= 3 && <><div className="cut-bar cut-bar-top" aria-hidden="true" /><div className="cut-bar cut-bar-bottom" aria-hidden="true" /></>}
      <BlockButton tone="dark" className="cut-skip" faceClassName="cut-skip-face" onClick={onDismiss}><span className="tx-label">SKIP</span></BlockButton>

      {phase === "charge" ? (
        <div className="cut-charge">
          <div className="cut-rings" aria-hidden="true"><i /><i /><i /></div>
          <CloverImg tier={data.tier} locked className="cut-silhouette" />
          <span className="tx-stroke cut-word">{crystal ? "SOMETHING CRYSTALLIZES" : theme.word}</span>
          {data.isNew && <span className="tx-label cut-first">FIRST UNLOCK / {t.name.toUpperCase()}</span>}
        </div>
      ) : (
        <div className="cut-reveal">
          {effects && <><div className="cut-rays" aria-hidden="true" /><div className="cut-burst" aria-hidden="true" /></>}
          <div className="cut-card">
            {data.isNew && (
              <Block tone="red" className="cut-new-stamp" faceClassName="cut-new-face">
                <span className="tx-stroke">FIRST UNLOCK</span>
              </Block>
            )}
            <RarityText tier={data.tier} crystal={crystal} className="cut-rarity" animated={effects}>{variantPrefix(data.variant)}{t.label}</RarityText>
            <CloverImg tier={data.tier} variant={data.variant} size="lg" className="cut-clover" animated={effects} effects={effects} />
            <Block className="cut-plate" faceClassName="cut-plate-face">
              <span className="tx-stroke cut-name">{t.name.toUpperCase()}</span>
              <span className="cut-line">{crystal ? "Ice crystallizes around the clover." : theme.line}</span>
              <span className="tx-label">1 IN {fmtOdds(t.chance * variantBaseOdds(data.variant))}</span>
              <div className="cut-tags">
                <Block tone="green" className="cut-value" faceClassName="cut-tag-face"><span className="tx-stroke">+{fmt(data.value)}</span></Block>
                {crystal && (
                  <Block tone="tint" className="cut-tag" faceClassName="cut-tag-face" style={{ "--h": 203 } as CSSProperties}>
                    <span className="tx-stroke">CRYSTAL x{CRYSTAL_VALUE}</span>
                  </Block>
                )}
                {data.crit && <Block tone="gold" className="cut-tag" faceClassName="cut-tag-face"><span className="tx-stroke">CRIT x10</span></Block>}
              </div>
            </Block>
            <BlockButton tone="dark" className="cut-continue" faceClassName="cut-continue-face" onClick={onDismiss}><span className="tx-stroke">CONTINUE</span></BlockButton>
          </div>
        </div>
      )}
    </div>
  );
}
