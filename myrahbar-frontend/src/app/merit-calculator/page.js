import { Suspense } from "react";
import MeritCalculatorClient from "./MeritCalculatorClient";

export const metadata = {
  title: "Pakistan University Aggregate & Merit Calculator | Rahbars",
  description:
    "Calculate your exact university admission aggregate for NED, NUST, FAST, Karachi University, Dow, and other top universities in Pakistan.",
  alternates: { canonical: "https://www.rahbars.com/merit-calculator" },
};

export default function MeritCalculatorPage() {
  return (
    <div>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Calculator...</div>}>
        <MeritCalculatorClient />
      </Suspense>

      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-slate-100 mt-12 text-slate-600">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">How Pakistan University Aggregate Is Calculated</h2>
        <p>Every university in Pakistan uses a specific aggregate formula to calculate your admission merit score. For instance, engineering universities commonly give 50% weightage to their entry test, 40% to F.Sc (Intermediate), and 10% to Matriculation. Medical colleges (MDCAT) follow the PMDC criteria.</p>
      </section>
    </div>
  );
}
