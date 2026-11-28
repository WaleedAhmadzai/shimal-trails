import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { FavouritesProvider } from "@/context/FavouritesProvider";
import { ItineraryProvider } from "@/context/ItineraryProvider";
import { ToastProvider } from "@/context/ToastProvider";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shimal-trails.vercel.app"),
  title: {
    default: "Shimal Trails · Plan your trip to northern Pakistan",
    template: "%s · Shimal Trails",
  },
  description:
    "Plan a realistic trip to Hunza, Skardu, Naran, Swat and more: real drive times, season and altitude checks, and a live budget in PKR.",
  openGraph: {
    type: "website",
    siteName: "Shimal Trails",
    locale: "en_PK",
  },
};

export const viewport: Viewport = {
  themeColor: "#123f2a",
};

const NAV_LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/itinerary", label: "Itinerary" },
  { href: "/plan-trip", label: "Get a quote" },
  { href: "/about", label: "About" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${instrument.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <ItineraryProvider>
          <FavouritesProvider>
            <ToastProvider>
              <Navbar links={NAV_LINKS} />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer links={[{ href: "/", label: "Home" }, ...NAV_LINKS]} />
            </ToastProvider>
          </FavouritesProvider>
        </ItineraryProvider>
      </body>
    </html>
  );
}
