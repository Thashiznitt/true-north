import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "True North | Your Digital Sanctuary for Spiritual Growth",
  description: "Align your daily life with your spiritual path. Realize your True North through sacred journaling, community circles, and daily guided affirmations.",
  keywords: [
    "spiritual growth", "digital sanctuary", "sacred journaling", 
    "daily affirmations", "mindfulness app", "community circles", 
    "meditation", "self-discovery", "True North App", "spiritual wellness", 
    "journaling app", "mental clarity"
  ],
  authors: [{ name: "True North" }],
  openGraph: {
    title: "True North | Your Digital Sanctuary",
    description: "Align your daily life with your spiritual path through sacred journaling, community circles, and daily affirmations.",
    url: "https://truenorth.you",
    siteName: "True North",
    images: [
      {
        url: "https://truenorth.you/logo.png",
        width: 1200,
        height: 630,
        alt: "True North - Your Digital Sanctuary",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "True North | Your Digital Sanctuary",
    description: "Align your daily life with your spiritual path through sacred journaling and daily affirmations.",
    images: ["https://truenorth.you/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased selection:bg-primary selection:text-primary-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
