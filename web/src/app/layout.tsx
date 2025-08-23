import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import MobileNav from "./(components)/MobileNav";

const favoritRegular = localFont({
  src: "../../public/fonts/ABCFavoritHangul-Regular.woff2",
  variable: "--font-favorit-regular",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lovelace Research",
  description: "Independent research-led innovation lab for personal & humane AI",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${favoritRegular.variable}`}>
      <body>
        {children}
        <Analytics />
        <MobileNav />
      </body>
    </html>
  );
}
