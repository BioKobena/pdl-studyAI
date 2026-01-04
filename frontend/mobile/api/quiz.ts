import { api } from "./client";
import { storage } from "./storage/token";

/** Format backend attendu (comme côté web) */
type BackendReponse = { content: string; isCorrect: boolean; isSelected?: boolean };
type BackendQuestion = { id?: number; content: string; reponses: BackendReponse[] };
type BackendQuiz = { id: string; subjectId: string; questions: BackendQuestion[] };

export type QuizResponse = { message: string; quiz: BackendQuiz };

/**  Format de TON écran */
export type Answer = { id: string; text: string; isCorrect: boolean };
export type UiQuestion = {
  id: string;
  question: string;
  answers: Answer[];
  selectedAnswer?: string; // id de la réponse choisie
};

/** Transform backend -> UI */
function mapBackendToUi(quiz: BackendQuiz): UiQuestion[] {
  return (quiz.questions ?? []).map((q, qi) => ({
    id: String(q.id ?? qi + 1),
    question: q.content,
    answers: (q.reponses ?? []).map((r, ai) => ({
      id: String(ai + 1),          
      text: r.content,
      isCorrect: r.isCorrect,
    })),
  }));
}

export async function createQuizForUi(subjectId: string): Promise<UiQuestion[]> {
  if (!subjectId) throw new Error("Aucun Subject ID fourni !");

  let token = await storage.getAccessToken();
  if (!token) throw new Error("Pas connecté");
  token = token.replace(/^"|"$/g, "");

  const { data } = await api.post<QuizResponse>(
    "/quiz/create", //adapte si ton backend c'est "/api/quiz/create"
    { subjectId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!data?.quiz) throw new Error("Aucun quiz trouvé dans la réponse.");
  return mapBackendToUi(data.quiz);
}
