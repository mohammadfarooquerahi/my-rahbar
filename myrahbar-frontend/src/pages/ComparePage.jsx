import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Plus, X, BarChart2, Check, Minus } from "lucide-react";
import { KARACHI_UNIVERSITIES } from "../data/universities";
import { formatFee } from "../utils/merit";

export default function ComparePage() {
  const [searchParams] = useSearchParams();

  const initialSlug = searchParams.get("uni1") || "";
  const initialUni = KARACHI_UNIVERSITIES.find((u) => u.slug === initialSlug);

  const [selected, setSelected] = useState(initialUni ? [initialUni] : []);

  const addUniversity = (slug) => {
    if (selected.length >= 3) return;
    const uni = KARACHI_UNIVERSITIES.find((u) => u.slug === slug);
    if (uni && !selected.find((s) => s.id === uni.id)) {
      setSelected([...selected, uni]);
    }
  };

  const removeUniversity = (id) => {
    setSelected(selected.filter((u) => u.id !== id));
  };

  const available = KARACHI_UNIVERSITIES.filter(
    (u) => !selected.find((s) => s.id === u.id),
  );

  // Rows to compare
  const rows = [
    {
      label: "Type",
      get: (u) => (u.type === "government" ? "Government" : "Private"),
    },
    { label: "Established", get: (u) => u.established },
    { label: "City", get: (u) => u.city },
    { label: "Campuses", get: (u) => u.campuses.length },
    { label: "Departments", get: (u
<truncated 8858 bytes>
cholarships.map((s) => (
                    <p
                      key={s}
                      className="text-xs text-slate-600 mb-0.5 flex items-start gap-1"
                    >
                      <Check
                        size={10}
                        className="text-green-500 shrink-0 mt-0.5"
                      />
                      {s}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Action row */}
            <div
              className="grid p-4"
              style={{
                gridTemplateColumns:
                  "200px " + "repeat(" + selected.length + ", 1fr)",
              }}
            >
              <div className="text-xs text-slate-400 flex items-center">
                View details
              </div>
              {selected.map((uni) => (
                <div key={uni.id} className="px-2">
                  <Link
                    to={"/university/" + uni.slug}
                    className="block text-center py-2 text-sm font-medium text-white rounded-xl"
                    style={{ background: "var(--navy)" }}
                  >
                    View {uni.shortName}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <BarChart2 size={40} className="mx-auto mb-4 opacity-40" />
            <p className="text-sm">
              Select at least one university above to start comparing
            </p>
          </div>
        )}
      </div>
    </>
  );
}
