import { useRef } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { projects } from '../data/content';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { gsap, useGSAP } from '../lib/gsap';
import { cn, EASE_OUT, scrollToTarget, trackPointer } from '../lib/utils';
import { Button, SectionLabel } from '../components/ui';
import { RevealText } from '../components/motion';
import ProjectVisual from '../components/visuals/ProjectVisual';

const HORIZONTAL_QUERY = '(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)';
const PANEL_COUNT = projects.length + 1;

const reveal = {
  initial: { opacity: 0, y: 48, filter: 'blur(10px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
  viewport: { once: true, margin: '0px 0px -8% 0px' },
  transition: { duration: 1, ease: EASE_OUT },
};

function ProjectPanel({ project, horizontal }) {
  return (
    <motion.article
      {...(horizontal ? {} : reveal)}
      onPointerMove={trackPointer}
      className={cn(
        'work-panel glow-card group relative flex shrink-0 flex-col overflow-hidden rounded-[28px] border border-line bg-surface',
        horizontal ? 'h-[min(60vh,600px)] w-[min(76vw,1100px)] flex-row' : 'w-full md:flex-row',
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
          horizontal ? 'w-[54%]' : 'aspect-[4/3] md:aspect-auto md:min-h-[400px] md:w-1/2',
        )}
      >
        <div className="work-visual-inner absolute inset-y-0 -left-[4%] w-[108%] px-[4%]">
          <div className="h-full w-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
            <ProjectVisual type={project.visual} />
          </div>
        </div>
        <span className="absolute left-4 top-4 rounded-full border border-line bg-bg/70 px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] text-fg backdrop-blur-md">
          {project.index} / {String(projects.length).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8 lg:p-9">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{project.kind}</p>
        <h3 className="mt-3 text-[clamp(1.6rem,2.4vw,2.35rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
          {project.title}
        </h3>
        <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-muted">{project.description}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-line bg-bg/40 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em]">
              {tag}
            </li>
          ))}
        </ul>

        <div className="pointer-events-none relative z-20 mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-7">
          <span className="inline-flex items-center gap-2 text-sm font-medium">
            Read case study
            <span className="grid size-7 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="size-3.5" />
            </span>
          </span>
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto inline-flex min-h-11 items-center gap-1 font-mono text-[11px] text-muted underline-offset-4 hover:text-accent-ink hover:underline"
            >
              {link.label}
              <ArrowUpRight className="size-3" aria-hidden="true" />
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
  const counter = useRef(null);

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
          onUpdate: (self) => {
            gsap.set(bar.current, { scaleX: self.progress });
            const index = Math.min(PANEL_COUNT, Math.floor(self.progress * PANEL_COUNT) + 1);
            counter.current.textContent = String(index).padStart(2, '0');
          },
        },
      });
      gsap.set(bar.current, { scaleX: 0 });

      // Panels grow and brighten as they slide in from the right.
      gsap.utils.toArray('.work-panel').forEach((panel) => {
        gsap.fromTo(
          panel,
          { scale: 0.86, opacity: 0.35, rotateY: -10, transformPerspective: 1400, transformOrigin: '0% 50%' },
          {
            scale: 1,
            opacity: 1,
            rotateY: 0,
            ease: 'none',
            scrollTrigger: { trigger: panel, containerAnimation: slide, start: 'left 105%', end: 'left 45%', scrub: true },
          },
        );
      });

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
            horizontal ? 'pb-8 pt-28' : 'pb-12 pt-24 md:pt-32',
          )}
        >
          <div>
            <SectionLabel index="02" title="Selected work" />
            <RevealText as="h2" className="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1] tracking-[-0.045em]">
              Shipped, live, <span className="font-serif font-normal italic text-accent-ink">in production.</span>
            </RevealText>
          </div>
          <div className={cn('w-64', !horizontal && 'hidden')} aria-hidden="true">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              <span>
                <span ref={counter} className="text-fg">
                  01
                </span>{' '}
                / {String(PANEL_COUNT).padStart(2, '0')}
              </span>
              <span className="flex items-center gap-2">
                Scroll <ArrowRight className="size-3.5" />
              </span>
            </div>
            <div className="mt-3 h-px bg-line">
              <div ref={bar} className="h-full origin-left bg-accent" />
            </div>
          </div>
        </div>

        <div
          ref={track}
          className={cn(
            'flex gap-5 px-gutter',
            horizontal ? 'w-max flex-1 flex-row items-center gap-6 pb-10' : 'flex-col pb-24 md:pb-32',
          )}
        >
          {projects.map((project) => (
            <ProjectPanel key={project.slug} project={project} horizontal={horizontal} />
          ))}

          <motion.div
            {...(horizontal ? {} : reveal)}
            className={cn(
              'work-panel relative flex shrink-0 flex-col justify-between gap-10 overflow-hidden rounded-[28px] bg-accent p-7 text-on-accent md:p-9',
              horizontal ? 'h-[min(60vh,600px)] w-[min(32vw,460px)]' : 'w-full',
            )}
          >
            <div
              aria-hidden="true"
              className="spin-slower pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full border border-on-accent/20"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 -right-10 size-44 rounded-full border border-on-accent/20"
            />
            <p className="font-mono text-[11px] uppercase tracking-[0.18em]">03 / What’s next</p>
            <p className="text-[clamp(2rem,3vw,3rem)] font-semibold leading-[1] tracking-[-0.045em]">
              Your product
              <br />
              <span className="font-serif font-normal italic">could be next.</span>
            </p>
            <div className="relative">
              <Button
                href="#contact"
                variant="ink"
                icon={ArrowRight}
                dir="right"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(lenis, '#contact');
                }}
              >
                Start a conversation
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
