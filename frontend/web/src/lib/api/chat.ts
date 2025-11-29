// lib/api/chat.ts

export type ChatResponse = {
  message: string;
  fullResponse?: string;   // Pour plus tard si ton API renvoie autre chose
};

/**
 * Envoie un message utilisateur au backend pour un subject donné.
 *
 * Même si l’API backend n’est pas encore prête, cette fonction renverra
 * automatiquement "Chat trouvé" en mode fallback.
 */
export async function chatWithSubject(
  subjectId: string,
  userMessage: string
): Promise<ChatResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subject/${subjectId}/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      }
    );

    if (!res.ok) {
      console.warn("Chat API non disponible, fallback activé.");
      return { message: "Chat trouvé (fallback)" };
    }

    const data = await res.json();
    return {
      message: data.message ?? "Réponse vide du serveur",
      fullResponse: JSON.stringify(data),
    };
  } catch (error) {
    console.warn("Erreur API chat:", error);
    return { message: "Chat trouvé (fallback)" };
  }
}
