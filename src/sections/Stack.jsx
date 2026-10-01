import { useRef } from 'react';
import { SiDocker, SiExpress, SiFirebase, SiGithub, SiJavascript, SiMongodb, SiNodedotjs, SiRazorpay, SiReact, SiRedis } from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { TbBrandTwilio } from 'react-icons/tb';
import { Binary, Braces, Database, ShieldCheck } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { cn } from '../lib/utils';
import { SectionLabel } from '../components/ui';
import { Reveal, RevealText, TiltCard } from '../components/motion';

const MERN = [
  { letter: 'M', name: 'MongoDB', role: 'Schemas & data', icon: SiMongodb },
  { letter: 'E', name: 'Express.js', role: 'REST APIs', icon: SiExpress },
  { letter: 'R', name: 'React.js', role: 'Interfaces', icon: SiReact },
  { letter: 'N', name: 'Node.js', role: 'Runtime & workers', icon: SiNodedotjs },
];

const GROUPS = [
  {
    key: 'cloud',
    title: 'Cloud & DevOps',
    className: 'md:col-span-3 lg:col-span-2',
    items: [
      { name: 'AWS EC2', icon: FaAws },
      { name: 'AWS S3', icon: FaAws },
      { name: 'Docker', icon: SiDocker },
      { name: 'Firebase', icon: SiFirebase },
    ],
  },
  {
    key: 'integrations',
    title: 'Backend & integrations',
    className: 'md:col-span-3 lg:col-span-2',
    items: [
      { name: 'REST APIs', icon: Braces },
      { name: 'Redis queues', icon: SiRedis },
      { name: 'Razorpay + webhooks', icon: SiRazorpay },
      { name: 'Twilio SMS', icon: TbBrandTwilio },
    ],
  },
  {
    key: 'foundations',
    title: 'Foundations',
    className: 'md:col-span-3 lg:col-span-2',
    items: [
      { name: 'Role-based access', icon: ShieldCheck },
      { name: 'Git & GitHub', icon: SiGithub },
      { name: 'SQL', icon: Database },
      { name: 'Data structures & algorithms', icon: Binary },
    ],
  },
];

const TERMINAL = [
  { prompt: true, text: 'git pull origin main && npm ci' },
  { prompt: true, text: 'docker compose up -d grammar-service' },
  { prompt: false, text: '✓ grammar-service is up' },
  { prompt: true, text: 'aws s3 sync ./uploads s3://media' },
  { prompt: false, text: '✓ shipped' },
];

const cardBase = 'flex flex-col overflow-hidden rounded-[24px] border border-line bg-surface p-6 md:p-7';

function CardTitle({ children }) {
  return <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{children}</h3>;
}

function SkillList({ items }) {
  return (
    <ul className="mt-5 flex flex-col divide-y divide-line">
      {items.map(({ name, icon: Icon }) => (
        <li key={name} className="group/s flex items-center gap-3.5 py-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-bg transition-colors duration-300 group-hover/s:border-accent group-hover/s:bg-accent group-hover/s:text-on-accent">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <span className="text-[15px] font-medium tracking-[-0.01em] transition-transform duration-500 group-hover/s:translate-x-1">
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Stack() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const lines = gsap.utils.toArray('.term-line');
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.terminal', start: 'top 80%' } });
      lines.forEach((line) => {
        const chars = line.textContent.length;
        tl.fromTo(
          line,
          { clipPath: 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: Math.max(0.25, chars * 0.025), ease: `steps(${chars})` },
          '+=0.15',
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="stack" className="px-gutter py-24 md:py-32">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionLabel index="03" title="Stack" />
          <RevealText as="h2" className="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1] tracking-[-0.045em]">
            One language, <span className="font-serif font-normal italic text-accent-ink">every layer.</span>
          </RevealText>
        </div>
        <Reveal as="p" delay={0.15} className="max-w-[40ch] text-[15px] leading-relaxed text-muted">
          JavaScript from the React interface to the Node workers — plus the cloud, payment and messaging pieces that
          turn an app into a product.
        </Reveal>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-6">
        <TiltCard max={3} className={cn(cardBase, 'md:col-span-6 lg:col-span-4')}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <CardTitle>Languages & frameworks</CardTitle>
            <p className="flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs text-muted">
              <SiJavascript className="size-3.5 text-accent-ink" aria-hidden="true" /> JavaScript, front to back
            </p>
          </div>
          <p className="mt-3 text-[clamp(1.4rem,2.2vw,2rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
            The MERN core, end to end.
          </p>
          <ul className="mt-8 grid flex-1 grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
            {MERN.map(({ letter, name, role, icon: Icon }) => (
              <li key={name} className="group/l relative flex flex-col bg-surface p-5 transition-colors duration-500 hover:bg-surface-2">
                <span
                  className="hollow text-[clamp(3.5rem,6.5vw,6rem)] font-bold leading-[0.85] tracking-[-0.06em] transition-[color,transform] duration-700 group-hover/l:-translate-y-1 group-hover/l:text-accent"
                  aria-hidden="true"
                >
                  {letter}
                </span>
                <span className="mt-auto pt-6">
                  <Icon className="size-5 transition-transform duration-700 group-hover/l:rotate-[360deg]" aria-hidden="true" />
                </span>
                <span className="mt-2.5 text-[15px] font-semibold tracking-[-0.01em]">{name}</span>
                <span className="text-[13px] text-muted">{role}</span>
              </li>
            ))}
          </ul>
        </TiltCard>

        {GROUPS.map((group, i) => (
          <TiltCard key={group.key} delay={0.08 * (i + 1)} className={cn(cardBase, group.className)}>
            <CardTitle>{group.title}</CardTitle>
            <SkillList items={group.items} />
          </TiltCard>
        ))}

        <TiltCard delay={0.32} className={cn(cardBase, 'terminal bg-[#0c0b09]! text-[#ece5d8] md:col-span-3 lg:col-span-2')}>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#ff5a1f]" />
            <span className="size-2.5 rounded-full bg-[#ece5d8]/30" />
            <span className="size-2.5 rounded-full bg-[#ece5d8]/30" />
            <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#a8a091]">deploy.sh</span>
          </div>
          <pre className="mt-6 overflow-x-auto font-mono text-[12px] leading-[1.95]">
            {TERMINAL.map((line, i) => (
              <span key={i} className="term-line block w-fit whitespace-pre">
                {line.prompt ? <span className="text-[#ff6a33]">$ </span> : null}
                <span className={line.prompt ? undefined : 'text-[#d9f24a]'}>{line.text}</span>
              </span>
            ))}
            <span className="caret mt-1" aria-hidden="true" />
          </pre>
        </TiltCard>
      </div>
    </section>
  );
}
