import { Suspense } from "react";
import MeritCalculatorClient from "@/app/merit-calculator/MeritCalculatorClient";

export async function generateMetadata({ params }) {
  const { uniSlug } = await params;
  const name = uniSlug ? uniSlug.replace(/-/g, " ").toUpperCase() : "University";
  return {
    title: `${name} Merit & Aggregate Calculator | Rahbars`,
    description: `Calculate your aggregate score and check admission chances for ${name}.`,
    alternates: { canonical: `https://www.rahbars.com/${uniSlug}/merit-cal` },
  };
}

export default function UniMeritCalculatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Calculator...</div>}>
      <MeritCalculatorClient />
    </Suspense>
  );
}
