import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FrostedButton } from "@/components/shared/FrostedButton";
import { ProgressiveBlur } from "@/components/shared/ProgressiveBlur";
import { Counter } from "@/components/shared/Counter";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutStory } from "@/components/about/AboutStory";
import { FoundersGrid } from "@/components/about/FoundersGrid";
import { Commitment } from "@/components/about/Commitment";
import { BRAND, buildWhatsAppLink } from "@/lib/constants";
import { MAVIS_STATS } from "@/lib/data/mavis-difference";

/**
 * `/about` — the brand showpiece. A type-only editorial hero, a scroll-pinned
 * narrative spine (the problem → why we exist → 37 came back → how we stay),
 * the numbers, the founders, and an honest "we do / we don't" commitment,
 * closing into the concierge CTA.
 *
 * Server shell + static metadata; the cinematic motion lives in the client
 * components. Spec: design.md §19.4, CONTENT.md §3.1.
 */

export const metadata: Metadata = {
  title: "We Stay — About Mavis Infra",
  description:
    "Mavis Infra was built on one promise: we stay after the sale. 37 of our 200 families came back for their second home. Founded 2019 in Bangalore.",
};

const aboutWhatsApp = buildWhatsAppLink(
  "Hi Mavis, I read your story and I'd like to speak with a senior advisor.",
);

export default function AboutPage() {
  return (
    <div className="relative w-full bg-mavis-bg text-mavis-fg">
      <AboutHero />

      <AboutStory />

      {/* Cinematic interlude — the promise, over a darkened image */}
      <section className="relative h-[70svh] w-full overflow-hidden isolate">
        <Image
          src="/images/about/interlude.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={82}
          className="object-cover brightness-[0.8]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(13,12,10,0.92) 0%, rgba(13,12,10,0.4) 45%, rgba(13,12,10,0.72) 100%)",
          }}
        />
        <ProgressiveBlur
          direction="top"
          blurLayers={5}
          blurIntensity={0.3}
          className="absolute inset-x-0 top-0 h-[16vh]"
        />
        <ProgressiveBlur
          direction="bottom"
          blurLayers={5}
          blurIntensity={0.3}
          className="absolute inset-x-0 bottom-0 h-[16vh]"
        />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
          <p className="max-w-3xl text-center font-display italic font-light text-mavis-fg leading-tight text-[clamp(1.75rem,4.5vw,3.5rem)]">
            &ldquo;{BRAND.tagline}&rdquo;
          </p>
        </div>
      </section>

      {/* The Numbers */}
      <section className="border-t border-mavis-line py-16 sm:py-24">
        <Container size="wide">
          <SectionHeading bold="BY THE" thin="NUMBERS" size="md" align="left" />
          <div className="mt-12 grid grid-cols-2 gap-y-12 gap-x-6 sm:gap-x-8 lg:grid-cols-4">
            {MAVIS_STATS.map((stat) => (
              <div key={stat.label}>
                <Counter
                  end={stat.end}
                  suffix={stat.suffix}
                  duration={stat.duration}
                  className={`block font-display font-light leading-none text-[clamp(3rem,7vw,5.5rem)] ${
                    stat.emphasize ? "text-mavis-gold" : "text-mavis-fg"
                  }`}
                />
                <p
                  className="mt-4 text-[10px] uppercase font-light text-mavis-fg-faint"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
            {/* Highest deal — a string figure, not a counter */}
            <div>
              <span className="block font-display font-light leading-none text-mavis-fg text-[clamp(3rem,7vw,5.5rem)]">
                {BRAND.metrics.highestDeal}
              </span>
              <p
                className="mt-4 text-[10px] uppercase font-light text-mavis-fg-faint"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                Highest Deal Closed
              </p>
            </div>
          </div>
        </Container>
      </section>

      <FoundersGrid />

      <Commitment />

      {/* CTA block */}
      <section className="border-t border-mavis-line py-16 sm:py-24">
        <Container size="narrow" className="text-center">
          <h2 className="font-display italic font-light text-mavis-fg text-[clamp(1.75rem,4vw,2.75rem)] leading-tight">
            Talk to the people who&rsquo;ll still be here after handover.
          </h2>
          <p className="mt-5 text-sm sm:text-base font-light leading-relaxed text-mavis-fg-muted">
            No pressure, no scripts — just a senior advisor who knows the
            inventory and stays with you through possession and beyond.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <FrostedButton href="/#concierge" size="lg">
              Speak to an advisor
            </FrostedButton>
            <a
              href={aboutWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center px-9 text-xs uppercase font-light text-mavis-fg-muted hover:text-mavis-gold transition-colors"
              style={{ letterSpacing: "var(--tracking-display-wide)" }}
            >
              Or message us on WhatsApp
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
