import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://athasecurity.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ATHA Security — AI-Native Cybersecurity",
    template: "%s — ATHA Security",
  },
  description:
    "ATHA Security is a coordinated multi-agent security system designed to help modern software teams detect, analyze, respond to and verify security events.",
  keywords: [
    "ATHA Security",
    "cybersecurity",
    "multi-agent security",
    "AI-native security",
    "application security",
    "security automation",
  ],
  authors: [{ name: "ATHA Security" }],
  openGraph: {
    title: "ATHA Security — AI-Native Cybersecurity",
    description:
      "A coordinated security system built around specialized agents for detection, analysis, response and verification.",
    url: SITE_URL,
    siteName: "ATHA Security",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATHA Security — AI-Native Cybersecurity",
    description:
      "A coordinated security system built around specialized agents for detection, analysis, response and verification.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f9ff",
  width: "device-width",
  initialScale: 1,
};

/** Before-paint theme bootstrap: light is the default, localStorage wins. */
const themeBootstrap = `(function(){try{if(localStorage.getItem("atha-theme")==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
