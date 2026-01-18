import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"], // Required: Language subsets (add 'latin-ext', 'cyrillic' if needed)
  display: "swap", // Optional: 'auto' (default), 'block', 'swap', 'optional' — 'swap' for quick fallback
  variable: "--font-sans", // Optional: CSS variable for easy CSS/Tailwind use (e.g., font-family: var(--font-sans))
  weight: ["300", "400", "500", "600", "700", "800"], // Optional: Specify weights (Open Sans supports 300–800)
  style: ["normal", "italic"], // Optional: Normal or italic
  fallback: ["ui-sans-serif", "system-ui"], // Optional: Fallback fonts
});

import "./globals.css";

export const metadata: Metadata = {
  title: "IP Address Lookup - Public IP and Geolocation (iphound.net)",
  description:
    "What is my ip address? Lookup details about your IP address including location (lat/long, city, zip code), ISP and client/connection data via web or terminal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,500,0,0"
          rel="stylesheet"
        />
      </head>
      <body
        className={`antialiased ${openSans.variable || openSans.className}`}
      >
        {children}
      </body>
    </html>
  );
}
