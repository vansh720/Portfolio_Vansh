import { prefersReducedMotion } from './gsap';

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const EASE = [0.76, 0, 0.24, 1];
export const EASE_OUT = [0.16, 1, 0.3, 1];

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
