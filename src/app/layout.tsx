import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ConditionalLandScout } from "@/components/ai/ConditionalLandScout";
import "./globals.css";

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Brandon Zelma Land | Southeast Ohio Land Pro",
    template: "%s | Brandon Zelma Land",
  },
  description:
    "Southeast Ohio land — hunt, farm, homestead, timber. Field-report dossiers, Mission Lab, free Land Scout AI, and veteran Land Pro Brandon Zelma with Buckeye Land Sales.",
  openGraph: {
    title: "Brandon Zelma Land",
    description:
      "Southeast Ohio land — explained by someone who walks it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ConditionalLandScout />
      </body>
    </html>
  );
}
