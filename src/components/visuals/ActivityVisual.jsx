import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { BellRing, Link2, MessageSquare } from 'lucide-react';
import { EASE_OUT } from '../../lib/utils';

const USERS = ['User 01', 'User 02', 'User 03', 'User 04', 'User 05'];
const DAYS = 14;
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const EVENTS = [
  { icon: BellRing, title: 'Reminder queued', meta: 'redis · reminders' },
  { icon: MessageSquare, title: 'SMS delivered', meta: 'twilio · group A' },
  { icon: Link2, title: 'Meeting link broadcast', meta: 'group B · all members' },
];

/** Deterministic 0–4 activity level, so the grid looks the same on every render. */
const level = (u, d) => {
  const v = Math.sin((u + 1) * 12.9898 + (d + 1) * 78.233) * 43758.5453;
  return Math.floor((v - Math.floor(v)) * 5);
};

/** Illustration of the coach dashboard: activity heatmap plus queued notifications. */
export default function ActivityVisual() {
  const root = useRef(null);
  const inView = useInView(root, { margin: '-10%' });
  const reduced = useReducedMotion();
  const [eventIndex, setEventIndex] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = setInterval(() => setEventIndex((i) => (i + 1) % EVENTS.length), 2400);
    return () => clearInterval(id);
  }, [inView, reduced]);

  const event = EVENTS[eventIndex];
  const Icon = event.icon;

  return (
    <div
      ref={root}
      className="dot-grid flex h-full w-full flex-col justify-center gap-5 px-[8%] py-8"
      role="img"
      aria-label="Illustration: a coach dashboard showing two weeks of daily activity for each user, with reminders and broadcasts being sent."
    >
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        <span>Coach view · 2 weeks</span>
        <span className="flex gap-1 rounded-full border border-line p-1">
          <span className="rounded-full bg-fg px-2.5 py-1 text-bg">Daily</span>
          <span className="px-2.5 py-1">Weekly</span>
        </span>
      </div>

      <div className="grid gap-1.5" style={{ gridTemplateColumns: `minmax(3.5rem, auto) repeat(${DAYS}, minmax(0, 1fr))` }}>
        <span />
        {Array.from({ length: DAYS }, (_, d) => (
          <span key={d} className="text-center font-mono text-[9px] text-muted">
            {DAY_LABELS[d % 7]}
          </span>
        ))}
        {USERS.map((user, u) => (
          <div key={user} className="contents">
            <span className="self-center whitespace-nowrap font-mono text-[10px] text-muted">{user}</span>
            {Array.from({ length: DAYS }, (_, d) => {
              const l = level(u, d);
              return (
                <motion.span
                  key={d}
                  className="aspect-square rounded-[4px]"
                  style={{
                    background: l === 0 ? 'var(--line)' : `color-mix(in oklab, var(--accent) ${20 + l * 20}%, transparent)`,
                  }}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={inView ? { opacity: 1, scale: 1 } : undefined}
                  transition={{ duration: 0.5, ease: EASE_OUT, delay: (u * DAYS + d) * 0.006 }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="relative h-16" aria-live="off">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={eventIndex}
            className="absolute inset-x-0 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.45)]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-on-accent">
              <Icon className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{event.title}</span>
              <span className="block truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{event.meta}</span>
            </span>
            <span className="ml-auto live-dot" aria-hidden="true" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
