import DocumentToolsClient from "./DocumentToolsClient";

export const metadata = {
  title: "Document Tools & Image Compressor for Admission Forms | Rahbars",
  description: "Free document tools for university admission applications in Pakistan. Compress images, resize photos to under 100KB, convert documents.",
  alternates: { canonical: "https://www.rahbars.com/document-tools" },
};

export default function DocumentToolsPage() {
  return (
    <div>
      <DocumentToolsClient />
    </div>
  );
}
