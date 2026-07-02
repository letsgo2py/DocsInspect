import { useState } from "react";
import api from "../services/api";

function ResumeAnalyzerDrawer({ isOpen, onClose }) {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setError("");
    setResult(null);

    if (selected && !selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are supported");
      setResume(null);
      return;
    }

    setResume(selected);
  };

  const analyzeResume = async () => {
    if (!resume) {
      setError("Please upload a resume PDF first");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append("resume", resume);
      if (jobDescription.trim()) {
        formData.append("job_description", jobDescription.trim());
      }

      const response = await api.post(
        "/analyze-resume-pdf",
        formData
      );

      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          "Failed to analyze resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setResume(null);
    setJobDescription("");
    setResult(null);
    setError("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const uploadNewResume = () => {
    resetState();
  };

  const scoreColor = (score) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const scoreBg = (score) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-xl font-semibold">Resume Analyzer</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Resume upload - hidden once a result is shown, replaced by summary + "Upload New" */}
          {!result && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Resume (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full text-sm border rounded-lg p-2 bg-gray-50"
                />
                {resume && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    Selected: {resume.name}
                  </p>
                )}
              </div>

              {/* JD input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Job Description{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={5}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here to get a match score against a specific role..."
                  className="w-full border rounded-lg p-3 text-sm"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-2">
                  {error}
                </p>
              )}

              <button
                onClick={analyzeResume}
                disabled={loading || !resume}
                className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? "Analyzing..." : "Analyze Resume"}
              </button>
            </>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">

              {/* Analyzed file summary + upload new button */}
              <div className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Analyzed file</p>
                  <p className="text-sm font-medium truncate">{resume?.name}</p>
                </div>
                <button
                  onClick={uploadNewResume}
                  className="shrink-0 ml-3 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Upload New Resume
                </button>
              </div>

              {result.is_resume === false ? (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                  This file doesn't look like a resume. Please upload a valid resume PDF.
                </div>
              ) : (
                <>
                  {/* ATS Score */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">ATS Match Score</span>
                      <span className={`text-lg font-bold ${scoreColor(result.match_score)}`}>
                        {result.match_score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${scoreBg(result.match_score)}`}
                        style={{ width: `${result.match_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Matching skills */}
                  {result.matching_skills?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-green-700">
                        Matching Skills
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {result.matching_skills.map((skill, i) => (
                          <span
                            key={i}
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing skills */}
                  {result.missing_skills?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-red-700">
                        Missing Skills
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {result.missing_skills.map((skill, i) => (
                          <span
                            key={i}
                            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {result.recommendations?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-gray-800">
                        Recommendations
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {result.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* Bottom upload new resume button too, for convenience after scrolling */}
              <button
                onClick={uploadNewResume}
                className="w-full border border-indigo-600 text-indigo-600 px-4 py-2.5 rounded-lg hover:bg-indigo-50 font-medium"
              >
                Upload New Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ResumeAnalyzerDrawer;