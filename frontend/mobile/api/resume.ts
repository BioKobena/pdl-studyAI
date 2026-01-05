import { api } from "./client";
import { storage } from "./storage/token";

export type Resume = {
  id?: string;
  subjectId?: string;
  content?: string;
  texteResume?: string // ou le champ réel de ton model Resume
};

export type ResumeResponse ={
    message : string;
    resume : Resume;
}

export async function resumeText(subjectId:string){

    if (!subjectId)throw new Error("Aucun Subject ID fourni !");
    const token =  await storage.getAccessToken();
    if(!token) throw new Error("Pas connecté");

    const {data} = await api.post<ResumeResponse>(
        "/api/resume/create",
        {subjectId},
        {headers:
            { Authorization:'Bearer ${token}'}
         }
    )
    return data 
}