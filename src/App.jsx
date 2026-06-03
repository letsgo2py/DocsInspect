import UploadSection from "./components/UploadSection";
import ChatSection from "./components/ChatSection";

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-5xl mx-auto p-8">

        <div className="text-center mb-10">

          <h1 className="text-5xl font-bold mb-3">
            DocsInspect AI
          </h1>

          <p className="text-gray-600 text-lg">
            Upload PDFs and chat with your documents using AI.
          </p>

        </div>

        <UploadSection />

        <ChatSection />

      </div>
    </div>
  );
}

export default App;