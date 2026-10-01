import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { scrollToTarget } from '../lib/utils';

/** Floating button whose ring fills with page progress. */
export default function BackToTop() {
  const { lenis, menuOpen } = useApp();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  const [visible, setVisible] = useState(false);

  // Shown mid-page only — at the very bottom the footer has its own "Back to top".
  useMotionValueEvent(scrollY, 'change', (y) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    setVisible(y > 900 && y < max - 600);
  });

  return (
    <AnimatePresence>
      {visible && !menuOpen && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => scrollToTarget(lenis, 0)}
          className="fixed bottom-4 right-4 z-30 grid size-12 place-items-center rounded-full border border-line bg-bg/75 shadow-[0_10px_30px_-10px_var(--shadow)] backdrop-blur-md md:bottom-6 md:right-6"
          initial={{ opacity: 0, scale: 0.5, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 24 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              className="stroke-accent"
              style={{ pathLength: progress }}
            />
          </svg>
          <ArrowUp className="size-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
