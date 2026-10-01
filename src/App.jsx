import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { AppContext } from './context/AppContext';
import { useLenisSetup } from './hooks/useLenis';
import { useTheme } from './hooks/useTheme';
import Preloader from './components/Preloader';
import Nav from './components/Nav';
import Cursor from './components/Cursor';
import ScrollProgress from './components/ScrollProgress';
import Home from './pages/Home';
import CaseStudy from './pages/CaseStudy';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <Shell />
      </MotionConfig>
    </BrowserRouter>
  );
}

function Shell() {
  const location = useLocation();
  const lenis = useLenisSetup();
  const [theme, toggleTheme] = useTheme();
  const [ready, setReady] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Pages entering after a route change wait for the curtain before animating in.
  const prevPath = useRef(location.pathname);
  const navigated = useRef(false);
  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      navigated.current = true;
      prevPath.current = location.pathname;
      setMenuOpen(false);
    }
  }, [location.pathname]);
  const introDelay = useCallback(() => (navigated.current ? 0.45 : 0), []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  const locked = !ready || menuOpen;
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', locked);
    if (!lenis) return;
    if (locked) lenis.stop();
    else lenis.start();
  }, [locked, lenis]);

  const handleReveal = useCallback(() => setReady(true), []);
  const handleLoaderDone = useCallback(() => setLoaderGone(true), []);

  const onExitComplete = () => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  };

  const value = useMemo(
    () => ({ ready, lenis, theme, toggleTheme, menuOpen, setMenuOpen, introDelay }),
    [ready, lenis, theme, toggleTheme, menuOpen, introDelay],
  );

  return (
    <AppContext.Provider value={value}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <Nav />
      <AnimatePresence mode="wait" initial={false} onExitComplete={onExitComplete}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Cursor />
      {!loaderGone && <Preloader onReveal={handleReveal} onDone={handleLoaderDone} />}
      <div className="grain" aria-hidden="true" />
    </AppContext.Provider>
  );
}
