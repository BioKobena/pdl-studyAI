import { Card } from "./card";

interface ResumePDFViewerProps {
  summary: string;
}

export function ResumePDFViewer({ summary }: ResumePDFViewerProps) {
  return (
    <div className="relative">
      <Card className="bg-white border-4 border-gray-700 shadow-xl max-w-2xl mx-auto">
        <div className="p-8 text-[#0a0a0a]">
          <h2 className="text-center mb-6">Résumé du document</h2>

          <div className="space-y-4 text-justify">
            {summary ? (
              <p className="whitespace-pre-wrap">{summary}</p>
            ) : (
              <p className="text-gray-500 text-center">
                Aucun résumé disponible pour le moment.
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
