import { useRef } from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { profile } from '../data/content';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { scrollToTarget } from '../lib/utils';
import { LocalClock, RollText } from './ui';

export default function Footer() {
  const root = useRef(null);
  const { lenis } = useApp();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        '.footer-fill',
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: '.footer-word', start: 'top bottom', end: 'bottom bottom', scrub: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden px-gutter pb-6 pt-16">
      <div className="flex flex-col gap-10 border-t border-line pt-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Have something in mind?</p>
          <a
            href={`mailto:${profile.email}`}
            className="group mt-3 inline-flex items-center gap-3 break-all font-display text-[clamp(1.5rem,3.4vw,3rem)] font-medium tracking-[-0.03em] hover:text-accent-ink"
          >
            {profile.email}
            <ArrowUpRight className="size-[0.8em] shrink-0 transition-transform duration-500 group-hover:rotate-45" />
          </a>
        </div>
        <ul className="flex flex-wrap gap-2">
          <li>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost group">
              <RollText>LinkedIn</RollText>
            </a>
          </li>
          <li>
            <a href={profile.resume} download className="btn btn-ghost group">
              <RollText>Résumé</RollText>
            </a>
          </li>
          <li>
            <button type="button" onClick={() => scrollToTarget(lenis, 0)} className="btn btn-accent group">
              <RollText>Back to top</RollText>
              <ArrowUp className="size-4" />
            </button>
          </li>
        </ul>
      </div>

      <div className="footer-word relative mt-14 select-none" aria-hidden="true">
        <p className="hollow font-display text-[31vw] font-bold uppercase leading-[0.78] tracking-[-0.05em]">Vansh</p>
        <p className="footer-fill absolute inset-0 font-display text-[31vw] font-bold uppercase leading-[0.78] tracking-[-0.05em] text-accent">
          Vansh
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:flex-row md:justify-between">
        <span>© 2026 Vansh Narula</span>
        <span>React · GSAP · Motion · Three.js</span>
        <span>
          Ambala <LocalClock /> IST
        </span>
      </div>
    </footer>
  );
}
