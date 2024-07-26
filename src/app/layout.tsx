import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TENK ChatBot",
  description:
    "Website created for AI workshop held by Variant for TENK Camp 2024",

  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <Head>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
