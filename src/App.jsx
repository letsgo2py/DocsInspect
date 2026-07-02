import { useState } from "react";
import UploadSection from "./components/UploadSection";
import ChatSection from "./components/ChatSection";
import ResumeAnalyzerDrawer from "./components/ResumeAnalyzerDrawer";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-5xl mx-auto p-8">

        <div className="relative text-center mb-10">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium shadow"
          >
            Resume Analyzer
          </button>

          <h1 className="text-5xl font-bold mb-3">DocsInspect AI</h1>
          <p className="text-gray-600 text-lg">
            Upload PDFs and chat with your documents using AI.
          </p>
        </div>

        <UploadSection onUploadSuccess={() => setHasUploadedFile(true)} />

        <ChatSection hasUploadedFile={hasUploadedFile} />

      </div>

      <ResumeAnalyzerDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}

export default App;