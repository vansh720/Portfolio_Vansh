import { useRef } from 'react';
import { motion } from 'motion/react';
import { SiDocker, SiExpress, SiFirebase, SiGithub, SiJavascript, SiMongodb, SiNodedotjs, SiRazorpay, SiReact, SiRedis } from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { TbBrandTwilio } from 'react-icons/tb';
import { Binary, Braces, Database, ShieldCheck } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { cn, EASE_OUT } from '../lib/utils';
import { SectionLabel } from '../components/ui';

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

function Card({ className, children, index }) {
  return (
    <motion.div
      className={cn('bento flex flex-col overflow-hidden rounded-[28px] border border-line bg-surface p-6 md:p-8', className)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: index * 0.07 }}
    >
      {children}
    </motion.div>
  );
}

function CardTitle({ children }) {
  return <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{children}</h3>;
}

export default function Stack() {
  const root = useRef(null);

  const onPointerMove = (e) => {
    const card = e.target.closest('.bento');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

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
    <section ref={root} id="stack" className="px-gutter py-24 md:py-36">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionLabel index="03" title="Stack" />
          <h2 className="mt-5 font-display text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
            One language, <span className="font-serif font-normal italic text-accent-ink">every layer.</span>
          </h2>
        </div>
        <p className="max-w-[40ch] text-muted">
          JavaScript from the React interface to the Node workers — plus the cloud, payment and messaging pieces that
          turn an app into a product.
        </p>
      </div>

      <div onPointerMove={onPointerMove} className="mt-14 grid gap-4 md:grid-cols-6">
        <Card index={0} className="md:col-span-6 lg:col-span-4">
          <div className="flex items-start justify-between gap-4">
            <CardTitle>Languages & frameworks</CardTitle>
            <p className="flex items-center gap-2 text-sm text-muted">
              <SiJavascript className="size-4 text-accent-ink" aria-hidden="true" /> JavaScript, front to back
            </p>
          </div>
          <p className="mt-4 max-w-[24ch] font-display text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-[1] tracking-[-0.04em]">
            The MERN core, end to end.
          </p>
          <ul className="mt-10 grid flex-1 grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
            {MERN.map(({ letter, name, role, icon: Icon }) => (
              <li key={name} className="group/l flex flex-col bg-surface p-5">
                <span
                  className="hollow font-display text-[clamp(4.5rem,11vw,10rem)] font-bold leading-[0.85] tracking-[-0.06em] transition-colors duration-500 group-hover/l:text-accent"
                  aria-hidden="true"
                >
                  {letter}
                </span>
                <span className="mt-auto pt-6">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span className="mt-3 font-semibold">{name}</span>
                <span className="text-sm text-muted">{role}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card index={1} className={GROUPS[0].className}>
          <CardTitle>{GROUPS[0].title}</CardTitle>
          <SkillList items={GROUPS[0].items} />
        </Card>

        {GROUPS.slice(1).map((group, i) => (
          <Card key={group.key} index={i + 2} className={group.className}>
            <CardTitle>{group.title}</CardTitle>
            <SkillList items={group.items} />
          </Card>
        ))}

        <Card index={4} className="terminal bg-[#0c0b09]! text-[#ece5d8] md:col-span-3 lg:col-span-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#ff5a1f]" />
            <span className="size-2.5 rounded-full bg-[#ece5d8]/30" />
            <span className="size-2.5 rounded-full bg-[#ece5d8]/30" />
            <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#a8a091]">deploy.sh</span>
          </div>
          <pre className="mt-6 overflow-x-auto font-mono text-[12.5px] leading-[1.9]">
            {TERMINAL.map((line, i) => (
              <span key={i} className="term-line block w-fit whitespace-pre">
                {line.prompt ? <span className="text-[#ff6a33]">$ </span> : null}
                <span className={line.prompt ? undefined : 'text-[#d9f24a]'}>{line.text}</span>
              </span>
            ))}
            <span className="caret mt-1" aria-hidden="true" />
          </pre>
        </Card>
      </div>
    </section>
  );
}

function SkillList({ items }) {
  return (
    <ul className="mt-6 flex flex-col divide-y divide-line">
      {items.map(({ name, icon: Icon }) => (
        <li key={name} className="flex items-center gap-4 py-3.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-bg">
            <Icon className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="font-medium tracking-tight">{name}</span>
        </li>
      ))}
    </ul>
  );
}
