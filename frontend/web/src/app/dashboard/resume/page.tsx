"use client";
import { withAuth } from "@/lib/api/withAuth.client";
import { ResumePDFViewer } from "@/component/ui/resume-pdf-viewer";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { summarizeExtractText } from "@/lib/api/summary";
import { useRouter } from "next/navigation";

function App() {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); //loader pendant l’API
  const router = useRouter();

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);

      try {
        const res = await summarizeExtractText();

        if (res?.resume?.texteResume) {
          setSummary(res.resume.texteResume);
        } else {
          setSummary("Aucun résumé disponible.");
        }
      } catch (err) {
        setSummary("Erreur lors de la génération du résumé.");
      }

      setLoading(false);
    };

    fetchSummary();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 relative">

      {/* 🔥 LOADER PLEIN ÉCRAN (identique au login) */}
      {loading && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#3FA9D9] border-t-transparent" />
            <p className="text-[#3FA9D9] font-medium">Chargement du résumé…</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-center gap-12 mb-12">
        <button
          onClick={() => router.back()}
          className="text-[#3FA9D9] hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={25} strokeWidth={3} />
        </button>
        <h1 className="text-[#3FA9D9] text-2xl uppercase tracking-wide">
          Votre Résumé
        </h1>
      </div>

      {/* Section Résumé */}
      <div className="bg-gray-500 p-8 rounded-lg">
        {/* afficher uniquement quand loading = false */}
        {!loading && <ResumePDFViewer summary={summary ?? ""} />}
      </div>
    </main>
  );
}

export default withAuth(App);
