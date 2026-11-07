import FindUniClient from "./FindUniClient";

export const metadata = {
  title: "Smart University Matcher & Finder | Rahbars",
  description: "Find the best universities matching your marks, budget, and preferred career path in Pakistan.",
  alternates: { canonical: "https://www.rahbars.com/find-university" },
};

export default function FindUniversityPage() {
  return (
    <div>
      <FindUniClient />
      
      {/* Hidden SEO content for Google crawler */}
      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-slate-100 mt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">How Rahbars Smart University Finder Works</h2>
        <div className="prose prose-slate max-w-none text-slate-600">
          <p>The Rahbars Smart University Finder algorithm matches prospective students to leading universities in Pakistan based on their academic marks, field of interest (such as Computer Science, Engineering, Medicine, Business, and Law), location preference, and tuition fee budget.</p>
          <p>Get personalized recommendations with closing merits, scholarship opportunities, and application deadlines.</p>
        </div>
      </section>
    </div>
  );
}
