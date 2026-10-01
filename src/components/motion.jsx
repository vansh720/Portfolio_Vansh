import { Children, isValidElement, useId, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { cn, EASE_OUT } from '../lib/utils';

const SCRAMBLE_CHARS = '!<>-_/[]{}=+*^?#01';

function plainText(node) {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(plainText).join('');
  if (isValidElement(node)) return node.type === 'br' ? ' ' : plainText(node.props.children);
  return '';
}

const toWords = (text, extra) =>
  text
    .split(/(\s+)/)
    .filter(Boolean)
    .map((part) => (/^\s+$/.test(part) ? { space: true } : { text: part, ...extra }));

/** Strings become words; styled text runs keep their className; other elements animate as one unit. */
function tokenize(children) {
  const tokens = [];
  Children.toArray(children).forEach((child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      tokens.push(...toWords(String(child)));
    } else if (isValidElement(child)) {
      if (child.type === 'br') tokens.push({ br: true });
      else if (typeof child.props.children === 'string') {
        tokens.push(...toWords(child.props.children, { className: child.props.className }));
      } else tokens.push({ node: child });
    }
  });
  return tokens;
}

const blurIn = (blur, y) => ({
  hidden: { opacity: 0, y, filter: `blur(${blur}px)` },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE_OUT },
    transitionEnd: { filter: 'none' },
  },
});

/** Word-by-word blur + rise reveal when the text scrolls into view. */
export function RevealText({
  as = 'p',
  children,
  className,
  delay = 0,
  stagger = 0.045,
  blur = 10,
  y = '0.35em',
  margin = '0px 0px -12% 0px',
}) {
  const Tag = motion[as];
  const variants = blurIn(blur, y);

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      <span className="sr-only">{plainText(children)}</span>
      <span aria-hidden="true">
        {tokenize(children).map((token, i) => {
          if (token.space) return ' ';
          if (token.br) return <br key={i} />;
          return (
            <motion.span key={i} variants={variants} className={cn('inline-block', token.className)}>
              {token.node ?? token.text}
            </motion.span>
          );
        })}
      </span>
    </Tag>
  );
}

/** Single block that fades, rises and de-blurs into view. */
export function Reveal({ as = 'div', children, className, delay = 0, y = 28, blur = 8, margin = '0px 0px -10% 0px', ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      viewport={{ once: true, margin }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Parent that staggers its RevealItem children. */
export function RevealGroup({ as = 'div', children, className, stagger = 0.08, delay = 0, margin = '0px 0px -10% 0px' }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({ as = 'div', children, className, y = 26, blur = 8, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={blurIn(blur, y)} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Card that tilts toward the pointer in 3D, with a spotlight fill and border glow
 * (see .glow-card). Reveals itself on scroll.
 */
export function TiltCard({ as = 'div', children, className, max = 5, delay = 0, ...rest }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 18, mass: 0.6 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 18, mass: 0.6 });
  const Tag = motion[as];

  const onPointerMove = (e) => {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
    if (reduced || e.pointerType !== 'mouse') return;
    rotateY.set((px - 0.5) * max * 2);
    rotateX.set(-(py - 0.5) * max * 2);
  };
  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <Tag
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 1100 }}
      className={cn('glow-card', className)}
      initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Mono text that decodes itself when it first scrolls into view, and again on hover. */
export function Scramble({ text, className, as: Tag = 'span' }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to(ref.current, {
        duration: 1.2,
        ease: 'none',
        scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.55, revealDelay: 0.25 },
        scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
      });
    },
    { scope: ref, dependencies: [text] },
  );

  const replay = () => {
    if (prefersReducedMotion()) return;
    gsap.to(ref.current, {
      duration: 0.7,
      ease: 'none',
      scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.8 },
      overwrite: true,
    });
  };

  return (
    <Tag ref={ref} className={className} onPointerEnter={replay}>
      {text}
    </Tag>
  );
}

/** Text set on a slowly rotating circle, with arbitrary content in the middle. */
export function CircularText({ text, className, children }) {
  const id = `circle-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <div className={cn('relative grid place-items-center', className)}>
      <svg viewBox="0 0 120 120" className="spin-slower absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <path id={id} d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
        </defs>
        <text className="fill-fg font-mono uppercase" fontSize="8.6">
          <textPath href={`#${id}`} textLength="292" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      {children}
    </div>
  );
}
