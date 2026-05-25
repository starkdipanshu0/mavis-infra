import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ALL_PROJECTS } from "@/lib/data/all-projects";
import { buildWhatsAppLink, BRAND } from "@/lib/constants";

/**
 * Project detail — `/projects/[slug]`.
 *
 * Editorial stub for v1. When the CMS comes online the lookup becomes a
 * GROQ query; the page composition stays.
 *
 * Note on Next 16 params: `params` is now a Promise — `await` it before use.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = ALL_PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.name} — ${project.locality}`,
    description: `${project.bhkRange} apartments in ${project.locality} by ${project.builder}. ${project.priceFrom}. Channel-partner pricing via Mavis.`,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = ALL_PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const waMessage = `Hi, I'd like to know more about ${project.name} in ${project.locality}.`;

  return (
    <article className="relative w-full bg-mavis-bg text-mavis-fg">
      {/* HERO — full-bleed image with editorial overlay */}
      <section className="relative h-[75vh] sm:h-[80vh] w-full overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="100vw"
            quality={88}
            priority
            className="object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 90% 90% at center 40%, ${project.tone} 0%, ${project.tone}cc 60%, #050505 100%)`,
            }}
          />
        )}

        {/* Editorial mask */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              "linear-gradient(to top, rgba(13,12,10,0.88) 0%, rgba(13,12,10,0.35) 40%, transparent 70%)",
              "linear-gradient(to bottom, rgba(13,12,10,0.55) 0%, transparent 25%)",
            ].join(", "),
          }}
        />

        {/* Top: back link */}
        <div className="absolute inset-x-0 top-24 z-10 px-6 sm:px-10 lg:px-16">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-[11px] uppercase text-mavis-fg-muted hover:text-mavis-fg transition-colors"
            style={{ letterSpacing: "var(--tracking-display-wide)" }}
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
              strokeWidth={1.5}
            />
            All Projects
          </Link>
        </div>

        {/* Bottom-left: builder + name + locality */}
        <div className="absolute inset-x-0 bottom-12 sm:bottom-16 z-10 px-6 sm:px-10 lg:px-16 max-w-3xl">
          <p
            className="text-[10px] sm:text-xs uppercase text-mavis-gold/85 font-light"
            style={{ letterSpacing: "var(--tracking-eyebrow)" }}
          >
            {project.builder} · {project.reraDisplay}
          </p>
          <h1 className="mt-4 font-display italic font-light text-mavis-fg text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.05] tracking-tight">
            {project.name}
          </h1>
          <p
            className="mt-3 text-[11px] sm:text-xs uppercase text-mavis-fg-muted font-light"
            style={{ letterSpacing: "var(--tracking-display-wide)" }}
          >
            {project.locality}
          </p>
        </div>
      </section>

      {/* META STRIP — BHK · Price · Status · Type */}
      <section className="relative border-y border-mavis-line bg-mavis-surface">
        <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { label: "Configuration", value: project.bhkRange },
            { label: "From", value: project.priceFrom },
            {
              label: "Status",
              value:
                project.status === "pre-launch"
                  ? "Pre-launch"
                  : project.status === "ready"
                    ? "Ready to Move"
                    : "Under Construction",
            },
            { label: "Type", value: capitalise(project.type) },
          ].map((m) => (
            <div key={m.label}>
              <p
                className="text-[10px] uppercase text-mavis-fg-faint font-light"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                {m.label}
              </p>
              <p className="mt-3 font-display italic text-mavis-fg text-lg sm:text-xl leading-tight">
                {m.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* EDITORIAL COPY + ENQUIRE BLOCK */}
      <section className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20">
          <div>
            <p
              className="text-[10px] uppercase text-mavis-gold/85 font-light"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              About this residence
            </p>
            <h2 className="mt-5 font-display italic font-light text-mavis-fg text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15]">
              Full details, floor plans, and availability are with our advisor.
            </h2>
            <p className="mt-6 text-mavis-fg-muted leading-relaxed max-w-prose">
              {project.name} sits in {project.locality}, by {project.builder}.
              We&rsquo;re a registered channel partner — pricing, allotments,
              site visits and home-loan paperwork all run through us at no
              additional cost to you. Reach out below and we&rsquo;ll send the
              brochure within the hour.
            </p>
            <p className="mt-4 text-mavis-fg-faint text-sm leading-relaxed max-w-prose">
              The interactive detail page (master plan, floor plans, amenity
              gallery, location map) is in development and will land before the
              site&rsquo;s public launch. For now, the fastest way to
              everything specific is a quick WhatsApp.
            </p>
          </div>

          <aside className="border border-mavis-line bg-mavis-elevated/40 rounded-sm p-7 h-fit sticky top-28">
            <p
              className="text-[10px] uppercase text-mavis-fg-faint font-light"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Enquire
            </p>
            <h3 className="mt-3 font-display italic font-light text-mavis-fg text-2xl leading-tight">
              Speak to a Mavis advisor.
            </h3>
            <p className="mt-3 text-sm text-mavis-fg-muted leading-relaxed">
              Brochure, price sheet, and site-visit slot — within the hour.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <a
                href={buildWhatsAppLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-between gap-2 px-5 py-3 rounded-sm border border-mavis-gold/40 bg-mavis-gold/[0.08] text-mavis-fg hover:bg-mavis-gold/15 hover:border-mavis-gold/60 transition-all"
              >
                <span
                  className="text-[11px] uppercase font-light"
                  style={{ letterSpacing: "var(--tracking-display-wide)" }}
                >
                  WhatsApp this project
                </span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </a>
              <a
                href={`tel:+${BRAND.phone.numeric}`}
                className="group inline-flex items-center justify-between gap-2 px-5 py-3 rounded-sm border border-mavis-line text-mavis-fg-muted hover:text-mavis-fg hover:border-mavis-fg/30 transition-all"
              >
                <span
                  className="text-[11px] uppercase font-light"
                  style={{ letterSpacing: "var(--tracking-display-wide)" }}
                >
                  Call {BRAND.phone.display}
                </span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </a>
            </div>
          </aside>
        </div>
      </section>
    </article>
  );
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
