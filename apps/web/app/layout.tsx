import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { AmbientBackground } from "@/components/ambient-background";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "nook",
  description:
    "Browse fresh apartment rental listings in Tbilisi, aggregated hourly from Telegram channels.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans text-foreground antialiased [font-family:var(--font-sans),ui-sans-serif,system-ui,sans-serif]">
        <a
          href="#content"
          className="sr-only z-50 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <AmbientBackground />
        <Header />
        <div id="content" className="relative z-10 flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
