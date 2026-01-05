import { api } from "./client";
import { storage } from "./storage/token";

export interface SubjectData {
  userId: string;
  title: string;
  extractText: string;
}

export type CreateSubjectResponse = {
  message: string;
  subject: {
    id: string;
    userId: string;
    title: string;
    extractText: string;
  };
};

export type Subject = {
    id:string;
    userId:string;
    title:string;
    extractText:string;
}

export async function createSubject(payload: SubjectData) {
    // on verifie que la personne est
  const token = await storage.getAccessToken();
  if (!token) throw new Error("Pas connecté");

  const res = await api.post("/api/subjects/create", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
 console.log("CREATE baseURL", api.defaults.baseURL);

  return res.data; 
}

export async function listeSubjectUser(userId:string): Promise<Subject[]> {
    const token = await storage.getAccessToken();
    if (!token) throw new Error("Pas connecté");
     const {data} = await api.get(`/api/subjects/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("liste baseURL", api.defaults.baseURL);
  return data;


}

