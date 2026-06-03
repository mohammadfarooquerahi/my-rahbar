import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  DollarSign,
  CheckCircle,
  LogOut,
  Edit2,
  Save,
  Heart,
} from "lucide-react";
import { useAuthStore, useWatchlistStore } from "../store";

const FIELDS = [
  "Computer Science",
  "Engineering",
  "Medical",
  "Business",
  "Arts",
  "Architecture",
  "Law",
  "Sciences",
];

export default function ProfilePage() {
  const { user, isLoggedIn, logout, updateProfile } = useAuthStore();
  const { universities } = useWatchlistStore();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    whatsapp: user?.whatsapp || "",
    matricPercent: user?.matricPercent || "",
    fscPercent: user?.fscPercent || "",
    fscSubjects: user?.fscSubjects || "Pre-Engineering",
    budget: user?.budget || "medium",
    needsScholarship: user?.needsScholarship || false,
    needsHostel: user?.needsHostel || false,
    preferredSector: user?.preferredSector || "any",
    interestedField: user?.interestedField || "",
  });

  // If not logged in redirect to login
  if (!isLoggedIn) {
    return (
      <div className="max-w-md m
<truncated 18807 bytes>
  className="block text-xs text-center text-blue-600 pt-1 hover:underline"
                  >
                    View all {universities.length} saved â†’
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <p
            className="text-sm font-semibold text-blue-800 mb-3"
            style={{ fontFamily: "Sora" }}
          >
            Quick Actions
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/find-university"
              className="text-xs font-medium text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100"
            >
              Retake University Quiz
            </Link>
            <Link
              to="/merit-calculator"
              className="text-xs font-medium text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100"
            >
              Calculate Merit
            </Link>
            <Link
              to="/career-match"
              className="text-xs font-medium text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100"
            >
              AI Career Guidance
            </Link>
            <Link
              to="/counseling"
              className="text-xs font-medium text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100"
            >
              Book Counseling
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
