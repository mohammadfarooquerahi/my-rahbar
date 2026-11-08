import { getNews } from "@/lib/api";
import NewsClient from "./NewsClient";

export const revalidate = 60; // 60s ISR

export const metadata = {
  title: "Admission News & Notifications 2026 | Rahbars",
  description: "Latest university admission news, notifications, and announcements for Pakistani students.",
  alternates: { canonical: "https://www.rahbars.com/news" },
};

export default async function NewsPage() {
  const newsItems = await getNews();
  const serialized = JSON.parse(JSON.stringify(Array.isArray(newsItems) ? newsItems : []));

  return <NewsClient initialNews={serialized} />;
}
