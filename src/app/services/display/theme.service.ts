import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private theme = this.getStoredTheme() ?? this.getSystemTheme();

  constructor() {
    this.setTheme(this.theme);
  }

  toggle() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    localStorage.setItem('theme', theme);

    if (theme === 'light') {
      this.document.documentElement.classList.add('light-mode');
      this.document.documentElement.classList.remove('dark-mode');
    } else {
      this.document.documentElement.classList.remove('light-mode');
      this.document.documentElement.classList.add('dark-mode');
    }
  }

  getSystemTheme(): Theme {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    return prefersDark ? 'dark' : 'light';
  }

  private getStoredTheme(): Theme | null {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : null;
  }
}
