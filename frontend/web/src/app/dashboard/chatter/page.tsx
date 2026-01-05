// components/ui/ai-assistant-wrapper.tsx
"use client";

import AiAssistant from "@/component/ui/chat";
import { withAuth } from "@/lib/api/withAuth.client";
import { ArrowLeft } from "lucide-react";
import {useRouter} from "next/navigation";

function AiAssistantWrapper({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  // afficher titre/description au-dessus si tu veux
  const router = useRouter();
  return (
    <div>
      <main className="flex-1 p-8 bg-gray-50">
        {title && <h1>{title}</h1>}
        {description && <p>{description}</p>}
        <div className="flex items-center justify-center gap-12 mb-8">
        <button
          onClick={() => router.back()}
          className="text-[#3FA9D9] hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={25} strokeWidth={3} />
          </button>
            <h1 className="text-[#3FA9D9] text-2xl uppercase tracking-wide">
              Votre chat
            </h1>
      </div>
        <AiAssistant />
      </main>
    </div>
  );
}
export default withAuth(AiAssistantWrapper);
