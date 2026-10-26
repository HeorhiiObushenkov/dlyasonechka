/**
 * Anime Autocomplete Component (Vanilla JS)
 * Searches across Ukrainian titles and extracted English titles
 */
export class AnimeAutocomplete {
  constructor(inputEl, dropdownEl, animeList, onSelect) {
    this.input = inputEl;
    this.dropdown = dropdownEl;
    this.animeList = animeList;
    this.onSelect = onSelect;
    this.selectedIndex = -1;
    this.currentMatches = [];
    this.isOpen = false;

    this.init();
  }

  init() {
    this.input.addEventListener('input', () => this.handleInput());
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.input.addEventListener('focus', () => {
      if (this.input.value.trim().length > 0) {
        this.handleInput();
      }
    });

    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.close();
      }
    });
  }

  cleanStr(str) {
    return String(str)
      .toLowerCase()
      .replace(/['’`ʼ]/g, "'")
      .replace(/[:\-–—_().!?×]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  handleInput() {
    const query = this.input.value.trim();
    if (!query) {
      this.close();
      return;
    }

    const cleanQuery = this.cleanStr(query);
    if (!cleanQuery) {
      this.close();
      return;
    }

    const matches = [];
    for (const anime of this.animeList) {
      const uaClean = this.cleanStr(anime.ua);
      const enTitles = anime.enTitles || [];
      const cleanEns = enTitles.map(t => this.cleanStr(t));

      let matched = false;
      let score = 0;

      if (uaClean.startsWith(cleanQuery)) {
        matched = true;
        score = 100 - Math.min(30, uaClean.length - cleanQuery.length);
      } else if (uaClean.includes(cleanQuery)) {
        matched = true;
        score = 75;
      } else {
        for (const en of cleanEns) {
          if (en.startsWith(cleanQuery)) {
            matched = true;
            score = 90 - Math.min(30, en.length - cleanQuery.length);
            break;
          } else if (en.includes(cleanQuery)) {
            matched = true;
            score = 65;
            break;
          }
        }
      }

      if (matched) {
        matches.push({ anime, score });
      }
    }

    matches.sort((a, b) => b.score - a.score);
    this.currentMatches = matches.slice(0, 7).map(m => m.anime);
    this.selectedIndex = this.currentMatches.length > 0 ? 0 : -1;
    this.render();
  }

  getBestMatchForText(rawText) {
    if (this.currentMatches.length > 0) {
      const idx = this.selectedIndex >= 0 ? this.selectedIndex : 0;
      return this.currentMatches[idx];
    }
    const q = this.cleanStr(rawText);
    return this.animeList.find(a =>
      this.cleanStr(a.ua) === q ||
      this.cleanStr(a.cleanUa || '') === q ||
      (a.enTitles && a.enTitles.some(en => this.cleanStr(en) === q))
    ) || null;
  }

  handleKeydown(e) {
    if (e.key === 'ArrowDown') {
      if (!this.isOpen && this.input.value.trim()) {
        this.handleInput();
        return;
      }
      if (this.currentMatches.length > 0) {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex + 1) % this.currentMatches.length;
        this.updateSelectionVisuals();
      }
    } else if (e.key === 'ArrowUp') {
      if (this.isOpen && this.currentMatches.length > 0) {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex - 1 + this.currentMatches.length) % this.currentMatches.length;
        this.updateSelectionVisuals();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.isOpen && this.currentMatches.length > 0) {
        const pick = this.currentMatches[this.selectedIndex >= 0 ? this.selectedIndex : 0];
        this.select(pick);
      } else if (this.input.value.trim()) {
        const best = this.getBestMatchForText(this.input.value.trim());
        if (this.onSelect) {
          this.onSelect(best || this.input.value.trim());
        }
      }
    } else if (e.key === 'Escape') {
      this.close();
    }
  }

  updateSelectionVisuals() {
    const items = this.dropdown.querySelectorAll('.autocomplete-item');
    items.forEach((item, idx) => {
      if (idx === this.selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  render() {
    if (this.currentMatches.length === 0) {
      this.close();
      return;
    }

    this.dropdown.innerHTML = '';
    const query = this.input.value.trim();

    this.currentMatches.forEach((anime, idx) => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item' + (idx === this.selectedIndex ? ' selected' : '');

      const primary = document.createElement('div');
      primary.className = 'autocomplete-title';
      primary.innerHTML = this.highlightMatch(anime.ua, query);
      item.appendChild(primary);

      if (anime.enTitles && anime.enTitles.length > 0) {
        const secondary = document.createElement('div');
        secondary.className = 'autocomplete-subtitle';
        secondary.innerHTML = this.highlightMatch(anime.enTitles[0], query);
        item.appendChild(secondary);
      }

      item.addEventListener('mouseenter', () => {
        this.selectedIndex = idx;
        this.updateSelectionVisuals();
      });

      item.addEventListener('click', () => {
        this.select(anime);
      });

      this.dropdown.appendChild(item);
    });

    this.dropdown.classList.remove('hidden');
    this.isOpen = true;
  }

  highlightMatch(text, query) {
    if (!query) return text;
    try {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    } catch {
      return text;
    }
  }

  select(anime) {
    this.input.value = anime.ua;
    this.close();
    if (this.onSelect) {
      this.onSelect(anime);
    }
  }

  close() {
    this.dropdown.classList.add('hidden');
    this.isOpen = false;
    this.selectedIndex = -1;
  }

  clear() {
    this.input.value = '';
    this.currentMatches = [];
    this.close();
  }
}
