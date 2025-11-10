'use client';
import { withAuth } from "@/lib/api/withAuth.client";
import { ResumePDFViewer } from "../../../component/ui/resume-pdf-viewer";
import { ArrowLeft } from "lucide-react";

function App() {

  return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Back arrow and title */}
        <div className="flex items-center justify-center gap-12 mb-12">
          <button className="text-[#3FA9D9] hover:opacity-80 transition-opacity">
            <ArrowLeft size={25} strokeWidth={3} />
          </button>
          <h1 className="text-[#3FA9D9] text-2xl uppercase tracking-wide">
            Votre Résumé
          </h1>
        </div>
        
        {/* PDF viewer section */}
        <div className="bg-gray-500 p-8 rounded-lg">
          <ResumePDFViewer />
        </div>
      </main>
  );
}
export default withAuth(App);