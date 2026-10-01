import { useEffect } from 'react';
import { ScrollTrigger } from '../lib/gsap';

/** Sets the document title and re-measures scroll triggers once a page has mounted. */
export function usePageSetup(title) {
  useEffect(() => {
    document.title = title;
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [title]);
}
