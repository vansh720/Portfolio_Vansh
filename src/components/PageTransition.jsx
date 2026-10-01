import { motion } from 'motion/react';
import { EASE } from '../lib/utils';

/**
 * Wraps a route. Leaving: an ember curtain rises from the bottom.
 * Entering: the same curtain retracts to the top, revealing the new page.
 */
export default function PageTransition({ children }) {
  return (
    <>
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80] origin-bottom bg-accent"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80] origin-top bg-accent"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.7, ease: EASE, delay: 0.05 } }}
        exit={{ scaleY: 0 }}
      />
    </>
  );
}
