# Vansh Narula — Portfolio

Personal portfolio built with React 19 + Vite, Tailwind CSS v4, GSAP (ScrollTrigger, SplitText), Motion, Lenis and React Three Fiber.

## Run it

```bash
npm install      # only needed once
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## Editing content

All text — profile, projects, case studies, experience, certifications — lives in
[`src/data/content.js`](src/data/content.js). The résumé download is `public/Vansh_Narula_Resume.pdf`.

## Structure

```
src/
  data/content.js        all copy and résumé data
  sections/              Hero, About, Work (pinned horizontal scroll), Stack, Experience, Contact
  pages/                 Home, CaseStudy (/work/:slug), NotFound
  components/            Nav, Preloader, Cursor, Marquee, HeroCanvas (Three.js), Footer, visuals/
  hooks/                 Lenis smooth scroll, theme switch, media queries
  index.css              design tokens (dark + light themes) and global styles
```

## Notes

- Dark and light themes share one set of tokens in `src/index.css`; the toggle uses a circular View Transition.
- Every animation respects `prefers-reduced-motion`: smooth scroll, pinning and the particle field switch off.
- The contact form validates with Zod, then opens the visitor's email app with the message pre-filled (no backend needed).
- Client-side routing: when deploying, rewrite all paths to `index.html` (Vercel/Netlify do this with a one-line rewrite rule).
