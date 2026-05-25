import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { BRAND } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${BRAND.domain}`),
  title: {
    default: `${BRAND.shortName} Infra — Premium Apartments in Bangalore`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    "RERA-verified channel partner for Sobha, Prestige, Brigade, Godrej, Puravankara & 20+ Bangalore builders. 200+ families helped. Free site visits, home loans, after-sales support.",
  keywords: [
    "Bangalore real estate",
    "premium apartments Bangalore",
    "Sobha Hoskote",
    "Sobha OneWorld",
    "RERA approved",
    "channel partner",
    "Mavis Infra",
  ],
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `https://${BRAND.domain}`,
    siteName: BRAND.name,
    title: `${BRAND.name} — Premium Apartments in Bangalore`,
    description:
      "Sale is not the end. It's the beginning of our service. 200+ families helped, 37 repeat clients.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.shortName} Infra — Premium Apartments in Bangalore`,
    description:
      "RERA-verified channel partner for top Bangalore builders. After-sales service included.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-mavis-bg text-mavis-fg">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingActions />
        {/* Site-wide film grain — gives the digital surface a "printed" texture.
            Fixed so it stays put as the page scrolls. z-50 sits above sections
            but below the floating-actions cluster (z-40 with backdrop). */}
        <div
          aria-hidden="true"
          className="film-grain fixed inset-0 z-[35]"
        />
      </body>
    </html>
  );
}
