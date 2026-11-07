import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const metadata = {
  title: "Search & Filter Universities in Pakistan 2026 | Rahbars",
  description: "Search and filter 100+ universities in Pakistan by city, degree level, tuition fee, closing merit, and entry test.",
  alternates: { canonical: "https://www.rahbars.com/search" },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Universities...</div>}>
      <SearchClient />
    </Suspense>
  );
}
