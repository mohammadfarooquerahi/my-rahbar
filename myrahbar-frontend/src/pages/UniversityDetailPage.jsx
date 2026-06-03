import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Globe,
  Clock,
  Star,
  Heart,
  BookOpen,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Home,
  BarChart2,
  ChevronRight,
  FileText,
  Phone,
  Award,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { KARACHI_UNIVERSITIES } from "../data/universities";
import { useWatchlistStore } from "../store";
import { daysUntilDeadline, deadlineLabel, formatFee } from "../utils/merit";

const TABS = [
  "Overview",
  "Admission",
  "Fee & Expenses",
  "Scholarships",
  "Reviews",
  "Past Papers",
];

export default function UniversityDetailPage() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const { isWatched, addUniversity, removeUniversity } = useWatchlistStore();

  const uni = KARACHI_UNIVERSITIES.find((u) => u.slug === slug);

  if (!uni) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <BookOpen size={48} className="mx-auto mb-4 text-slate-300" />
        <h2
          className="text-2xl font-bold text-slate-700 mb-2"
          style={{ fontFamily: "Sora" }}
        >
          University Not Found
5
<truncated 30663 bytes>
xt-blue-600 hover:text-blue-800"
              >
                <BarChart2 size={14} />
                Add to comparison â†’
              </Link>
            </div>

            {/* Merit calculator shortcut */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <TrendingUp size={14} /> Check Your Chances
              </p>
              <p className="text-xs text-blue-600 mb-3">
                Use the merit calculator to see if you qualify for this
                university.
              </p>
              <Link
                to={"/merit-calculator?uni=" + uni.slug}
                className="block w-full text-center py-2 bg-blue-700 text-white text-sm font-medium rounded-xl hover:bg-blue-800 transition-colors"
              >
                Calculate Merit
              </Link>
            </div>

            {/* Counseling */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-700 mb-1">
                Need Help Deciding?
              </p>
              <p className="text-xs text-slate-500 mb-3">
                Book a 1-on-1 counseling session with an admission expert.
              </p>
              <Link
                to="/counseling"
                className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800"
              >
                <Phone size={13} />
                Book Counseling â†’
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
