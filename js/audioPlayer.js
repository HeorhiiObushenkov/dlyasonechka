/**
 * Audio Snippet Player & Sound FX Synthesizer (Vanilla Web Audio)
 */
export class AudioSnippetPlayer {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';

    this.currentTrackUrl = null;
    this.randomStartTime = 15;
    this.duration = 0;
    this.currentSnippetDuration = 1;
    this.isPlaying = false;
    this.isFullPlay = false;

    this.rafId = null;
    this.callbacks = {
      onPlay: () => {},
      onPause: () => {},
      onStop: () => {},
      onProgress: (currentTime, maxTime) => {},
      onError: (err) => {}
    };

    this.audioCtx = null;
    this.isMuted = false;

    this.initAudioEvents();
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
    this.audio.muted = this.isMuted;
    return this.isMuted;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  initAudioEvents() {
    this.audio.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
      this.callbacks.onError(e);
    });

    this.audio.addEventListener('ended', () => {
      this.stop();
    });
  }

  async loadTrack(audioPath) {
    this.stop();
    this.currentTrackUrl = audioPath;
    this.audio.src = encodeURI(audioPath);
    this.audio.muted = this.isMuted;
    this.isFullPlay = false;

    return new Promise((resolve) => {
      let resolved = false;
      const finish = () => {
        if (resolved) return;
        resolved = true;
        this.duration = (this.audio.duration && isFinite(this.audio.duration)) ? this.audio.duration : 90;
        const safeMin = Math.min(10, Math.max(0, this.duration * 0.12));
        const safeMax = Math.max(safeMin + 5, this.duration - 12);
        this.randomStartTime = Math.floor(safeMin + Math.random() * (safeMax - safeMin));
        this.audio.removeEventListener('loadedmetadata', finish);
        this.audio.removeEventListener('error', finish);
        resolve({ duration: this.duration, startTime: this.randomStartTime });
      };

      if (this.audio.readyState >= 1) {
        finish();
      } else {
        this.audio.addEventListener('loadedmetadata', finish);
        this.audio.addEventListener('error', finish);
      }
    });
  }

  setSnippetDuration(seconds) {
    this.currentSnippetDuration = seconds;
  }

  playSnippet(seconds) {
    if (seconds) {
      this.currentSnippetDuration = seconds;
    }
    this.isFullPlay = false;

    if (!this.audio.src) return;

    this.getAudioContext();
    this.audio.currentTime = this.randomStartTime;
    this.audio.muted = this.isMuted;
    this.audio.volume = 1;

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlaying = true;
        this.callbacks.onPlay();
        this.startSnippetTracker();
      }).catch(err => {
        console.warn('Playback error:', err);
        this.callbacks.onError(err);
      });
    }
  }

  playFull() {
    this.isFullPlay = true;
    this.stopTracker();
    this.getAudioContext();
    if (this.audio.currentTime >= (this.audio.duration || 90) - 1) {
      this.audio.currentTime = 0;
    }
    this.audio.muted = this.isMuted;
    this.audio.volume = 1;

    this.audio.play().then(() => {
      this.isPlaying = true;
      this.callbacks.onPlay();
      this.startFullTracker();
    }).catch(err => {
      console.warn('Playback error:', err);
    });
  }

  startSnippetTracker() {
    this.stopTracker();
    const maxSnippetTime = this.randomStartTime + this.currentSnippetDuration;

    const check = () => {
      if (!this.isPlaying || this.isFullPlay) return;

      const current = this.audio.currentTime;
      const elapsed = Math.max(0, current - this.randomStartTime);

      this.callbacks.onProgress(
        Math.min(elapsed, this.currentSnippetDuration),
        this.currentSnippetDuration
      );

      if (current >= maxSnippetTime) {
        this.stop();
        return;
      }

      this.rafId = requestAnimationFrame(check);
    };

    this.rafId = requestAnimationFrame(check);
  }

  startFullTracker() {
    this.stopTracker();
    const check = () => {
      if (!this.isPlaying || !this.isFullPlay) return;
      this.callbacks.onProgress(this.audio.currentTime, this.audio.duration || 90);
      this.rafId = requestAnimationFrame(check);
    };
    this.rafId = requestAnimationFrame(check);
  }

  stopTracker() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.stopTracker();
    this.callbacks.onPause();
  }

  stop() {
    this.audio.pause();
    this.isPlaying = false;
    this.isFullPlay = false;
    this.stopTracker();
    this.callbacks.onStop();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.playSnippet(this.currentSnippetDuration);
    }
  }

  playSfx(type) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      if (type === 'correct') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.075);

          gain.gain.setValueAtTime(0.18, now + idx * 0.075);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.075 + 0.28);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.075);
          osc.stop(now + idx * 0.075 + 0.3);
        });
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(210, now);
        osc.frequency.exponentialRampToValueAtTime(135, now + 0.24);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'unlock') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      console.warn('SFX error:', e);
    }
  }
}
