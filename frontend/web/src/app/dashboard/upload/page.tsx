"use client";

import { useEffect, useRef, useState } from "react";
import React from "react";
import FileUpload, {DropZone, FileError, FileList, FileInfo, FileProgress} from "@/component/ui/file-uploader";
import { FileText, MessageCircle, GraduationCap } from "lucide-react";
import { HoverEffect } from "@/component/ui/hover-effect";
import {InteractiveHoverButton} from "@/component/ui/interactive-button"
import { useRouter } from "next/navigation";


// ---------- AJOUT: aide extraction PDF (pdfjs-dist) + nettoyage ----------
async function extractPdfTextFromFile(file: File): Promise<string> {

  // import dynamique pour ne charger pdfjs-dist que quand on en a besoin
  const pdfjsLib: any = await import('pdfjs-dist');
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const buffer = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: buffer }).promise;

  let text = '';
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const pageText = content.items.map((it: any) => ('str' in it ? it.str : '')).join(' ');
    text += pageText + '\n\n';
  }
  await doc.destroy();
  return cleanPdfText(text);
}

function cleanPdfText(raw: string): string {
  return raw
    .replace(/-\s*\n/g, '')        // recoller les mots coupés
    .replace(/\s+\n/g, '\n')       // espaces avant saut de ligne
    .replace(/\n{3,}/g, '\n\n')    // sauts de ligne excessifs
    .replace(/[ \t]{2,}/g, ' ')    // espaces multiples
    .trim();
}

// Récupère le File natif depuis FileInfo (adapte si ton composant expose un autre champ)
function getNativeFile(fi: FileInfo): File | null {
  // essais courants: fi.file, fi.blob, fi.nativeFile, fi.originalFile
  const cand: any = (fi as any).file ?? (fi as any).blob ?? (fi as any).nativeFile ?? (fi as any).originalFile;
  return (cand && typeof cand.arrayBuffer === 'function') ? cand as File : null;
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

export default function UploadFiles() {
  const router = useRouter();

  const [uploadFiles, setUploadFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);               // AJOUT
  const [errMsg, setErrMsg] = useState<string | null>(null);   // AJOUT
  const processingRef = useRef(false);                         // AJOUT: évite double-traitement

  const onFileSelectChange = (files: FileInfo[]) => {
    setUploadFiles(files);
  };

  const onRemove = (fileId: string) => {
    setUploadFiles(uploadFiles.filter((file) => file.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    if (type === "pdf") return "text-red-500";
    else if (type === "docx" || type === "doc") return "text-blue-500";
    else return "text-gray-500";
  };

  //Déclenchement auto dès qu’un fichier est choisi 
  useEffect(() => {
    if (processingRef.current) return;
    if (!uploadFiles || uploadFiles.length === 0) return;

    const first = uploadFiles[0];
    const file = getNativeFile(first);
    const name = (first as any).name ?? (file?.name ?? 'document.pdf');

    const isPdf = name.toLowerCase().endsWith('.pdf') || (file?.type === 'application/pdf');

    if (!isPdf) {
      setErrMsg("L’extraction locale est disponible pour les PDF. Vous pouvez importer une version PDF texte.");
      return;
    }

    processingRef.current = true;
    setErrMsg(null);
    setLoading(true);

    (async () => {
      try {
        if (!file) {
          throw new Error("Fichier introuvable dans FileInfo. Adapte getNativeFile(...) selon ton composant.");
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
      } catch (e: any) {
        console.error(e);
        setErrMsg("Échec de l’analyse du PDF. Essayez un autre fichier (PDF texte non scanné).");
        setLoading(false);
        processingRef.current = false;
      }
    })();
  }, [uploadFiles, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 container mx-auto px-4 max-w-4xl">
        {/* ---------- AJOUT: overlay loader “soft” ---------- */}
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
              {/* Message d'erreur lorsque le fichier n'est pas pas pdf*/}
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

        {/* Cards section insérée ici */}
        <div className="mb-1">
          <div className="max-w-5xl mx-auto px-8">
            <HoverEffect items={projects} />
          </div>
        </div>
        <div className="flex justify-end ml-4" >
          <InteractiveHoverButton text="Commencer" href="/dashboard/upload-success"/>
        </div>
      </main>
    </div>
  );
}
