import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  Upload,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Trash2,
  Info,
  Loader,
} from "lucide-react";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];
const MAX_SIZE_MB = 5;

export default function DocumentToolsPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [targetSize, setTargetSize] = useState(200);
  const [quality, setQuality] = useState(0.7);
  const inputRef = useRef(null);

  const handleFile = (selected) => {
    setError("");
    setCompressed(null);

    if (!selected) return;

    // Type check
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError("Only JPG, PNG and PDF files are accepted.");
      return;
    }

    // Size check
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError("File is too large. Maximum allowed size is 5MB.");
      return;
    }

    setFile(selected);

    // Show preview for images
    if (selected.type.startsWith("image/")) {
      const reader = new FileReader();
      read
<truncated 14204 bytes>
 >
                      New File
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Tips for Document Submission
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle
                size={14}
                className="text-green-500 shrink-0 mt-0.5"
              />
              Always scan documents in good lighting â€” blurry scans get rejected
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle
                size={14}
                className="text-green-500 shrink-0 mt-0.5"
              />
              Keep a copy of every document you upload, on your phone and email
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle
                size={14}
                className="text-green-500 shrink-0 mt-0.5"
              />
              Passport photos should be recent, plain white background, formal
              dress
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle
                size={14}
                className="text-green-500 shrink-0 mt-0.5"
              />
              Check each university page for their specific format requirements
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
