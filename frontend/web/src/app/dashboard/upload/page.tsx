"use client";

import { useEffect, useRef, useState } from "react";
import React from "react";
import FileUpload, {
  DropZone,
  FileError,
  FileList,
  FileInfo,
  FileProgress,
} from "@/component/ui/file-uploader";
import { FileText, MessageCircle, GraduationCap } from "lucide-react";
import { HoverEffect } from "@/component/ui/hover-effect";
import { InteractiveHoverButton } from "@/component/ui/interactive-button";
import { useRouter } from "next/navigation";
import { withAuth } from "@/lib/api/withAuth.client";

import { extractPdfTextFromFile } from "@/lib/pdf";

// -----------------------------
// Helpers pour récupérer file
// -----------------------------
type BlobLike = { arrayBuffer: () => Promise<ArrayBuffer> };

function pickProp<T>(obj: unknown, key: string): T | undefined {
  if (obj && typeof obj === "object" && key in obj) {
    return (obj as Record<string, unknown>)[key] as T;
  }
  return undefined;
}

function getNativeFile(fi: FileInfo): File | null {
  const maybe =
    pickProp<File | Blob>(fi, "file") ??
    pickProp<File | Blob>(fi, "blob") ??
    pickProp<File | Blob>(fi, "nativeFile") ??
    pickProp<File | Blob>(fi, "originalFile");

  return maybe && typeof (maybe as BlobLike).arrayBuffer === "function"
    ? (maybe as File)
    : null;
}

function getFileInfoName(fi: FileInfo): string | undefined {
  const n = pickProp<unknown>(fi, "name");
  return typeof n === "string" ? n : undefined;
}

// -----------------------------------
// Sections descriptive (inchangé)
// -----------------------------------
const projects = [
  {
    title: "Générer un résumé intelligent",
    description:
      "Obtenez un résumé clair et structuré de votre document pour réviser plus efficacement.",
    icon: <FileText size={40} />,
  },
  {
    title: "Discuter avec ton fichier",
    description:
      "Pose des questions à ton fichier et reçois des réponses précises comme si tu parlais à ton cours.",
    icon: <MessageCircle size={40} />,
  },
  {
    title: "Créer un quiz personnalisé",
    description:
      "Teste tes connaissances avec un quiz généré à partir du contenu de ton fichier.",
    icon: <GraduationCap size={40} />,
  },
];

// -----------------------------------
// PRINCIPAL : UploadFiles
// -----------------------------------
function UploadFiles() {
  const router = useRouter();

  const [uploadFiles, setUploadFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const processingRef = useRef(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const onFileSelectChange = (files: FileInfo[]) => setUploadFiles(files);

  const onRemove = (fileId: string) => {
    setUploadFiles(uploadFiles.filter((file) => file.id !== fileId));
  };

  // -----------------------------
  // Nouvelle animation fluide
  // -----------------------------
  const animateProgress = () => {
    let value = 0;

    progressInterval.current = setInterval(() => {
      value += 1;
      if (value >= 95) value = 95;
      setProgress(value);
    }, 35);
  };

  // --------------------------------------------------------------
  // TRAITEMENT AUTO DÈS CHOIX DU FICHIER
  // --------------------------------------------------------------
  useEffect(() => {
    if (processingRef.current) return;
    if (!uploadFiles || uploadFiles.length === 0) return;

    const first = uploadFiles[0];
    const file = getNativeFile(first);
    const name = getFileInfoName(first) ?? file?.name ?? "document.pdf";

    const isPdf =
      name.toLowerCase().endsWith(".pdf") ||
      file?.type === "application/pdf";

    if (!isPdf) {
      setErrMsg("Importez un fichier PDF texte (non scanné).");
      return;
    }

    processingRef.current = true;
    setErrMsg(null);
    setLoading(true);

    // 🔥 Lancer barre fluide
    setProgress(0);
    animateProgress();

    (async () => {
      try {
        if (!file) throw new Error("Fichier introuvable.");

        const blobUrl = URL.createObjectURL(file);
        const text = await extractPdfTextFromFile(file);

        const key = crypto.randomUUID();
        sessionStorage.removeItem("currentSubjectId");
        sessionStorage.setItem(`pdfText:${key}`, text);
        sessionStorage.setItem(`pdfName:${key}`, name);
        sessionStorage.setItem(`pdfBlobUrl:${key}`, blobUrl);

        //  Finalisation 95 → 100%
        if (progressInterval.current)
          clearInterval(progressInterval.current);

        let finish = 95;
        const finishInterval = setInterval(() => {
          finish += 1;
          setProgress(finish);
          if (finish >= 100) clearInterval(finishInterval);
        }, 20);

        setTimeout(() => {
          router.push(`/dashboard/upload-success?key=${key}`);
        }, 450);
      } catch (e) {
        console.error(e);

        if (progressInterval.current)
          clearInterval(progressInterval.current);
        setProgress(0);

        setErrMsg("Échec de l’analyse. Essayez un autre PDF.");
        setLoading(false);
        processingRef.current = false;
      }
    })();
  }, [uploadFiles, router]);

  // -----------------------------------
  // UI
  // -----------------------------------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 container mx-auto px-4 max-w-4xl">

        {/* 🔥 LOADER ANIMÉ FLUIDE (sans barre orange) */}
        {loading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">

            <div className="bg-white shadow-xl p-6 rounded-xl border border-gray-200 flex flex-col items-center w-80 animate-fade-in">

              {/* PDF animé */}
              <div className="w-28 h-36 border-2 border-dashed border-[#3FA9D9] bg-[#E8F4FB] rounded-lg flex flex-col justify-center items-center text-[#3FA9D9] text-lg font-semibold shadow-sm animate-bounce-slow">
                PDF
              </div>

              {/* Barre progression fluide */}
              <div className="w-full bg-gray-200 rounded-full h-4 mt-6 overflow-hidden">
                <div
                  className="bg-[#3FA9D9] h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* % */}
              <p className="text-[#3FA9D9] font-semibold text-sm mt-3">
                Importation… {progress}%
              </p>
            </div>
          </div>
        )}

        {/* Zone upload */}
        <div className="w-full max-w-1xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col items-center space-y-2 mb-4 mt-4 justify-center">
            <h1 className="text-2xl font-bold tracking-tight text-red-700">
              Dépose ton PDF
            </h1>
            <p className="text-muted-foreground">Révise plus vite.</p>
          </div>

          <FileUpload
            files={uploadFiles}
            onFileSelectChange={onFileSelectChange}
            multiple={false}
            accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
            maxSize={10}
            maxCount={1}
            className="mt-2"
          >
            <div className="space-y-4">
              <DropZone prompt="Clique ou dépose ton fichier ici" />
              <FileError />
              <FileProgress />
              <FileList
                files={uploadFiles}
                onClear={() => setUploadFiles([])}
                onRemove={onRemove}
                canResume={true}
              />
              {errMsg && <p className="text-sm text-amber-600">{errMsg}</p>}
            </div>
          </FileUpload>
        </div>

        {/* Section descriptive */}
        <div className="text-center mb-2 mt-5">
          <h2 className="bg-[#89C4F4] text-white inline-block px-8 py-4 rounded">
            CE QUE VOUS POUVEZ FAIRE ?
          </h2>
        </div>

        <div className="mb-1">
          <div className="max-w-5xl mx-auto px-8">
            <HoverEffect items={projects} />
          </div>
        </div>

        <div className="flex justify-end ml-4">
          <InteractiveHoverButton
            text="Dépose ton fichier"
            href="#top"
          />
        </div>
      </main>
    </div>
  );
}

export default withAuth(UploadFiles);
