import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Check, CircleAlert, Copy, LoaderCircle, Send } from 'lucide-react';
import { profile } from '../data/content';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../lib/gsap';
import { cn, EASE_OUT } from '../lib/utils';
import { Magnetic, RollText, SectionLabel } from '../components/ui';

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
});

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
      className="grid size-11 shrink-0 place-items-center rounded-full border border-line transition-colors hover:border-fg"
      aria-label={copied ? 'Email copied' : 'Copy email address'}
    >
      {copied ? <Check className="size-4 text-accent-ink" /> : <Copy className="size-4" />}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </button>
  );
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        {label} <span className="text-accent-ink" aria-hidden="true">*</span>
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 flex items-center gap-2 text-sm text-accent-ink">
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {error.message}
        </p>
      )}
    </div>
  );
}

const inputClass =
  'mt-2 w-full border-b border-line bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-muted/70 focus:border-accent aria-[invalid=true]:border-accent-ink';

export default function Contact() {
  const root = useRef(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', topic: 'role', message: '' },
  });

  const onSubmit = async (data) => {
    const topic = TOPICS.find((t) => t.value === data.topic)?.label ?? 'Hello';
    const subject = `${topic} — from ${data.name}`;
    const body = `${data.message}\n\n— ${data.name}\n${data.email}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSent(true);
    reset();
  };

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const split = SplitText.create('.contact-line', { type: 'chars' });
      gsap.from(split.chars, {
        yPercent: 115,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.025,
        scrollTrigger: { trigger: '.contact-title', start: 'top 80%' },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contact" className="px-gutter pb-12 pt-24 md:pb-16 md:pt-36">
      <SectionLabel index="05" title="Contact" />
      <h2 className="contact-title mt-8 font-display text-[clamp(2.5rem,10.5vw,11rem)] font-bold uppercase leading-[0.86] tracking-[-0.055em]">
        <span className="block overflow-hidden pb-[0.04em]">
          <span className="contact-line inline-block">Have an idea</span>
        </span>
        <span className="block overflow-hidden pb-[0.06em]">
          <span className="contact-line inline-block">
            worth <span className="font-serif font-normal lowercase italic tracking-[-0.02em] text-accent">shipping?</span>
          </span>
        </span>
      </h2>

      <div className="mt-16 grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Write to me</p>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="min-w-0 break-all font-display text-[clamp(1.35rem,2.4vw,2.1rem)] font-medium tracking-[-0.03em] hover:text-accent-ink"
            >
              {profile.email}
            </a>
            <CopyEmail />
          </div>

          <ul className="mt-10 divide-y divide-line border-y border-line">
            {CHANNELS.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  target={channel.external ? '_blank' : undefined}
                  rel={channel.external ? 'noreferrer' : undefined}
                  download={channel.download || undefined}
                  className="group flex min-h-16 items-center justify-between gap-4 py-4"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{channel.label}</span>
                  <span className="flex items-center gap-3 font-medium">
                    <RollText>{channel.value}</RollText>
                    <ArrowUpRight className="size-4 text-accent-ink transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </a>
              </li>
            ))}
            <li className="flex min-h-16 items-center justify-between gap-4 py-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Location</span>
              <span className="text-right font-medium">{profile.location} · IST</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.div
                key="sent"
                className="flex flex-col items-start gap-5 rounded-[28px] border border-line bg-surface p-8 md:p-10"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                role="status"
              >
                <span className="grid size-14 place-items-center rounded-full bg-accent text-on-accent">
                  <Check className="size-6" />
                </span>
                <p className="font-display text-3xl font-semibold tracking-[-0.03em]">Your email is ready to send.</p>
                <p className="max-w-[44ch] leading-relaxed text-muted">
                  Your mail app should have opened with everything filled in — just hit send. If nothing opened, write to{' '}
                  <a href={`mailto:${profile.email}`} className="text-fg underline underline-offset-4">
                    {profile.email}
                  </a>{' '}
                  directly.
                </p>
                <button type="button" onClick={() => setSent(false)} className="btn btn-ghost group">
                  <RollText>Write another message</RollText>
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-8"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              >
                <fieldset>
                  <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">I’m reaching out about</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {TOPICS.map((topic) => (
                      <label key={topic.value} className="relative">
                        <input type="radio" value={topic.value} {...register('topic')} className="peer sr-only" />
                        <span
                          className={cn(
                            'inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm transition-colors',
                            'hover:border-fg peer-checked:border-accent peer-checked:bg-accent peer-checked:text-on-accent',
                            'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent',
                          )}
                        >
                          {topic.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-8 md:grid-cols-2">
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
                    rows={5}
                    placeholder="What are you building, and where could I help?"
                    aria-invalid={errors.message ? 'true' : 'false'}
                    aria-describedby={errors.message ? 'message-error' : 'message-help'}
                    className={cn(inputClass, 'resize-none')}
                    {...register('message')}
                  />
                  {!errors.message && (
                    <p id="message-help" className="mt-2 text-sm text-muted">
                      Sending opens your email app with this message ready to go.
                    </p>
                  )}
                </Field>

                <div>
                  <Magnetic>
                    <button type="submit" disabled={isSubmitting} className="btn btn-accent group disabled:opacity-50">
                      <RollText>{isSubmitting ? 'Opening mail…' : 'Send message'}</RollText>
                      {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
                    </button>
                  </Magnetic>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
