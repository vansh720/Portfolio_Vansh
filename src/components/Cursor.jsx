import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

/**
 * A soft ring that trails the native cursor. It grows over links and turns into
 * a labelled disc over anything marked with data-cursor="view".
 */
export default function Cursor() {
  const root = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    let state = '';

    const setState = (next, text = '') => {
      if (next === state) return;
      state = next;
      el.dataset.state = next;
      label.current.textContent = text;
    };
    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      el.classList.add('is-visible');
    };
    const onOver = (e) => {
      const target = e.target.closest?.('[data-cursor], a, button, label, input, textarea, select');
      if (!target) return setState('');
      if (target.dataset.cursor) return setState(target.dataset.cursor, target.dataset.cursorLabel || 'View');
      if (target.matches('input, textarea, select')) return setState('text');
      return setState('link');
    };
    const onLeave = () => el.classList.remove('is-visible');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={root} className="cursor" aria-hidden="true">
      <span className="cursor-ring" />
      <span ref={label} className="cursor-label" />
    </div>
  );
}
