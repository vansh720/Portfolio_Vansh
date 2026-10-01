import { useRef } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { projects } from '../data/content';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { gsap, useGSAP } from '../lib/gsap';
import { cn, EASE_OUT, scrollToTarget } from '../lib/utils';
import { Magnetic, RollText, SectionLabel } from '../components/ui';
import ProjectVisual from '../components/visuals/ProjectVisual';

const HORIZONTAL_QUERY = '(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)';

const reveal = {
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.9, ease: EASE_OUT },
};

function ProjectPanel({ project, horizontal }) {
  return (
    <motion.article
      {...reveal}
      className={cn(
        'work-panel group relative flex shrink-0 flex-col overflow-hidden rounded-[28px] border border-line bg-surface',
        horizontal ? 'h-[min(62vh,660px)] w-[min(80vw,1200px)] flex-row' : 'w-full md:flex-row',
      )}
    >
      <Link
        to={`/work/${project.slug}`}
        className="absolute inset-0 z-10 rounded-[28px]"
        data-cursor="view"
        data-cursor-label="Case study"
        aria-label={`Read the ${project.title} case study`}
      />

      <div
        className={cn(
          'relative overflow-hidden bg-surface-2',
          horizontal ? 'w-[55%]' : 'aspect-[4/3] md:aspect-auto md:min-h-[420px] md:w-1/2',
        )}
      >
        <div className="work-visual-inner absolute inset-y-0 -left-[4%] w-[108%] px-[4%]">
          <ProjectVisual type={project.visual} />
        </div>
        <span className="absolute left-5 top-5 rounded-full bg-bg/80 px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-fg backdrop-blur">
          {project.index} / {String(projects.length).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-9 lg:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{project.kind}</p>
        <h3 className="mt-4 font-display text-[clamp(2.25rem,4.2vw,4.25rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
          {project.title}
        </h3>
        <p className="mt-5 max-w-[46ch] leading-relaxed text-muted">{project.description}</p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em]">
              {tag}
            </li>
          ))}
        </ul>

        <div className="pointer-events-none relative z-20 mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
          <span className="inline-flex items-center gap-2 font-semibold">
            Read case study
            <ArrowUpRight className="size-5 text-accent-ink transition-transform duration-500 group-hover:rotate-45" />
          </span>
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto inline-flex min-h-11 items-center gap-1 font-mono text-xs text-muted underline-offset-4 hover:text-accent-ink hover:underline"
            >
              {link.label}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function Work() {
  const { lenis } = useApp();
  const horizontal = useMediaQuery(HORIZONTAL_QUERY);
  const section = useRef(null);
  const pin = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);

  useGSAP(
    () => {
      if (!horizontal) return;
      const distance = () => track.current.scrollWidth - window.innerWidth;

      const slide = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
        },
      });
      gsap.set(bar.current, { scaleX: 0 });

      gsap.utils.toArray('.work-visual-inner').forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: -3 },
          {
            xPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('.work-panel'),
              containerAnimation: slide,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );
      });
    },
    { scope: section, dependencies: [horizontal], revertOnUpdate: true },
  );

  return (
    <section ref={section} id="work" className="relative">
      <div ref={pin} className={cn('flex flex-col', horizontal && 'h-dvh overflow-hidden')}>
        <div
          className={cn(
            'flex flex-col gap-6 px-gutter lg:flex-row lg:items-end lg:justify-between',
            horizontal ? 'pb-8 pt-24' : 'pb-12 pt-24 md:pt-32',
          )}
        >
          <div>
            <SectionLabel index="02" title="Selected work" />
            <h2 className="mt-5 font-display text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
              Shipped, live, <span className="font-serif font-normal italic text-accent-ink">in production.</span>
            </h2>
          </div>
          <div className={cn('w-60', !horizontal && 'hidden')} aria-hidden="true">
            <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              <span>Keep scrolling</span>
              <ArrowRight className="size-4" />
            </div>
            <div className="mt-3 h-px bg-line">
              <div ref={bar} className="h-full origin-left bg-accent" />
            </div>
          </div>
        </div>

        <div
          ref={track}
          className={cn(
            'flex gap-6 px-gutter',
            horizontal ? 'w-max flex-1 flex-row items-center gap-8 pb-10' : 'flex-col pb-24 md:pb-32',
          )}
        >
          {projects.map((project) => (
            <ProjectPanel key={project.slug} project={project} horizontal={horizontal} />
          ))}

          <motion.div
            {...reveal}
            className={cn(
              'work-panel flex shrink-0 flex-col justify-between gap-10 rounded-[28px] bg-accent p-8 text-on-accent md:p-10',
              horizontal ? 'h-[min(62vh,660px)] w-[min(34vw,500px)]' : 'w-full',
            )}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em]">03 / What’s next</p>
            <p className="font-display text-[clamp(2.5rem,4vw,4.25rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              Your product
              <br />
              <span className="font-serif font-normal italic">could be next.</span>
            </p>
            <div>
              <Magnetic>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget(lenis, '#contact');
                  }}
                  className="btn btn-ink group"
                >
                  <RollText>Start a conversation</RollText>
                  <ArrowRight className="size-4" />
                </a>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
