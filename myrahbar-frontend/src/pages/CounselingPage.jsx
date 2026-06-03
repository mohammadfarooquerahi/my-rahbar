import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Headphones,
  CheckCircle,
  Clock,
  Star,
  MessageCircle,
  Calendar,
  User,
  Mail,
  Phone,
} from "lucide-react";

const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

const TOPICS = [
  "University Selection",
  "Merit and Aggregate Confusion",
  "Scholarship Guidance",
  "Career Path Selection",
  "Document Preparation",
  "Admission Form Help",
  "After Admission Guidance",
  "Other",
];

export default function CounselingPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    topic: "",
    slot: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
    setLoading(false);
  };

  const isValid =
    form.name && form.email && form.whatsapp && form.topic && form.slot;

  const features 
<truncated 12936 bytes>
      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Anything else you want to share? (optional)
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="Tell us your FSc marks, which university you are confused about, your budget..."
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid || loading}
                    className="w-full py-3 text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: "var(--navy)" }}
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Calendar size={15} />
                        Confirm Booking
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
