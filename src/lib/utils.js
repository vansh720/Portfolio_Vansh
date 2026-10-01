import { prefersReducedMotion } from './gsap';

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const EASE = [0.76, 0, 0.24, 1];
export const EASE_OUT = [0.16, 1, 0.3, 1];

/** The page "sheet" that lifts off the footer underneath it. */
export const PAGE_SHEET =
  'relative z-10 rounded-b-[2rem] bg-bg shadow-[0_40px_80px_-40px_var(--shadow)] md:rounded-b-[3rem]';

/** Feeds pointer position to .glow-card's spotlight. */
export function trackPointer(e) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  el.style.setProperty('--my', `${e.clientY - rect.top}px`);
}

/** Scroll to an element, selector or y-offset — through Lenis when it's running. */
export function scrollToTarget(lenis, target, options = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (lenis) {
    lenis.scrollTo(el ?? target, {
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      force: true,
      ...options,
    });
    return;
  }
  const behavior = options.immediate || prefersReducedMotion() ? 'auto' : 'smooth';
  if (typeof target === 'number') window.scrollTo({ top: target, behavior });
  else el?.scrollIntoView({ behavior });
}
