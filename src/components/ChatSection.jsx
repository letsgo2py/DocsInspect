import { useState } from "react";
import api from "../services/api";

function ChatSection() {
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
        placeholder="Ask something about the uploaded document..."
        className="w-full border rounded-lg p-3"
      />

      <button
        onClick={askQuestion}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

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
          <h3 className="font-bold mb-2">
            Sources
          </h3>

          {sources.map((source, index) => (
            <div
              key={index}
              className="border rounded-lg p-2 mb-2"
            >
              <p>File: {source.source}</p>
              <p>Page: {source.page}</p>
              <p>Chunk: {source.chunk}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatSection;