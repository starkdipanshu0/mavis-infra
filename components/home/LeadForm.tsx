"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, MapPin, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

/**
 * S8 — A Letter to the Concierge (Lead Form).
 *
 * The conversion section, reframed. Instead of the standard "panel slides in,
 * form appears" gate, the right panel becomes a cream-paper letter addressed
 * to the Mavis concierge — a deliberate contrast against the dark cinematic
 * left half so the moment of writing feels intimate, not transactional.
 *
 * Choreography (scroll-in):
 *   1. Left panel slides from -100% over 0.9s; cinematic backdrop fades in.
 *   2. Right panel slides from +100% in parallel; letterhead settles first.
 *   3. "Dear Mavis," typewrites character-by-character (~1.1s).
 *   4. Form lines stagger in from the top (0.4s total).
 *   5. Brass wax seal fades + rotates softly into resting position.
 *
 * Submission:
 *   • Validates name + phone client-side (other fields optional).
 *   • Brass seal "stamps" down (scale + shadow flash, 0.5s).
 *   • Opens wa.me deep link with a pre-filled greeting.
 *   • CRM webhook posting is a TODO — wire when AiSensy/Sell.Do credentials land.
 *
 * Reduced-motion: replaces typewriter with instant text, kills rotation,
 * keeps the slide-in as a quick fade.
 *
 * Spec: MAVIS-HOMEPAGE-PLAN.md §8.
 */

const EASE_QUINT_OUT = [0.22, 1, 0.36, 1] as const;

// WhatsApp number the concierge replies from. Sourced from the single
// brand-wide constant so every CTA on the site goes to the same inbox.
const CONCIERGE_WHATSAPP = BRAND.whatsapp.numeric;
const CONCIERGE_NAME = "Manvendra Singh";
const REPLY_WINDOW_MIN = 4;

const LOOKING_FOR_OPTIONS = ["2 BHK", "3 BHK", "4 BHK", "Villa", "Plot"] as const;
const BUDGET_OPTIONS = [
  "Under ₹1 Cr",
  "₹1–2 Cr",
  "₹2–5 Cr",
  "₹5 Cr+",
] as const;

const TESTIMONIALS: { quote: string; attribution: string }[] = [
  {
    quote:
      "Three years after our handover, they still pick up. That's the difference.",
    attribution: "— Pranav R., Birla Trimaya buyer · 2023",
  },
  {
    quote:
      "I came for one apartment. I came back for the second because they answered every call.",
    attribution: "— Anjali M., repeat client · 2024",
  },
  {
    quote:
      "The NOC took ten months. They followed up like it was their own home.",
    attribution: "— Suresh K., Phoenix Kessaku · 2022",
  },
];

interface LeadFormState {
  name: string;
  phone: string;
  lookingFor: string[];
  budget: string | null;
}

export function LeadForm() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="concierge"
      aria-label="Talk to a Mavis advisor"
      className="relative w-full bg-mavis-bg scroll-mt-16"
    >
      <div className="relative flex min-h-screen w-full flex-col lg:flex-row overflow-hidden">
        {/* ──────── LEFT PANEL — Cinematic concierge ──────── */}
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { x: "-8%", opacity: 0 }}
          whileInView={{
            x: 0,
            opacity: 1,
            transition: {
              duration: reduceMotion ? 0.6 : 1.0,
              ease: EASE_QUINT_OUT,
            },
          }}
          viewport={{ once: true, margin: "-10%" }}
          className="relative w-full lg:w-3/5 min-h-[60vh] lg:min-h-screen overflow-hidden"
        >
          <LeftPanel />
        </motion.div>

        {/* ──────── RIGHT PANEL — The Letter ──────── */}
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { x: "8%", opacity: 0 }}
          whileInView={{
            x: 0,
            opacity: 1,
            transition: {
              duration: reduceMotion ? 0.6 : 1.0,
              ease: EASE_QUINT_OUT,
            },
          }}
          viewport={{ once: true, margin: "-10%" }}
          className="relative w-full lg:w-2/5 min-h-screen bg-[#f3ece0]"
        >
          <RightPanel />
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   LEFT PANEL — Cinematic, rotating testimonial, calling-card actions
   ──────────────────────────────────────────────────────────────────────── */

