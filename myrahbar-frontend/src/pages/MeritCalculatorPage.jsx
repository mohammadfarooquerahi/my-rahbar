import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Calculator,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { KARACHI_UNIVERSITIES } from "../data/universities";
import { calculateAggregate, getMeritStatus } from "../utils/merit";

export default function MeritCalculatorPage() {
  const [searchParams] = useSearchParams();

  const [selectedUniSlug, setSelectedUniSlug] = useState(
    searchParams.get("uni") || "",
  );
  const [selectedDeptName, setSelectedDeptName] = useState("");
  const [matric, setMatric] = useState("");
  const [fsc, setFsc] = useState("");
  const [testScore, setTest] = useState("");
  const [aggregate, setAggregate] = useState(null);
  const [status, setStatus] = useState(null);

  const selectedUni = KARACHI_UNIVERSITIES.find(
    (u) => u.slug === selectedUniSlug,
  );

  const selectedDept = selectedUni?.departments.find(
    (d) => d.name === selectedDeptName,
  );

  // Auto calculate whenever inputs change
  useEffect(() => {
    if (!selectedUni || !matric || !fsc) {
      setAggregate(null);
      setStatus(null);
      return;
    }

    const formula = selectedUni.aggregateFormula;
    const agg = calculateAggregate(matric, fsc, testScore, formula);
    setAggregate
<truncated 12223 bytes>
div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to action */}
              <div className="flex gap-3 pt-2">
                <Link
                  to={
                    selectedUni ? "/university/" + selectedUni.slug : "/search"
                  }
                  className="flex-1 text-center py-2.5 text-sm font-medium text-white rounded-xl"
                  style={{ background: "var(--navy)" }}
                >
                  View University Details
                </Link>
                <Link
                  to="/compare"
                  className="flex-1 text-center py-2.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100"
                >
                  Compare Universities
                </Link>
              </div>
            </div>
          )}

          {/* Empty state hint */}
          {!selectedUni && (
            <div className="text-center py-8 text-slate-400">
              <TrendingUp size={36} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">
                Select a university above to start calculating
              </p>
            </div>
          )}
        </div>

        {/* Info note */}
        <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 px-1">
          <Info size={13} className="shrink-0 mt-0.5" />
          <p>
            Merit data is based on last available year. Actual closing merit
            changes every year. Always verify on the official university
            website.
          </p>
        </div>
      </div>
    </>
  );
}
