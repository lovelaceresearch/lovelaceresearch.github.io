import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const favoritRegular = localFont({
  src: "../../public/fonts/ABCFavoritHangul-Regular.woff2",
  variable: "--font-favorit-regular",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lovelace Research",
  description: "Independent research-led innovation lab for personal & humane AI",
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
      </body>
    </html>
  );
}
