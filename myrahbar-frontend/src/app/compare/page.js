import { Suspense } from "react";
import CompareClient from "./CompareClient";

export const metadata = {
  title: "Compare Universities Side-by-Side | Rahbars",
  description: "Compare fee structures, eligibility, test requirements, departments, and rankings of top Pakistani universities.",
  alternates: { canonical: "https://www.rahbars.com/compare" },
};

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Comparison...</div>}>
      <CompareClient />
    </Suspense>
  );
}
