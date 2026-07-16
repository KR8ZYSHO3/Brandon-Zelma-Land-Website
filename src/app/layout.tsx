import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ConditionalLandScout } from "@/components/ai/ConditionalLandScout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSeoConfig } from "@/lib/seo-config-store";
import "./globals.css";

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoConfig();
  return {
    title: {
      default: seo.titleDefault,
      template: seo.titleTemplate,
    },
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.brandName,
      description: seo.description,
      type: "website",
      url: seo.siteUrl || undefined,
    },
    verification: {
      google: seo.googleSiteVerification || undefined,
      other: seo.bingSiteVerification
        ? { "msvalidate.01": seo.bingSiteVerification }
        : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <JsonLd />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ConditionalLandScout />
      </body>
    </html>
  );
}
