import { Fragment, useRef } from 'react';
import { SiDocker, SiExpress, SiFirebase, SiGithub, SiMongodb, SiNodedotjs, SiRazorpay, SiReact, SiRedis } from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { TbBrandTwilio } from 'react-icons/tb';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { Asterisk } from './ui';

const PHRASES = ['Full stack', 'MERN', 'Payments', 'Role-based access', 'Real-time', 'Cloud deploys'];

const LOGOS = [
  { name: 'MongoDB', icon: SiMongodb },
  { name: 'Express', icon: SiExpress },
  { name: 'React', icon: SiReact },
  { name: 'Node.js', icon: SiNodedotjs },
  { name: 'AWS', icon: FaAws },
  { name: 'Docker', icon: SiDocker },
  { name: 'Redis', icon: SiRedis },
  { name: 'Razorpay', icon: SiRazorpay },
  { name: 'Twilio', icon: TbBrandTwilio },
  { name: 'Firebase', icon: SiFirebase },
  { name: 'GitHub', icon: SiGithub },
];

function PhraseRow({ hidden }) {
  return (
    <div className="flex shrink-0 items-center gap-6 pr-6 md:gap-9 md:pr-9" aria-hidden={hidden || undefined}>
      {PHRASES.map((phrase, i) => (
        <Fragment key={phrase}>
          <span
            className={
              i % 2
                ? 'whitespace-nowrap font-serif text-[clamp(1.6rem,3.6vw,3rem)] italic leading-none'
                : 'whitespace-nowrap text-[clamp(1.4rem,3.2vw,2.75rem)] font-semibold leading-none tracking-[-0.04em]'
            }
          >
            {phrase}
          </span>
          <Asterisk className="size-[clamp(1rem,2vw,1.6rem)] shrink-0" />
        </Fragment>
      ))}
    </div>
  );
}

function LogoRow({ hidden }) {
  return (
    <ul className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={hidden || undefined}>
      {LOGOS.map(({ name, icon: Icon }) => (
        <li
          key={name}
          className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-surface/50 px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-fg"
        >
          <Icon className="size-4" aria-hidden="true" />
          {name}
        </li>
      ))}
    </ul>
  );
}

/** An ember band and a logo strip scrolling in opposite directions; scroll speed pushes and leans them. */
export default function Marquee() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const tracks = gsap.utils.toArray('.mq-track');
      const tweens = tracks.map((track, i) =>
        i % 2 === 0
          ? gsap.fromTo(track, { xPercent: 0 }, { xPercent: -50, duration: 36, ease: 'none', repeat: -1 })
          : gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: 44, ease: 'none', repeat: -1 }),
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
        const target = direction * (1 + Math.min(Math.abs(dy) * 0.2, 4));
        speed += (target - speed) * 0.08;
        tweens.forEach((t) => t.timeScale(speed));
        skew += (gsap.utils.clamp(-5, 5, -dy * 0.25) - skew) * 0.12;
        gsap.set(skewTargets, { skewX: skew });
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Technologies I work with" className="relative overflow-hidden py-14 md:py-20">
      <p className="sr-only">{LOGOS.map((l) => l.name).join(', ')}</p>
      <div className="-mx-4 -rotate-[1.5deg] bg-accent py-3.5 text-on-accent md:py-5" aria-hidden="true">
        <div className="mq-skew">
          <div className="mq-track flex w-max">
            <PhraseRow />
            <PhraseRow hidden />
          </div>
        </div>
      </div>
      <div className="mask-x mt-8 md:mt-10" aria-hidden="true">
        <div className="mq-skew">
          <div className="mq-track flex w-max">
            <LogoRow />
            <LogoRow hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
