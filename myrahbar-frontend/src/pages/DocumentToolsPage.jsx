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
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    handleFile(dropped);
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      // For images — compress using canvas
      if (file.type.startsWith("image/")) {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const canvas = document.createElement("canvas");

        // Scale down if needed
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Keep reducing quality until under target size
        let q = quality;
        let dataUrl = canvas.toDataURL("image/jpeg", q);

        while (dataUrl.length > targetSize * 1024 * 1.37 && q > 0.1) {
          q -= 0.05;
          dataUrl = canvas.toDataURL("image/jpeg", q);
        }

        setCompressed({
          dataUrl,
          size: Math.round((dataUrl.length * 0.75) / 1024),
          type: "image/jpeg",
          name: file.name.replace(/\.[^.]+$/, "") + "_compressed.jpg",
        });
      } else {
        // For PDF — just return as is with a note
        // Real PDF compression needs a server-side library
        const reader = new FileReader();
        reader.onload = (e) => {
          setCompressed({
            dataUrl: e.target.result,
            size: Math.round(file.size / 1024),
            type: "application/pdf",
            name: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
    } catch {
      setError("Something went wrong while compressing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressed) return;
    const link = document.createElement("a");
    link.href = compressed.dataUrl;
    link.download = compressed.name;
    link.click();
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setCompressed(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const originalSizeKB = file ? Math.round(file.size / 1024) : 0;
  const savedPercent = compressed
    ? Math.round(((originalSizeKB - compressed.size) / originalSizeKB) * 100)
    : 0;

  return (
    <>
      <Helmet>
        <title>Document Tools — Compress & Prepare Files | MyRahbar</title>
        <meta
          name="description"
          content="Compress and resize your documents for university admission. Reduce JPG, PNG file size to meet university requirements."
        />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#FFFBEB" }}
          >
            <FileText size={26} style={{ color: "#F39C12" }} />
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "Sora", color: "var(--navy)" }}
          >
            Document Tools
          </h1>
          <p className="text-slate-500">
            Compress your documents to meet university size requirements
          </p>
        </div>

        {/* Required documents info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <p className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Info size={14} />
            Common University Document Requirements
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
            <p>• Passport Photo: 200KB max, JPG</p>
            <p>• CNIC / B-Form: 500KB max, JPG/PDF</p>
            <p>• Marksheet: 1MB max, PDF/JPG</p>
            <p>• Character Certificate: 500KB max</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          {/* Upload zone */}
          {!file && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-10 text-center cursor-pointer transition-colors"
            >
              <Upload size={32} className="mx-auto mb-3 text-slate-400" />
              <p className="font-medium text-slate-700 mb-1">
                Drop your file here or click to upload
              </p>
              <p className="text-sm text-slate-400">
                Supports JPG, PNG, PDF — max 5MB
              </p>
              <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm mt-4">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {/* File selected */}
          {file && (
            <div className="space-y-5">
              {/* File info */}
              <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Original size: {originalSizeKB} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="p-1.5 text-slate-400 hover:text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Image preview */}
              {preview && (
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-48 object-contain bg-slate-100"
                  />
                </div>
              )}

              {/* Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Target Size:{" "}
                    <span className="font-bold">{targetSize} KB</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={targetSize}
                    onChange={(e) => setTargetSize(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                    <span>50 KB</span>
                    <span>500 KB</span>
                    <span>1000 KB</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Quality:{" "}
                    <span className="font-bold">
                      {Math.round(quality * 100)}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              {/* Compress button */}
              {!compressed && (
                <button
                  onClick={handleCompress}
                  disabled={loading}
                  className="w-full py-3 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: "var(--navy)" }}
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />{" "}
                      Compressing...
                    </>
                  ) : (
                    "Compress Document"
                  )}
                </button>
              )}

              {/* Result */}
              {compressed && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle size={16} className="text-green-600" />
                      <p className="font-semibold text-green-800 text-sm">
                        Compression Complete
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-xs text-slate-500">Original</p>
                        <p
                          className="font-bold text-slate-700"
                          style={{ fontFamily: "DM Mono" }}
                        >
                          {originalSizeKB} KB
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Compressed</p>
                        <p
                          className="font-bold text-green-700"
                          style={{ fontFamily: "DM Mono" }}
                        >
                          {compressed.size} KB
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Saved</p>
                        <p
                          className="font-bold text-green-700"
                          style={{ fontFamily: "DM Mono" }}
                        >
                          {savedPercent}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleDownload}
                      className="flex-1 py-3 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
                      style={{ background: "var(--green)" }}
                    >
                      <Download size={15} />
                      Download File
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-3 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
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
              Always scan documents in good lighting — blurry scans get rejected
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
