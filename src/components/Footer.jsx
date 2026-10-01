import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { navLinks, profile } from '../data/content';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { scrollToTarget } from '../lib/utils';
import { Button, LocalClock, RollText } from './ui';

const SOCIALS = [
  { label: 'LinkedIn', href: profile.linkedin, external: true },
  { label: 'Email', href: `mailto:${profile.email}` },
  { label: 'Résumé', href: profile.resume, download: true },
];

/**
 * Sits underneath the page: the content above lifts away to reveal it,
 * while the oversized wordmark fills with ember as you reach the end.
 */
export default function Footer() {
  const root = useRef(null);
  const { lenis } = useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const page = root.current.previousElementSibling;
      const scrub = { trigger: page, start: 'bottom bottom', end: 'max', scrub: true };
      gsap.fromTo('.footer-fill', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: scrub });
      gsap.fromTo('.footer-inner', { yPercent: -30, opacity: 0.2 }, { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: scrub });
    },
    { scope: root },
  );

  const goTo = (e, id) => {
    e.preventDefault();
    if (pathname === '/') scrollToTarget(lenis, `#${id}`);
    else navigate(`/#${id}`);
  };

  return (
    <footer ref={root} className="footer-reveal z-0 overflow-hidden bg-surface">
      <div className="footer-inner px-gutter pb-6 pt-16 md:pt-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Have something in mind?</p>
            <p className="mt-4 max-w-[18ch] text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
              Let’s build something <span className="font-serif font-normal italic text-accent-ink">that ships.</span>
            </p>
            <div className="mt-7">
              <Button href={`mailto:${profile.email}`}>Get in touch</Button>
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-6 md:grid-cols-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Sitemap</p>
              <ul className="mt-4 space-y-1">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a href={`/#${link.id}`} onClick={(e) => goTo(e, link.id)} className="group inline-flex min-h-9 items-center text-[15px]">
                      <RollText>{link.label}</RollText>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Elsewhere</p>
              <ul className="mt-4 space-y-1">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.external ? '_blank' : undefined}
                      rel={s.external ? 'noreferrer' : undefined}
                      download={s.download || undefined}
                      className="group inline-flex min-h-9 items-center gap-1.5 text-[15px]"
                    >
                      <RollText>{s.label}</RollText>
                      <ArrowUpRight className="size-3.5 text-muted transition-transform duration-500 group-hover:rotate-45" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Local time</p>
              <p className="mt-4 flex items-center gap-2 text-[15px]">
                <span className="live-dot" aria-hidden="true" />
                <LocalClock /> IST
              </p>
              <p className="mt-1 text-[13px] text-muted">{profile.location}</p>
              <button
                type="button"
                onClick={() => scrollToTarget(lenis, 0)}
                className="group mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm transition-colors hover:border-fg/40"
              >
                <RollText>Back to top</RollText>
                <ArrowUp className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </nav>
        </div>

        <div className="relative mt-16 select-none md:mt-20" aria-hidden="true">
          <p className="hollow whitespace-nowrap text-[15.6vw] font-semibold leading-[0.8] tracking-[-0.06em]">Vansh Narula</p>
          <p className="footer-fill absolute inset-0 whitespace-nowrap text-[15.6vw] font-semibold leading-[0.8] tracking-[-0.06em] text-accent">
            Vansh Narula
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-line pt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted md:flex-row md:justify-between">
          <span>© 2026 Vansh Narula</span>
          <span>Built with React · GSAP · Motion · Three.js</span>
        </div>
      </div>
    </footer>
  );
}
