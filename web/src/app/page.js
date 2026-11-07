import { getUniversities, getHeroStudents } from "@/lib/api";
import HomeClient from "./HomeClient";

// This is the HOME PAGE - Server Component that fetches data and passes to client
export const revalidate = 3600; // ISR: revalidate every hour

export default async function HomePage() {
  const [universities, heroStudents] = await Promise.all([
    getUniversities(),
    getHeroStudents(),
  ]);

  // Static fallback for hero students
  const STATIC_HERO_STUDENTS = [
    { _id: "s1", name: "Sudheer Mantharani", tag: "FAST", subtitle: "BS Computer Science", imageUrl: "/hero/sudheer-mantharani.png", color: "emerald", order: 1 },
    { _id: "s2", name: "Muzammil Ahmed", tag: "UET Taxila", subtitle: "BS Mechanical Engineering", imageUrl: "/hero/muzammil-ahmed.jpg", color: "rose", order: 2 },
    { _id: "s3", name: "Muhammad Abdullah", tag: "LUMS", subtitle: "BSc Accounting & Finance", imageUrl: "/hero/muhammad-abdullah.jpg", color: "amber", order: 3 },
    { _id: "s4", name: "Aleena Zia", tag: "NUST", subtitle: "BS Computer Engineering", imageUrl: "/hero/aleena-zia.png", color: "purple", order: 4 },
    { _id: "s5", name: "Faizan Ahmed", tag: "NED", subtitle: "BE Civil Engineering", imageUrl: "/hero/faizan-ahmed.png", color: "blue", order: 5 },
    { _id: "s6", name: "Abdullah Aamir", tag: "NUST", subtitle: "BS Artificial Intelligence", imageUrl: "/hero/abdullah-aamir.jpg", color: "sky", order: 6 },
  ];

  const students = heroStudents.length > 0 ? heroStudents : STATIC_HERO_STUDENTS;

  // Normalize universities
  const normalizedUnis = universities.map((u) => ({ ...u, id: u._id || u.id }));

  return (
    <>
      {/* SEO-critical content rendered as static HTML by the server */}
      <section className="sr-only" aria-label="SEO Content">
        <h1>Rahbars — Pakistan&apos;s #1 University Admission & Merit Intelligence Platform</h1>
        <p>Find the best universities in Pakistan. Calculate your merit score, compare fee structures, check admission deadlines, and apply smarter with Rahbars.</p>
        <h2>Featured Universities</h2>
        <ul>
          {normalizedUnis.slice(0, 20).map((uni) => (
            <li key={uni.id || uni.slug}>
              <a href={`/university/${uni.slug}`}>
                {uni.name} ({uni.shortName || uni.city}) — {uni.type} university in {uni.city || "Pakistan"}
                {uni.admissionOpen ? " — Admissions Open 2026" : ""}
              </a>
            </li>
          ))}
        </ul>
        <h2>Tools & Features</h2>
        <ul>
          <li><a href="/find-university">Smart University Finder — Answer 10 questions, get matched</a></li>
          <li><a href="/merit-calculator">Aggregate & Merit Calculator 2026</a></li>
          <li><a href="/compare">Compare Universities Side by Side</a></li>
          <li><a href="/past-papers">Download Past Papers & Entry Test Solutions</a></li>
          <li><a href="/blog">Admission Guides & Articles</a></li>
          <li><a href="/counseling">1-on-1 Expert Career Counseling</a></li>
        </ul>
      </section>

      {/* Interactive client component with the full UI */}
      <HomeClient universities={normalizedUnis} students={students} />
    </>
  );
}
