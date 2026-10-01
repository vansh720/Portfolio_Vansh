import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { usePageSetup } from '../hooks/usePageSetup';
import { ScrollTrigger } from '../lib/gsap';
import { PAGE_SHEET, scrollToTarget } from '../lib/utils';
import PageTransition from '../components/PageTransition';
import Marquee from '../components/Marquee';
import Footer from '../components/Footer';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Work from '../sections/Work';
import Stack from '../sections/Stack';
import Experience from '../sections/Experience';
import Contact from '../sections/Contact';

export default function Home() {
  const { lenis } = useApp();
  const { hash } = useLocation();
  usePageSetup('Vansh Narula — Full Stack Developer (MERN)');

  // Arriving from another page with /#section: jump there once the pinned work
  // section has added its scroll distance and Lenis knows the new page height,
  // otherwise the jump is clamped to the previous page's limits.
  useEffect(() => {
    if (!hash) return;
    const id = setTimeout(() => {
      ScrollTrigger.refresh();
      lenis?.resize();
      const el = document.getElementById(hash.slice(1));
      if (el) scrollToTarget(lenis, el, { immediate: true });
    }, 120);
    return () => clearTimeout(id);
  }, [hash, lenis]);

  return (
    <PageTransition>
      <div className={PAGE_SHEET}>
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />
          <Marquee />
          <About />
          <Work />
          <Stack />
          <Experience />
          <Contact />
        </main>
      </div>
      <Footer />
    </PageTransition>
  );
}
