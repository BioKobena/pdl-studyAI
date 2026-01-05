import { api } from "./client";
import { storage } from "./storage/token";

export type ChatResponse = {
  message: string;
};

// backend renvoie souvent { response: "..." }
type BackendChatOk = { response?: string; message?: string };
type BackendChatErr = { error?: string; message?: string };

export async function sendChatMessageMobile(params: {
  userId: string;
  subjectId: string;
  message: string;
}): Promise<ChatResponse> {
  const token = await storage.getAccessToken();

  try {

    
    const { data } = await api.post<BackendChatOk>(
        
      "/chat/message",
      params.message, //body = texte brut
      {
        params: { userId: params.userId, subjectId: params.subjectId },
        headers: {
          "Content-Type": "text/plain",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    console.log("CHAT RAW =", params);
    return { message: data?.response ?? data?.message ?? "Réponse vide." };
  } catch (e: any) {
    const backend: BackendChatErr | undefined = e?.response?.data;
    const msg =
      backend?.error ??
      backend?.message ??
      e?.message ??
      "Impossible de contacter le serveur.";
        console.log("CHAT status:", e?.response?.status);
        console.log("CHAT data:", e?.response?.data);
        console.log("CHAT url:", e?.config?.baseURL, e?.config?.url);

   
      return { message: msg };
  }
}
