import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { Asterisk } from './ui';

const COLUMNS = 5;

/**
 * Counts to 100 while fonts load, then lifts away in staggered columns.
 * `onReveal` fires as the columns start moving so the hero can animate underneath.
 */
export default function Preloader({ onReveal, onDone }) {
  const root = useRef(null);
  const count = useRef(null);
  const callbacks = useRef({ onReveal, onDone });
  callbacks.current = { onReveal, onDone };

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
      const value = { n: 0 };
      const countDuration = reduced ? 0.3 : 1.7;

      const tl = gsap.timeline();
      tl.from('.pl-in', { yPercent: 110, duration: 0.8, stagger: 0.06, ease: 'expo.out' })
        .to(
          value,
          {
            n: 100,
            duration: countDuration,
            ease: 'power3.inOut',
            onUpdate: () => {
              count.current.textContent = String(Math.round(value.n)).padStart(3, '0');
            },
          },
          0.1,
        )
        .fromTo('.pl-bar', { scaleX: 0 }, { scaleX: 1, duration: countDuration, ease: 'power3.inOut' }, '<')
        .addPause('+=0.05', () => {
          fontsReady.then(() => tl.play());
        })
        .to('.pl-in', { yPercent: -110, duration: 0.5, stagger: 0.03, ease: 'power3.in' })
        .call(() => callbacks.current.onReveal?.(), null, '-=0.1')
        .to('.pl-col', { yPercent: -100, duration: reduced ? 0.3 : 1, stagger: 0.07, ease: 'expo.inOut' }, '<')
        .call(() => callbacks.current.onDone?.());
    },
    { scope: root },
  );

  return (
    <div ref={root} className="fixed inset-0 z-[100]" role="status" aria-live="polite">
      <span className="sr-only">Loading portfolio</span>
      <div className="absolute inset-0 flex" aria-hidden="true">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <div key={i} className="pl-col -mr-px h-full flex-1 bg-surface" />
        ))}
      </div>

      <div className="relative flex h-full flex-col justify-between px-gutter py-6 md:py-8" aria-hidden="true">
        <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          <span className="overflow-hidden">
            <span className="pl-in flex items-center gap-2">
              <Asterisk className="size-3 text-accent" /> Vansh Narula
            </span>
          </span>
          <span className="overflow-hidden">
            <span className="pl-in block">Portfolio ©2026</span>
          </span>
        </div>

        <div>
          <div className="flex items-end justify-between gap-6">
            <p className="overflow-hidden font-serif text-[clamp(1.15rem,2vw,1.75rem)] italic leading-tight">
              <span className="pl-in block">Full stack, from schema to cloud.</span>
            </p>
            <p className="overflow-hidden text-[clamp(3.5rem,11vw,9rem)] font-semibold leading-[0.85] tracking-[-0.06em] tabular-nums">
              <span ref={count} className="pl-in block">
                000
              </span>
            </p>
          </div>
          <div className="mt-6 h-px bg-line">
            <div className="pl-bar h-full origin-left bg-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}
