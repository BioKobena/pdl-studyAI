import axios from "axios";
import * as FileSystem from "expo-file-system/legacy";

const extractorApi = axios.create({
  baseURL: "https://pdf-extractor-js.onrender.com",
  timeout: 300000,
});

export async function extractPdfTextAxiosJson(params: {
  uri: string;
  name?: string;
  mimeType?: string;
}) {
  // 1) Lire le fichier local en base64
  const base64 = await FileSystem.readAsStringAsync(params.uri, {
  encoding: "base64" as any, });

  // 2) Envoyer en JSON
  const res = await extractorApi.post(
    "/extract-pdf",
    {
      file: base64,
      fileName: params.name ?? "document.pdf",
      mimeType: params.mimeType ?? "application/pdf",
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = res.data;

  if (data?.success === false) {
    throw new Error(data?.message ?? data?.error ?? "Extraction échouée");
  }

  const text = data?.text ?? data?.fullText ?? data?.result ?? "";
  if (!text) throw new Error("Réponse inattendue : aucun texte extrait.");

  return text;
}
