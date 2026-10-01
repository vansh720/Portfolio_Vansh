import { useRef } from 'react';
import { Link, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { projects } from '../data/content';
import { usePageSetup } from '../hooks/usePageSetup';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { EASE_OUT } from '../lib/utils';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';
import Flows from '../components/Flows';
import ProjectVisual from '../components/visuals/ProjectVisual';
import { RollText, SectionLabel } from '../components/ui';
import NotFound from './NotFound';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.9, ease: EASE_OUT },
};

export default function CaseStudy() {
  const { slug } = useParams();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return <NotFound />;
  return <Study project={projects[index]} next={projects[(index + 1) % projects.length]} />;
}

function Study({ project, next }) {
  const { ready, introDelay } = useApp();
  const root = useRef(null);
  const intro = useRef(null);
  usePageSetup(`${project.title} — Case study · Vansh Narula`);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const split = SplitText.create('.cs-title', { type: 'words,chars', wordsClass: 'word' });
      intro.current = gsap
        .timeline({ paused: true, defaults: { ease: 'expo.out' } })
        .from(split.chars, { yPercent: 115, duration: 1.2, stagger: 0.025 })
        .from('.cs-fade', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.3);
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (ready && intro.current) gsap.delayedCall(introDelay(), () => intro.current?.play());
    },
    { dependencies: [ready], scope: root },
  );

  const meta = [
    { k: 'Type', v: project.kind },
    { k: 'Role', v: 'Full stack — design to deployment' },
    { k: 'Stack', v: project.stack.join(', ') },
  ];

  return (
    <PageTransition>
      <main ref={root} id="main" tabIndex={-1} className="outline-none">
        <header className="px-gutter pb-14 pt-28 md:pt-36">
          <Link
            to="/#work"
            className="cs-fade group inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted hover:text-fg"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <RollText>All work</RollText>
          </Link>

          <SectionLabel index={project.index} title="Case study" className="cs-fade mt-10" />
          <h1 className="cs-title mt-6 font-display text-[clamp(2.75rem,10vw,10.5rem)] font-bold uppercase leading-[0.86] tracking-[-0.055em] [&_.word]:overflow-hidden [&_.word]:pb-[0.05em]">
            {project.title}
          </h1>
          <p className="cs-fade mt-8 max-w-[34ch] font-serif text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.12]">
            {project.tagline}
          </p>

          <dl className="cs-fade mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {meta.map((m) => (
              <div key={m.k} className="bg-bg p-6">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{m.k}</dt>
                <dd className="mt-2 font-medium leading-snug">{m.v}</dd>
              </div>
            ))}
            <div className="bg-bg p-6">
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Live</dt>
              <dd className="mt-2 flex flex-col gap-1">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 break-all font-medium text-accent-ink underline-offset-4 hover:underline"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </header>

        <motion.div {...fadeUp} className="px-gutter">
          <div className="relative h-[clamp(360px,62vw,680px)] overflow-hidden rounded-[28px] border border-line bg-surface-2">
            <ProjectVisual type={project.visual} />
          </div>
        </motion.div>

        <section className="grid gap-8 px-gutter py-24 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel index="A" title="Overview" />
          </div>
          <motion.p
            {...fadeUp}
            className="font-display text-[clamp(1.5rem,2.8vw,2.6rem)] font-medium leading-[1.15] tracking-[-0.03em] lg:col-span-8"
          >
            {project.overview}
          </motion.p>
        </section>

        <section className="px-gutter pb-24 md:pb-32">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionLabel index="B" title="What I built" />
            </div>
            <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:col-span-8">
              {project.highlights.map((h, i) => (
                <motion.li
                  key={h.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: (i % 2) * 0.08 }}
                  className="flex flex-col gap-3 bg-bg p-6 md:p-8 md:odd:last:col-span-2"
                >
                  <span className="font-mono text-xs text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">{h.title}</h3>
                  <p className="leading-relaxed text-muted">{h.body}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-gutter pb-24 md:pb-32">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionLabel index="C" title="How it flows" />
              <p className="mt-5 max-w-[32ch] text-muted">The main paths data takes through the system.</p>
            </div>
            <div className="lg:col-span-8">
              <Flows flows={project.flows} />
            </div>
          </div>
        </section>

        <section className="px-gutter pb-16">
          <Link
            to={`/work/${next.slug}`}
            data-cursor="view"
            data-cursor-label="Next"
            className="group block rounded-[28px] border border-line bg-surface p-8 transition-colors hover:bg-accent hover:text-on-accent md:p-12"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted transition-colors group-hover:text-on-accent">
              Next case study · {next.index}
            </p>
            <p className="mt-6 flex items-end justify-between gap-6 font-display text-[clamp(2.5rem,7vw,7rem)] font-bold uppercase leading-[0.88] tracking-[-0.055em]">
              {next.title}
              <ArrowUpRight className="size-[0.7em] shrink-0 transition-transform duration-500 group-hover:rotate-45" />
            </p>
          </Link>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
