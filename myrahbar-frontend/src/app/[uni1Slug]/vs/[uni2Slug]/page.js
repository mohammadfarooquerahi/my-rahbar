import { Suspense } from "react";
import CompareClient from "@/app/compare/CompareClient";

export async function generateMetadata({ params }) {
  const { uni1Slug, uni2Slug } = await params;
  const name1 = uni1Slug ? uni1Slug.replace(/-/g, " ").toUpperCase() : "University 1";
  const name2 = uni2Slug ? uni2Slug.replace(/-/g, " ").toUpperCase() : "University 2";
  return {
    title: `${name1} vs ${name2} Comparison | Rahbars`,
    description: `Compare fees, merit, rankings, and programs between ${name1} and ${name2}.`,
    alternates: { canonical: `https://www.rahbars.com/${uni1Slug}/vs/${uni2Slug}` },
  };
}

export default function UniVsUniPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Comparison...</div>}>
      <CompareClient />
    </Suspense>
  );
}
