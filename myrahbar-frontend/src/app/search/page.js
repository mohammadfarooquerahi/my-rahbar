import { Suspense } from "react";
import { getUniversities } from "@/lib/api";
import SearchClient from "./SearchClient";

export const revalidate = 1800; // ISR: 30 minutes

export const metadata = {
  title: "Search & Filter Universities in Pakistan 2026 | Rahbars",
  description: "Search and filter 100+ universities in Pakistan by city, degree level, tuition fee, closing merit, and entry test.",
  alternates: { canonical: "https://www.rahbars.com/search" },
};

export default async function SearchPage() {
  const universities = await getUniversities();
  const serialized = JSON.parse(JSON.stringify(universities || []));

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-500 font-medium">Loading Universities...</p>
        </div>
      }
    >
      <SearchClient initialUnis={serialized} />
    </Suspense>
  );
}
