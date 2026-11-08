import { getBlogs } from "@/lib/api";
import BlogClient from "./BlogClient";

export const revalidate = 60; // 60s ISR

export const metadata = {
  title: "Pakistani University Admissions & Career Guides 2026 | Rahbars",
  description: "Read expert admission guides, aggregate formulas, entry test tips, and university reviews in Pakistan.",
  alternates: { canonical: "https://www.rahbars.com/blog" },
};

export default async function BlogPage() {
  const blogs = await getBlogs();
  const serialized = JSON.parse(JSON.stringify(blogs || []));

  return <BlogClient initialBlogs={serialized} />;
}
