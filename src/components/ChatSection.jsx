import { useState } from "react";
import api from "../services/api";

function ChatSection({ hasUploadedFile }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);

      const response = await api.post("/ask", {
        question,
        k: 4,
      });

      setAnswer(response.data.answer);
      setSources(response.data.sources);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Ask Questions
      </h2>

      <textarea
        rows={4}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={
          hasUploadedFile
          ? "Ask something about the uploaded document..."
          : "Upload a PDF first to start asking questions..."
        }
        disabled={!hasUploadedFile}
        className="w-full border rounded-lg p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      <button
        onClick={askQuestion}
        disabled={!hasUploadedFile || loading || !question.trim()}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {!hasUploadedFile && (
        <p className="text-sm text-gray-500 mt-2">
          Please upload a PDF above before asking questions.
        </p>
      )}

      {answer && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">
            Answer
          </h3>

          <div className="bg-gray-100 p-4 rounded-lg">
            {answer}
          </div>
        </div>
      )}
      {sources.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold mb-3">Sources</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sources.map((source, index) => (
              <div
                key={index}
                className="flex items-center justify-between border rounded-lg px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <svg
                    className="w-4 h-4 text-gray-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-800 truncate">
                    {source.source}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    P{source.page}
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    C{source.chunk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatSection;