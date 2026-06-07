import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Heart,
  Bell,
  Trash2,
  MapPin,
  Star,
  Clock,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { useWatchlistStore, useAuthStore } from "../store";
import { daysUntilDeadline, deadlineLabel } from "../utils/merit";

export default function WatchlistPage() {
  const { universities, removeUniversity } = useWatchlistStore();
  const { isLoggedIn } = useAuthStore();

  const colorMap = {
    red: "text-red-600",
    orange: "text-orange-500",
    yellow: "text-yellow-600",
    green: "text-green-600",
  };

  return (
    <>
      <Helmet>
        <title>My Watchlist — Saved Universities | Rahbars</title>
        <meta
          name="description"
          content="View your saved universities and departments. Get deadline alerts on WhatsApp and email."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "Sora", color: "var(--navy)" }}
            >
              My Watchlist
            </h1>
            <p className="text-slate-500 mt-1">
              {universities.length} saved{" "}
              {universities.length === 1 ? "university" : "universities"}
            </p>
          </div>

          {/* Alert setup prompt */}
          {!isLoggedIn && universities.length > 0 && (
            <Link
              to="/auth/register"
              className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-xl"
              style={{ background: "var(--navy)" }}
            >
              <Bell size={14} />
              Enable Alerts
            </Link>
          )}
        </div>

        {/* Alert info banner */}
        {universities.length > 0 && !isLoggedIn && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <Bell size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Want deadline alerts on WhatsApp?
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Sign up for free to get WhatsApp and email alerts 7 days and 1
                day before each university deadline.
              </p>
              <Link
                to="/auth/register"
                className="inline-block mt-2 text-xs font-medium text-amber-800 underline"
              >
                Create free account →
              </Link>
            </div>
          </div>
        )}

        {/* Empty state */}
        {universities.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Heart size={44} className="mx-auto mb-4 text-slate-300" />
            <h3
              className="text-xl font-bold text-slate-600 mb-2"
              style={{ fontFamily: "Sora" }}
            >
              No universities saved yet
            </h3>
            <p className="text-slate-400 mb-6 text-sm">
              Click the heart icon on any university to save it here
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-xl"
              style={{ background: "var(--navy)" }}
            >
              Browse Universities
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Saved universities list */}
        {universities.length > 0 && (
          <div className="space-y-4">
            {universities.map((uni) => {
              const days = daysUntilDeadline(uni.admissionDeadline);
              const dl = deadlineLabel(days);

              return (
                <div
                  key={uni.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                        style={{
                          background: "var(--navy)",
                          fontFamily: "Sora",
                        }}
                      >
                        {uni.shortName?.slice(0, 2)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className={
                              "text-xs font-medium px-2 py-0.5 rounded-full " +
                              (uni.type === "government"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-purple-50 text-purple-700")
                            }
                          >
                            {uni.type === "government"
                              ? "Government"
                              : "Private"}
                          </span>
                          {uni.admissionOpen && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                              Open
                            </span>
                          )}
                        </div>

                        <h3
                          className="font-bold text-slate-800 truncate"
                          style={{ fontFamily: "Sora" }}
                        >
                          {uni.name}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin size={10} /> {uni.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star
                              size={10}
                              className="text-amber-400"
                              fill="currentColor"
                            />
                            {uni.overallRating}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen size={10} />
                            {uni.departments?.length} Depts
                          </span>
                        </div>

                        {/* Deadline */}
                        <div className="flex items-center gap-1 mt-2">
                          <Clock size={11} />
                          <span
                            className={
                              "text-xs font-medium " +
                              (colorMap[dl.color] || "text-slate-500")
                            }
                          >
                            {dl.text}
                          </span>
                          <span className="text-xs text-slate-400">
                            —{" "}
                            {new Date(uni.admissionDeadline).toLocaleDateString(
                              "en-PK",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={"/university/" + uni.slug}
                        className="text-xs font-medium text-white px-3 py-1.5 rounded-lg"
                        style={{ background: "var(--navy)" }}
                      >
                        View
                      </Link>
                      <Link
                        to={"/merit-calculator?uni=" + uni.slug}
                        className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100"
                      >
                        Merit
                      </Link>
                      <button
                        onClick={() => removeUniversity(uni.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                        title="Remove from watchlist"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bottom tip */}
            <div className="text-center pt-4">
              <Link
                to="/search"
                className="text-sm text-slate-400 hover:text-slate-600 hover:underline"
              >
                + Add more universities
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
