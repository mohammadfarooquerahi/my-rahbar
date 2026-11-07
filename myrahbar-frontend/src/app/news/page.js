import { getNews } from "@/lib/api";

export const revalidate = 1800;

export const metadata = {
  title: "Admission News & Notifications 2026",
  description: "Latest university admission news, notifications, and announcements for Pakistani students.",
  alternates: { canonical: "https://www.rahbars.com/news" },
};

const TYPE_META = {
  news: { label: "News", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  notification: { label: "Notification", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  announcement: { label: "Announcement", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  admission: { label: "Admission", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
};

export default async function NewsPage() {
  const newsItems = await getNews();
  const items = Array.isArray(newsItems) ? newsItems : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: "Sora" }}>
          Admission <span className="text-blue-600">News</span>
        </h1>
        <p className="text-slate-500">Stay updated with the latest university admission news and notifications across Pakistan.</p>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-slate-400 py-20">No news items yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const meta = TYPE_META[item.type] || TYPE_META.news;
            const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "";
            return (
              <article key={item._id} className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${meta.bg} ${meta.text} ${meta.border}`}>{meta.label}</span>
                  {date && <span className="text-xs text-slate-400">{date}</span>}
                  {item.priority === "high" && <span className="text-xs font-bold text-red-600">🔴 Urgent</span>}
                </div>
                <h2 className="font-bold text-slate-900 text-base mb-1">{item.title}</h2>
                {item.description && <p className="text-sm text-slate-500">{item.description}</p>}
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 font-semibold hover:underline mt-2 inline-block">Read More ↗</a>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
