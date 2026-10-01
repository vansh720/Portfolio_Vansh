import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Check, CircleAlert, Copy, LoaderCircle, Send } from 'lucide-react';
import { contactForm, profile } from '../data/content';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { cn, EASE_OUT, trackPointer } from '../lib/utils';
import { Button, Magnetic, RollText, SectionLabel } from '../components/ui';
import { CircularText, Reveal, RevealGroup, RevealItem } from '../components/motion';

const TOPICS = [
  { value: 'role', label: 'A full-time role' },
  { value: 'freelance', label: 'A freelance project' },
  { value: 'hello', label: 'Just saying hi' },
];

const schema = z.object({
  name: z.string().trim().min(2, 'Please tell me your name.'),
  email: z
    .string()
    .trim()
    .min(1, 'Your email is required so I can reply.')
    .email('That email doesn’t look right — check it for typos.'),
  topic: z.enum(['role', 'freelance', 'hello']),
  message: z.string().trim().min(10, 'A little more detail helps — at least 10 characters.'),
  // Honeypot: hidden from people; bots tend to tick it, and Web3Forms rejects those submissions.
  botcheck: z.boolean().optional(),
});

const SEND_TIMEOUT_MS = 15000;

const CHANNELS = [
  { label: 'LinkedIn', value: profile.linkedinLabel, href: profile.linkedin, external: true },
  { label: 'Phone', value: profile.phone, href: profile.phoneHref },
  { label: 'Résumé', value: 'Download PDF', href: profile.resume, download: true },
];

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-line transition-colors hover:border-fg/40"
      aria-label={copied ? 'Email copied' : 'Copy email address'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'done' : 'copy'}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.3, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        >
          {copied ? <Check className="size-4 text-accent-ink" /> : <Copy className="size-4" />}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </button>
  );
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        {label} <span className="text-accent-ink" aria-hidden="true">*</span>
      </label>
      <div className="field relative">
        {children}
        <span className="field-line" aria-hidden="true" />
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            className="mt-2 flex items-center gap-2 text-sm text-accent-ink"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass =
  'mt-1 w-full border-b border-line bg-transparent py-3 text-base outline-none transition-colors placeholder:text-muted/60 aria-[invalid=true]:border-accent-ink';

export default function Contact() {
  const root = useRef(null);
  const [sentTo, setSentTo] = useState(null);
  const [sendFailed, setSendFailed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', topic: 'role', message: '', botcheck: false },
  });

  const onSubmit = async (data) => {
    setSendFailed(false);
    const topic = TOPICS.find((t) => t.value === data.topic)?.label ?? 'Hello';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
    // FormData keeps this a "simple" CORS request, so no preflight that could be blocked.
    const body = new FormData();
    body.append('access_key', contactForm.accessKey);
    body.append('subject', `Portfolio: ${topic} — from ${data.name}`);
    body.append('from_name', 'Vansh Narula · Portfolio');
    body.append('name', data.name);
    body.append('email', data.email);
    body.append('topic', topic);
    body.append('message', data.message);
    if (data.botcheck) body.append('botcheck', 'on');

    try {
      const response = await fetch(contactForm.endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
        body,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || `HTTP ${response.status}`);
      setSentTo(data.email);
      reset();
    } catch {
      // Keep what they typed so they can retry, and offer plain email as a fallback.
      setSendFailed(true);
    } finally {
      clearTimeout(timeout);
    }
  };

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const split = SplitText.create('.contact-title', { type: 'chars' });
      gsap.from(split.chars, {
        yPercent: 60,
        autoAlpha: 0,
        filter: 'blur(14px)',
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.022,
        scrollTrigger: { trigger: '.contact-title', start: 'top 82%' },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contact" className="relative px-gutter pb-16 pt-24 md:pb-24 md:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(60%_60%_at_15%_20%,color-mix(in_oklab,var(--accent)_10%,transparent),transparent)]"
      />
      <div className="relative">
        <SectionLabel index="05" title="Contact" />
        <div className="mt-6 flex items-end justify-between gap-8">
          <h2 className="contact-title max-w-[16ch] text-[clamp(2.25rem,5.6vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
            Have an idea worth <span className="font-serif font-normal italic text-accent-ink">shipping?</span>
          </h2>
          <Reveal delay={0.3} className="hidden shrink-0 md:block">
            <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`} className="group block">
              <CircularText text="Write to me · Say hello · " className="size-32">
                <span className="grid size-14 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110">
                  <ArrowUpRight className="size-5" />
                </span>
              </CircularText>
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Write to me</p>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="group min-w-0 break-all text-[clamp(1.2rem,1.9vw,1.6rem)] font-medium tracking-[-0.03em] transition-colors hover:text-accent-ink"
                >
                  {profile.email}
                </a>
                <CopyEmail />
              </div>
            </Reveal>

            <RevealGroup as="ul" className="mt-8 divide-y divide-line border-y border-line" stagger={0.07} delay={0.1}>
              {CHANNELS.map((channel) => (
                <RevealItem as="li" key={channel.label}>
                  <a
                    href={channel.href}
                    target={channel.external ? '_blank' : undefined}
                    rel={channel.external ? 'noreferrer' : undefined}
                    download={channel.download || undefined}
                    className="group flex min-h-14 items-center justify-between gap-4 py-3"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{channel.label}</span>
                    <span className="flex items-center gap-3 text-[15px] font-medium">
                      <RollText>{channel.value}</RollText>
                      <span className="grid size-7 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    </span>
                  </a>
                </RevealItem>
              ))}
              <RevealItem as="li" className="flex min-h-14 items-center justify-between gap-4 py-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Location</span>
                <span className="text-right text-[15px] font-medium">{profile.location} · IST</span>
              </RevealItem>
            </RevealGroup>
          </div>

          <Reveal delay={0.15} className="lg:col-span-7">
            <div
              onPointerMove={trackPointer}
              className="glow-card rounded-[28px] border border-line bg-surface/60 p-6 backdrop-blur-md md:p-9"
            >
              <AnimatePresence mode="wait" initial={false}>
                {sentTo ? (
                  <motion.div
                    key="sent"
                    className="flex flex-col items-start gap-5 py-6"
                    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    role="status"
                  >
                    <motion.span
                      className="grid size-14 place-items-center rounded-full bg-accent text-on-accent"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.1 }}
                    >
                      <Check className="size-6" />
                    </motion.span>
                    <p className="text-2xl font-semibold tracking-[-0.03em]">Message sent — thank you!</p>
                    <p className="max-w-[44ch] text-[15px] leading-relaxed text-muted">
                      It’s landed in my inbox. I’ll reply to <span className="font-medium text-fg">{sentTo}</span>.
                    </p>
                    <Button as="button" type="button" variant="ghost" magnetic={false} onClick={() => setSentTo(null)} icon={null}>
                      Send another message
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-7"
                    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                  >
                    <fieldset>
                      <legend className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">I’m reaching out about</legend>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {TOPICS.map((topic) => (
                          <label key={topic.value} className="relative">
                            <input type="radio" value={topic.value} {...register('topic')} className="peer sr-only" />
                            <span
                              className={cn(
                                'inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm transition-all duration-300',
                                'hover:border-fg/40 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-on-accent',
                                'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent',
                              )}
                            >
                              {topic.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="grid gap-7 md:grid-cols-2">
                      <Field id="name" label="Your name" error={errors.name}>
                        <input
                          id="name"
                          type="text"
                          autoComplete="name"
                          placeholder="Jane Doe"
                          aria-invalid={errors.name ? 'true' : 'false'}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                          className={inputClass}
                          {...register('name')}
                        />
                      </Field>
                      <Field id="email" label="Your email" error={errors.email}>
                        <input
                          id="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="jane@company.com"
                          aria-invalid={errors.email ? 'true' : 'false'}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                          className={inputClass}
                          {...register('email')}
                        />
                      </Field>
                    </div>

                    <Field id="message" label="Message" error={errors.message}>
                      <textarea
                        id="message"
                        rows={4}
                        placeholder="What are you building, and where could I help?"
                        aria-invalid={errors.message ? 'true' : 'false'}
                        aria-describedby={errors.message ? 'message-error' : 'message-help'}
                        className={cn(inputClass, 'resize-none')}
                        {...register('message')}
                      />
                    </Field>
                    {!errors.message && (
                      <p id="message-help" className="-mt-4 text-[13px] text-muted">
                        Goes straight to my inbox — I’ll reply by email.
                      </p>
                    )}

                    <input type="checkbox" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register('botcheck')} />

                    <AnimatePresence initial={false}>
                      {sendFailed && (
                        <motion.div
                          role="alert"
                          className="flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-[14px] leading-relaxed"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3, ease: EASE_OUT }}
                        >
                          <CircleAlert className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden="true" />
                          <p>
                            That didn’t go through — please try again, or email me directly at{' '}
                            <a href={`mailto:${profile.email}`} className="font-medium underline underline-offset-4">
                              {profile.email}
                            </a>
                            .
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <Magnetic>
                        <button type="submit" disabled={isSubmitting} className="btn btn-accent group disabled:opacity-60">
                          <RollText>{isSubmitting ? 'Sending…' : 'Send message'}</RollText>
                          {isSubmitting ? (
                            <span className="-mr-[0.4rem] grid size-7 place-items-center" aria-hidden="true">
                              <LoaderCircle className="size-4 animate-spin" />
                            </span>
                          ) : (
                            <span className="btn-icon" data-dir="right" aria-hidden="true">
                              <Send />
                              <Send />
                            </span>
                          )}
                        </button>
                      </Magnetic>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
