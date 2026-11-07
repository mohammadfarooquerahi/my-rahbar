import { getUniversities, getUniversityBySlug } from "@/lib/api";
import { formatFee } from "@/lib/merit";
import { notFound } from "next/navigation";
import UniversityClient from "./UniversityClient";

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
  const uni = await getUniversityBySlug(slug);
  if (!uni) return { title: "University Not Found" };

  const title = `${uni.name} - Admission, Merit, Fee 2026`;
  const description = `Explore ${uni.name} (${uni.city || "Pakistan"}). Check 2026 admission deadlines, eligibility criteria, fee structure, closing merit, and departments.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.rahbars.com/university/${slug}`,
      type: "website",
    },
    twitter: { title, description },
    alternates: {
      canonical: `https://www.rahbars.com/university/${slug}`,
    },
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: uni.name,
        alternateName: uni.shortName || uni.name,
        url: `https://www.rahbars.com/university/${slug}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: uni.city || "Pakistan",
          addressCountry: "PK",
        },
        description: uni.description || `Admission and merit details for ${uni.name}.`,
      }),
    },
  };
}

export default async function UniversityDetailPage({ params }) {
  const { slug } = await params;
  const uni = await getUniversityBySlug(slug);

  if (!uni) notFound();

  const depts = Array.isArray(uni.departments) ? uni.departments : [];

  return (
    <>
      {/* SEO-critical server-rendered HTML — Google sees this fully */}
      <article className="max-w-[1100px] mx-auto px-4 py-6" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-4">
          <a href="/" className="text-blue-600 hover:underline">Home</a> &gt;{" "}
          <a href="/find-university" className="text-blue-600 hover:underline">Universities</a> &gt;{" "}
          <span>{uni.name}</span>
        </nav>

        {/* University Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex flex-wrap gap-2 items-center mb-3">
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {uni.type || "University"}
            </span>
            <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
              📍 {uni.city || "Pakistan"}
            </span>
            {uni.established && (
              <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
                Est. {uni.established}
              </span>
            )}
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${uni.admissionOpen ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              {uni.admissionOpen ? "● Admissions Open 2026" : "○ Admissions Closed"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            {uni.name} {uni.shortName ? `(${uni.shortName})` : ""}
          </h1>

          <p className="text-base text-slate-600 leading-relaxed mb-4">
            {uni.description ||
              `${uni.name} is a renowned higher education institution in ${uni.city || "Pakistan"}. Check below for 2026 admission eligibility, fee structure, closing merit, and departments.`}
          </p>

          {uni.website && (
            <a href={uni.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold text-sm hover:underline">
              Visit Official Website ↗
            </a>
          )}
        </div>

        {/* Admission & Fee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Admission & Eligibility 2026</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {uni.eligibilityCriteria || "Intermediate / FSc / A-Level with minimum required marks as per HEC / University criteria."}
            </p>
            {uni.testRequired && (
              <p className="text-sm text-slate-600 mt-2">
                <strong>Entry Test:</strong> {uni.testRequired} ({uni.admissionTestType || "Entry Test"})
              </p>
            )}
            {uni.admissionDeadline && (
              <p className="text-sm text-red-600 mt-2 font-semibold">
                Deadline: {uni.admissionDeadline}
              </p>
            )}
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Fee & Facilities</h2>
            {uni.admissionFee && (
              <p className="text-sm text-slate-600"><strong>Admission Fee:</strong> PKR {uni.admissionFee}</p>
            )}
            <p className="text-sm text-slate-600">
              <strong>Hostel:</strong> {uni.hostelAvailable ? "Available" : "Not available"}
            </p>
            {uni.hostelFee && (
              <p className="text-sm text-slate-600"><strong>Hostel Fee:</strong> PKR {uni.hostelFee}</p>
            )}
            {uni.scholarships && (
              <p className="text-sm text-emerald-600 mt-2">
                <strong>Scholarships:</strong> {Array.isArray(uni.scholarships) ? uni.scholarships.join(", ") : uni.scholarships}
              </p>
            )}
          </div>
        </div>

        {/* Departments Table */}
        {depts.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Departments & Degrees Offered</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-200">
                    <th className="p-3 text-slate-600">Program / Department</th>
                    <th className="p-3 text-slate-600">Field</th>
                    <th className="p-3 text-slate-600">Semester Fee</th>
                    <th className="p-3 text-slate-600">Closing Merit</th>
                  </tr>
                </thead>
                <tbody>
                  {depts.map((d, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="p-3 font-semibold text-slate-800">{d.name}</td>
                      <td className="p-3 text-slate-500">{d.category || "General"}</td>
                      <td className="p-3 text-slate-800">
                        {d.semesterFee ? formatFee(d.semesterFee) : "Contact Uni"}
                      </td>
                      <td className="p-3 text-emerald-700 font-semibold">
                        {Array.isArray(d.lastMerit) && d.lastMerit.length > 0
                          ? `${d.lastMerit[0].closing}% (${d.lastMerit[0].year || "2024"})`
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-2xl p-6 text-center mb-6">
          <h3 className="text-xl font-extrabold mb-2">
            Calculate Your Admission Chances at {uni.shortName || uni.name}
          </h3>
          <p className="text-sm text-blue-100 mb-4">
            Use the free Rahbars aggregate calculator to compute your exact merit score.
          </p>
          <a href={`/${uni.slug}/merit-cal`} className="inline-block bg-white text-blue-700 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
            Open Merit Calculator →
          </a>
        </div>
      </article>

      {/* Interactive client-side features (tabs, reviews, watchlist, etc.) */}
      <UniversityClient uni={JSON.parse(JSON.stringify(uni))} />
    </>
  );
}
