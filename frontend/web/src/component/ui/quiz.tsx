"use client";

import { useEffect, useRef, useState } from "react";

/* ---------- Icons (simples) ---------- */
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);
const ChevronRight = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);
const Gift = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
    />
  </svg>
);
const Trophy = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
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
  correctAnswer: number;
}

/* ---------- Mock (remplace par fetch API plus tard) ---------- */
const localQuiz: Question[] = [
  {
    id: 1,
    question: "Which planet is known as the 'Red Planet'?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "Which element has the chemical symbol 'Au'?",
    options: ["Silver", "Aluminum", "Gold", "Argon"],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: "How many bones are there in an adult human body?",
    options: ["186", "206", "226", "246"],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "What is the speed of light in a vacuum?",
    options: [
      "299,792,458 m/s",
      "300,000,000 m/s",
      "186,000 miles/s",
      "All of the above",
    ],
    correctAnswer: 0,
  },
  // Ajoute autant de questions que tu veux pour tester >5
  {
    id: 6,
    question: "The tallest mountain on Earth is?",
    options: ["K2", "Everest", "Kilimanjaro", "Denali"],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: "H2O is the chemical formula for?",
    options: ["Hydrogen", "Oxygen", "Water", "Salt"],
    correctAnswer: 2,
  },
];

interface QuizService {
  loadQuiz(): Promise<Question[]>;
}
const mockQuizService: QuizService = {
  async loadQuiz() {
    await new Promise((r) => setTimeout(r, 300));
    return localQuiz;
  },
};
// // Quand l’API sera prête :
// const apiQuizService: QuizService = { async loadQuiz() {
//   const res = await fetch("/api/quiz", { cache: "no-store" })
//   if (!res.ok) throw new Error("Failed to load quiz")
//   return (await res.json()) as Question[]
// }}

/* ---------- UI Component ---------- */
export function Component() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // ref pour auto-centre l’indicateur courant
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    mockQuizService
      .loadQuiz()
      .then((qs) => {
        if (!alive) return;
        setQuestions(qs);
        setAnswers(Array(qs.length).fill(null));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Unknown error"));
    return () => {
      alive = false;
    };
  }, []);

  // centre l’item courant s’il y a overflow
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const active = el.querySelector<HTMLDivElement>(
      `[data-idx="${currentQuestion}"]`,
    );
    if (active) {
      const offset =
        active.offsetLeft - (el.clientWidth - active.clientWidth) / 2;
      el.scrollTo({ left: offset, behavior: "smooth" });
    }
  }, [currentQuestion, questions]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
          Failed to load quiz: {error}
        </div>
      </div>
    );
  }
  if (!questions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="h-6 w-6 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
          <span>Loading quiz…</span>
        </div>
      </div>
    );
  }

  const total = questions.length;
  const answeredCount = answers.filter((a) => a !== null).length;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const copy = [...answers];
    copy[currentQuestion] = answerIndex;
    setAnswers(copy);
  };

  const handleNext = () => {
    if (currentQuestion < total - 1) {
      const next = currentQuestion + 1;
      setCurrentQuestion(next);
      setSelectedAnswer(answers[next]);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion === 0) return;
    const prev = currentQuestion - 1;
    setCurrentQuestion(prev);
    setSelectedAnswer(answers[prev]);
  };

  const calculateScore = (): number =>
    answers.reduce<number>(
      (acc, ans, i) =>
        ans !== null && ans === questions[i].correctAnswer ? acc + 1 : acc,
      0,
    );

  /* ---------- Results ---------- */
  if (quizCompleted) {
    const finalScore = calculateScore();
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="text-center p-8 border-b border-slate-200">
            <div className="mb-4 flex justify-center">
              <Trophy className="w-16 h-16 text-sky-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Quiz complete</h1>
            <p className="text-slate-600 mt-1">
              Score:{" "}
              <span className="font-semibold">
                {finalScore}/{total}
              </span>{" "}
              ({Math.round((finalScore / total) * 100)}%)
            </p>
          </div>

          {/* Grille responsive des questions (quel que soit le nombre) */}
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {questions.map((q, i) => {
              const ok = answers[i] === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`rounded-lg border px-3 py-2 text-sm text-center
                  ${
                    ok
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
                setSelectedAnswer(null);
                setAnswers(Array(total).fill(null));
              }}
              className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-2.5 text-white font-medium hover:bg-sky-700 transition"
            >
              Take quiz again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Quiz Screen (adapté à n questions) ---------- */
  return (
    <div className="min-h-[calc(100vh-64px)] grid place-items-center bg-slate-50 px-4 ">
      <div className="w-full max-w-3xl max-h-[calc(100vh-64px-2rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg flex flex-col">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-slate-600">
              Question {currentQuestion + 1} of {total}
            </div>
            <div className="text-sm text-slate-600">
              Answered: {answeredCount}/{total}
            </div>
          </div>

          {/* Indicateurs scrollables pour n questions */}
          <div
            ref={tabsRef}
            className="mb-4 flex gap-6 overflow-x-auto no-scrollbar pb-2"
            style={{ scrollSnapType: "x proximity" }}
          >
            {questions.map((_, i) => {
              const isCurrent = i === currentQuestion;
              const isAnswered = answers[i] !== null;
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
                    className={`text-[11px] ${isCurrent ? "text-sky-700 font-medium" : "text-slate-600"}`}
                  >
                    {i + 1}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Barre de progression dynamique */}
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-8">
            <div
              className="bg-sky-600 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(answeredCount / total) * 100}%` }}
            />
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-6">
            {questions[currentQuestion].question}
          </h2>
        </div>

        {/* Options (sélection bleue uniquement) */}
        <div className="p-6">
          <div className="space-y-3 mb-6">
            {questions[currentQuestion].options.map((option, index) => {
              const isSelected = index === selectedAnswer;
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

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-slate-800 hover:bg-slate-100 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-sm text-slate-600">
              {selectedAnswer !== null ? "Answer selected" : "Select an answer"}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:opacity-50"
            >
              <span>{currentQuestion === total - 1 ? "Finish" : "Next"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
