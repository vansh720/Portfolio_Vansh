import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { prefersReducedMotion } from '../lib/gsap';

const STORAGE_KEY = 'vn-theme';
const THEME_COLORS = { dark: '#0c0b09', light: '#eee8dc' };

const readTheme = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

export function useTheme() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage can be unavailable (private mode, blocked site data) — the theme still applies.
    }
  }, [theme]);

  /** Switches theme with a circular reveal from the toggle button. */
  const toggle = useCallback((event) => {
    const next = readTheme() === 'light' ? 'dark' : 'light';
    const apply = () => {
      document.documentElement.dataset.theme = next;
      flushSync(() => setTheme(next));
    };

    if (!document.startViewTransition || prefersReducedMotion()) {
      apply();
      return;
    }

    const rect = event?.currentTarget?.getBoundingClientRect?.();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 48;
    const y = rect ? rect.top + rect.height / 2 : 36;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 750, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' },
        );
      })
      .catch(() => {});
  }, []);

  return [theme, toggle];
}
