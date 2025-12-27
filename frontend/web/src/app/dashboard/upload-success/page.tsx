"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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

  const [loadingAction, setLoadingAction] = useState(false);
  const [creatingSubject, setCreatingSubject] = useState(false);
  const [subjectId, setSubjectId] = useState<string>("");

  // ✅ anti double call (dev/StrictMode)
  const createOnceRef = useRef(false);

  // -------------------------------------------------------
  // 1) Charger le PDF depuis sessionStorage (TOUJOURS)
  // -------------------------------------------------------
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

    // subjectId déjà créé ?
    const existingSubjectId = sessionStorage.getItem(`subjectId:${key}`) || "";
    if (existingSubjectId) setSubjectId(existingSubjectId);

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [key]);

  const hasText = useMemo(() => sessText.trim().length > 0, [sessText]);

  const getUserId = () => {
    const fromLocal = localStorage.getItem("userid");
    if (fromLocal) return fromLocal;

    try {
      const currentUser = JSON.parse(localStorage.getItem("current_user") || "{}");
      return currentUser?.id || null;
    } catch {
      return null;
    }
  };

  // -------------------------------------------------------
  // 2) Créer le subject (1 seule fois par key)
  // -------------------------------------------------------
  const ensureSubjectId = useCallback(async (): Promise<string> => {
    if (!key) throw new Error("key manquant");
    if (!sessText.trim()) throw new Error("Aucun texte extrait");

    // déjà en mémoire ?
    const cached = sessionStorage.getItem(`subjectId:${key}`);
    if (cached) return cached;

    // si création déjà en cours -> attendre
    if (creatingSubject) {
      await new Promise((r) => setTimeout(r, 250));
      const cachedAfter = sessionStorage.getItem(`subjectId:${key}`);
      if (cachedAfter) return cachedAfter;
    }

    setCreatingSubject(true);
    try {
      const userId = getUserId();
      const payload = {
        userId,
        title: sessName || "Document",
        extractText: sessText,
      };

      const res = await createSubject(payload);

      const id =
        (res as any)?.subjectId ??
        (res as any)?.id ??
        (res as any)?.subject?.id;

      if (!id) {
        console.error("createSubject response:", res);
        throw new Error("Le backend n’a pas renvoyé de subjectId");
      }

      const idStr = String(id);
      sessionStorage.setItem(`subjectId:${key}`, idStr);
      setSubjectId(idStr);

      return idStr;
    } finally {
      setCreatingSubject(false);
    }
  }, [key, sessName, sessText, creatingSubject]);

  // -------------------------------------------------------
  // 3) Auto-create dès que le texte est prêt (sans bloquer le chargement)
  // -------------------------------------------------------
  useEffect(() => {
    if (!key) return;

    // ✅ on attend que le texte soit vraiment chargé
    if (!sessText.trim()) return;

    // ✅ si déjà créé, rien à faire
    if (subjectId) return;

    // ✅ anti double call dev
    if (createOnceRef.current) return;
    createOnceRef.current = true;

    ensureSubjectId().catch((e) => {
      console.error("ensureSubjectId auto:", e);
      createOnceRef.current = false; // permet retry (clic)
    });
  }, [key, sessText, subjectId, ensureSubjectId]);

  // -------------------------------------------------------
  // 4) Redirection : garantit subjectId + passe en URL
  // -------------------------------------------------------
  const startLoadingAndRedirect = async (target: "resume" | "chatter" | "quiz") => {
    setLoadingAction(true);
    try {
      const id = await ensureSubjectId();
      router.push(`/dashboard/${target}?key=${key}&subjectId=${id}`);
    } catch (e) {
      console.error(e);
      setLoadingAction(false);
      alert("Impossible de créer le sujet (subjectId). Vérifie la console.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {(loadingAction || creatingSubject) && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#3FA9D9] border-t-transparent" />
            <p className="text-[#3FA9D9] font-medium">
              {creatingSubject ? "Création du sujet…" : "Chargement…"}
            </p>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-6 py-5">
        <div className="text-center mb-4">
          <p className="text-2xl text-[#3FA9D9]">Révise plus vite</p>
        </div>

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

        {hasText ? (
          <div className="mb-6 inline-flex flex-wrap items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-3 py-2">
            <span>✓PDF analysé</span>
            <span>• {(meta?.chars ?? sessText.length).toLocaleString()} caractères</span>
            {subjectId ? <span>• subjectId: {subjectId}</span> : null}
          </div>
        ) : (
          <div className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            Aucun texte extrait — ce PDF semble être un scan.
          </div>
        )}

        <div className="flex flex-col items-center justify-center space-y-6">
          <h2 className="text-2xl text-gray-700">
            Commençons votre révision, choisissez une option :
          </h2>

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <div onClick={() => startLoadingAndRedirect("resume")}>
              <OptionButton icon="/resume.png" label="Resume" />
            </div>

            <div onClick={() => startLoadingAndRedirect("chatter")}>
              <OptionButton icon="/chat.png" label="Chat" />
            </div>

            <div onClick={() => startLoadingAndRedirect("quiz")}>
              <OptionButton icon="/quizz.png" label="Quizz" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(UploadSuccess);
