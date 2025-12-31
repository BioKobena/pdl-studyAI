// lib/api/chat.ts

export type ChatResponse = {
  message: string;
};

function getToken() {
  return localStorage.getItem("auth_token") || "";
}

function isJsonResponse(res: Response) {
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json");
}

export async function sendChatMessage(
  userId: string,
  subjectId: string,
  message: string
): Promise<ChatResponse> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!base) {
    return { message: "API base URL manquante (NEXT_PUBLIC_API_BASE_URL)." };
  }

  const token = getToken();

  console.log("userId : ", userId, "message : ", message, " subjectId : ", subjectId)
  try {
    const res = await fetch(
      `${base}/chat/message?userId=${encodeURIComponent(userId)}&subjectId=${encodeURIComponent(
        subjectId
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: message,
      }
    );

    // Erreurs: on essaie de récupérer {error: "..."} du backend
    if (!res.ok) {
      let backendError = `Erreur IA (HTTP ${res.status}).`;

      try {
        if (isJsonResponse(res)) {
          const data = (await res.json()) as { error?: string };
          if (data?.error) backendError = data.error;
        } else {
          const txt = await res.text();
          if (txt) backendError = txt;
        }
      } catch {
        // ignore parse
      }

      return { message: backendError };
    }

    //Succès: backend renvoie { response: "..." }
    if (isJsonResponse(res)) {
      const data = (await res.json()) as { response?: string };
      return { message: data?.response ?? "Réponse vide." };
    }

    // fallback si jamais le backend renvoie du texte
    const text = await res.text();
    return { message: text || "Réponse vide." };
  } catch (e) {
    console.error("sendChatMessage error:", e);
    return { message: "Impossible de contacter le serveur." };
  }
}
