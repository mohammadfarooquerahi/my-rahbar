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
        <title>My Watchlist â€” Saved Universities | MyRahbar</title>
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
         
<truncated 7336 bytes>
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
