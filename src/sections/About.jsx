import { useRef } from 'react';
import { aboutFacts, stats } from '../data/content';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { SectionLabel } from '../components/ui';

const formatStat = (value, { decimals = 0, pad = 0 }) => {
  const text = value.toFixed(decimals);
  return pad ? text.padStart(pad, '0') : text;
};

export default function About() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const split = SplitText.create('.about-text', { type: 'words' });
      gsap.fromTo(
        split.words,
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: '.about-text', start: 'top 78%', end: 'bottom 45%', scrub: true },
        },
      );

      gsap.from('.about-fact', {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.about-facts', start: 'top 85%' },
      });

      gsap.utils.toArray('.stat-num').forEach((el) => {
        const stat = stats[Number(el.dataset.index)];
        const counter = { v: 0 };
        el.textContent = formatStat(0, stat);
        gsap.to(counter, {
          v: stat.value,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = formatStat(counter.v, stat);
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="px-gutter py-24 md:py-36">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <SectionLabel index="01" title="About" />
        </div>
        <div className="lg:col-span-9">
          <p className="about-text font-display text-[clamp(1.7rem,3.8vw,3.6rem)] font-medium leading-[1.1] tracking-[-0.03em]">
            I’m a full-stack developer who enjoys the parts that have to{' '}
            <em className="font-serif font-normal text-accent-ink">just work</em> — access rules that hold across
            three tiers of users, payment webhooks that settle in real time, and queues that send the reminder exactly
            when it should. I design the REST APIs, model the MongoDB schemas, and deploy the whole thing on AWS.
          </p>

          <dl className="about-facts mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
            {aboutFacts.map((fact) => (
              <div key={fact.k} className="about-fact bg-bg p-6">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{fact.k}</dt>
                <dd className="mt-2 text-lg font-medium tracking-tight">{fact.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <dl className="mt-20 grid grid-cols-2 border-t border-line md:mt-28 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="flex flex-col justify-between gap-6 border-line py-8 max-lg:odd:border-r max-lg:odd:pr-4 max-lg:even:pl-4 max-lg:[&:nth-child(n+3)]:border-t lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
          >
            <dt className="order-2 max-w-[22ch] text-sm leading-snug text-muted">{stat.label}</dt>
            <dd className="order-1 flex items-baseline gap-1 font-display text-[clamp(3.25rem,7vw,7rem)] font-bold leading-none tracking-[-0.06em] tabular-nums">
              <span className="stat-num" data-index={i}>
                {formatStat(stat.value, stat)}
              </span>
              {stat.suffix && (
                <span className="font-serif text-[0.4em] font-normal italic tracking-normal text-accent-ink">{stat.suffix}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
