import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Color Baddies — Free Online Adult Coloring Book | Baddie Coloring Pages",
  description:
    "Color Baddies is a free online adult coloring book featuring bold, beautiful baddie illustrations. Tap to fill with solid colors, gradients, and skin tones. No download required — color right in your browser on phone or desktop.",
  keywords: [
    "adult coloring book",
    "online coloring book",
    "free coloring pages",
    "baddie coloring pages",
    "coloring app",
    "color by tap",
    "digital coloring book",
    "relaxing coloring",
    "black girl coloring pages",
    "adult coloring online free",
    "coloring book for adults",
    "stress relief coloring",
    "gradient coloring",
    "skin tone coloring",
  ],
  openGraph: {
    title: "Color Baddies — Free Online Adult Coloring Book",
    description:
      "Bold, beautiful baddie illustrations you can color right in your browser. Solid fills, gradients, skin tones — no download needed.",
    url: "https://colorbaddies.com",
    siteName: "Color Baddies",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Baddies — Free Online Adult Coloring Book",
    description:
      "Bold, beautiful baddie illustrations you can color right in your browser. Solid fills, gradients, skin tones — no download needed.",
  },
  metadataBase: new URL("https://colorbaddies.com"),
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Color Baddies",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F472B6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9884036004694992"
          crossOrigin="anonymous"
        />
      </head>
      <body className="h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
