/**
 * Anime Guesser - Main Application Controller
 */

import { AnimeAutocomplete } from './autocomplete.js';
import { AudioSnippetPlayer } from './audioPlayer.js';
import { AnimeGame, MODES } from './game.js';
import { getIconSvg } from './icons.js';

const MODE_CONFIG = {
  [MODES.AUDIO]: { name: 'Гей секундочку', icon: 'music', colorClass: 'icon-audio' },
  [MODES.BLUR]: { name: 'Прийом у окуліста', icon: 'eye', colorClass: 'icon-blur' },
  [MODES.LYRICS]: { name: 'Ду ю спів японіш', icon: 'quote', colorClass: 'icon-lyrics' },
  [MODES.EMOJI]: { name: 'Емодзі-ребус', icon: 'sparkles', colorClass: 'icon-emoji' },
  [MODES.MIXED]: { name: 'Все і одразу', icon: 'zap', colorClass: 'icon-mixed' }
};

class App {
  constructor() {
    this.animeList = [];
    this.lyricsList = [];
    this.emojiList = [];
    this.game = null;
    this.player = new AudioSnippetPlayer();
    this.autocomplete = null;

    this.selectedRoundsCount = 10;
    this.bestStreak = 0;

    // DOM Elements - Screens
    this.screens = {
      welcome: document.getElementById('screen-welcome'),
      game: document.getElementById('screen-game'),
      result: document.getElementById('screen-result'),
      final: document.getElementById('screen-final')
    };

    // HUD Elements
    this.hud = {
      round: document.getElementById('hud-round'),
      modeBadge: document.getElementById('hud-mode-badge'),
      streak: document.getElementById('hud-streak'),
      score: document.getElementById('hud-score'),
      hearts: [
        document.getElementById('heart-1'),
        document.getElementById('heart-2'),
        document.getElementById('heart-3')
      ]
    };

    // Stage Elements
    this.stageText = document.getElementById('stage-text');
    this.stageDots = document.getElementById('stage-dots');
    this.stagePoints = document.getElementById('stage-points');

    // Mode Views
    this.views = {
      audio: document.getElementById('game-audio-view'),
      blur: document.getElementById('game-blur-view'),
      lyrics: document.getElementById('game-lyrics-view'),
      emoji: document.getElementById('game-emoji-view')
    };

    // Audio View Controls
    this.vinylDisk = document.getElementById('vinyl-disk');
    this.soundwave = document.getElementById('soundwave');
    this.audioProgressBar = document.getElementById('audio-progress-bar');
    this.audioTimeCurrent = document.getElementById('audio-time-current');
    this.audioTimeMax = document.getElementById('audio-time-max');
    this.btnAudioPlay = document.getElementById('btn-audio-play');
    this.playBtnIcon = document.getElementById('play-btn-icon');
    this.playBtnText = document.getElementById('play-btn-text');

    // Blur View Controls
    this.blurImg = document.getElementById('blur-img');
    this.blurFallback = document.getElementById('blur-fallback');

    // Lyrics View Controls
    this.lyricCards = [
      document.getElementById('lyric-card-1'),
      document.getElementById('lyric-card-2'),
      document.getElementById('lyric-card-3')
    ];
    this.lyricBadges = [
      document.getElementById('lyric-badge-1'),
      document.getElementById('lyric-badge-2'),
      document.getElementById('lyric-badge-3')
    ];
    this.lyricTexts = [
      document.getElementById('lyric-text-1'),
      document.getElementById('lyric-text-2'),
      document.getElementById('lyric-text-3')
    ];

    // Emoji View Controls
    this.emojiCards = [
      document.getElementById('emoji-card-1'),
      document.getElementById('emoji-card-2'),
      document.getElementById('emoji-card-3')
    ];
    this.emojiBadges = [
      document.getElementById('emoji-badge-1'),
      document.getElementById('emoji-badge-2'),
      document.getElementById('emoji-badge-3')
    ];
    this.emojiClues = [
      document.getElementById('emoji-clues-1'),
      document.getElementById('emoji-clues-2'),
      document.getElementById('emoji-clues-3')
    ];

    // Input & Guess
    this.wrongGuessesRow = document.getElementById('wrong-guesses-row');
    this.animeInput = document.getElementById('anime-input');
    this.btnClearInput = document.getElementById('btn-clear-input');
    this.btnSubmit = document.getElementById('btn-submit-guess');
    this.autocompleteDropdown = document.getElementById('autocomplete-dropdown');
    this.btnAdvanceHint = document.getElementById('btn-advance-hint');
    this.btnAdvanceText = document.getElementById('btn-advance-text');
    this.btnGiveUp = document.getElementById('btn-give-up');

    // Result Screen Elements
    this.resultBadge = document.getElementById('result-status-badge');
    this.resultIcon = document.getElementById('result-status-icon');
    this.resultStatusText = document.getElementById('result-status-text');
    this.resultCoverImg = document.getElementById('result-cover-img');
    this.resultTitleUa = document.getElementById('result-title-ua');
    this.resultTitleEn = document.getElementById('result-title-en');
    this.resultSongBox = document.getElementById('result-song-box');
    this.resultSongName = document.getElementById('result-song-name');
    this.btnListenFull = document.getElementById('btn-listen-full');
    this.fullSongIcon = document.getElementById('full-song-icon');
    this.fullSongText = document.getElementById('full-song-text');
    this.btnNextRound = document.getElementById('btn-next-round');
    this.nextRoundText = document.getElementById('next-round-text');
    this.btnFinishInfinite = document.getElementById('btn-finish-infinite');

    // Final Screen Elements
    this.finalBadge = document.getElementById('final-badge');
    this.finalTitle = document.getElementById('final-title');
    this.finalSubtitle = document.getElementById('final-subtitle');
    this.finalScore = document.getElementById('final-score');
    this.finalGuessed = document.getElementById('final-guessed');
    this.finalMaxStreak = document.getElementById('final-max-streak');
    this.historyScroll = document.getElementById('history-scroll');
    this.btnPlayAgain = document.getElementById('btn-play-again');
    this.btnBackMenu = document.getElementById('btn-back-menu');

    // Header Actions
    this.btnThemeToggle = document.getElementById('btn-theme-toggle');
    this.themeIconSlot = document.getElementById('theme-icon-slot');
    this.themeIcon = document.getElementById('theme-icon');
    this.btnSoundToggle = document.getElementById('btn-sound-toggle');
    this.soundIconSlot = document.getElementById('sound-icon-slot');
    this.soundIcon = document.getElementById('sound-icon');
    this.btnBrandHome = document.getElementById('btn-brand-home');
    this.btnHeaderHome = document.getElementById('btn-header-home');

    // Toast
    this.toast = document.getElementById('toast-msg');
    this.toastText = document.getElementById('toast-text');
    this.toastTimeout = null;

    this.init();
  }

  async init() {
    this.setupTheme();
    this.setupAudioCallbacks();
    this.bindEvents();
    await this.loadData();
  }

  setupTheme() {
    const savedTheme = localStorage.getItem('anime_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (this.themeIconSlot) {
      this.themeIconSlot.innerHTML = getIconSvg(savedTheme === 'dark' ? 'sun' : 'moon', { size: 22 });
    } else if (this.themeIcon) {
      this.themeIcon.textContent = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';
    }
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('anime_theme', next);
    if (this.themeIconSlot) {
      this.themeIconSlot.innerHTML = getIconSvg(next === 'dark' ? 'sun' : 'moon', { size: 22 });
    } else if (this.themeIcon) {
      this.themeIcon.textContent = next === 'dark' ? 'light_mode' : 'dark_mode';
    }
  }

  toggleSound() {
    const muted = this.player.setMuted(!this.player.isMuted);
    if (this.soundIconSlot) {
      this.soundIconSlot.innerHTML = getIconSvg(muted ? 'volume-x' : 'volume-2', { size: 22 });
    } else if (this.soundIcon) {
      this.soundIcon.textContent = muted ? 'volume_off' : 'volume_up';
    }
    this.showToast(muted ? 'Звук вимкнено' : 'Звук увімкнено');
  }

  // Helper to resolve cover path smoothly whether it's in 'обкладинка/' or root
  resolveCoverUrl(coverFile) {
    if (!coverFile) return '';
    if (coverFile.startsWith('http') || coverFile.includes('/')) {
      return encodeURI(coverFile);
    }
    return encodeURI(`обкладинка/${coverFile}`);
  }

  setImgWithFallback(imgEl, rawCoverPath, onFailCallback = null) {
    if (!rawCoverPath) {
      if (onFailCallback) onFailCallback();
      return;
    }
    const primaryUrl = this.resolveCoverUrl(rawCoverPath);
    const fallbackRootUrl = encodeURI(rawCoverPath);

    imgEl.onerror = () => {
      if (imgEl.src.indexOf(fallbackRootUrl) === -1) {
        imgEl.src = fallbackRootUrl;
      } else {
        imgEl.onerror = null;
        if (onFailCallback) onFailCallback();
      }
    };
    imgEl.src = primaryUrl;
  }

  setupAudioCallbacks() {
    this.player.callbacks.onPlay = () => {
      if (this.player.isFullPlay) {
        this.fullSongIcon.innerHTML = getIconSvg('pause', { size: 20 });
        this.fullSongText.textContent = 'Пауза опенінгу';
      } else {
        this.vinylDisk.classList.add('spinning');
        this.soundwave.classList.add('active');
        this.playBtnIcon.innerHTML = getIconSvg('pause', { size: 20 });
        this.playBtnText.textContent = 'Зупинити';
      }
    };

    this.player.callbacks.onPause = () => {
      this.vinylDisk.classList.remove('spinning');
      this.soundwave.classList.remove('active');
      this.playBtnIcon.innerHTML = getIconSvg('play', { size: 20, fill: 'currentColor' });
      this.playBtnText.textContent = 'Слухати уривок';
      this.fullSongIcon.innerHTML = getIconSvg('play-circle', { size: 20 });
      this.fullSongText.textContent = 'Послухати повний опенінг';
    };

    this.player.callbacks.onStop = () => {
      this.vinylDisk.classList.remove('spinning');
      this.soundwave.classList.remove('active');
      this.playBtnIcon.innerHTML = getIconSvg('play', { size: 20, fill: 'currentColor' });
      this.playBtnText.textContent = 'Слухати уривок';
      this.audioProgressBar.style.width = '0%';
      this.audioTimeCurrent.textContent = '0.0с';

      this.fullSongIcon.innerHTML = getIconSvg('play-circle', { size: 20 });
      this.fullSongText.textContent = 'Послухати повний опенінг';
    };

    this.player.callbacks.onProgress = (currentTime, maxTime) => {
      if (!this.player.isFullPlay) {
        const pct = Math.min(100, (currentTime / (maxTime || 1)) * 100);
        this.audioProgressBar.style.width = `${pct}%`;
        this.audioTimeCurrent.textContent = `${currentTime.toFixed(1)}с`;
        this.audioTimeMax.textContent = `${maxTime.toFixed(1)}с`;
      }
    };

    this.player.callbacks.onError = () => {
      this.showToast('Не вдалося завантажити аудіо файл');
    };
  }

  async loadData() {
    try {
      const [manifestRes, lyricsRes, emojiRes] = await Promise.all([
        fetch('manifest.json'),
        fetch('lyrics_ua.json'),
        fetch('emoji_ua.json')
      ]);

      const manifestData = await manifestRes.json();
      this.lyricsList = await lyricsRes.json();
      this.emojiList = await emojiRes.json();

      // Extract English titles and clean Ukrainian titles without "(2 сезони)"
      this.animeList = manifestData.map(item => {
        const enTitles = new Set();
        (item.covers || []).forEach(cover => {
          const cleanName = cover.replace(/^\d+(_S\d+)?\.\s*/, '').replace(/\.(jpg|png|jpeg|webp)$/i, '');
          const parts = cleanName.split(' - ');
          if (parts.length > 1) {
            const en = parts[parts.length - 1]
              .replace(/\s*\([Ss]\d+\)$/, '')
              .replace(/_/g, ':')
              .trim();
            if (en) enTitles.add(en);
          }
        });

        const cleanUa = item.ua.replace(/\s*\([^)]*\)\s*$/g, '').trim();

        return {
          ...item,
          cleanUa,
          enTitles: Array.from(enTitles)
        };
      });

      this.game = new AnimeGame(this.animeList, this.lyricsList, this.emojiList);

      this.autocomplete = new AnimeAutocomplete(
        this.animeInput,
        this.autocompleteDropdown,
        this.animeList,
        (selectedAnime) => {
          this.submitGuess(selectedAnime);
        }
      );
    } catch (e) {
      console.error('Error loading anime data:', e);
      this.showToast('Помилка завантаження бази аніме');
    }
  }

  bindEvents() {
    // Mode selection cards
    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.dataset.mode;
        this.startSession(mode);
      });
    });

    // Round count selector
    document.querySelectorAll('.seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const count = btn.dataset.rounds;
        this.selectedRoundsCount = count === 'Infinity' ? Infinity : parseInt(count, 10);
      });
    });

    // Header buttons
    if (this.btnThemeToggle) this.btnThemeToggle.addEventListener('click', () => this.toggleTheme());
    if (this.btnSoundToggle) this.btnSoundToggle.addEventListener('click', () => this.toggleSound());
    if (this.btnBrandHome) this.btnBrandHome.addEventListener('click', () => this.showScreen('welcome'));
    if (this.btnHeaderHome) this.btnHeaderHome.addEventListener('click', () => this.showScreen('welcome'));

    // Audio Play button
    this.btnAudioPlay.addEventListener('click', () => {
      this.player.togglePlay();
    });

    // Clicking locked lyric cards directly unlocks next hint
    this.lyricCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (this.game && this.game.activeRoundMode === MODES.LYRICS) {
          if (idx > this.game.stageIndex && !this.game.isRoundOver) {
            if (this.game.advanceStage()) {
              this.player.playSfx('unlock');
              this.updateStageUI();
            }
          }
        }
      });
    });

    // Clicking locked emoji cards directly unlocks next hint
    this.emojiCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (this.game && this.game.activeRoundMode === MODES.EMOJI) {
          if (idx > this.game.stageIndex && !this.game.isRoundOver) {
            if (this.game.advanceStage()) {
              this.player.playSfx('unlock');
              this.updateStageUI();
            }
          }
        }
      });
    });

    // Input clear button visibility
    this.animeInput.addEventListener('input', () => {
      this.btnClearInput.classList.toggle('hidden', this.animeInput.value.length === 0);
    });

    this.btnClearInput.addEventListener('click', () => {
      this.autocomplete.clear();
      this.btnClearInput.classList.add('hidden');
      this.animeInput.focus();
    });

    // Submit guess button
    this.btnSubmit.addEventListener('click', () => {
      const val = this.animeInput.value.trim();
      if (!val) return;
      // If dropdown has top match, use it or pass raw string
      const bestMatch = this.autocomplete.getBestMatchForText(val);
      this.submitGuess(bestMatch || val);
    });

    // Advance hint button
    this.btnAdvanceHint.addEventListener('click', () => {
      if (this.game && this.game.advanceStage()) {
        this.player.playSfx('unlock');
        this.updateStageUI();
      }
    });

    // Give up button
    this.btnGiveUp.addEventListener('click', () => {
      if (!this.game) return;
      const res = this.game.giveUp();
      if (res) {
        this.player.playSfx('wrong');
        this.onRoundFinished(false, 0);
      }
    });

    // Listen Full song button on Result screen
    this.btnListenFull.addEventListener('click', () => {
      if (this.player.isPlaying && this.player.isFullPlay) {
        this.player.pause();
      } else {
        this.player.playFull();
      }
    });

    // Next round button
    this.btnNextRound.addEventListener('click', () => {
      this.player.stop();
      if (this.game.isSessionFinished()) {
        this.showFinalScreen();
      } else {
        this.startNextRound();
      }
    });

    // Finish infinite session early
    this.btnFinishInfinite.addEventListener('click', () => {
      this.player.stop();
      this.showFinalScreen();
    });

    // Play again & Back to menu
    this.btnPlayAgain.addEventListener('click', () => {
      this.startSession(this.game.currentMode);
    });

    this.btnBackMenu.addEventListener('click', () => {
      this.showScreen('welcome');
    });
  }

  showScreen(name) {
    this.player.stop();
    Object.keys(this.screens).forEach(key => {
      this.screens[key].classList.toggle('active', key === name);
    });
    if (this.btnHeaderHome) {
      this.btnHeaderHome.classList.toggle('hidden', name === 'welcome');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startSession(mode) {
    if (!this.game) return;
    this.game.setSessionConfig(mode, this.selectedRoundsCount);
    this.bestStreak = 0;
    this.startNextRound();
  }

  async startNextRound() {
    const roundData = this.game.startNewRound();
    this.autocomplete.clear();
    this.btnClearInput.classList.add('hidden');
    this.wrongGuessesRow.innerHTML = '';
    this.wrongGuessesRow.classList.add('hidden');

    this.showScreen('game');

    // Update HUD
    const totalRoundsStr = this.game.roundsTotal === Infinity ? '∞' : this.game.roundsTotal;
    this.hud.round.textContent = `Раунд ${roundData.roundIndex}/${totalRoundsStr}`;
    const modeConf = MODE_CONFIG[roundData.mode] || { name: 'Гра', icon: 'zap', colorClass: 'icon-mixed' };
    this.hud.modeBadge.innerHTML = `${getIconSvg(modeConf.icon, { size: 16, className: modeConf.colorClass })}<span>${modeConf.name}</span>`;
    this.hud.streak.innerHTML = `${getIconSvg('flame', { size: 18, className: 'icon-flame' })}<span>${this.game.streak}</span>`;
    this.hud.score.innerHTML = `${getIconSvg('star', { size: 18, className: 'icon-star', fill: '#ffd700' })}<span>${this.game.totalScore} б.</span>`;
    this.updateHearts(roundData.lives);

    // Switch View according to round mode
    this.views.audio.classList.toggle('hidden', roundData.mode !== MODES.AUDIO);
    this.views.blur.classList.toggle('hidden', roundData.mode !== MODES.BLUR);
    this.views.lyrics.classList.toggle('hidden', roundData.mode !== MODES.LYRICS);
    this.views.emoji.classList.toggle('hidden', roundData.mode !== MODES.EMOJI);

    if (roundData.mode === MODES.AUDIO) {
      if (roundData.opening && roundData.opening.file) {
        await this.player.loadTrack(roundData.opening.file);
      }
    } else if (roundData.mode === MODES.BLUR) {
      this.blurImg.classList.remove('hidden');
      this.blurFallback.classList.add('hidden');
      this.setImgWithFallback(this.blurImg, roundData.cover, () => {
        this.blurImg.classList.add('hidden');
        this.blurFallback.classList.remove('hidden');
      });
    } else if (roundData.mode === MODES.LYRICS) {
      this.lyricTexts[0].textContent = roundData.lyrics[0] || '';
      this.lyricTexts[1].textContent = roundData.lyrics[1] || '';
      this.lyricTexts[2].textContent = roundData.lyrics[2] || '';
    } else if (roundData.mode === MODES.EMOJI) {
      const sets = roundData.emoji || ['❓❓❓', '❓❓❓', '❓❓❓'];
      this.emojiClues[0].textContent = sets[0] || '❓❓❓';
      this.emojiClues[1].textContent = sets[1] || '❓❓❓';
      this.emojiClues[2].textContent = sets[2] || '❓❓❓';
    }

    this.updateStageUI();
  }

  updateHearts(count) {
    this.hud.hearts.forEach((heart, idx) => {
      if (idx < count) {
        heart.className = 'heart beating';
        heart.innerHTML = getIconSvg('heart', { size: 20, fill: '#ff3366', stroke: '#ff3366' });
      } else {
        heart.className = 'heart lost';
        heart.innerHTML = getIconSvg('heart-off', { size: 20, stroke: 'currentColor' });
      }
    });
  }

  renderStageDots(currentIdx, totalStages) {
    this.stageDots.innerHTML = '';
    for (let i = 0; i < totalStages; i++) {
      const dot = document.createElement('span');
      dot.className = 'stage-dot';
      if (i === currentIdx) dot.classList.add('active');
      else if (i < currentIdx) dot.classList.add('passed');
      this.stageDots.appendChild(dot);
    }
  }

  formatPointsWord(pts) {
    if (pts === 1) return '+1 бал';
    if (pts >= 2 && pts <= 4) return `+${pts} бали`;
    return `+${pts} балів`;
  }

  updateStageUI() {
    const stage = this.game.getCurrentStageConfig();
    const mode = this.game.activeRoundMode;

    this.renderStageDots(stage.stageIndex, stage.totalStages);
    this.stagePoints.textContent = this.formatPointsWord(stage.pointsPossible);

    if (mode === MODES.AUDIO) {
      this.stageText.textContent = `Підказка ${stage.stageIndex + 1}/${stage.totalStages}: Уривок ${stage.value} сек`;
      this.player.setSnippetDuration(stage.value);
      this.audioTimeMax.textContent = `${stage.value}.0с`;

      if (stage.canAdvance) {
        this.btnAdvanceHint.disabled = false;
        this.btnAdvanceText.textContent = `Збільшити до ${stage.nextValue} сек (-1 бал)`;
      } else {
        this.btnAdvanceHint.disabled = true;
        this.btnAdvanceText.textContent = 'Максимальний уривок (6 сек)';
      }
    } else if (mode === MODES.BLUR) {
      this.stageText.textContent = `Підказка ${stage.stageIndex + 1}/${stage.totalStages}: Чіткість постера`;
      this.blurImg.style.filter = `blur(${stage.value}px)`;

      if (stage.canAdvance) {
        this.btnAdvanceHint.disabled = false;
        this.btnAdvanceText.textContent = `Зменшити розмиття (-1 бал)`;
      } else {
        this.btnAdvanceHint.disabled = true;
        this.btnAdvanceText.textContent = 'Максимальна чіткість';
      }
    } else if (mode === MODES.LYRICS) {
      this.stageText.textContent = `Підказка ${stage.stageIndex + 1}/${stage.totalStages}: Відкрито ${stage.value} з 3 рядків`;

      this.lyricCards.forEach((card, idx) => {
        if (idx <= stage.stageIndex) {
          card.classList.remove('locked');
          card.classList.add('active');
          this.lyricBadges[idx].innerHTML = `
            ${getIconSvg('quote', { size: 16, className: 'icon-lyrics' })}
            <span>Рядок ${idx + 1} • Відкрито</span>
          `;
        } else {
          card.classList.add('locked');
          card.classList.remove('active');
          this.lyricBadges[idx].innerHTML = `
            ${getIconSvg('lock', { size: 16 })}
            <span>Рядок ${idx + 1} • Натисни, щоб відкрити (-2 бали)</span>
          `;
        }
      });

      if (stage.canAdvance) {
        this.btnAdvanceHint.disabled = false;
        this.btnAdvanceText.textContent = `Відкрити рядок ${stage.stageIndex + 2} (-2 бали)`;
      } else {
        this.btnAdvanceHint.disabled = true;
        this.btnAdvanceText.textContent = 'Усі рядки відкрито';
      }
    } else if (mode === MODES.EMOJI) {
      this.stageText.textContent = `Підказка ${stage.stageIndex + 1}/${stage.totalStages}: Відкрито ${stage.stageIndex + 1} з 3 сетів`;

      this.emojiCards.forEach((card, idx) => {
        if (idx <= stage.stageIndex) {
          card.classList.remove('locked');
          card.classList.add('active');
          this.emojiBadges[idx].innerHTML = `
            ${getIconSvg('sparkles', { size: 16, className: 'icon-emoji' })}
            <span>Сет ${idx + 1} • Відкрито</span>
          `;
        } else {
          card.classList.add('locked');
          card.classList.remove('active');
          this.emojiBadges[idx].innerHTML = `
            ${getIconSvg('lock', { size: 16 })}
            <span>Сет ${idx + 1} • Натисни, щоб відкрити (-2 бали)</span>
          `;
        }
      });

      if (stage.canAdvance) {
        this.btnAdvanceHint.disabled = false;
        this.btnAdvanceText.textContent = `Відкрити сет ${stage.stageIndex + 2} (-2 бали)`;
      } else {
        this.btnAdvanceHint.disabled = true;
        this.btnAdvanceText.textContent = 'Усі набори емодзі відкрито';
      }
    }
  }

  addWrongGuessChip(label) {
    this.wrongGuessesRow.classList.remove('hidden');
    const chip = document.createElement('div');
    chip.className = 'wrong-chip';
    chip.innerHTML = `${getIconSvg('x', { size: 14 })}<span>${label}</span>`;
    this.wrongGuessesRow.appendChild(chip);
  }

  submitGuess(animeOrTitle) {
    if (!animeOrTitle || !this.game) return;

    const result = this.game.makeGuess(animeOrTitle);
    if (!result) return;

    if (result.duplicate) {
      this.showToast('Цей варіант уже перевірявся в цьому раунді');
      this.autocomplete.clear();
      this.btnClearInput.classList.add('hidden');
      return;
    }

    this.bestStreak = Math.max(this.bestStreak, this.game.streak);
    this.hud.streak.innerHTML = `${getIconSvg('flame', { size: 18, className: 'icon-flame' })}<span>${this.game.streak}</span>`;
    this.hud.score.innerHTML = `${getIconSvg('star', { size: 18, className: 'icon-star', fill: '#ffd700' })}<span>${this.game.totalScore} б.</span>`;
    this.updateHearts(result.lives);

    this.autocomplete.clear();
    this.btnClearInput.classList.add('hidden');

    if (result.success) {
      this.player.playSfx('correct');
      this.triggerConfetti();
      this.onRoundFinished(true, result.pointsEarned);
    } else {
      this.player.playSfx('wrong');
      this.addWrongGuessChip(result.guessedLabel);
      this.animeInput.classList.add('shake');
      setTimeout(() => this.animeInput.classList.remove('shake'), 400);

      if (result.isRoundOver) {
        this.onRoundFinished(false, 0);
      } else {
        this.showToast(`Не вгадано! Залишилося спроб: ${result.lives}`);
        this.updateStageUI();
      }
    }
  }

  onRoundFinished(isSuccess, pointsEarned) {
    this.player.stop();
    const anime = this.game.activeAnime;
    const cover = this.game.activeCover;
    const opening = this.game.activeOpening;

    // Preload full track so user can listen on result screen
    if (opening && opening.file) {
      this.player.loadTrack(opening.file);
      this.btnListenFull.classList.remove('hidden');
      this.resultSongBox.classList.remove('hidden');
      this.resultSongName.textContent = opening.song;
    } else {
      this.btnListenFull.classList.add('hidden');
      this.resultSongBox.classList.add('hidden');
    }

    if (isSuccess) {
      this.resultBadge.className = 'result-badge win';
      this.resultIcon.innerHTML = getIconSvg('check-circle-2', { size: 24, stroke: '#10b981' });
      this.resultStatusText.textContent = `Вгадано! ${this.formatPointsWord(pointsEarned)}`;
    } else {
      this.resultBadge.className = 'result-badge lose';
      this.resultIcon.innerHTML = getIconSvg('x-circle', { size: 24, stroke: '#f43f5e' });
      this.resultStatusText.textContent = 'Не вдалося вгадати • 0 балів';
    }

    this.setImgWithFallback(this.resultCoverImg, cover);
    this.resultTitleUa.textContent = anime.ua;
    this.resultTitleEn.textContent = (anime.enTitles && anime.enTitles[0]) ? anime.enTitles[0] : '';

    // Update Next button text if session is about to end
    if (this.game.isSessionFinished()) {
      this.nextRoundText.textContent = 'Фінальні підсумки';
      this.btnFinishInfinite.classList.add('hidden');
    } else {
      this.nextRoundText.textContent = 'Наступний раунд';
      this.btnFinishInfinite.classList.toggle('hidden', this.game.roundsTotal !== Infinity);
    }

    this.showScreen('result');
  }

  showFinalScreen() {
    this.showScreen('final');
    this.player.playSfx('correct');
    this.triggerConfetti();

    const rank = this.game.getRank();
    this.finalBadge.textContent = rank.badge;
    this.finalTitle.textContent = rank.title;
    this.finalSubtitle.textContent = rank.subtitle;

    this.finalScore.textContent = this.game.totalScore;
    const guessedCount = this.game.roundHistory.filter(r => r.guessed).length;
    this.finalGuessed.textContent = `${guessedCount}/${this.game.roundHistory.length}`;
    this.finalMaxStreak.textContent = this.bestStreak;

    // Render history scroll
    this.historyScroll.innerHTML = '';
    this.game.roundHistory.forEach(item => {
      const el = document.createElement('div');
      el.className = 'history-item';

      const img = document.createElement('img');
      img.className = 'history-thumb';
      img.alt = item.anime.ua;
      this.setImgWithFallback(img, item.cover);

      const title = document.createElement('div');
      title.className = 'history-item-title';
      title.title = item.anime.ua;
      title.textContent = item.anime.cleanUa || item.anime.ua;

      const pts = document.createElement('div');
      pts.className = 'history-pts ' + (item.guessed ? 'won' : 'lost');
      pts.textContent = item.guessed ? `+${item.points} б.` : '0 б.';

      el.appendChild(img);
      el.appendChild(title);
      el.appendChild(pts);
      this.historyScroll.appendChild(el);
    });
  }

  triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#ffafd0', '#dcb8ff', '#76d6e3', '#67df95', '#ffd700']
      });
    }
  }

  showToast(msg) {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastText.textContent = msg;
    this.toast.classList.add('show');
    this.toastTimeout = setTimeout(() => {
      this.toast.classList.remove('show');
    }, 2600);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
