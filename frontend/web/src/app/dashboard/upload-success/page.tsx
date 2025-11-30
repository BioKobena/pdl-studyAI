"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { FileText } from "lucide-react";
import OptionButton from "../../../component/ui/option-button";
import { useSearchParams, useRouter } from "next/navigation";
import { createSubject } from "@/lib/api/subject";
import { withAuth } from "@/lib/api/withAuth.client";

type PdfMeta = { chars: number; ms?: number; pages?: number };

function UploadSuccess() {
  const router = useRouter();

  const params = useSearchParams();
  const key = params.get("key") || "";

  const [sessName, setSessName] = useState<string>("");
  const [sessText, setSessText] = useState<string>("");
  const [meta, setMeta] = useState<PdfMeta | null>(null);
  const [showExtract, setShowExtract] = useState(false);

  // Loader 
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (!key) return;

    const name = sessionStorage.getItem(`pdfName:${key}`) || "";
    const blobUrl = sessionStorage.getItem(`pdfBlobUrl:${key}`) || "";
    const text = sessionStorage.getItem(`pdfText:${key}`) || "";
    const metaRaw = sessionStorage.getItem(`pdfMeta:${key}`);

    setSessName(name);
    setSessText(text);

    if (metaRaw) {
      try {
        setMeta(JSON.parse(metaRaw) as PdfMeta);
      } catch {
        setMeta({ chars: text.length });
      }
    } else {
      setMeta({ chars: text.length });
    }

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [key]);

  const hasText = useMemo(() => sessText.trim().length > 0, [sessText]);
  const extractPreview = useMemo(() => sessText.slice(0, 1200), [sessText]);

  //Fonction qui affiche le loader puis redirige
  const startLoadingAndRedirect = (url: string) => {
    setLoadingAction(true);
    setTimeout(() => router.push(url), 700);
  };

  // Télécharger en .txt
  const downloadTxt = () => {
    const blob = new Blob([sessText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (sessName || "document") + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">

      {/*LOADER*/}
      {loadingAction && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#3FA9D9] border-t-transparent" />
            <p className="text-[#3FA9D9] font-medium">Chargement…</p>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-6 py-5">
        <div className="text-center mb-4">
          <p className="text-2xl text-[#3FA9D9]">Révise plus vite</p>
        </div>

        {/* Upload Area */}
        <div className="mb-10 border-2 rounded-lg p-8 bg-white">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-28 bg-white border border-gray-300 rounded-lg shadow-md flex flex-col items-center justify-center overflow-hidden">
                  <div className="flex-1 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-[#c94a4a]" />
                  </div>
                  <div className="bg-[#c94a4a] w-full py-2 text-white text-center">
                    PDF
                  </div>
                </div>
              </div>
            </div>

            {sessName && (
              <p className="text-[#8b0000] mt-2">
                Fichier : <b>{sessName}</b>
              </p>
            )}
          </div>
        </div>

        {/* Confirmation d’extraction */}
        {hasText ? (
          <div className="mb-6 inline-flex flex-wrap items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-3 py-2">
            <span>✓PDF analysé</span>
            <span>• {(meta?.chars ?? sessText.length).toLocaleString()} caractères</span>
          </div>
        ) : (
          <div className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            Aucun texte extrait — ce PDF semble être un scan.
          </div>
        )}

        {/* Options Section */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <h2 className="text-2xl text-gray-700">
            Commençons votre révision, choisissez une option :
          </h2>

          <div className="mt-6 flex flex-wrap gap-3 justify-center">

            {/*Résumé → loader */}
            <div onClick={() => startLoadingAndRedirect(`/dashboard/resume?key=${key}`)}>
              <OptionButton icon="/resume.png" label="Resume" />
            </div>

            {/*Chat → loader */}
            <div onClick={() => startLoadingAndRedirect(`/dashboard/chatter?key=${key}`)}>
              <OptionButton icon="/chat.png" label="Chat" />
            </div>

            {/*Quizz → loader */}
            <div onClick={() => startLoadingAndRedirect(`/dashboard/quiz?key=${key}`)}>
              <OptionButton icon="/quizz.png" label="Quizz" />
            </div>

            {/*Changer de fichier → loader
            <button
              onClick={() => startLoadingAndRedirect("/dashboard/upload")}
              className="rounded-full border-2 border-gray-300 px-6 py-2 text-gray-600 hover:bg-gray-50"
            >
              Changer de fichier
            </button>
             */}
          </div>
        
          {/* Commandes texte */}
          {/*hasText && (
            <div className="mt-6 w-full max-w-2xl">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowExtract((s) => !s)}
                  className="rounded-full border-2 border-[#7CB6DB] text-[#7CB6DB] px-4 py-1.5 hover:bg-[#E8F6FF]"
                >
                  {showExtract ? "Masquer l’extrait" : "Voir un extrait"}
                </button>

                <button
                  onClick={() => navigator.clipboard.writeText(sessText)}
                  className="rounded-full border-2 border-gray-300 text-gray-700 px-4 py-1.5 hover:bg-gray-50"
                >
                  Copier le texte
                </button>

                <button
                  onClick={downloadTxt}
                  className="rounded-full border-2 border-gray-300 text-gray-700 px-4 py-1.5 hover:bg-gray-50"
                >
                  Télécharger (.txt)
                </button>
              </div>

              {showExtract && (
                <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 bg-white border rounded-lg p-3 text-gray-700">
                  {extractPreview}
                  {sessText.length > extractPreview.length ? "…" : ""}
                </pre>
              )}
            </div>
          )*/}
          
        </div>
      </main>
    </div>
  );
}

export default withAuth(UploadSuccess);
