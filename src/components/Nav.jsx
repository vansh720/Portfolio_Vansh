import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { navLinks, profile } from '../data/content';
import { useActiveSection } from '../hooks/useActiveSection';
import { cn, EASE, EASE_OUT, scrollToTarget } from '../lib/utils';
import { Asterisk, Button, LocalClock, RollText } from './ui';

const SECTION_IDS = navLinks.map((l) => l.id);
const SPRING = { type: 'spring', stiffness: 420, damping: 34 };

export default function Nav() {
  const { lenis, ready, menuOpen, setMenuOpen, theme, toggleTheme } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';
  const active = useActiveSection(SECTION_IDS, onHome);

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(null);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 480);
    setScrolled(y > 24);
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

  const solid = scrolled || menuOpen;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4"
        initial={{ y: '-130%' }}
        animate={{ y: !ready || (hidden && !menuOpen) ? '-130%' : '0%' }}
        transition={{ duration: 0.7, ease: EASE, delay: ready && !scrolled ? 0.5 : 0 }}
      >
        <nav
          aria-label="Primary"
          className={cn(
            'mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full border pl-4 pr-1.5 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 md:pl-5',
            solid
              ? 'border-line bg-bg/70 shadow-[0_12px_40px_-14px_var(--shadow)] backdrop-blur-xl'
              : 'border-transparent bg-transparent',
          )}
        >
          <Link to="/" onClick={goHome} className="group flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.02em]">
            <span className="grid size-7 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-700 group-hover:rotate-180">
              <Asterisk className="size-3.5" />
            </span>
            <RollText>Vansh Narula</RollText>
          </Link>

          <ul className="hidden items-center lg:flex" onPointerLeave={() => setHovered(null)}>
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`/#${link.id}`}
                    onClick={(e) => goTo(e, link.id)}
                    onPointerEnter={() => setHovered(link.id)}
                    onFocus={() => setHovered(link.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={cn(
                      'relative flex h-10 items-center rounded-full px-4 text-sm transition-colors duration-300',
                      isActive || hovered === link.id ? 'text-fg' : 'text-muted',
                    )}
                  >
                    {hovered === link.id && (
                      <motion.span layoutId="nav-hover" className="absolute inset-0 -z-10 rounded-full bg-surface-2" transition={SPRING} />
                    )}
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute bottom-1 left-[calc(50%-2px)] size-1 rounded-full bg-accent"
                        transition={SPRING}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <p className="mr-2 hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted xl:flex">
              <span className="live-dot" aria-hidden="true" />
              <LocalClock /> IST
            </p>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="relative grid size-10 place-items-center overflow-hidden rounded-full border border-line transition-colors hover:border-fg/40"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ y: 18, rotate: -90, opacity: 0 }}
                  animate={{ y: 0, rotate: 0, opacity: 1 }}
                  exit={{ y: -18, rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                >
                  {theme === 'dark' ? <Sun className="size-4" strokeWidth={1.75} /> : <Moon className="size-4" strokeWidth={1.75} />}
                </motion.span>
              </AnimatePresence>
            </button>
            <Button
              href="/#contact"
              onClick={(e) => goTo(e, 'contact')}
              size="sm"
              magnetic={false}
              className="hidden sm:inline-flex"
            >
              Let’s talk
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="grid size-10 place-items-center rounded-full bg-fg text-bg lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuOpen ? 'close' : 'open'}
                  initial={{ scale: 0.4, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.4, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.25 }}
                >
                  {menuOpen ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>{menuOpen && <MobileMenu onNavigate={goTo} active={active} />}</AnimatePresence>
    </>
  );
}

function MobileMenu({ onNavigate, active }) {
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
      initial={{ clipPath: 'circle(0% at 92% 5%)' }}
      animate={{ clipPath: 'circle(150% at 92% 5%)' }}
      exit={{ clipPath: 'circle(0% at 92% 5%)', transition: { duration: 0.55, ease: EASE } }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Menu</p>
      <ul className="mt-4 flex flex-col">
        {navLinks.map((link, i) => (
          <li key={link.id} className="overflow-hidden border-b border-line">
            <motion.a
              ref={i === 0 ? firstLink : undefined}
              href={`/#${link.id}`}
              onClick={(e) => onNavigate(e, link.id)}
              className="flex items-center justify-between py-4 text-[clamp(1.75rem,8vw,2.75rem)] font-semibold leading-none tracking-[-0.04em]"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '110%', opacity: 0, transition: { duration: 0.25 } }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 + i * 0.05 }}
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-xs font-normal tracking-normal text-accent-ink">0{i + 1}</span>
                {link.label}
              </span>
              {active === link.id && <span className="size-2 rounded-full bg-accent" aria-hidden="true" />}
            </motion.a>
          </li>
        ))}
      </ul>

      <motion.div
        className="mt-auto flex flex-col gap-1 pt-8 text-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.6, ease: EASE_OUT } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        <a href={`mailto:${profile.email}`} className="flex min-h-11 items-center justify-between">
          {profile.email} <ArrowUpRight className="size-4" />
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-between">
          LinkedIn <ArrowUpRight className="size-4" />
        </a>
        <p className="flex min-h-11 items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <span className="live-dot" aria-hidden="true" />
          Ambala <LocalClock /> IST
        </p>
      </motion.div>
    </motion.div>
  );
}
