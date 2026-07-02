import { useState, useEffect } from "react";
import api from "../services/api";

function UploadSection({ onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: string }

  const MAX_FILES = 3;

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);

    if (selected.length > MAX_FILES) {
      setError(`You can only upload up to ${MAX_FILES} files at a time.`);
      setFiles(selected.slice(0, MAX_FILES));
    } else {
      setError("");
      setFiles(selected);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError("");
  };

  const uploadPdf = async () => {
    if (files.length === 0) return;

    try {
      setLoading(true);
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      await api.post("/upload", formData);

      // alert("PDF(s) uploaded successfully");
      setToast({ type: "success", message: "PDF(s) uploaded successfully" });
      setFiles([]);
      onUploadSuccess?.();   // <-- notify parent
    } catch (error) {
      console.error(error);
      // alert("Upload failed");
      setToast({ type: "error", message: "Upload failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        Upload PDF
      </h2>

      <input
        type="file"
        accept=".pdf"
        multiple
        onChange={handleFileChange}
        className="mb-2 bg-gray-400 rounded-lg p-2 mr-4"
      />

      {error && (
        <p className="text-red-600 text-sm mb-2">{error}</p>
      )}

      {files.length > 0 && (
        <ul className="mb-4 space-y-1">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between text-sm bg-gray-100 px-3 py-1.5 rounded-lg"
            >
              <span className="truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 ml-3 text-xs"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={uploadPdf}
        disabled={loading || files.length === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Uploading..." : `Upload ${files.length > 0 ? `(${files.length})` : ""}`}
      </button>

      {/* Toast message card */}
      {toast && (
        <div
          className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade-in ${
            toast.type === "success"
              ? "bg-green-500 text-green-700 border border-green-200"
              : "bg-red-500 text-red-700 border border-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-current opacity-60 hover:opacity-100"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadSection;