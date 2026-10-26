/**
 * Game Engine & State Manager
 */

export const MODES = {
  AUDIO: 'audio',       // Гей секундочку
  BLUR: 'blur',         // Прийом у окуліста
  LYRICS: 'lyrics',     // Ду ю спів японіш
  EMOJI: 'emoji',       // Емодзі-ребус
  MIXED: 'mixed'        // Все і одразу
};

export class AnimeGame {
  constructor(animeList, lyricsList, emojiList = []) {
    this.animeList = animeList;
    this.lyricsMap = new Map();
    lyricsList.forEach(item => {
      this.lyricsMap.set(item.num, item.lines);
    });
    this.emojiMap = new Map();
    emojiList.forEach(item => {
      this.emojiMap.set(item.num, item.sets);
    });

    this.currentMode = MODES.AUDIO;
    this.roundsTotal = 10;
    this.currentRoundIndex = 0;
    this.totalScore = 0;
    this.maxPossibleScore = 0;
    this.streak = 0;
    this.roundHistory = [];

    // Non-repeating shuffle bag of anime indices
    this.remainingPool = [];

    // Current Round State
    this.activeAnime = null;
    this.activeOpening = null;
    this.activeCover = null;
    this.activeLyrics = [];
    this.activeEmoji = [];
    this.activeRoundMode = MODES.AUDIO;

    this.lives = 3;
    this.stageIndex = 0;
    this.isRoundOver = false;
    this.isGuessed = false;
    this.guessedIdsInRound = new Set();
  }

  setSessionConfig(mode, roundCount = 10) {
    this.currentMode = mode;
    this.roundsTotal = roundCount;
    this.currentRoundIndex = 0;
    this.totalScore = 0;
    this.maxPossibleScore = 0;
    this.streak = 0;
    this.roundHistory = [];
    this.refillPool();
  }

  refillPool() {
    this.remainingPool = [...this.animeList];
    // Fisher-Yates shuffle
    for (let i = this.remainingPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.remainingPool[i], this.remainingPool[j]] = [this.remainingPool[j], this.remainingPool[i]];
    }
  }

  startNewRound() {
    this.currentRoundIndex++;
    this.lives = 3;
    this.stageIndex = 0;
    this.isRoundOver = false;
    this.isGuessed = false;
    this.guessedIdsInRound.clear();

    // Determine mode for this round
    if (this.currentMode === MODES.MIXED) {
      const subModes = [MODES.AUDIO, MODES.BLUR, MODES.LYRICS, MODES.EMOJI];
      this.activeRoundMode = subModes[Math.floor(Math.random() * subModes.length)];
    } else {
      this.activeRoundMode = this.currentMode;
    }

    // Track max possible points for accurate final ranking
    const maxPtsForMode = this.activeRoundMode === MODES.LYRICS
      ? 6
      : (this.activeRoundMode === MODES.EMOJI
        ? 5
        : (this.activeRoundMode === MODES.BLUR ? 4 : 3));
    this.maxPossibleScore += maxPtsForMode;

    // Pick next anime without repeats
    if (this.remainingPool.length === 0) {
      this.refillPool();
    }
    this.activeAnime = this.remainingPool.pop();

    // Pick random opening if multiple
    const openings = this.activeAnime.openings || [];
    this.activeOpening = openings.length > 0
      ? openings[Math.floor(Math.random() * openings.length)]
      : null;

    // Pick random cover if multiple
    const covers = this.activeAnime.covers || [];
    this.activeCover = covers.length > 0
      ? covers[Math.floor(Math.random() * covers.length)]
      : null;

    // Pick lyrics
    this.activeLyrics = this.lyricsMap.get(this.activeAnime.num) || [
      'Загадковий перший рядок...',
      'Загадковий другий рядок...',
      'Загадковий третій рядок...'
    ];

    // Pick emoji clues
    this.activeEmoji = this.emojiMap.get(this.activeAnime.num) || [
      '❓✨🌟',
      '🎯🎭🎬',
      '💫🔮💖'
    ];

    return {
      roundIndex: this.currentRoundIndex,
      mode: this.activeRoundMode,
      anime: this.activeAnime,
      opening: this.activeOpening,
      cover: this.activeCover,
      lyrics: this.activeLyrics,
      emoji: this.activeEmoji,
      stage: this.getCurrentStageConfig(),
      lives: this.lives
    };
  }

  getCurrentStageConfig() {
    if (this.activeRoundMode === MODES.AUDIO) {
      const secondsProgression = [1, 3, 6];
      const pointsProgression = [3, 2, 1];
      const seconds = secondsProgression[this.stageIndex] ?? 6;
      const points = pointsProgression[this.stageIndex] ?? 1;
      const isMax = this.stageIndex >= secondsProgression.length - 1;
      return {
        stageIndex: this.stageIndex,
        totalStages: secondsProgression.length,
        value: seconds,
        unit: 'сек',
        pointsPossible: points,
        canAdvance: !isMax && !this.isRoundOver,
        nextValue: !isMax ? secondsProgression[this.stageIndex + 1] : null
      };
    } else if (this.activeRoundMode === MODES.BLUR) {
      // Balanced visual blur progression (45px -> 24px -> 10px -> 3px)
      const blurProgression = [45, 24, 10, 3];
      const pointsProgression = [4, 3, 2, 1];
      const blur = blurProgression[this.stageIndex] ?? 0;
      const points = pointsProgression[this.stageIndex] ?? 1;
      const isMax = this.stageIndex >= blurProgression.length - 1;
      return {
        stageIndex: this.stageIndex,
        totalStages: blurProgression.length,
        value: blur,
        unit: 'px',
        pointsPossible: points,
        canAdvance: !isMax && !this.isRoundOver,
        nextValue: !isMax ? blurProgression[this.stageIndex + 1] : null
      };
    } else if (this.activeRoundMode === MODES.LYRICS) {
      const linesProgression = [1, 2, 3];
      const pointsProgression = [6, 4, 2];
      const lines = linesProgression[this.stageIndex] ?? 3;
      const points = pointsProgression[this.stageIndex] ?? 2;
      const isMax = this.stageIndex >= linesProgression.length - 1;
      return {
        stageIndex: this.stageIndex,
        totalStages: linesProgression.length,
        value: lines,
        unit: 'рядок',
        pointsPossible: points,
        canAdvance: !isMax && !this.isRoundOver,
        nextValue: !isMax ? linesProgression[this.stageIndex + 1] : null
      };
    } else if (this.activeRoundMode === MODES.EMOJI) {
      const setsProgression = [1, 2, 3];
      const pointsProgression = [5, 3, 1];
      const setsCount = setsProgression[this.stageIndex] ?? 3;
      const points = pointsProgression[this.stageIndex] ?? 1;
      const isMax = this.stageIndex >= setsProgression.length - 1;
      return {
        stageIndex: this.stageIndex,
        totalStages: setsProgression.length,
        value: setsCount,
        unit: 'сет',
        pointsPossible: points,
        canAdvance: !isMax && !this.isRoundOver,
        nextValue: !isMax ? setsProgression[this.stageIndex + 1] : null
      };
    }
  }

  advanceStage() {
    if (this.isRoundOver) return false;
    const maxStages = this.activeRoundMode === MODES.BLUR ? 4 : 3;
    if (this.stageIndex < maxStages - 1) {
      this.stageIndex++;
      return true;
    }
    return false;
  }

  normalizeTitle(str) {
    return String(str)
      .toLowerCase()
      .replace(/\s*\([^)]*\)\s*/g, ' ') // ignore "(2 сезони)", "(1 частина)"
      .replace(/['’`ʼ]/g, "'")
      .replace(/[:\-–—_.,!?×x]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  makeGuess(animeOrTitle) {
    if (this.isRoundOver) return null;

    let guessedAnime = null;
    if (typeof animeOrTitle === 'object' && animeOrTitle.num) {
      guessedAnime = animeOrTitle;
    } else {
      const qNorm = this.normalizeTitle(animeOrTitle);
      guessedAnime = this.animeList.find(a =>
        this.normalizeTitle(a.ua) === qNorm ||
        this.normalizeTitle(a.cleanUa) === qNorm ||
        (a.enTitles && a.enTitles.some(en => this.normalizeTitle(en) === qNorm))
      );
    }

    // Prevent losing a life on duplicate guess in the same round
    const guessKey = guessedAnime ? `id_${guessedAnime.num}` : `raw_${this.normalizeTitle(animeOrTitle)}`;
    if (this.guessedIdsInRound.has(guessKey)) {
      return { duplicate: true };
    }
    this.guessedIdsInRound.add(guessKey);

    const isCorrect = Boolean(guessedAnime && guessedAnime.num === this.activeAnime.num);
    const guessedLabel = guessedAnime ? (guessedAnime.cleanUa || guessedAnime.ua) : String(animeOrTitle);

    if (isCorrect) {
      const stageConfig = this.getCurrentStageConfig();
      const earned = stageConfig.pointsPossible;
      this.totalScore += earned;
      this.streak++;
      this.isGuessed = true;
      this.isRoundOver = true;

      this.roundHistory.push({
        round: this.currentRoundIndex,
        mode: this.activeRoundMode,
        anime: this.activeAnime,
        opening: this.activeOpening,
        cover: this.activeCover,
        points: earned,
        guessed: true,
        stageIndex: this.stageIndex
      });

      return {
        success: true,
        pointsEarned: earned,
        totalScore: this.totalScore,
        streak: this.streak,
        isRoundOver: true,
        lives: this.lives,
        guessedLabel,
        anime: this.activeAnime
      };
    } else {
      this.lives--;
      this.streak = 0;

      if (this.lives <= 0) {
        this.isRoundOver = true;
        this.isGuessed = false;

        this.roundHistory.push({
          round: this.currentRoundIndex,
          mode: this.activeRoundMode,
          anime: this.activeAnime,
          opening: this.activeOpening,
          cover: this.activeCover,
          points: 0,
          guessed: false,
          stageIndex: this.stageIndex
        });

        return {
          success: false,
          pointsEarned: 0,
          totalScore: this.totalScore,
          streak: 0,
          isRoundOver: true,
          lives: 0,
          guessedLabel,
          anime: this.activeAnime
        };
      }

      // Automatically unlock next hint on wrong guess
      this.advanceStage();

      return {
        success: false,
        pointsEarned: 0,
        totalScore: this.totalScore,
        streak: 0,
        isRoundOver: false,
        lives: this.lives,
        guessedLabel,
        stage: this.getCurrentStageConfig()
      };
    }
  }

  giveUp() {
    if (this.isRoundOver) return null;

    this.isRoundOver = true;
    this.isGuessed = false;
    this.streak = 0;

    this.roundHistory.push({
      round: this.currentRoundIndex,
      mode: this.activeRoundMode,
      anime: this.activeAnime,
      opening: this.activeOpening,
      cover: this.activeCover,
      points: 0,
      guessed: false,
      stageIndex: this.stageIndex
    });

    return {
      pointsEarned: 0,
      totalScore: this.totalScore,
      streak: 0,
      isRoundOver: true,
      lives: this.lives,
      anime: this.activeAnime
    };
  }

  isSessionFinished() {
    if (this.roundsTotal === Infinity) return false;
    return this.currentRoundIndex >= this.roundsTotal;
  }

  getRank() {
    const ratio = this.maxPossibleScore > 0 ? (this.totalScore / this.maxPossibleScore) : 0;

    if (ratio >= 0.8) {
      return {
        title: 'Богиня Аніме',
        subtitle: 'Неймовірний результат! Твої знання опенінгів та тайтлів просто бездоганні!',
        badge: 'S+'
      };
    } else if (ratio >= 0.55) {
      return {
        title: 'Справжня Отаку-Експертка',
        subtitle: 'Чудова інтуїція та слух! Ти впізнаєш улюблені аніме з перших секунд!',
        badge: 'A'
      };
    } else if (ratio >= 0.3) {
      return {
        title: 'Чарівна Анімешниця',
        subtitle: 'Класна гра і чудовий вечір разом! Попереду ще стільки крутих тайтлів!',
        badge: 'B'
      };
    } else {
      return {
        title: 'Мила Мандрівниця',
        subtitle: 'Головне — це обійми, смаколики і теплий спільний вечір!',
        badge: 'C'
      };
    }
  }
}
