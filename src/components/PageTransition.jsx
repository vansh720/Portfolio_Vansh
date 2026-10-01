import { motion } from 'motion/react';
import { EASE } from '../lib/utils';
import { Asterisk } from './ui';

/**
 * Wraps a route. Leaving: an ember sheet with a curved leading edge sweeps up over the page.
 * Entering: it carries on upward, its trailing edge curving as it clears the new page.
 */
export default function PageTransition({ children }) {
  return (
    <>
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] grid h-[120vh] place-items-center bg-accent text-on-accent"
        initial={{ y: '100%', borderTopLeftRadius: '50% 20vh', borderTopRightRadius: '50% 20vh' }}
        animate={{ y: '100%', borderTopLeftRadius: '50% 20vh', borderTopRightRadius: '50% 20vh' }}
        exit={{ y: '0%', borderTopLeftRadius: '0% 0vh', borderTopRightRadius: '0% 0vh' }}
        transition={{ duration: 0.75, ease: EASE }}
      >
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 0, rotate: -180 }}
          exit={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="mt-[20vh] block"
        >
          <Asterisk className="size-12" />
        </motion.span>
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[80] grid h-[120vh] place-items-center bg-accent text-on-accent"
        initial={{ y: '0%', borderBottomLeftRadius: '0% 0vh', borderBottomRightRadius: '0% 0vh' }}
        animate={{
          y: '-100%',
          borderBottomLeftRadius: '50% 20vh',
          borderBottomRightRadius: '50% 20vh',
          transition: { duration: 0.85, ease: EASE, delay: 0.05 },
        }}
        exit={{ y: '-100%' }}
      >
        <motion.span
          initial={{ scale: 1, rotate: 0 }}
          animate={{ scale: 0, rotate: 180, transition: { duration: 0.5, ease: EASE } }}
          className="mb-[20vh] block"
        >
          <Asterisk className="size-12" />
        </motion.span>
      </motion.div>
    </>
  );
}
