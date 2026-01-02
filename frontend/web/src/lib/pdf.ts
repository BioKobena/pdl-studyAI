// frontend/web/src/lib/pdf.ts
// Typage sans "any" pour pdfjs-dist (import dynamique)

type Pdfjs = typeof import("pdfjs-dist");
type TextContent = import("pdfjs-dist/types/src/display/api").TextContent;
type TextItem = import("pdfjs-dist/types/src/display/api").TextItem;

function isTextItem(item: TextContent["items"][number]): item is TextItem {
  // pas de "any" ici : on vérifie prudemment la présence de "str"
  return typeof (item as { str?: unknown }).str === "string";
}

export async function extractPdfTextFromFile(file: File): Promise<string> {
  const pdfjsLib = (await import("pdfjs-dist")) as Pdfjs;

  // Worker local servi depuis /public/pdf.worker.min.mjs
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  // (optionnel) console.log si tu veux vérifier :
  // console.log("[workerSrc]", pdfjsLib.GlobalWorkerOptions.workerSrc);

  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const doc = await loadingTask.promise;

  let text = "";
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent(); // TextContent

    const pageText = content.items
      .map((item) => (isTextItem(item) ? item.str : ""))
      .join(" ");

    text += pageText + "\n\n";
  }

  await doc.destroy();
  return text.trim();
}
