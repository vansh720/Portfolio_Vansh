import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useMotionValue, useSpring } from 'motion/react';
import { ArrowDown, Cloud, CreditCard, Download, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { profile } from '../data/content';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { cn, EASE_OUT, scrollToTarget } from '../lib/utils';
import { Button, LocalClock } from '../components/ui';

const HeroCanvas = lazy(() => import('../components/HeroCanvas'));

/** What Vansh builds — each one is also a particle formation (order matches HeroCanvas shapes). */
const FORMATIONS = [
  { phrase: 'payment flows', label: 'Payment flows', meta: 'Razorpay · webhooks', icon: CreditCard },
  { phrase: 'role-based systems', label: 'Role-based systems', meta: '3-tier RBAC', icon: ShieldCheck },
  { phrase: 'real-time features', label: 'Real-time features', meta: 'Twilio · Redis queues', icon: Zap },
  { phrase: 'cloud deployments', label: 'Cloud deployments', meta: 'AWS EC2 · S3 · Docker', icon: Cloud },
];
const CYCLE_SECONDS = 5.5;
const SPRING = { type: 'spring', stiffness: 380, damping: 32 };

const letter = {
  hidden: { y: '110%', opacity: 0, filter: 'blur(8px)' },
  show: { y: '0%', opacity: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE_OUT } },
  exit: { y: '-110%', opacity: 0, filter: 'blur(8px)', transition: { duration: 0.45, ease: [0.7, 0, 0.84, 0] } },
};

