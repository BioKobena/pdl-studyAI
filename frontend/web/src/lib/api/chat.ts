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
export async function sendChatMessage(userId:String,subjectId:string,message:string){
  const token = localStorage.getItem("auth_token");
  console.log("API URL =", process.env.NEXT_PUBLIC_API_BASE_URL);
  console.log("TOKEN=",token);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/message?userId=${userId}&subjectId=${subjectId}`,
      {
        method: "POST",
        headers: { 
          "Content-type":"text/plain",
          Authorization:`Bearer ${token}` },
       body:message,
      },
     
    );

    if (!res.ok) {
      console.error("Chat API error", res.status);

      return { message: "Erreur lors de la communication avec l’IA." };
    }

    const text = await res.text();
    return {
      message: text
    };
  } catch (error) {
    return { message: "Erreur interne." };
  }
}
