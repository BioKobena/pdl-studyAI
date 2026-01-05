"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

/* ---------- Icons (simples) ---------- */
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
const Gift = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
    />
  </svg>
);
const Trophy = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
    />
  </svg>
);

/* ---------- Types ---------- */
interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswers: number[];
  userAnswers: number[];
}

interface BackendQuestion {
  id?: number;
  content: string;
  reponses: {
    content: string;
    isCorrect: boolean;
    isSelected: boolean;
  }[];
}

interface BackendQuiz {
  id: string;
  subjectId: string;
  questions: BackendQuestion[];
}

interface QuizResponse {
  message: string;
  quiz: BackendQuiz;
}

/* ---------- Transform backend -> frontend ---------- */
function transformBackendToFrontend(backendQuiz: BackendQuiz): Question[] {
  if (!backendQuiz || !backendQuiz.questions) {
    throw new Error("Invalid quiz data from backend");
  }

  return backendQuiz.questions.map((q, index) => {
    const correctIndices = q.reponses
      .map((reponse, idx) => (reponse.isCorrect ? idx : -1))
      .filter((idx) => idx !== -1);

    return {
      id: q.id || index + 1,
      question: q.content,
      options: q.reponses.map((r) => r.content),
      correctAnswers: correctIndices.length > 0 ? correctIndices : [0],
      userAnswers: [],
    };
  });
}

