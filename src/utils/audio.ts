/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private gripOscillator: OscillatorNode | null = null;
  private gripGain: GainNode | null = null;

  // Master options
  public masterEnabled = true;
  public sfxEnabled = true;
  public ambientEnabled = true;

  constructor() {
    // Lazy loaded context to comply with browser autoplay policies
  }

  private initContext(): boolean {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return true;
    }
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return false;
    try {
      this.ctx = new AudioContextClass();
      return true;
    } catch (e) {
      console.warn('AudioContext failed to initialize', e);
      return false;
    }
  }

  /**
   * Play the deep, resonant temple bowl gong chime (ambient/success).
   */
  public playGongChime() {
    if (!this.masterEnabled || !this.ambientEnabled) return;
    if (!this.initContext() || !this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Create multiple oscillators for rich metallic harmonic overtones
    const frequencies = [110, 220, 330, 442, 554, 660, 880];
    const gains = [1.0, 0.4, 0.25, 0.15, 0.1, 0.05, 0.02];
    
    // Master gain for the chime
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    // Smooth, long decay over 3.5 seconds
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);
    masterGain.connect(this.ctx.destination);

    frequencies.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      // Use sine for standard, pure overtones; some triangle for warmth
      osc.type = idx === 0 ? 'sine' : idx < 3 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      // Detune slightly for an organic, lush chorus texture
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);
      
      oscGain.gain.setValueAtTime(gains[idx], now);
      // Individual overtones decay faster at higher frequencies
      const decayTime = 4.0 / (idx * 0.4 + 1);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);
      
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      
      osc.start(now);
      osc.stop(now + decayTime + 0.1);
    });
  }

  /**
   * Play a wind-whoosh sound when the cups are thrown upward.
   */
  public playWhoosh() {
    if (!this.masterEnabled || !this.sfxEnabled) return;
    if (!this.initContext() || !this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.8;

    // We synthesize wind whoosh using white noise and a moving Bandpass Filter
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Create a Bandpass Filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3, now); // Slightly resonant
    // Sweeping the frequency up and down to match the throw curve
    filter.frequency.setValueAtTime(120, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + 0.35);
    filter.frequency.exponentialRampToValueAtTime(150, now + duration);

    // Create a Volume envelope
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.22, now + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration + 0.1);
  }

  /**
   * Play a highly realistic "clack-clack" double wood knock when landing.
   */
  public playWoodKnock() {
    if (!this.masterEnabled || !this.sfxEnabled) return;
    if (!this.initContext() || !this.ctx) return;

    const now = this.ctx.currentTime;
    
    // 1st primary impact
    this.triggerSingleKnock(now, 1.0, 310);
    // 2nd rebound bounce impact (slightly softer, slightly detuned)
    this.triggerSingleKnock(now + 0.12, 0.65, 270);
  }

  private triggerSingleKnock(startTime: number, volume: number, freq: number) {
    if (!this.ctx) return;

    // Use a combination of a fast pitch-swept triangle wave + slightly filtered click noise
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    // Pitch drop swept rapidly down to simulate hollow wood resonance
    osc.frequency.exponentialRampToValueAtTime(90, startTime + 0.08);

    // Volume envelope (extremely short, fast attack, short decay)
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.35 * volume, startTime + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.12);

    // Filter to clip harsh high frequencies
    const lpFilter = this.ctx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.setValueAtTime(800, startTime);

    osc.connect(lpFilter);
    lpFilter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    // Also synthesize a tiny click noise for the "snap" impact
    const clickBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.02, this.ctx.sampleRate);
    const clickData = clickBuffer.getChannelData(0);
    for (let i = 0; i < clickData.length; i++) {
      clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / 80); // Quick decay noise
    }
    const clickSource = this.ctx.createBufferSource();
    clickSource.buffer = clickBuffer;

    const clickGain = this.ctx.createGain();
    clickGain.gain.setValueAtTime(0.25 * volume, startTime);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.015);

    clickSource.connect(clickGain);
    clickGain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.15);
    
    clickSource.start(startTime);
    clickSource.stop(startTime + 0.05);
  }

  /**
   * Start a focusing background hum (when holding both fingers).
   */
  public startGripHum() {
    if (!this.masterEnabled || !this.sfxEnabled) return;
    if (!this.initContext() || !this.ctx) return;

    if (this.gripOscillator) return; // Already running

    const now = this.ctx.currentTime;
    
    this.gripOscillator = this.ctx.createOscillator();
    this.gripGain = this.ctx.createGain();

    this.gripOscillator.type = 'triangle';
    // Very low relaxing 85Hz hum
    this.gripOscillator.frequency.setValueAtTime(85, now);
    
    // Slow fade-in of the holding state hum
    this.gripGain.gain.setValueAtTime(0, now);
    this.gripGain.gain.linearRampToValueAtTime(0.18, now + 0.3);

    // Low-pass filter to keep it extremely dark, ambient, and non-distracting
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, now);

    this.gripOscillator.connect(filter);
    filter.connect(this.gripGain);
    this.gripGain.connect(this.ctx.destination);

    this.gripOscillator.start(now);
  }

  /**
   * Stop the focusing background hum when fingers release.
   */
  public stopGripHum() {
    if (!this.ctx || !this.gripOscillator || !this.gripGain) return;

    const now = this.ctx.currentTime;
    try {
      // Slow fade-out to prevent audible audio pops
      this.gripGain.gain.cancelScheduledValues(now);
      this.gripGain.gain.setValueAtTime(this.gripGain.gain.value, now);
      this.gripGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      
      const oscToStop = this.gripOscillator;
      setTimeout(() => {
        try {
          oscToStop.stop();
        } catch(e){}
      }, 200);
    } catch (e) {
      console.warn('Failed to stop grip hum cleanly', e);
    }

    this.gripOscillator = null;
    this.gripGain = null;
  }
}

export const audioSynth = new AudioSynthesizer();
