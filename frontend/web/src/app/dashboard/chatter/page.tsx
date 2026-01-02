// components/ui/ai-assistant-wrapper.tsx
"use client";

import AiAssistant from "@/component/ui/chat";
import { withAuth } from "@/lib/api/withAuth.client";

function AiAssistantWrapper({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  // afficher titre/description au-dessus si tu veux
  return (
    <div>
      <main className="flex-1 p-8 bg-gray-50">
        {title && <h1>{title}</h1>}
        {description && <p>{description}</p>}
        <AiAssistant />
      </main>
    </div>
  );
}
export default withAuth(AiAssistantWrapper);
