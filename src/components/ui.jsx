import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { cn } from '../lib/utils';

/** The eight-spoke mark used as the brand motif. */
export function Asterisk({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <line x1="12" y1="2.5" x2="12" y2="21.5" />
        <line x1="2.5" y1="12" x2="21.5" y2="12" />
        <line x1="5.3" y1="5.3" x2="18.7" y2="18.7" />
        <line x1="18.7" y1="5.3" x2="5.3" y2="18.7" />
      </g>
    </svg>
  );
}

export function SectionLabel({ index, title, className }) {
  return (
    <p className={cn('flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted', className)}>
      <span className="text-accent-ink">({index})</span>
      <span className="h-px w-10 bg-line" aria-hidden="true" />
      {title}
    </p>
  );
}

/** Text that rolls up to a duplicate on hover of the nearest `.group`. */
export function RollText({ children }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

/** Pulls its child toward the pointer on fine-pointer devices. */
export function Magnetic({ children, strength = 0.3, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    let rect = null;

    const onEnter = () => {
      rect = el.getBoundingClientRect();
    };
    const onMove = (e) => {
      rect ??= el.getBoundingClientRect();
      xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const onLeave = () => {
      rect = null;
      xTo(0);
      yTo(0);
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return (
    <span ref={ref} className={cn('inline-block', className)}>
      {children}
    </span>
  );
}

const istFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/** Current time in India, refreshed every few seconds. */
export function LocalClock({ className }) {
  const [time, setTime] = useState(() => istFormatter.format(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(istFormatter.format(new Date())), 5000);
    return () => clearInterval(id);
  }, []);

  return <time className={cn('tabular-nums', className)}>{time}</time>;
}
