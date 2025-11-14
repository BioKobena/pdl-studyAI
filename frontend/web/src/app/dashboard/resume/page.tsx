'use client';
import { withAuth } from "@/lib/api/withAuth.client";
import { ResumePDFViewer } from "@/component/ui/resume-pdf-viewer";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { summarizeExtractText } from "@/lib/api/summary";
import { useRouter } from "next/navigation";

function App() {
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            const res = await summarizeExtractText();
            if (res?.resume?.texteResume) setSummary(res.resume.texteResume);
            else setSummary("Aucun résumé disponible.");
            setLoading(false);
        };

        fetchSummary();
    }, []);

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            {/* Back arrow and title */}
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

            {/* PDF viewer section */}
            <div className="bg-gray-500 p-8 rounded-lg">
                {loading ? (
                    <p className="text-white text-center">Chargement du résumé…</p>
                ) : (
                    <ResumePDFViewer summary={summary ?? ""} />
                )}
            </div>
        </main>
    );
}

export default withAuth(App);
