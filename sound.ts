type Wave = OscillatorType;

class Sfx {
  private enabledFlag = true;
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private resumePending = false;
  private voices = new Set<AudioScheduledSourceNode>();
  private burst = 0;
  private burstAt = 0;

  get enabled() { return this.enabledFlag; }
  set enabled(value: boolean) {
    this.enabledFlag = value;
    if (!value) this.stopAll();
    if (this.ctx && this.master) this.master.gain.setTargetAtTime(value ? 0.85 : 0, this.ctx.currentTime, 0.01);
  }

  stopAll() {
    for (const voice of this.voices) {
      try { voice.stop(); } catch { /* The voice may have just finished. */ }
    }
    this.voices.clear();
  }

  private ensure(): AudioContext | null {
    if (!this.enabled) return null;
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return null;
    try {
      if (!this.ctx) {
        const Ctor =
          window.AudioContext ||
          (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return null;
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.85;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended" && !this.resumePending) {
        this.resumePending = true;
        void this.ctx.resume().then(
          () => { this.resumePending = false; },
          () => { this.resumePending = false; },
        );
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  private tone(
    freq: number,
    at: number,
    dur: number,
    type: Wave = "square",
    vol = 0.05,
    slideTo?: number,
  ) {
    const ctx = this.ensure();
    if (!ctx || !this.master || this.voices.size >= 26) return;
    const t = ctx.currentTime + at;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    this.voices.add(osc);
    osc.onended = () => {
      this.voices.delete(osc);
      osc.disconnect();
      gain.disconnect();
    };
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private noise(at: number, dur: number, vol = 0.05) {
    const ctx = this.ensure();
    if (!ctx || !this.master || this.voices.size >= 26) return;
    const frames = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    this.voices.add(src);
    src.onended = () => {
      this.voices.delete(src);
      src.disconnect();
      gain.disconnect();
    };
    src.buffer = buffer;
    gain.gain.value = vol;
    src.connect(gain);
    gain.connect(this.master);
    src.start(ctx.currentTime + at);
  }

  click() {
    this.tone(880, 0, 0.05, "triangle", 0.045);
  }

  /** Low mechanical thunk played the instant the roll button is pressed. */
  press() {
    this.tone(140, 0, 0.055, "sine", 0.07, 70);
    this.noise(0, 0.018, 0.02);
  }

  open() {
    this.tone(420, 0, 0.12, "triangle", 0.045, 760);
  }

  buy() {
    this.tone(988, 0, 0.08, "square", 0.04);
    this.tone(1319, 0.07, 0.2, "square", 0.04);
    this.tone(2637, 0.07, 0.18, "sine", 0.018);
  }

  collectOffline() {
    if (!this.enabled) return;
    [659.25, 783.99, 987.77, 1318.51].forEach((frequency, index) => {
      this.tone(frequency, index * 0.055, 0.22, "triangle", 0.045);
    });
    this.tone(2637, 0.17, 0.32, "sine", 0.022);
  }

  deny() {
    this.tone(150, 0, 0.16, "square", 0.045, 110);
  }

  /** rising tension for a cutscene; `level` 2-4 */
  charge(level: number, seconds: number) {
    const steps = level >= 4 ? 14 : level >= 3 ? 10 : 6;
    this.tone(70, 0, seconds, "sine", 0.1, 180);
    this.tone(160, 0, seconds, "sawtooth", 0.03, 1500);
    for (let i = 0; i < steps; i++) {
      const f = i / steps;
      this.tone(500 + f * 2600, (seconds * i) / steps, 0.09, "triangle", 0.022);
    }
    if (level >= 3) this.noise(seconds * 0.55, seconds * 0.45, 0.03);
  }

  /** the hit at the end of a cutscene */
  impact(level: number) {
    this.tone(60, 0, 1.1, "sine", 0.2, 32);
    this.noise(0, 0.5, level >= 4 ? 0.09 : 0.06);
    if (level >= 4) this.tone(44, 0.02, 1.6, "square", 0.08, 26);
  }

  /** Big crackling "run resets" whoosh followed by a rising phoenix chord. */
  rebirth() {
    if (!this.enabled) return;
    this.tone(90, 0, 0.9, "sawtooth", 0.05, 30);
    this.noise(0, 0.9, 0.06);
    [261.63, 329.63, 392, 523.25, 659.25, 783.99].forEach((f, i) => this.tone(f, 0.75 + i * 0.1, 1.3, "square", 0.03));
    [523.25, 659.25, 783.99].forEach((f) => this.tone(f * 2, 1.4, 1.5, "triangle", 0.02));
    for (let i = 0; i < 10; i++) this.tone(1500 + Math.random() * 3000, 1.3 + i * 0.08, 0.14, "sine", 0.018);
  }

  roll(tier: number, shiny: boolean, crit: boolean, crystal = false) {
    if (!this.enabled) return;
    const now = performance.now();
    if (now - this.burstAt > 120) {
      this.burst = 0;
      this.burstAt = now;
    }
    this.burst++;
    if (tier <= 2 && this.burst > 2) return;

    const scale = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98, 2093];

    if (tier === 0) {
      this.tone(620, 0, 0.08, "square", 0.035, 900);
    } else if (tier === 1) {
      this.tone(659.25, 0, 0.08, "square", 0.035);
      this.tone(987.77, 0.055, 0.12, "square", 0.035);
    } else if (tier === 2) {
      [0, 1, 2].forEach((n, i) => this.tone(scale[n + 1], i * 0.055, 0.15, "triangle", 0.05));
    } else if (tier === 3) {
      this.tone(110, 0, 0.28, "sine", 0.1, 60);
      [0, 1, 2, 3].forEach((n, i) => this.tone(scale[n + 1], i * 0.055, 0.18, "square", 0.035));
    } else {
      const chord =
        tier >= 8
          ? [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98]
          : tier >= 6
            ? [523.25, 659.25, 783.99, 1046.5, 1318.5]
            : [523.25, 659.25, 783.99, 1046.5];
      [0, 1, 2, 3].forEach((n, i) => this.tone(scale[n], i * 0.075, 0.16, "square", 0.035));
      chord.forEach((f) => this.tone(f, 0.32, 1, "square", 0.022));
      chord.forEach((f) => this.tone(f * 2, 0.32, 1, "triangle", 0.016));
      const sparkles = Math.min(18, 6 + tier);
      for (let i = 0; i < sparkles; i++) {
        this.tone(1800 + Math.random() * 2800, 0.38 + i * 0.06, 0.12, "sine", 0.016);
      }
      if (tier >= 9) {
        [0, 1, 2].forEach((i) => this.tone(scale[6] * (1 + i * 0.5), 1.3 + i * 0.18, 0.5, "triangle", 0.02));
      }
    }

    if (shiny) {
      for (let i = 0; i < 6; i++) this.tone(1800 + i * 300, 0.1 + i * 0.04, 0.11, "sine", 0.025);
    }
    if (crystal) {
      // glassy ascending chime
      [2093, 2637, 3136, 4186].forEach((f, i) => this.tone(f, 0.05 + i * 0.09, 0.5, "sine", 0.035));
      [2093, 2637, 3136, 4186].forEach((f, i) => this.tone(f * 1.5, 0.08 + i * 0.09, 0.3, "triangle", 0.012));
      this.tone(5200, 0.45, 0.6, "sine", 0.02, 6400);
    }
    if (crit) {
      this.tone(300, 0, 0.1, "sawtooth", 0.04, 1800);
      this.tone(1600, 0.08, 0.22, "square", 0.03);
    }
  }
}

export const sfx = new Sfx();
