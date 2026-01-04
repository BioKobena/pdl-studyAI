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

export async function createSubject(payload: SubjectData) {
    // on verifie que la personne est
  const token = await storage.getAccessToken();
  if (!token) throw new Error("Pas connecté");

  const res = await api.post("/api/subjects/create", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data; 
}

