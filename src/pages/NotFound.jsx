import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { usePageSetup } from '../hooks/usePageSetup';
import PageTransition from '../components/PageTransition';
import { RollText } from '../components/ui';

export default function NotFound() {
  usePageSetup('Page not found · Vansh Narula');

  return (
    <PageTransition>
      <main id="main" tabIndex={-1} className="flex min-h-dvh flex-col justify-center px-gutter py-32 outline-none">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Error 404</p>
        <h1 className="mt-6 font-display text-[clamp(5rem,24vw,22rem)] font-bold leading-[0.8] tracking-[-0.06em]">
          4<span className="text-accent">0</span>4
        </h1>
        <p className="mt-8 max-w-[30ch] font-serif text-[clamp(1.5rem,2.6vw,2.4rem)] leading-tight">
          This route was never deployed. Let’s get you back to something that was.
        </p>
        <div className="mt-10">
          <Link to="/" className="btn btn-accent group">
            <ArrowLeft className="size-4" />
            <RollText>Back home</RollText>
          </Link>
        </div>
      </main>
    </PageTransition>
  );
}
