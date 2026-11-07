import CareerMatchClient from "./CareerMatchClient";

export const metadata = {
  title: "AI Career Matcher & Admission Advisor | Rahbars",
  description: "Chat with Rahbars AI Admission Counselor to discover fields matching your skills, personality, and career ambitions in Pakistan.",
  alternates: { canonical: "https://www.rahbars.com/career-match" },
};

export default function CareerMatchPage() {
  return (
    <div>
      <CareerMatchClient />
    </div>
  );
}
