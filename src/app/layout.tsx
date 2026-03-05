import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://knex.com.bd"),
  title: {
    default: "KNEX - Online Shopping in Bangladesh",
    template: "%s | KNEX"
  },
  description: "Shop for Electronics, Fashion, Home, Beauty and more at KNEX. Best online shopping experience in Bangladesh with fast delivery.",
  keywords: ["online shopping", "bangladesh", "ecommerce", "knex", "electronics", "fashion"],
  authors: [{ name: "KNEX Team" }],
  creator: "KNEX",
  publisher: "KNEX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "KNEX - Online Shopping Bangladesh",
    description: "Shop for Electronics, Fashion, Home, Beauty and more at KNEX.",
    url: "https://knex.com.bd",
    siteName: "KNEX",
    locale: "en_BD",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Make sure this file exists in /public or use a real URL
        width: 1200,
        height: 630,
        alt: "KNEX Online Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KNEX - Online Shopping Bangladesh",
    description: "Shop for Electronics, Fashion, Home, Beauty and more at KNEX.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
