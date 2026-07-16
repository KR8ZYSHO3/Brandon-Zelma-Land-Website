import { getSeoConfig } from "@/lib/seo-config-store";

export async function JsonLd() {
  const seo = await getSeoConfig();
  const url = seo.siteUrl || undefined;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        name: seo.brandName,
        description: seo.description,
        url: url || undefined,
        telephone: seo.phone || undefined,
        email: seo.email || undefined,
        areaServed: seo.areaServed,
        brand: { "@type": "Brand", name: seo.brandName },
        memberOf: {
          "@type": "Organization",
          name: seo.brokerName,
        },
        sameAs: seo.sameAs.length ? seo.sameAs : undefined,
      },
      {
        "@type": "Person",
        name: seo.personName,
        jobTitle: "Land Pro / Real Estate Salesperson",
        worksFor: { "@type": "Organization", name: seo.brokerName },
        telephone: seo.phone || undefined,
        url: url || undefined,
      },
      {
        "@type": "WebSite",
        name: seo.brandName,
        url: url || undefined,
        description: seo.description,
        potentialAction: {
          "@type": "SearchAction",
          target: `${url || ""}/find`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