function LeftPanel() {
  const reduceMotion = useReducedMotion();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Track visibility so the auto-cycle doesn't keep ticking when the user
  // has scrolled past the section.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "0px", threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Auto-cycle the rotating quote every 6 s while on screen. Pauses entirely
  // when the user prefers reduced motion or has scrolled the section away.
  useEffect(() => {
    if (reduceMotion || !isVisible) return;
    const interval = window.setInterval(() => {
      setQuoteIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [reduceMotion, isVisible]);

  const quote = TESTIMONIALS[quoteIndex];

  return (
    <>
      {/* Backdrop image with Ken-Burns drift */}
      <div className="absolute inset-0 bg-mavis-bg">
        <motion.div
          initial={false}
          animate={
            reduceMotion
              ? { scale: 1 }
              : { scale: [1.04, 1.12, 1.04], x: ["-1%", "1%", "-1%"] }
          }
          transition={{
            duration: 36,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/featured/sobha-oneworld.jpg)",
          }}
        />
        {/* Triple-layer overlay for legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.35) 40%, rgba(8,8,8,0.85) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 30% 50%, transparent 0%, rgba(8,8,8,0.6) 100%)",
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 film-grain" />
      </div>

      <div
        ref={sectionRef}
        className="relative z-10 flex h-full min-h-[60vh] lg:min-h-screen flex-col justify-between px-8 py-12 sm:px-12 sm:py-16 lg:px-20 lg:py-24"
      >
        {/* Top: eyebrow + live status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, delay: 0.6, ease: EASE_QUINT_OUT },
          }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <span
            className="text-[10px] uppercase text-mavis-gold font-light"
            style={{ letterSpacing: "var(--tracking-eyebrow)" }}
          >
            S/08 — Concierge Desk
          </span>
          <LiveStatus />
        </motion.div>

        {/* Middle: rotating testimonial + headline */}
        <div className="my-12 lg:my-0 max-w-2xl">
          <div className="min-h-35 sm:min-h-42.5">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={quoteIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.9, ease: EASE_QUINT_OUT },
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  transition: { duration: 0.5, ease: "easeIn" },
                }}
                className="font-display italic text-mavis-fg leading-snug text-[clamp(1.25rem,2.2vw,1.8rem)]"
              >
                &ldquo;{quote.quote}&rdquo;
                <footer
                  className="mt-4 text-[10px] uppercase text-mavis-fg-faint not-italic font-sans font-light"
                  style={{ letterSpacing: "var(--tracking-display-wide)" }}
                >
                  {quote.attribution}
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Dot pager for quotes — 44px hit area, 1px visual bar inside */}
          <div className="mt-3 flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setQuoteIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                aria-pressed={i === quoteIndex}
                className="group flex h-11 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft rounded"
              >
                <span
                  className={cn(
                    "block h-1 rounded-full transition-all duration-500",
                    i === quoteIndex
                      ? "w-8 bg-mavis-gold"
                      : "w-2 bg-mavis-fg/30 group-hover:bg-mavis-fg/60",
                  )}
                />
              </button>
            ))}
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 1.0, delay: 0.4, ease: EASE_QUINT_OUT },
            }}
            viewport={{ once: true }}
            className="mt-12 uppercase leading-[0.92] text-mavis-fg text-[clamp(3rem,7vw,5.5rem)]"
            style={{ letterSpacing: "var(--tracking-display)" }}
          >
            <span className="font-thin">Write to</span>
            <br />
            <span className="font-bold">the concierge.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{
              opacity: 1,
              transition: { duration: 0.8, delay: 0.9, ease: EASE_QUINT_OUT },
            }}
            viewport={{ once: true }}
            className="mt-6 font-display italic font-light text-mavis-fg-muted text-[clamp(1rem,1.5vw,1.15rem)] max-w-md leading-relaxed"
          >
            One letter. One reply. The same advisor for the next five years.
          </motion.p>
        </div>

        {/* Bottom: quick actions + social */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.9, delay: 1.0, ease: EASE_QUINT_OUT },
          }}
          viewport={{ once: true }}
          className="flex flex-col gap-8"
        >
          {/* Three quick-action links */}
          <ul className="flex flex-col gap-4 text-mavis-fg">
            <QuickLink
              href={`https://wa.me/${CONCIERGE_WHATSAPP}?text=${encodeURIComponent(
                "Hi Mavis, I'd like to talk to an advisor.",
              )}`}
              icon={<MessageCircle className="h-4 w-4" strokeWidth={1.5} />}
              external
            >
              Prefer WhatsApp? Start the chat
            </QuickLink>
            <QuickLink
              href="https://maps.google.com/?q=Mavis+Infra+JP+Nagar+Bangalore"
              icon={<MapPin className="h-4 w-4" strokeWidth={1.5} />}
              external
            >
              Visit our JP Nagar office
            </QuickLink>
            <QuickLink href="/projects" icon={<ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />}>
              Browse all 46 residences
            </QuickLink>
          </ul>

          {/* Social row — only renders when a real handle is configured.
              Empty BRAND.social entries (TBC from client) hide rather than
              link to facebook.com/instagram.com homepages. */}
          {(BRAND.social.instagram || BRAND.social.facebook) && (
            <div className="flex items-center gap-4">
              {BRAND.social.instagram && (
                <SocialIcon href={BRAND.social.instagram} label="Instagram">
                  <InstagramGlyph />
                </SocialIcon>
              )}
              {BRAND.social.facebook && (
                <SocialIcon href={BRAND.social.facebook} label="Facebook">
                  <FacebookGlyph />
                </SocialIcon>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

function LiveStatus() {
  return (
    <div className="flex items-center gap-3 text-mavis-fg-muted">
      <span className="relative flex h-2 w-2">
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span
        className="text-[10px] uppercase font-light"
        style={{ letterSpacing: "var(--tracking-display-wide)" }}
      >
        {CONCIERGE_NAME} · Online · Replies ~ {REPLY_WINDOW_MIN} min
      </span>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  children,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group inline-flex items-center gap-4 text-[12px] uppercase font-light hover:text-mavis-gold transition-colors duration-300"
        style={{ letterSpacing: "var(--tracking-display-wide)" }}
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-mavis-fg/20 group-hover:border-mavis-gold/60 group-hover:bg-mavis-gold/10 transition-all duration-300">
          {icon}
        </span>
        <span className="relative">
          {children}
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-mavis-gold/70 transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
        </span>
      </a>
    </li>
  );
}

function InstagramGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-mavis-fg/25 text-mavis-fg-muted hover:text-mavis-gold hover:border-mavis-gold/60 transition-all duration-300"
    >
      {children}
    </a>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   RIGHT PANEL — The Letter itself
   ──────────────────────────────────────────────────────────────────────── */

function RightPanel() {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<LeadFormState>({
    name: "",
    phone: "",
    lookingFor: [],
    budget: null,
  });
  const [status, setStatus] = useState<"idle" | "sealing" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  // Resolve the date on the client only — `new Date()` during SSR would
  // produce server-time / server-locale output that mismatches the client's
  // first render, triggering a hydration warning. We render an empty stamp
  // on first paint and fill it in once mounted.
  const [dateString, setDateString] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe one-shot
    setDateString(
      new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
  }, []);

  const toggleLookingFor = (option: string) => {
    setForm((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(option)
        ? prev.lookingFor.filter((o) => o !== option)
        : [...prev.lookingFor, option],
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Please tell us your name.");
      return;
    }

    // Accept anything from a bare 10-digit mobile to "+91 98765 43210" or
    // "09876543210" — strip everything non-numeric and trim a leading 91/0.
    const digits = form.phone.replace(/\D/g, "");
    const trimmed = digits.replace(/^(91|0)/, "");
    if (!/^\d{10}$/.test(trimmed)) {
      setError("Please enter a 10-digit Indian mobile number.");
      return;
    }

    setStatus("sealing");

    // Compose the WhatsApp greeting from form state.
    const lookingFor =
      form.lookingFor.length > 0 ? form.lookingFor.join(" / ") : "a home";
    const budget = form.budget ? ` in the ${form.budget} range` : "";
    const message = `Hi Mavis, I'm ${form.name.trim()}. I'm looking for ${lookingFor}${budget}. Please reach out on WhatsApp at +91 ${trimmed}.`;
    const url = `https://wa.me/${CONCIERGE_WHATSAPP}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp synchronously so popup blockers honour the user gesture.
    // The seal-stamp animation still plays via the `sealing` state below.
    const opened = window.open(url, "_blank", "noopener,noreferrer");

    // Brief sealing → sent transition, then allow the user to send again
    // (re-enquire for a second project, etc.) without reloading the page.
    window.setTimeout(() => {
      setStatus("sent");
    }, 700);
    window.setTimeout(() => {
      setStatus("idle");
    }, 4000);

    // If the popup never opened (blocker, no WhatsApp installed on desktop),
    // surface a recoverable error rather than silently losing the lead.
    if (!opened) {
      setError(
        "We couldn't open WhatsApp. Tap the WhatsApp button on the right to chat.",
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Paper texture + warm vignette */}
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 50% 0%, rgba(255,238,210,0.6) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.08, 0 0 0 0 0.06, 0 0 0 0 0.05, 0 0 0 0.35 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
            backgroundSize: "240px 240px",
            mixBlendMode: "multiply",
          }}
        />
        {/* Faint horizontal rule lines — like a Smythson notepad */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0px, transparent 31px, #2a2521 31px, #2a2521 32px)",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col px-8 py-10 sm:px-12 sm:py-14 lg:px-14 lg:py-16 text-[#2a2521]">
        {/* Letterhead */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, delay: 0.7, ease: EASE_QUINT_OUT },
          }}
          viewport={{ once: true }}
          className="flex items-start justify-between border-b border-[#2a2521]/15 pb-5"
        >
          <div>
            <p
              className="text-[10px] uppercase font-light"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Mavis Infra · Concierge
            </p>
            <p className="mt-1 font-display italic text-base">
              JP Nagar, Bangalore
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-[10px] uppercase font-light opacity-60"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Date
            </p>
            <p className="mt-1 font-display italic text-base">
              {dateString || " "}
            </p>
          </div>
        </motion.header>

        {/* Greeting — typewriter */}
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: { duration: 0.4, delay: 1.1, ease: "easeOut" },
          }}
          viewport={{ once: true }}
          className="mt-10 font-display italic text-[clamp(2rem,3.5vw,2.8rem)] leading-none"
        >
          <Typewriter text="Dear Mavis," delay={1100} skip={!!reduceMotion} />
        </motion.h3>

        {/* Form */}
        <motion.form
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-5%" }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.12,
                delayChildren: 2.4,
              },
            },
          }}
          onSubmit={handleSubmit}
          className="mt-8 flex flex-1 flex-col gap-7"
          aria-label="Letter to the concierge"
        >
          {/* Line 1 — name */}
          <motion.div variants={fieldVariants}>
            <LetterLabel htmlFor="lf-name" required>My name is</LetterLabel>
            <LetterInput
              id="lf-name"
              name="name"
              autoComplete="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="who shall I greet?"
            />
          </motion.div>

          {/* Line 2 — phone */}
          <motion.div variants={fieldVariants}>
            <LetterLabel htmlFor="lf-phone" required>
              Reach me on WhatsApp at <span className="opacity-60">+91</span>
            </LetterLabel>
            <LetterInput
              id="lf-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              maxLength={16}
              value={form.phone}
              onChange={(e) =>
                setForm({
                  // Allow digits, spaces, +, and hyphens — common phone
                  // formats. Submit handler normalises before validating.
                  ...form,
                  phone: e.target.value.replace(/[^\d +\-]/g, ""),
                })
              }
              placeholder="98765 43210"
            />
          </motion.div>

          {/* Line 3 — looking for chips */}
          <motion.div variants={fieldVariants}>
            <LetterLabel>I am looking for</LetterLabel>
            <div className="mt-3 flex flex-wrap gap-2">
              {LOOKING_FOR_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  selected={form.lookingFor.includes(option)}
                  onClick={() => toggleLookingFor(option)}
                >
                  {option}
                </Chip>
              ))}
            </div>
          </motion.div>

          {/* Line 4 — budget chips */}
          <motion.div variants={fieldVariants}>
            <LetterLabel>My budget is</LetterLabel>
            <div className="mt-3 flex flex-wrap gap-2">
              {BUDGET_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  selected={form.budget === option}
                  onClick={() =>
                    setForm({
                      ...form,
                      budget: form.budget === option ? null : option,
                    })
                  }
                >
                  {option}
                </Chip>
              ))}
            </div>
          </motion.div>

          {/* Signature line + seal */}
          <motion.div
            variants={fieldVariants}
            className="mt-auto flex flex-col-reverse gap-8 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="flex-1">
              <p className="font-display italic text-base">Yours sincerely,</p>
              <div className="mt-3 h-px w-48 bg-[#2a2521]/30" />
              <p
                className="mt-2 font-display italic text-sm opacity-70 min-h-5"
                aria-live="polite"
              >
                {form.name.trim() || " "}
              </p>
              {error && (
                <p
                  className="mt-3 text-[11px] uppercase text-red-700 font-light"
                  style={{ letterSpacing: "var(--tracking-display-wide)" }}
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>

            <WaxSeal status={status} />
          </motion.div>

          {/* Privacy footnote */}
          <p className="mt-6 font-display italic text-xs opacity-55 leading-relaxed">
            By sealing this letter you agree to our privacy policy and our
            promise — your details stay with Mavis. No mailing lists, no
            third-party brokers.
          </p>
        </motion.form>
      </div>
    </div>
  );
}

const fieldVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_QUINT_OUT },
  },
};

/* ────────────────────────────────────────────────────────────────────────
   LETTER PRIMITIVES — label, input, chip, typewriter, wax seal
   ──────────────────────────────────────────────────────────────────────── */

function LetterLabel({
  children,
  htmlFor,
  required = false,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-display italic text-[clamp(1rem,1.5vw,1.15rem)]"
    >
      {children}
      {required && (
        <span
          className="ml-1 align-super text-[0.7em] not-italic text-mavis-gold"
          aria-hidden="true"
        >
          *
        </span>
      )}
    </label>
  );
}

function LetterInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      className={cn(
        "mt-1 block w-full bg-transparent border-b border-[#2a2521]/35",
        "px-0 py-2 text-lg font-light text-[#2a2521]",
        "placeholder:font-display placeholder:italic placeholder:text-[#2a2521]/40",
        "focus:outline-none focus:border-mavis-gold focus:border-b-[1.5px]",
        "transition-colors duration-300",
        className,
      )}
    />
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center min-h-11 px-4 py-1.5 rounded-full border",
        "text-[11px] uppercase font-light transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft",
        selected
          ? "border-mavis-gold bg-mavis-gold/15 text-[#2a2521]"
          : "border-[#2a2521]/25 text-[#2a2521]/70 hover:border-[#2a2521]/55 hover:text-[#2a2521]",
      )}
      style={{ letterSpacing: "var(--tracking-display-wide)" }}
    >
      {children}
    </button>
  );
}

/**
 * Character-by-character typewriter for the "Dear Mavis," greeting.
 * Honours reduced-motion — when `skip` is true, prints the whole string
 * immediately.
 */
function Typewriter({
  text,
  delay = 0,
  skip = false,
}: {
  text: string;
  delay?: number;
  skip?: boolean;
}) {
  const [printed, setPrinted] = useState(skip ? text : "");

  useEffect(() => {
    if (skip) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot final value when motion is off
      setPrinted(text);
      return;
    }
    setPrinted("");
    // Track every active timer so unmount cancels mid-animation cleanly,
    // preventing setState-on-unmounted warnings + a leaked timer chain.
    const timers: number[] = [];
    const startTimer = window.setTimeout(() => {
      let i = 0;
      const tick = () => {
        i += 1;
        setPrinted(text.slice(0, i));
        if (i < text.length) {
          timers.push(window.setTimeout(tick, 65));
        }
      };
      tick();
    }, delay);
    timers.push(startTimer);
    return () => {
      for (const id of timers) window.clearTimeout(id);
    };
  }, [text, delay, skip]);

  return (
    <>
      {printed}
      <span
        aria-hidden="true"
        className={cn(
          "ml-1 inline-block w-[0.06em] align-[-0.05em] bg-[#2a2521]",
          "animate-pulse",
          printed.length === text.length ? "opacity-0" : "opacity-80",
        )}
        style={{ height: "0.9em" }}
      />
    </>
  );
}

/**
 * Brass wax seal — the submit button. SVG-only so it scales crisply, with
 * a rotating outer ring that circulates the "MAVIS · CONCIERGE · BLR" mark.
 * Hover rotates the whole disc continuously; click "stamps" it (scale dip
 * + shadow flash) before the form's submit handler opens WhatsApp.
 */
function WaxSeal({ status }: { status: "idle" | "sealing" | "sent" }) {
  const reduceMotion = useReducedMotion();
  const isSealing = status === "sealing";
  const isSent = status === "sent";
  const ariaLabel = isSent
    ? "Letter sent"
    : isSealing
      ? "Sealing letter…"
      : "Seal and send letter";

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        type="submit"
        aria-label={ariaLabel}
        disabled={isSealing || isSent}
        className={cn(
          "relative h-32 w-32 sm:h-36 sm:w-36 rounded-full",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mavis-gold-soft focus-visible:ring-offset-4 focus-visible:ring-offset-[#f3ece0]",
          "cursor-pointer disabled:cursor-not-allowed",
          "transition-transform duration-300",
          "hover:scale-[1.04] active:scale-95",
        )}
        animate={
          isSealing
            ? { scale: [1, 1.12, 0.92, 1.02], rotate: [0, -8, 4, 0] }
            : isSent
              ? { scale: 1, rotate: 0 }
              : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.7, ease: EASE_QUINT_OUT }}
        style={{
          filter:
            "drop-shadow(0 10px 18px rgba(74, 53, 14, 0.35)) drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
        }}
      >
        {/* Rotating ring text */}
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full"
          animate={
            reduceMotion || isSent
              ? { rotate: 0 }
              : isSealing
                ? { rotate: 0 }
                : { rotate: 360 }
          }
          transition={{
            duration: 22,
            ease: "linear",
            repeat: reduceMotion || isSealing || isSent ? 0 : Infinity,
          }}
        >
          <defs>
            <path
              id="seal-text-path"
              d="M 100,100 m -82,0 a 82,82 0 1,1 164,0 a 82,82 0 1,1 -164,0"
            />
          </defs>
          <text
            className="font-sans"
            fontSize="10.5"
            letterSpacing="6"
            fill="#3a2d12"
          >
            <textPath href="#seal-text-path" startOffset="0%">
              MAVIS · CONCIERGE · BANGALORE · MAVIS · CONCIERGE · BANGALORE ·
            </textPath>
          </text>
        </motion.svg>

        {/* Static seal disc */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="brass-fill" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#f0d59a" />
              <stop offset="45%" stopColor="#c8a96e" />
              <stop offset="100%" stopColor="#6e5524" />
            </radialGradient>
          </defs>
          {/* Outer brass disc — sits inside the rotating ring so the ring text
              circles around it */}
          <circle cx="100" cy="100" r="74" fill="url(#brass-fill)" />
          {/* Rim line */}
          <circle
            cx="100"
            cy="100"
            r="74"
            fill="none"
            stroke="#3a2d12"
            strokeWidth="1"
            opacity="0.5"
          />
          {/* Inner dashed ring */}
          <circle
            cx="100"
            cy="100"
            r="58"
            fill="none"
            stroke="#3a2d12"
            strokeWidth="0.8"
            strokeDasharray="1.5 4"
            opacity="0.55"
          />
          {/* Cormorant M monogram */}
          <text
            x="100"
            y="128"
            textAnchor="middle"
            fontSize="86"
            fontStyle="italic"
            fontFamily="var(--font-cormorant), serif"
            fill="#3a2d12"
            opacity="0.92"
          >
            M
          </text>
        </svg>

        {/* Sent-state checkmark overlay */}
        {isSent && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE_QUINT_OUT }}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-emerald-700/85 backdrop-blur-sm"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-12 w-12 text-mavis-fg"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12.5 L10 17.5 L19 7" />
            </svg>
          </motion.div>
        )}
      </motion.button>

      <p
        className="text-[10px] uppercase font-light text-[#2a2521]/70 font-sans"
        style={{ letterSpacing: "var(--tracking-display-wide)" }}
      >
        {isSent ? "Letter sent ✓" : isSealing ? "Sealing…" : "Tap to seal & send"}
      </p>
    </div>
  );
}

