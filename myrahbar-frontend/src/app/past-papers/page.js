import PastPapersClient from "./PastPapersClient";

export const metadata = {
  title: "Entry Test Past Papers & Sample Papers | Rahbars",
  description: "Download past papers and sample test questions for NED, ECAT, MDCAT, NUST NET, FAST, and IBA.",
  alternates: { canonical: "https://www.rahbars.com/past-papers" },
};

export default function PastPapersPage() {
  return (
    <div>
      <PastPapersClient />
    </div>
  );
}
