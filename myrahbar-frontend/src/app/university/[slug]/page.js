import { getUniversities, getUniversityBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import UniversityDetailClient from "./UniversityDetailClient";

// Generate static pages for all universities at build time
export async function generateStaticParams() {
  const universities = await getUniversities();
  return universities
    .filter((u) => u.slug)
    .map((u) => ({ slug: u.slug }));
}

// ISR: revalidate every 30 minutes
export const revalidate = 1800;

// Dynamic metadata per university
export async function generateMetadata({ params }) {
  const { slug } = await params;
  let uni = null;
  try {
    uni = await getUniversityBySlug(slug);
  } catch {}

  const prettyName = slug
    ? slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "University";

  const title = uni?.seoTitle?.replace(/\s*\|\s*Rahbars.*$/i, "") || `${uni?.name || prettyName} — Admission, Merit, Fee 2026`;
  const description =
    uni?.seoDescription ||
    `Explore ${uni?.name || prettyName} (${uni?.city || "Pakistan"}). Check 2026 admission deadlines, eligibility criteria, fee structure, closing merit, and departments.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.rahbars.com/university/${slug}`,
      type: "website",
      images: [uni?.image || uni?.logo || "https://www.rahbars.com/og-image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [uni?.image || uni?.logo || "https://www.rahbars.com/og-image.jpg"],
    },
    alternates: {
      canonical: `https://www.rahbars.com/university/${slug}`,
    },
    other: {
      "application/ld+json": JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "CollegeOrUniversity",
          name: uni?.name || prettyName,
          alternateName: uni?.shortName || uni?.name || prettyName,
          url: uni?.website || `https://www.rahbars.com/university/${slug}`,
          logo: uni?.logo || "https://www.rahbars.com/logo-full.png",
          description: uni?.description || `Admission and merit details for ${uni?.name || prettyName}.`,
          address: {
            "@type": "PostalAddress",
            addressLocality: uni?.city || "Pakistan",
            addressRegion: uni?.province || "Pakistan",
            addressCountry: "PK",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.rahbars.com" },
            { "@type": "ListItem", "position": 2, "name": "Universities", "item": "https://www.rahbars.com/search" },
            { "@type": "ListItem", "position": 3, "name": uni?.name || prettyName, "item": `https://www.rahbars.com/university/${slug}` }
          ],
        },
      ]),
    },
  };
}

export default async function UniversityDetailPage({ params }) {
  const { slug } = await params;
  let uni = null;
  try {
    uni = await getUniversityBySlug(slug);
  } catch (err) {
    console.warn("[UniversityDetailPage] Server fetch fallback:", err.message);
  }

  const serializedUni = uni ? JSON.parse(JSON.stringify(uni)) : null;

  return (
    <div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-slate-500 font-medium">Loading university details...</p>
          </div>
        }
      >
        <UniversityDetailClient initialUni={serializedUni} />
      </Suspense>

      {/* SEO-critical content rendered on server for Google Crawler when available */}
      {uni && (
        <section className="sr-only" aria-hidden="true">
          <h2>About {uni.name}</h2>
          <p>{uni.description}</p>
          <p>Location: {uni.city}, {uni.province || "Pakistan"}</p>
          <p>Type: {uni.type}</p>
          <p>Website: {uni.website}</p>
          <h3>Departments and Programs</h3>
          <ul>
            {(uni.departments || []).map((d, i) => (
              <li key={i}>
                {d.name} ({d.category}) - Semester Fee: PKR {d.semesterFee || "N/A"}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
