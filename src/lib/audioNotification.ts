/**
 * Web Audio API Notification System for Haiya Soy Milk Order Tracker
 * Synthesizes a subtle, pleasant chime for order status changes (especially 'ready').
 * No external audio files or dependencies required.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {
      // AudioContext will resume on next user gesture
    });
  }
  return audioCtx;
}

/**
 * Check if sound notifications are enabled in user settings
 */
export function isSoundNotificationEnabled(): boolean {
  try {
    const val = localStorage.getItem('fs_sound_notifications');
    return val === null ? true : val === 'true'; // Enabled by default
  } catch {
    return true;
  }
}

/**
 * Toggle sound notification setting
 */
export function setSoundNotificationEnabled(enabled: boolean): void {
  try {
    localStorage.setItem('fs_sound_notifications', String(enabled));
  } catch {
    // ignore
  }
}

/**
 * Synthesizes a warm, pleasant 3-tone ascending bell chime
 * (C5: 523.25Hz -> E5: 659.25Hz -> G5: 783.99Hz with a gentle harmonic overlay)
 * Total duration: ~0.65 seconds
 */
export function playOrderReadyChime(): boolean {
  if (!isSoundNotificationEnabled()) return false;

  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    // Harmonious melody notes: C5 (523.25), E5 (659.25), G5 (783.99), high sparkle C6 (1046.50)
    const tones = [
      { freq: 523.25, timeOffset: 0.00, duration: 0.25, gain: 0.12 },
      { freq: 659.25, timeOffset: 0.12, duration: 0.30, gain: 0.14 },
      { freq: 783.99, timeOffset: 0.25, duration: 0.45, gain: 0.16 },
      { freq: 1046.50, timeOffset: 0.38, duration: 0.50, gain: 0.10 },
    ];

    const now = ctx.currentTime;

    tones.forEach(({ freq, timeOffset, duration, gain }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Warm sine tone with gentle harmonic texture
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + timeOffset);

      // Smooth attack and soft natural exponential decay
      gainNode.gain.setValueAtTime(0.0001, now + timeOffset);
      gainNode.gain.exponentialRampToValueAtTime(gain, now + timeOffset + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + timeOffset + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + timeOffset);
      osc.stop(now + timeOffset + duration);
    });

    return true;
  } catch (err) {
    console.warn('Audio notification could not play:', err);
    return false;
  }
}

/**
 * Synthesizes a subtle, soft confirmation blip for preparation milestone
 */
export function playOrderProgressChime(): boolean {
  if (!isSoundNotificationEnabled()) return false;

  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now); // A4
    osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.12); // C#5

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
    return true;
  } catch {
    return false;
  }
}
