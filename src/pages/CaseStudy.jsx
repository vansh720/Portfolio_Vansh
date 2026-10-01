import { useRef } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { projects } from '../data/content';
import { usePageSetup } from '../hooks/usePageSetup';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { PAGE_SHEET } from '../lib/utils';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';
import Flows from '../components/Flows';
import ProjectVisual from '../components/visuals/ProjectVisual';
import { RollText, SectionLabel } from '../components/ui';
import { Reveal, RevealText, TiltCard } from '../components/motion';
import NotFound from './NotFound';

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
      const title = SplitText.create('.cs-title', { type: 'chars' });
      intro.current = gsap
        .timeline({ paused: true, defaults: { ease: 'expo.out' } })
        .from(title.chars, { yPercent: 60, autoAlpha: 0, filter: 'blur(14px)', duration: 1.2, stagger: 0.028 })
        .from('.cs-fade', { y: 24, autoAlpha: 0, filter: 'blur(8px)', duration: 1, stagger: 0.08 }, 0.3)
        .fromTo(
          '.cs-hero-visual',
          { clipPath: 'inset(18% 8% 0% 8% round 28px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.6, ease: 'expo.inOut' },
          0.4,
        );

      gsap.to('.cs-hero-visual-inner', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: '.cs-hero-visual', start: 'top bottom', end: 'bottom top', scrub: true },
      });
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
      <div className={PAGE_SHEET}>
        <main ref={root} id="main" tabIndex={-1} className="outline-none">
          <header className="px-gutter pb-12 pt-28 md:pt-36">
            <Link
              to="/#work"
              className="cs-fade group inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm text-muted transition-colors hover:border-fg/40 hover:text-fg"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <RollText>All work</RollText>
            </Link>

            <SectionLabel index={project.index} title="Case study" className="cs-fade mt-10" />
            <h1 className="cs-title mt-5 max-w-[14ch] text-[clamp(2.5rem,6.4vw,6rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
              {project.title}
            </h1>
            <p className="cs-fade mt-6 max-w-[38ch] text-[clamp(1.15rem,1.8vw,1.5rem)] leading-[1.45] tracking-[-0.02em] text-muted">
              {project.tagline}
            </p>

            <dl className="cs-fade mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {meta.map((m) => (
                <div key={m.k} className="rounded-2xl border border-line bg-surface/50 p-5">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{m.k}</dt>
                  <dd className="mt-2 text-[15px] font-medium leading-snug">{m.v}</dd>
                </div>
              ))}
              <div className="rounded-2xl border border-line bg-surface/50 p-5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Live</dt>
                <dd className="mt-2 flex flex-col gap-1">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 break-all text-[15px] font-medium text-accent-ink underline-offset-4 hover:underline"
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

          <div className="px-gutter">
            <div className="cs-hero-visual relative h-[clamp(340px,56vw,620px)] overflow-hidden rounded-[28px] border border-line bg-surface-2">
              <div className="cs-hero-visual-inner absolute inset-x-0 -top-[8%] h-[116%]">
                <ProjectVisual type={project.visual} />
              </div>
            </div>
          </div>

          <section className="grid gap-8 px-gutter py-24 md:py-28 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionLabel index="A" title="Overview" />
            </div>
            <RevealText
              className="text-[clamp(1.3rem,2.2vw,2rem)] font-medium leading-[1.35] tracking-[-0.03em] lg:col-span-8"
              stagger={0.012}
            >
              {project.overview}
            </RevealText>
          </section>

          <section className="px-gutter pb-24 md:pb-28">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <SectionLabel index="B" title="What I built" />
              </div>
              <ol className="grid gap-3 md:grid-cols-2 lg:col-span-8">
                {project.highlights.map((h, i) => (
                  <TiltCard
                    as="li"
                    key={h.title}
                    max={4}
                    delay={(i % 2) * 0.08}
                    className="flex flex-col gap-3 rounded-[22px] border border-line bg-surface/60 p-6 md:odd:last:col-span-2"
                  >
                    <span className="grid size-8 place-items-center rounded-full bg-accent/15 font-mono text-[11px] text-accent-ink">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-lg font-semibold tracking-[-0.02em]">{h.title}</h3>
                    <p className="text-[15px] leading-relaxed text-muted">{h.body}</p>
                  </TiltCard>
                ))}
              </ol>
            </div>
          </section>

          <section className="px-gutter pb-24 md:pb-28">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <SectionLabel index="C" title="How it flows" />
                <Reveal as="p" className="mt-5 max-w-[32ch] text-[15px] text-muted">
                  The main paths data takes through the system.
                </Reveal>
              </div>
              <div className="lg:col-span-8">
                <Flows flows={project.flows} />
              </div>
            </div>
          </section>

          <section className="px-gutter pb-20">
            <Reveal>
              <Link
                to={`/work/${next.slug}`}
                data-cursor="view"
                data-cursor-label="Next"
                className="group relative block overflow-hidden rounded-[28px] border border-line bg-surface p-7 md:p-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100"
                />
                <span className="relative block font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors duration-500 group-hover:text-on-accent">
                  Next case study · {next.index}
                </span>
                <span className="relative mt-5 flex items-end justify-between gap-6 text-[clamp(1.9rem,4.4vw,4rem)] font-semibold leading-[1] tracking-[-0.05em] transition-colors duration-500 group-hover:text-on-accent">
                  {next.title}
                  <span className="grid size-[1.2em] shrink-0 place-items-center rounded-full border border-current transition-transform duration-700 group-hover:rotate-45">
                    <ArrowUpRight className="size-[0.55em]" />
                  </span>
                </span>
              </Link>
            </Reveal>
          </section>
        </main>
      </div>
      <Footer />
    </PageTransition>
  );
}
