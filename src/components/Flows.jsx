import { Fragment } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { cn, EASE_OUT } from '../lib/utils';

/** Request/data flows drawn as chains of chips. */
export default function Flows({ flows }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {flows.map((flow, i) => (
        <motion.li
          key={flow.label}
          className="grid gap-4 py-6 md:grid-cols-[180px_1fr] md:items-center md:py-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.06 }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <span className="text-accent-ink">{String(i + 1).padStart(2, '0')}</span> — {flow.label}
          </p>
          <p className="flex flex-wrap items-center gap-2">
            {flow.steps.map((step, j) => (
              <Fragment key={`${step}-${j}`}>
                {j > 0 && (
                  <>
                    <ArrowRight className="size-4 shrink-0 text-accent-ink" aria-hidden="true" />
                    <span className="sr-only">then</span>
                  </>
                )}
                <span
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm',
                    j === 0 ? 'border-accent text-fg' : 'border-line bg-surface text-fg',
                  )}
                >
                  {step}
                </span>
              </Fragment>
            ))}
          </p>
        </motion.li>
      ))}
    </ol>
  );
}
