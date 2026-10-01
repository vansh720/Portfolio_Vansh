import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Menu, Moon, Sun, X, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { navLinks, profile } from '../data/content';
import { useActiveSection } from '../hooks/useActiveSection';
import { cn, EASE, scrollToTarget } from '../lib/utils';
import { Asterisk, LocalClock, RollText } from './ui';

const SECTION_IDS = navLinks.map((l) => l.id);

export default function Nav() {
  const { lenis, menuOpen, setMenuOpen, theme, toggleTheme } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';
  const active = useActiveSection(SECTION_IDS, onHome);

  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160);
  });

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, setMenuOpen]);

  const goTo = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    if (onHome) scrollToTarget(lenis, `#${id}`);
    else navigate(`/#${id}`);
  };

  const goHome = (e) => {
    setMenuOpen(false);
    if (onHome) {
      e.preventDefault();
      scrollToTarget(lenis, 0);
    }
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !menuOpen ? '-110%' : '0%' }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div className={cn('nav-fade pointer-events-none absolute inset-0 -z-10 transition-opacity', menuOpen && 'opacity-0')} />
        <nav aria-label="Primary" className="flex h-18 items-center justify-between gap-6 px-gutter">
          <Link
            to="/"
            onClick={goHome}
            className="group flex items-center gap-2.5 font-display text-[15px] font-semibold tracking-tight"
          >
            <Asterisk className="spin-slow size-4 text-accent" />
            <RollText>Vansh Narula</RollText>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link, i) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`/#${link.id}`}
                    onClick={(e) => goTo(e, link.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={cn(
                      'group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors',
                      isActive ? 'text-fg' : 'text-muted hover:text-fg',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-surface-2"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="font-mono text-[10px] text-accent-ink">0{i + 1}</span>
                    <RollText>{link.label}</RollText>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 md:gap-4">
            <p className="hidden items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:flex">
              <span className="live-dot" aria-hidden="true" />
              Ambala <LocalClock /> IST
            </p>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-fg"
            >
              {theme === 'dark' ? <Sun className="size-4" strokeWidth={1.75} /> : <Moon className="size-4" strokeWidth={1.75} />}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="grid size-11 place-items-center rounded-full bg-fg text-bg lg:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>{menuOpen && <MobileMenu onNavigate={goTo} />}</AnimatePresence>
    </>
  );
}

function MobileMenu({ onNavigate }) {
  const firstLink = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => firstLink.current?.focus({ preventScroll: true }), 350);
    return () => clearTimeout(id);
  }, []);

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-40 flex flex-col bg-surface px-gutter pb-8 pt-28 lg:hidden"
      initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.5, ease: EASE } }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <ul className="flex flex-col">
        {navLinks.map((link, i) => (
          <li key={link.id} className="overflow-hidden border-b border-line">
            <motion.a
              ref={i === 0 ? firstLink : undefined}
              href={`/#${link.id}`}
              onClick={(e) => onNavigate(e, link.id)}
              className="flex items-baseline gap-4 py-3 font-display text-[clamp(2.5rem,12vw,5rem)] font-semibold uppercase leading-none tracking-[-0.04em]"
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              exit={{ y: '110%', transition: { duration: 0.3 } }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.05 }}
            >
              <span className="font-mono text-xs font-normal tracking-normal text-accent-ink">0{i + 1}</span>
              {link.label}
            </motion.a>
          </li>
        ))}
      </ul>

      <motion.div
        className="mt-auto flex flex-col gap-3 pt-8 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.5 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        <a href={`mailto:${profile.email}`} className="flex items-center justify-between py-2">
          {profile.email} <ArrowUpRight className="size-4" />
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-between py-2">
          LinkedIn <ArrowUpRight className="size-4" />
        </a>
        <p className="flex items-center gap-2.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <span className="live-dot" aria-hidden="true" />
          Ambala <LocalClock /> IST
        </p>
      </motion.div>
    </motion.div>
  );
}
