import { useRef } from 'react';
import { Award } from 'lucide-react';
import { certifications, experience } from '../data/content';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { SectionLabel } from '../components/ui';

export default function Experience() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        '.tl-fill',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.tl-list', start: 'top 65%', end: 'bottom 65%', scrub: true } },
      );

      gsap.utils.toArray('.tl-item').forEach((item) => {
        gsap.from(item.querySelector('.tl-body'), {
          y: 50,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: item, start: 'top 85%' },
        });
        ScrollTrigger.create({ trigger: item, start: 'top 65%', toggleClass: { targets: item, className: 'is-on' } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experience" className="px-gutter py-24 md:py-36">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <SectionLabel index="04" title="Experience" />
          <h2 className="mt-5 font-display text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
            Training room
            <br />
            to <span className="font-serif font-normal italic text-accent-ink">production.</span>
          </h2>
          <p className="mt-6 max-w-[40ch] leading-relaxed text-muted">
            Structured MERN training, then a stipend internship, then a full-time role at Bexo.ai — all inside a year.
          </p>

          <div className="mt-10 rounded-3xl border border-line p-6">
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              <Award className="size-4 text-accent-ink" aria-hidden="true" /> Certifications
            </p>
            <ul className="mt-4 divide-y divide-line">
              {certifications.map((cert) => (
                <li key={cert.title} className="py-3">
                  <p className="font-semibold tracking-tight">{cert.title}</p>
                  <p className="text-sm text-muted">{cert.by}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="tl-list relative lg:col-span-7">
          <span aria-hidden="true" className="absolute bottom-3 left-[5px] top-3 w-px bg-line">
            <span className="tl-fill block h-full w-full origin-top bg-accent" />
          </span>
          <ol>
            {experience.map((item) => (
              <li key={`${item.role}-${item.period}`} className="tl-item relative pb-14 pl-10 last:pb-0">
                <span aria-hidden="true" className="tl-dot absolute left-0 top-1.5 size-[11px] rounded-full border border-line bg-bg" />
                <div className="tl-body">
                  <p className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                    {item.period}
                    {item.current && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-line px-2.5 py-1 text-fg">
                        <span className="live-dot" aria-hidden="true" /> Now
                      </span>
                    )}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold leading-tight tracking-[-0.035em]">
                    {item.role}
                  </h3>
                  <p className="mt-1 font-medium text-accent-ink">
                    {item.org} <span className="font-normal text-muted">· {item.place}</span>
                  </p>
                  {item.points.length > 0 && (
                    <ul className="mt-5 max-w-[62ch] space-y-3 leading-relaxed text-muted">
                      {item.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-accent" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
