import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { usePageSetup } from '../hooks/usePageSetup';
import PageTransition from '../components/PageTransition';
import { Button } from '../components/ui';
import { Reveal, RevealText } from '../components/motion';

export default function NotFound() {
  usePageSetup('Page not found · Vansh Narula');

  return (
    <PageTransition>
      <main id="main" tabIndex={-1} className="flex min-h-dvh flex-col justify-center px-gutter py-32 outline-none">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Error 404</p>
        <RevealText as="h1" className="mt-5 text-[clamp(4rem,14vw,12rem)] font-semibold leading-[0.85] tracking-[-0.06em]">
          4<span className="text-accent">0</span>4
        </RevealText>
        <Reveal as="p" delay={0.2} className="mt-6 max-w-[32ch] text-[clamp(1.15rem,1.8vw,1.5rem)] leading-snug text-muted">
          This route was never deployed. Let’s get you back to something that was.
        </Reveal>
        <Reveal delay={0.3} className="mt-9">
          <Button as={Link} to="/" icon={ArrowLeft} dir="left">
            Back home
          </Button>
        </Reveal>
      </main>
    </PageTransition>
  );
}
