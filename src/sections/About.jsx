import { useRef } from 'react';
import { aboutFacts, stats } from '../data/content';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { SectionLabel } from '../components/ui';
import { RevealGroup, RevealItem } from '../components/motion';

const formatStat = (value, { decimals = 0, pad = 0 }) => {
  const text = value.toFixed(decimals);
  return pad ? text.padStart(pad, '0') : text;
};

export default function About() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Words brighten one by one as the paragraph scrolls through the viewport.
      const split = SplitText.create('.about-text', { type: 'words' });
      gsap.fromTo(
        split.words,
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: '.about-text', start: 'top 80%', end: 'bottom 50%', scrub: true },
        },
      );

      gsap.utils.toArray('.stat-num').forEach((el) => {
        const stat = stats[Number(el.dataset.index)];
        const counter = { v: 0 };
        el.textContent = formatStat(0, stat);
        gsap.to(counter, {
          v: stat.value,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = formatStat(counter.v, stat);
          },
        });
      });

      gsap.fromTo(
        '.stat-bar',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.6, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.stats', start: 'top 88%' } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="px-gutter py-24 md:py-32">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <SectionLabel index="01" title="About" />
        </div>
        <div className="lg:col-span-9">
          <p className="about-text max-w-[46ch] text-[clamp(1.35rem,2.4vw,2.2rem)] font-medium leading-[1.3] tracking-[-0.03em]">
            I’m a full-stack developer who enjoys the parts that have to{' '}
            <em className="font-serif text-[1.12em] font-normal text-accent-ink">just work</em> — access rules that hold
            across three tiers of users, payment webhooks that settle in real time, and queues that send the reminder
            exactly when it should. I design the REST APIs, model the MongoDB schemas, and deploy the whole thing on AWS.
          </p>

          <RevealGroup as="dl" className="mt-12 grid gap-3 sm:grid-cols-2" stagger={0.07}>
            {aboutFacts.map((fact) => (
              <RevealItem
                key={fact.k}
                className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface/50 px-5 py-4 transition-colors hover:border-fg/25"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{fact.k}</dt>
                <dd className="text-right text-[15px] font-medium tracking-[-0.01em]">{fact.v}</dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>

      <dl className="stats mt-20 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-24 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex flex-col gap-3">
            <dd className="order-1 flex items-baseline gap-1 text-[clamp(2.5rem,4.6vw,4.25rem)] font-semibold leading-none tracking-[-0.06em] tabular-nums">
              <span className="stat-num" data-index={i}>
                {formatStat(stat.value, stat)}
              </span>
              {stat.suffix && (
                <span className="font-serif text-[0.45em] font-normal italic tracking-normal text-accent-ink">{stat.suffix}</span>
              )}
            </dd>
            <div className="order-2 h-px bg-line" aria-hidden="true">
              <div className="stat-bar h-full w-1/3 origin-left bg-accent" />
            </div>
            <dt className="order-3 max-w-[24ch] text-sm leading-snug text-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
