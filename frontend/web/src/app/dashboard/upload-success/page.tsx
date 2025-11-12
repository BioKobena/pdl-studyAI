'use client';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { FileText } from 'lucide-react';
import OptionButton from "../../../component/ui/option-button";
import { useSearchParams } from 'next/navigation';
import { createSubject } from "@/lib/api/subject";
import { withAuth } from '@/lib/api/withAuth.client';
type PdfMeta = { chars: number; ms?: number; pages?: number };

function UploadSuccess() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const params = useSearchParams();
  const key = params.get('key') || '';
  console.log("Key from params : ", key);

  const [sessName, setSessName] = useState<string>('');
  const [sessBlobUrl, setSessBlobUrl] = useState<string>('');
  const [sessText, setSessText] = useState<string>('');
  const [meta, setMeta] = useState<PdfMeta | null>(null);
  const [showExtract, setShowExtract] = useState(false);

  useEffect(() => {
    if (!key) return;

    const name = sessionStorage.getItem(`pdfName:${key}`) || "";
    const blob = sessionStorage.getItem(`pdfBlobUrl:${key}`) || "";
    const text = sessionStorage.getItem(`pdfText:${key}`) || "";
    const metaRaw = sessionStorage.getItem(`pdfMeta:${key}`);

    setSessName(name);
    setSessBlobUrl(blob);
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

    //Lancer la création du subject une fois que le texte est chargé

    // 
    if (text && text.trim().length > 0) {
      /**
       * @marlenegohi 
       * hasBeenCreated n'existe pas c'est pourquoi il cré à chaque fois un nouveau id pour les documents, il va falloir le géré.
       * La logique à suivre est de faire un setItem avant de faire le getItem pour "subjectCreated"
       * J'ai parcouru tout le code mais j'ai pas vu de "hasBeenCreated" ou de "subjectCreated" donc si tu peux revoir ça, ça sera cool.  
       *  */
      const hasBeenCreated = sessionStorage.getItem(`subjectCreated:${key}`);
      console.log("hasBeenCreated : ", hasBeenCreated)
      const userId = localStorage.getItem("userId");
      /**
       * @marlenegohi
       * Ici j'ai changé le hasBeenCreated que t'avais pour vérifier avec le "key"
       * En vrai, tu peux voir une autre approche pour le faire, j'ai juste tester ça, je te laisse la main pour le reste.
       */
      if (key === null) {
        (async () => {
          try {
            const res = await createSubject({
              userId: userId,
              title: name || "Document sans titre",
              extractText: text,
            });

            console.log("Sujet créé :", res);

            const subjectId = res?.subject?.id;
            if (subjectId) {
              localStorage.setItem("SubjectId", subjectId);
              console.log("Subject ID sauvegardé :", subjectId);
            } else {
              console.warn("Aucun ID trouvé dans la réponse :", res);
            }

          } catch (err: unknown) {
            if (err instanceof Error) {
              console.error("Erreur lors de la création du subject :", err.message);
            } else {
              console.error("Erreur lors de la création du subject :", String(err));
            }
          }
        })();
      }
    }

    return () => {
      if (blob) URL.revokeObjectURL(blob);
    };
  }, [key]);


  const isScan = useMemo(() => key && sessText.trim().length === 0, [key, sessText]);
  const hasText = useMemo(() => sessText.trim().length > 0, [sessText]); // AJOUT
  const extractPreview = useMemo(() => sessText.slice(0, 1200), [sessText]); // AJOUT

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') setUploadedFile(files[0]);
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (files && files.length > 0) setUploadedFile(files[0]);
  };

  // AJOUT : télécharger le texte extrait en .txt
  const downloadTxt = () => {
    const blob = new Blob([sessText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = (sessName || 'document') + '.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-6 py-5">
        <div className="text-center mb-4">
          <p className="text-2xl text-[#3FA9D9]">Révise plus vite</p>
        </div>

        {/* Upload Area */}
        <div
          className={`mb-10 border-2 rounded-lg p-8 transition-colors ${isDragging ? 'border-[#3FA9D9] bg-blue-50' : ' bg-white'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-28 bg-white border border-gray-300 rounded-lg shadow-md flex flex-col items-center justify-center overflow-hidden">
                  <div className="flex-1 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-[#c94a4a]" />
                  </div>
                  <div className="bg-[#c94a4a] w-full py-2 text-white text-center">PDF</div>
                </div>
              </div>
            </div>

            {uploadedFile ? (
              <p className="text-[#8b0000]">{uploadedFile.name}</p>
            ) : (
              <>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
              </>
            )}

            {key && sessName && (
              <p className="text-[#8b0000] mt-2">Fichier : <b>{sessName}</b></p>
            )}
          </div>
        </div>

        {/* Confirmation d’extraction */}
        {key && (
          hasText ? (
            <div className="mb-6 inline-flex flex-wrap items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-3 py-2">
              <span>✓ PDF analysé</span>
              <span>• {(meta?.chars ?? sessText.length).toLocaleString()} caractères</span>
              {typeof meta?.pages === 'number' && <span>• {meta.pages} pages</span>}
              {typeof meta?.ms === 'number' && <span>• {meta.ms} ms</span>}
            </div>
          ) : (
            <div className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
              Aucun texte extrait — ce PDF semble être un scan (image). Importez une version texte ou activez un OCR côté serveur.
            </div>
          )
        )}

        {/* Options Section */}
        <div className="flex flex-col items-center justify-center min-h-screenspace-y-6">
          <h2 className="text-2xl text-gray-700">Commençons votre révision, choisissez une option :</h2>

          <div className="flex flex-wrap gap-6 justify-center mt-8">

          </div>

          {/* barre d’actions concrètes avec la key */}
          {key && (
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link rel="stylesheet" href={`/dashboard/resume?key=${key}`} >
                <OptionButton icon="/resume.png" label="Résumé" />
              </Link>
              <OptionButton icon="/chat.png" label="Chat" />
              <Link rel="stylesheet" href="/dashboard/quiz">
                <OptionButton icon="/quizz.png" label="Quizz" />
              </Link>

              <a
                href="/dashboard/upload"
                className="rounded-full border-2 border-gray-300 px-6 py-2 text-gray-600 hover:bg-gray-50"
              >
                Changer de fichier
              </a>
            </div>
          )}

          {/* AJOUT : commandes texte (extrait / copier / télécharger) */}
          {hasText && (
            <div className="mt-6 w-full max-w-2xl">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowExtract(s => !s)}
                  className="rounded-full border-2 border-[#7CB6DB] text-[#7CB6DB] px-4 py-1.5 hover:bg-[#E8F6FF]"
                >
                  {showExtract ? 'Masquer l’extrait' : 'Voir un extrait'}
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
                  {extractPreview}{sessText.length > extractPreview.length ? '…' : ''}
                </pre>
              )}
            </div>
          )}
        </div>


      </main>
    </div>
  );
}
export default withAuth(UploadSuccess);