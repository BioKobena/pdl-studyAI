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

// extraction PDF typée depuis lib
import { extractPdfTextFromFile } from "@/lib/pdf";

type BlobLike = { arrayBuffer: () => Promise<ArrayBuffer> };

function pickProp<T>(obj: unknown, key: string): T | undefined {
  if (obj && typeof obj === "object" && key in obj) {
    return (obj as Record<string, unknown>)[key] as T;
  }
  return undefined;
}

// Récupère File/Blob en évitant any
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

// Essaie d'obtenir un nom depuis FileInfo si exposé par ton composant
function getFileInfoName(fi: FileInfo): string | undefined {
  const n = pickProp<unknown>(fi, "name");
  return typeof n === "string" ? n : undefined;
}

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

function UploadFiles() {
  const router = useRouter();

  const [uploadFiles, setUploadFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const processingRef = useRef(false); // évite double-traitement

  const onFileSelectChange = (files: FileInfo[]) => {
    setUploadFiles(files);
  };

  const onRemove = (fileId: string) => {
    setUploadFiles(uploadFiles.filter((file) => file.id !== fileId));
  };

  // Déclenchement auto dès qu’un fichier est choisi
  useEffect(() => {
    if (processingRef.current) return;
    if (!uploadFiles || uploadFiles.length === 0) return;

    const first = uploadFiles[0];
    const file = getNativeFile(first);
    const name = getFileInfoName(first) ?? file?.name ?? "document.pdf";

    const isPdf =
      name.toLowerCase().endsWith(".pdf") || file?.type === "application/pdf";

    if (!isPdf) {
      setErrMsg(
        "L’extraction locale est disponible pour les PDF. Vous pouvez importer une version PDF texte.",
      );
      return;
    }

    processingRef.current = true;
    setErrMsg(null);
    setLoading(true);

    (async () => {
      try {
        if (!file) {
          throw new Error(
            "Fichier introuvable dans FileInfo. Adapte getNativeFile(...) selon ton composant.",
          );
        }

        // 1) Blob URL locale pour prévisualiser sans envoyer le fichier au serveur
        const blobUrl = URL.createObjectURL(file);

        // 2) Extraction du texte côté navigateur
        const text = await extractPdfTextFromFile(file);

        // 3) Stockage temporaire en session + clé
        const key = crypto.randomUUID();
        sessionStorage.setItem(`pdfText:${key}`, text);
        sessionStorage.setItem(`pdfName:${key}`, name);
        sessionStorage.setItem(`pdfBlobUrl:${key}`, blobUrl);

        // 4) Redirection vers la page d’actions
        router.push(`/dashboard/upload-success?key=${key}`);
      } catch (e: unknown) {
        console.error(e);
        setErrMsg(
          "Échec de l’analyse du PDF. Essayez un autre fichier (PDF texte non scanné).",
        );
        setLoading(false);
        processingRef.current = false;
      }
    })();
  }, [uploadFiles, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 container mx-auto px-4 max-w-4xl">
        {/* overlay loader “soft” */}
        {loading && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#3FA9D9] border-t-transparent" />
              <p className="text-[#3FA9D9] font-medium">Analyse du PDF…</p>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="w-full max-w-1xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col items-center space-y-2 mb-4 mt-4 justify-center">
            <h1 className="text-2xl font-bold tracking-tight text-red-700">
              Dépose ton PDF
            </h1>
            <p className="text-muted-foreground">Révise plus vite.</p>
          </div>

          {/* File Upload */}
          <FileUpload
            files={uploadFiles}
            onFileSelectChange={onFileSelectChange}
            multiple={false}
            accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
            maxSize={10}
            maxCount={1}
            className="mt-2"
            disabled={false}
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
              {/* Message d'erreur lorsque le fichier n'est pas pdf */}
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

        {/* Cards section */}
        <div className="mb-1">
          <div className="max-w-5xl mx-auto px-8">
            <HoverEffect items={projects} />
          </div>
        </div>
        <div className="flex justify-end ml-4">
          <InteractiveHoverButton
            text="Commencer"
            href="/dashboard/upload-success"
          />
        </div>
      </main>
    </div>
  );
}

export default withAuth(UploadFiles);
