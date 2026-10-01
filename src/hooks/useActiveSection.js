import { useEffect, useState } from 'react';

/** Tracks which section currently sits in the middle band of the viewport. */
export function useActiveSection(ids, enabled) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    // Sections mount with the page, which may land after the nav.
    const frame = requestAnimationFrame(() => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [ids, enabled]);

  return active;
}
