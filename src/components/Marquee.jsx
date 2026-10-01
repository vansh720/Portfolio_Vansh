import { Fragment, useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { marqueeRows } from '../data/content';
import { cn } from '../lib/utils';
import { Asterisk } from './ui';

function Row({ words, variant, hidden }) {
  return (
    <div className="flex shrink-0 items-center gap-6 pr-6 md:gap-10 md:pr-10" aria-hidden={hidden || undefined}>
      {words.map((word) => (
        <Fragment key={word}>
          <span
            className={cn(
              'whitespace-nowrap leading-none',
              variant === 'solid'
                ? 'font-display text-[clamp(2.5rem,7vw,6.5rem)] font-bold uppercase tracking-[-0.045em]'
                : 'font-serif text-[clamp(2.25rem,6vw,5.5rem)] italic',
            )}
          >
            {word}
          </span>
          <Asterisk className={cn('size-[clamp(1.25rem,3vw,2.75rem)] shrink-0', variant === 'solid' ? 'text-on-accent' : 'text-accent')} />
        </Fragment>
      ))}
    </div>
  );
}

/** Two counter-scrolling bands. Scroll speed pushes them faster and leans them into the motion. */
export default function Marquee() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const tracks = gsap.utils.toArray('.mq-track');
      const tweens = tracks.map((track, i) =>
        i % 2 === 0
          ? gsap.fromTo(track, { xPercent: 0 }, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
          : gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: 46, ease: 'none', repeat: -1 }),
      );
      const skewTargets = gsap.utils.toArray('.mq-skew');
      const trigger = ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top' });

      let lastY = window.scrollY;
      let direction = 1;
      let speed = 1;
      let skew = 0;
      const tick = () => {
        const y = window.scrollY;
        const dy = y - lastY;
        lastY = y;
        if (!trigger.isActive) return;
        if (dy !== 0) direction = dy > 0 ? 1 : -1;
        const target = direction * (1 + Math.min(Math.abs(dy) * 0.22, 5));
        speed += (target - speed) * 0.08;
        tweens.forEach((t) => t.timeScale(speed));
        skew += (gsap.utils.clamp(-6, 6, -dy * 0.3) - skew) * 0.12;
        gsap.set(skewTargets, { skewX: skew });
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Technologies I work with" className="relative overflow-hidden py-16 md:py-24">
      <p className="sr-only">{marqueeRows.flat().join(', ')}</p>
      <div className="-mx-4 -rotate-2 bg-accent py-4 text-on-accent md:py-6" aria-hidden="true">
        <div className="mq-skew">
          <div className="mq-track flex w-max">
            <Row words={marqueeRows[0]} variant="solid" />
            <Row words={marqueeRows[0]} variant="solid" hidden />
          </div>
        </div>
      </div>
      <div className="-mx-4 mt-4 rotate-1 border-y border-line py-4 md:mt-6 md:py-5" aria-hidden="true">
        <div className="mq-skew">
          <div className="mq-track flex w-max">
            <Row words={marqueeRows[1]} variant="serif" />
            <Row words={marqueeRows[1]} variant="serif" hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