/** Slot-machine phrase: letters leave upward and the next phrase rolls in from below. */
function TextLoop({ index }) {
  const phrase = FORMATIONS[Math.max(index, 0)].phrase;
  return (
    <span className="relative block overflow-hidden pb-[0.16em] pr-[0.1em]">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={phrase}
          className="block whitespace-nowrap"
          initial="hidden"
          animate="show"
          exit="exit"
          variants={{ show: { transition: { staggerChildren: 0.025 } }, exit: { transition: { staggerChildren: 0.012 } } }}
        >
          {[...phrase].map((ch, i) => (
            <motion.span key={i} variants={letter} className="inline-block">
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const { ready, lenis, introDelay } = useApp();
  const root = useRef(null);
  const intro = useRef(null);
  const nameChars = useRef([]);
  const proximityOn = useRef(false);

  // -1 shows the idle sphere until the intro hands over to the first formation.
  const [formation, setFormation] = useState(() => (prefersReducedMotion() ? 0 : -1));
  const progress = useMotionValue(prefersReducedMotion() ? 1 : 0);
  const autoplay = useRef({ tween: null, hold: false, visible: true });
  const inView = useInView(root, { amount: 0.25 });

  // Soft ember glow that trails the pointer.
  const glowX = useMotionValue(-600);
  const glowY = useMotionValue(-600);
  const springX = useSpring(glowX, { stiffness: 60, damping: 20 });
  const springY = useSpring(glowY, { stiffness: 60, damping: 20 });
  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const rect = root.current.getBoundingClientRect();
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  // Autoplay through formations; each one owns a progress bar.
  useEffect(() => {
    if (formation < 0 || prefersReducedMotion()) return;
    const proxy = { v: 0 };
    progress.set(0);
    const tween = gsap.to(proxy, {
      v: 1,
      duration: CYCLE_SECONDS,
      ease: 'none',
      onUpdate: () => progress.set(proxy.v),
      onComplete: () => setFormation((i) => (i + 1) % FORMATIONS.length),
    });
    autoplay.current.tween = tween;
    if (autoplay.current.hold || !autoplay.current.visible) tween.pause();
    return () => tween.kill();
  }, [formation, progress]);

  useEffect(() => {
    const state = autoplay.current;
    state.visible = inView;
    if (!state.tween) return;
    if (inView && !state.hold) state.tween.resume();
    else state.tween.pause();
  }, [inView]);

  const hold = (on) => {
    const state = autoplay.current;
    state.hold = on;
    if (!state.tween) return;
    if (on) state.tween.pause();
    else if (state.visible) state.tween.resume();
  };

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const name = SplitText.create('.hero-name', { type: 'chars' });
      nameChars.current = name.chars;

      intro.current = gsap
        .timeline({ paused: true, defaults: { ease: 'expo.out' } })
        .from('.hero-canvas', { autoAlpha: 0, duration: 2 }, 0)
        .from('.hero-badge', { y: 20, autoAlpha: 0, filter: 'blur(8px)', duration: 1 }, 0)
        .from(
          name.chars,
          { yPercent: 70, autoAlpha: 0, filter: 'blur(16px)', rotateX: -60, duration: 1.4, stagger: 0.035 },
          0.1,
        )
        .from('.hero-fade', { y: 22, autoAlpha: 0, filter: 'blur(10px)', duration: 1.1, stagger: 0.08 }, 0.5)
        .from('.hud-shell', { x: 40, autoAlpha: 0, filter: 'blur(10px)', duration: 1.2 }, 0.7)
        .from('.hud-row', { x: 24, autoAlpha: 0, duration: 0.9, stagger: 0.07 }, 0.85)
        .call(() => setFormation(0), null, 1)
        .call(() => {
          proximityOn.current = true;
        });

      // Scrolling away: content drifts up and fades, the formation sinks and grows.
      const scrub = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero-content, .hero-hud', { yPercent: -16, autoAlpha: 0, ease: 'none', scrollTrigger: scrub });
      gsap.to('.hero-canvas-drift', { yPercent: 24, ease: 'none', scrollTrigger: scrub });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (ready && intro.current) gsap.delayedCall(introDelay(), () => intro.current?.play());
    },
    { dependencies: [ready], scope: root },
  );

  // Letters of the name swell in weight as the cursor gets close (Geist is a variable font).
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const section = root.current;
    const BASE = 600;
    const PEAK = 900;
    const RADIUS = 240;
    const weights = new Map();
    let pointer = null;
    let frame = 0;

    const tick = () => {
      frame = 0;
      const chars = nameChars.current;
      if (!proximityOn.current || !chars.length) return;
      const rects = chars.map((c) => c.getBoundingClientRect());
      let settling = false;
      chars.forEach((char, i) => {
        let target = BASE;
        if (pointer) {
          const r = rects[i];
          const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2));
          const f = Math.max(0, 1 - d / RADIUS);
          target = BASE + (PEAK - BASE) * f * f * (3 - 2 * f);
        }
        const current = weights.get(char) ?? BASE;
        const next = current + (target - current) * 0.2;
        if (Math.abs(target - next) > 0.5) settling = true;
        weights.set(char, next);
        char.style.fontWeight = String(Math.round(next));
      });
      if (settling) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (e) => {
      pointer = { x: e.clientX, y: e.clientY };
      schedule();
    };
    const onLeave = () => {
      pointer = null;
      schedule();
    };

    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const toWork = (e) => {
    e.preventDefault();
    scrollToTarget(lenis, '#work');
  };

  const active = Math.max(formation, 0);

  return (
    <section
      ref={root}
      id="top"
      onPointerMove={onPointerMove}
      className="relative flex min-h-dvh flex-col overflow-hidden px-gutter pb-6 pt-24 md:pb-8"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="hero-grid absolute inset-0" />
        <div className="absolute -right-[15%] -top-[25%] size-[70vmax] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_60%)]" />
        <motion.div
          style={{ x: springX, y: springY }}
          className="absolute -left-[260px] -top-[260px] size-[520px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_65%)]"
        />
        <div className="hero-canvas-drift absolute inset-0">
          <div className="hero-canvas absolute inset-0">
            <Suspense fallback={null}>
              <HeroCanvas formation={formation} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="hero-content relative z-10 my-auto grid py-10 lg:grid-cols-12">
        <div className="flex flex-col items-start lg:col-span-7">
          <p className="hero-badge relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-line bg-surface/60 py-1.5 pl-1.5 pr-4 text-[13px] text-muted backdrop-blur-md">
            <span className="grid size-6 place-items-center rounded-full bg-signal/15">
              <span className="live-dot" aria-hidden="true" />
            </span>
            <span>
              {profile.role} at <span className="font-medium text-fg">{profile.company}</span>
            </span>
            <span className="badge-shine" aria-hidden="true" />
          </p>

          <h1 className="hero-name mt-6 text-[clamp(3rem,7.4vw,7.25rem)] font-semibold leading-[0.95] tracking-[-0.055em] [perspective:900px]">
            Vansh Narula<span className="text-accent">.</span>
          </h1>

          <div className="mt-5">
            <p className="hero-fade text-[clamp(1.05rem,1.45vw,1.3rem)] tracking-[-0.015em] text-muted">
              Full-stack MERN developer, building
            </p>
            <p className="hero-fade font-serif text-[clamp(2.2rem,4.4vw,4.1rem)] italic leading-[1.02] text-accent-ink">
              <span className="sr-only">
                payment flows, role-based systems, real-time features and cloud deployments
              </span>
              <span aria-hidden="true">
                <TextLoop index={formation} />
              </span>
            </p>
            <p className="hero-fade text-[clamp(1.05rem,1.45vw,1.3rem)] tracking-[-0.015em] text-muted">
              for production — from schema to cloud.
            </p>
          </div>

          <div className="hero-fade mt-9 flex flex-wrap items-center gap-3">
            <Button href="#work" onClick={toWork} icon={ArrowDown} dir="down">
              See the work
            </Button>
            <Button href={profile.resume} download variant="ghost" icon={Download} dir="down">
              Résumé
            </Button>
          </div>

          <div className="hero-fade mt-8 flex w-full max-w-xs gap-2 lg:hidden" role="group" aria-label="Formations">
            {FORMATIONS.map((f, i) => (
              <button
                key={f.label}
                type="button"
                onClick={() => setFormation(i)}
                aria-label={f.label}
                aria-pressed={formation === i}
                className="flex h-9 flex-1 items-center"
              >
                <span className="relative h-[3px] w-full overflow-hidden rounded-full bg-line">
                  {formation === i && (
                    <motion.span className="absolute inset-0 origin-left rounded-full bg-accent" style={{ scaleX: progress }} />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className="hero-hud absolute bottom-24 right-[var(--gutter)] z-10 hidden w-[20.5rem] lg:block"
        onPointerEnter={() => hold(true)}
        onPointerLeave={() => hold(false)}
      >
        <div className="hud-shell rounded-[22px] border border-line bg-bg/45 p-2 shadow-[0_24px_60px_-30px_var(--shadow)] backdrop-blur-xl">
          <div className="flex items-center justify-between px-3 pb-2 pt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            <span>What I build</span>
            <span className="flex items-center gap-2">
              <span className="live-dot" aria-hidden="true" />
              <span className="tabular-nums text-fg">{String(active + 1).padStart(2, '0')}</span> /{' '}
              {String(FORMATIONS.length).padStart(2, '0')}
            </span>
          </div>
          <ul role="group" aria-label="Particle formations">
            {FORMATIONS.map((f, i) => {
              const on = formation === i;
              const Icon = f.icon;
              return (
                <li key={f.label} className="hud-row">
                  <button
                    type="button"
                    onPointerEnter={() => setFormation(i)}
                    onClick={() => setFormation(i)}
                    aria-pressed={on}
                    className={cn(
                      'relative isolate flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-300',
                      on ? 'text-fg' : 'text-muted hover:text-fg',
                    )}
                  >
                    {on && <motion.span layoutId="hud-active" className="absolute inset-0 -z-10 rounded-2xl bg-surface-2" transition={SPRING} />}
                    <span
                      className={cn(
                        'grid size-8 shrink-0 place-items-center rounded-xl border transition-colors duration-300',
                        on ? 'border-accent bg-accent text-on-accent' : 'border-line',
                      )}
                    >
                      <Icon className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium tracking-[-0.01em]">{f.label}</span>
                      <span className="block truncate font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{f.meta}</span>
                    </span>
                    <span className="font-mono text-[10px] text-muted">0{i + 1}</span>
                    {on && (
                      <span className="absolute inset-x-3 bottom-1 h-px overflow-hidden rounded-full bg-line" aria-hidden="true">
                        <motion.span className="block h-full origin-left bg-accent" style={{ scaleX: progress }} />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="hero-fade relative z-10 flex items-end justify-between gap-6">
        <div className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-muted">
          <p>Based in {profile.location}</p>
          <p>
            <LocalClock /> IST · {profile.coords}
          </p>
        </div>
        <a
          href="#work"
          onClick={toWork}
          className="group hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-fg md:flex"
        >
          Scroll to explore
          <span className="flex h-9 w-[22px] justify-center rounded-full border border-line pt-2 transition-colors group-hover:border-accent">
            <span className="mouse-dot block h-1.5 w-[3px] rounded-full bg-accent" />
          </span>
        </a>
      </div>
    </section>
  );
}