/* ---------- Service API ---------- */
async function loadQuizFromApi(subjectId: string): Promise<Question[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  const response = await fetch(`${base}/quiz/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
    body: JSON.stringify({ subjectId }),
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error("Quiz introuvable pour ce sujet");
    if (response.status === 401) throw new Error("Authentification requise");
    throw new Error(`Erreur API: ${response.status}`);
  }

  const data: QuizResponse = await response.json();

  if (!data.quiz) {
    throw new Error("Aucun quiz trouvé dans la réponse");
  }

  return transformBackendToFrontend(data.quiz);
}

export async function getQuiz(subjectId: string): Promise<Question[] | null> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("No auth token found. Please log in first.");

  try {
    const res = await fetch(`${base}/api/subject/${subjectId}/quiz`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 404) return null; // pas de quiz existant
      throw new Error(`Erreur GET Quiz: ${res.status}`);
    }

    const data: QuizResponse = await res.json();
    if (!data.quiz) return null;

    return transformBackendToFrontend(data.quiz);
  } catch (e) {
    console.error("getQuiz error:", e);
    return null;
  }
}


/* ---------- UI Component ---------- */
export function Component() {
  const params = useSearchParams();
  const key = params.get("key") || "";
  const subjectIdFromUrl = params.get("subjectId") || "";

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[][]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const tabsRef = useRef<HTMLDivElement>(null);

  // ✅ 1) Réconcilier/Restaurer activeSubjectId (URL -> sessionStorage)
  useEffect(() => {
    const fromActive = sessionStorage.getItem("activeSubjectId") || "";
    const fromKey = key ? sessionStorage.getItem(`subjectId:${key}`) || "" : "";
    const legacy = localStorage.getItem("SubjectId") || "";

    const resolved = subjectIdFromUrl || fromActive || fromKey || legacy;

    if (resolved) {
      sessionStorage.setItem("activeSubjectId", resolved);
    }
  }, [key, subjectIdFromUrl]);

  // ✅ 2) Charger le quiz
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    const resolved =
      subjectIdFromUrl ||
      sessionStorage.getItem("activeSubjectId") ||
      (key ? sessionStorage.getItem(`subjectId:${key}`) : "") ||
      localStorage.getItem("SubjectId") ||
      "";

    if (!resolved) {
      setError("Aucun sujet sélectionné. Veuillez importer un PDF d'abord.");
      setQuestions(null);
      setLoading(false);
      return;
    }

    loadQuizFromApi(resolved)
      .then((qs) => {
        if (!alive) return;
        setQuestions(qs);
        setSelectedAnswers(Array(qs.length).fill([]));
        setCurrentQuestion(0);
        setQuizCompleted(false);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Erreur inconnue");
        setQuestions(null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [key, subjectIdFromUrl]);

  // centre l'item courant s'il y a overflow
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const active = el.querySelector<HTMLDivElement>(`[data-idx="${currentQuestion}"]`);
    if (active) {
      const offset = active.offsetLeft - (el.clientWidth - active.clientWidth) / 2;
      el.scrollTo({ left: offset, behavior: "smooth" });
    }
  }, [currentQuestion, questions]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!questions) return;

    const currentAnswers = [...selectedAnswers];
    currentAnswers[currentQuestion] = [answerIndex];
    setSelectedAnswers(currentAnswers);

    const updatedQuestions = questions.map((q, index) =>
      index === currentQuestion ? { ...q, userAnswers: [answerIndex] } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleNext = () => {
    if (!questions) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion === 0) return;
    setCurrentQuestion(currentQuestion - 1);
  };

  const calculateScore = (): number => {
    if (!questions) return 0;

    return questions.reduce((score, question, index) => {
      const userAnswers = selectedAnswers[index] || [];
      const correctAnswers = question.correctAnswers;

      const isCorrect =
        userAnswers.length === correctAnswers.length &&
        userAnswers.every((answer) => correctAnswers.includes(answer));

      return isCorrect ? score + 1 : score;
    }, 0);
  };

  const getAnsweredCount = (): number => {
    return selectedAnswers.filter((answers) => answers.length > 0).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="h-6 w-6 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
          <span>Chargement du quiz…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-6 py-4 text-rose-700 max-w-md text-center">
          <h2 className="text-lg font-semibold mb-2">Impossible de charger le quiz</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-6 py-4 text-amber-700 max-w-md text-center">
          <h2 className="text-lg font-semibold mb-2">Aucun quiz disponible</h2>
          <p>Aucune question n&apos;a été trouvée pour ce sujet.</p>
        </div>
      </div>
    );
  }

  const total = questions.length;
  const answeredCount = getAnsweredCount();
  const currentQuestionData = questions[currentQuestion];
  const currentSelectedAnswers = selectedAnswers[currentQuestion] || [];

  /* ---------- Results ---------- */
  if (quizCompleted) {
    const finalScore = calculateScore();

    return (
      <div className="min-h-screen bg-slate-50 flex items-start justify-center p-6">
        <div className="w-full max-w-5xl rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="text-center p-2 border-b border-slate-200">
            <div className="mb-4 flex justify-center">
              <Trophy className="w-16 h-16 text-sky-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Quiz terminé !</h1>
            <p className="text-slate-600 mt-2">
              Score:{" "}
              <span className="font-semibold">
                {finalScore}/{total}
              </span>{" "}
              ({Math.round((finalScore / total) * 100)}%)
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {total} question{total > 1 ? "s" : ""} au total
            </p>
          </div>

          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {questions.map((q, i) => {
              const userAnswers = selectedAnswers[i] || [];
              const correctAnswers = q.correctAnswers;
              const isCorrect =
                userAnswers.length === correctAnswers.length &&
                userAnswers.every((answer) => correctAnswers.includes(answer));

              return (
                <div
                  key={q.id}
                  className={`rounded-lg border px-3 py-2 text-sm text-center
                  ${
                    isCorrect
                      ? "border-emerald-600 text-emerald-700 bg-emerald-50"
                      : "border-rose-600 text-rose-700 bg-rose-50"
                  }`}
                >
                  Q{i + 1}
                </div>
              );
            })}
          </div>

          <div className="p-6 pt-0 text-center">
            <button
              onClick={() => {
                setQuizCompleted(false);
                setCurrentQuestion(0);
                setSelectedAnswers(Array(questions.length).fill([]));

                const resetQuestions = questions.map((q) => ({
                  ...q,
                  userAnswers: [],
                }));
                setQuestions(resetQuestions);
              }}
              className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-2.5 text-white font-medium hover:bg-sky-700 transition"
            >
              Refaire le quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Quiz Screen ---------- */
  return (
    <div className="min-h-[calc(100vh-64px)] grid place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-6xl h-100vh overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg flex flex-col">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-slate-600">
              Question {currentQuestion + 1} sur {total}
            </div>
            <div className="text-sm text-slate-600">
              Répondu: {answeredCount}/{total}
            </div>
          </div>

          <div
            ref={tabsRef}
            className="mb-4 flex gap-6 overflow-x-auto no-scrollbar pb-2"
            style={{ scrollSnapType: "x proximity" }}
          >
            {questions.map((_, i) => {
              const isCurrent = i === currentQuestion;
              const isAnswered = (selectedAnswers[i] || []).length > 0;
              return (
                <div
                  key={i}
                  data-idx={i}
                  className="flex flex-col items-center gap-1 scroll-mx-6"
                  style={{ scrollSnapAlign: "center" }}
                >
                  <Gift
                    className={`w-6 h-6 ${
                      isAnswered
                        ? "text-sky-600"
                        : isCurrent
                        ? "text-sky-600"
                        : "text-slate-300"
                    }`}
                  />
                  <div
                    className={`text-[11px] ${
                      isCurrent ? "text-sky-700 font-medium" : "text-slate-600"
                    }`}
                  >
                    {i + 1}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-8">
            <div
              className="bg-sky-600 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(answeredCount / total) * 100}%` }}
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-6">
            {currentQuestionData.question}
          </h2>
        </div>

        <div className="p-6">
          <div className="space-y-3 mb-6">
            {currentQuestionData.options.map((option, index) => {
              const isSelected = currentSelectedAnswers.includes(index);
              const cls = [
                "w-full p-4 text-left rounded-lg border-2 transition relative focus:outline-none font-medium",
                isSelected
                  ? "bg-sky-50 border-sky-600 text-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40",
              ].join(" ");

              return (
                <button
                  key={index}
                  className={cls}
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-slate-800 hover:bg-slate-100 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>

            <div className="text-sm text-slate-600">
              {currentSelectedAnswers.length > 0
                ? "Réponse sélectionnée"
                : "Sélectionnez une réponse"}
            </div>

            <button
              onClick={handleNext}
              disabled={currentSelectedAnswers.length === 0}
              className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:opacity-50"
            >
              <span>{currentQuestion === total - 1 ? "Terminer" : "Suivant"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}