export async function extractPdfTextFromFile(file: File): Promise<string> {
  const pdfjsLib: any = await import('pdfjs-dist');
  // ➜ IMPORTANT : worker local (
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  console.log('[workerSrc]', (pdfjsLib as any).GlobalWorkerOptions.workerSrc); // doit afficher /pdf.worker.min.mjs

  const buffer = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = '';
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    text += content.items.map((it: any) => it.str ?? '').join(' ') + '\n\n';
  }
  await doc.destroy();
  return text.trim();
}
