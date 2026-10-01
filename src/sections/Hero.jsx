import { lazy, Suspense, useRef } from 'react';
import { ArrowDown, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { profile } from '../data/content';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { scrollToTarget } from '../lib/utils';
import { Magnetic, RollText } from '../components/ui';

const HeroCanvas = lazy(() => import('../components/HeroCanvas'));

export default function Hero() {
  const { ready, lenis, introDelay } = useApp();
  const root = useRef(null);
  const intro = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const split = SplitText.create('.hero-word', { type: 'chars' });
      intro.current = gsap
        .timeline({ paused: true, defaults: { ease: 'expo.out' } })
        .from(split.chars, { yPercent: 118, rotate: 7, transformOrigin: '0% 100%', duration: 1.4, stagger: 0.045 })
        .from('.hero-fade', { y: 28, autoAlpha: 0, duration: 1.1, stagger: 0.07 }, 0.35)
        .from('.hero-canvas', { autoAlpha: 0, scale: 0.85, duration: 2.2 }, 0);

      const scrub = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero-word-1', { xPercent: -9, ease: 'none', scrollTrigger: scrub });
      gsap.to('.hero-word-2', { xPercent: 7, ease: 'none', scrollTrigger: scrub });
      gsap.to('.hero-canvas-drift', { yPercent: 22, ease: 'none', scrollTrigger: scrub });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (ready && intro.current) gsap.delayedCall(introDelay(), () => intro.current?.play());
    },
    { dependencies: [ready], scope: root },
  );

  return (
    <section ref={root} id="top" className="relative flex min-h-dvh flex-col overflow-hidden px-gutter pb-8 pt-24 md:pt-28">
      <div className="hero-canvas-drift pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="hero-canvas absolute inset-0">
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-muted md:grid-cols-4">
        <p className="hero-fade">
          Portfolio
          <br />
          Edition 2026
        </p>
        <p className="hero-fade">
          Full stack developer
          <br />
          MERN · AWS
        </p>
        <p className="hero-fade hidden md:block">
          Based in
          <br />
          {profile.location}
        </p>
        <p className="hero-fade hidden text-right md:block">
          {profile.coords}
          <br />
          IST · UTC+5:30
        </p>
      </div>

      <h1
        className="relative z-10 mt-auto pt-16 font-display text-[clamp(3.5rem,18vw,22rem)] font-bold uppercase leading-[0.8] tracking-[-0.06em]"
        aria-label="Vansh Narula"
      >
        <span className="block overflow-hidden pb-[0.05em] pt-[0.08em]" aria-hidden="true">
          <span className="hero-word hero-word-1 inline-block">Vansh</span>
        </span>
        <span className="block overflow-hidden pb-[0.07em] text-right" aria-hidden="true">
          <span className="hero-word hero-word-2 inline-block pr-[0.07em]">
            Narula<span className="text-accent">.</span>
          </span>
        </span>
      </h1>

      <div className="relative z-10 mt-8 grid gap-8 md:grid-cols-12 md:items-end">
        <p className="hero-fade max-w-[30ch] font-serif text-[clamp(1.5rem,2.5vw,2.35rem)] leading-[1.12] md:col-span-6 lg:col-span-5">
          I build and ship <em className="text-accent-ink">production</em> MERN apps — payments, roles and
          real-time — from schema to cloud.
        </p>

        <div className="flex flex-col gap-5 md:col-span-6 md:items-end lg:col-span-7">
          <p className="hero-fade flex items-center gap-2.5 text-sm text-muted">
            <span className="live-dot" aria-hidden="true" />
            <span>
              Currently {profile.role} at <span className="text-fg">{profile.company}</span>, {profile.companyPlace}
            </span>
          </p>
          <div className="hero-fade flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(lenis, '#work');
                }}
                className="btn btn-accent group"
              >
                <RollText>See the work</RollText>
                <ArrowDown className="size-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={profile.resume} download className="btn btn-ghost group">
                <RollText>Download résumé</RollText>
                <Download className="size-4" />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="hero-fade pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex" aria-hidden="true">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">Scroll</span>
        <span className="block h-12 w-px bg-line">
          <span className="scroll-cue block h-full w-full bg-accent" />
        </span>
      </div>
    </section>
  );
}
