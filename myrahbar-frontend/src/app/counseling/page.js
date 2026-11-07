import CounselingClient from "./CounselingClient";

export const metadata = {
  title: "1-on-1 University Admission Counseling | Rahbars",
  description: "Get personalized guidance from university seniors and education experts on university selection, field choice, and admission forms.",
  alternates: { canonical: "https://www.rahbars.com/counseling" },
};

export default function CounselingPage() {
  return (
    <div>
      <CounselingClient />
    </div>
  );
}
