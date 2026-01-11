import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createQuizForUi } from '@/api/quiz';
import { UiQuestion } from '@/api/quiz';

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  question: string;
  answers: Answer[];
  selectedAnswer?: string;
}

const QuizScreen = () => {
  const router = useRouter();
    const { subjectId } = useLocalSearchParams<{ subjectId: string }>();

  const [questions, setQuestions] = useState<UiQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  /**Load quiz depuis l’API */
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        if (!subjectId) {
          Alert.alert("Erreur", "SubjectId manquant (viens depuis Choose avec params).");
          router.back();
          return;
        }

        setLoading(true);
        const qs = await createQuizForUi(subjectId);

        if (!alive) return;

        setQuestions(qs);
        setCurrentQuestionIndex(0);
        setShowResults(false);
        setSelectedAnswer(null);
      } catch (e: any) {
        if (!alive) return;
        Alert.alert("Erreur", e?.message ?? "Erreur chargement quiz");
        router.back();
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [subjectId]);

  const currentQuestion = questions[currentQuestionIndex];

  /** IMPORTANT: on enregistre la réponse choisie DANS la question */
  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);

    setQuestions(prev =>
      prev.map((q, idx) =>
        idx === currentQuestionIndex ? { ...q, selectedAnswer: answerId } : q
      )
    );
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      //remettre la sélection de la question suivante (si l’utilisateur revient plus tard)
      setSelectedAnswer(questions[nextIndex]?.selectedAnswer ?? null);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setQuestions(prev => prev.map(q => ({ ...q, selectedAnswer: undefined })));
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResults(false);
  };

  /**Score basé sur selectedAnswer réel */
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (q.selectedAnswer) {
        const selected = q.answers.find(a => a.id === q.selectedAnswer);
        if (selected?.isCorrect) correct++;
      }
    });
    return correct;
  };
  


if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }}>
          <ActivityIndicator size="large" />
          <Text style={{ fontFamily: 'Kufam-SemiBold',color: "#666" }}>Chargement du quiz…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!questions.length) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={{ fontFamily: "Kufam-Bold", color: "#2C94CB" }}>Aucune question</Text>
          <Text style={{ color: "#666", marginTop: 8, textAlign: "center" }}>
            Aucun quiz n’a été généré pour ce sujet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /** ---------- RESULTATS ---------- */
  if (showResults) {
    const score = calculateScore();

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>QUIZ</Text>
            <Text style={styles.scoreText}>
              NOTE : <Text style={styles.scoreValue}>{score}/{questions.length} 😊</Text>
            </Text>
          </View>
        </View>

        <ScrollView style={styles.resultsScroll} showsVerticalScrollIndicator={false}>
          {questions.map((q, index) => {
            const selectedAns = q.answers.find(a => a.id === q.selectedAnswer);
            const isCorrect = selectedAns?.isCorrect;

            return (
              <View key={q.id} style={styles.resultCard}>
                <Text style={styles.resultQuestionLabel}>
                  Question: {index + 1}/{questions.length}
                </Text>
                <Text style={styles.resultQuestion}>{q.question}</Text>
                <View style={[styles.resultAnswer, isCorrect ? styles.correctAnswer : styles.wrongAnswer]}>
                  <Text style={styles.resultAnswerText}>
                    {selectedAns?.text ?? "Aucune réponse"}
                  </Text>
                </View>
              </View>
            );
          })}

          <TouchableOpacity style={styles.restartButton} onPress={handleRestart} activeOpacity={0.8}>
            <Text style={styles.restartButtonText}>Recommencer</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /** ---------- QUIZ ---------- */
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>QUIZ</Text>
          <Text style={styles.headerSubtitle}>{questions.length} Questions</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quizInfo}>
          <Text style={styles.quizTitle}>QUIZZ CONCERNANT VOTRE DOCUMENT</Text>
          <Text style={styles.quizDescription}>
            Veuillez répondre aux questions et voir les réponses.
          </Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>
            Question: {currentQuestionIndex + 1}/{questions.length}
          </Text>

          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          {currentQuestion.answers.map((answer) => (
            <TouchableOpacity
              key={answer.id}
              style={[
                styles.answerButton,
                selectedAnswer === answer.id && styles.selectedAnswer,
              ]}
              onPress={() => handleAnswerSelect(answer.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.answerText,
                  selectedAnswer === answer.id && styles.selectedAnswerText,
                ]}
              >
                {answer.text}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.nextButton, !selectedAnswer && { opacity: 0.4 }]}
            onPress={handleNextQuestion}
            activeOpacity={0.8}
            disabled={!selectedAnswer}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex === questions.length - 1 ? "Terminer" : "Prochaine question"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#2C94CB" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomColor: '#E0E0E0',
    justifyContent: "center"
  },
  backButton: {
    marginRight: 10,
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: 'Kufam-Bold',
    color: '#000',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Kufam-Regular',
    color: '#666',
  },
  scoreText: {
    fontSize: 14,
    fontFamily: 'Kufam-Regular',
    color: '#000',
  },
  scoreValue: {
    fontFamily: 'Kufam-Bold',
    color: '#F9690E',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  quizInfo: {
    marginBottom: 30,
  },
  quizTitle: {
    fontSize: 18,
    fontFamily: 'Kufam-Bold',
    color: '#2C94CB',
    marginBottom: 10,
  },
  quizDescription: {
    fontSize: 14,
    fontFamily: 'Kufam-Regular',
    color: '#666',
    lineHeight: 20,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionLabel: {
    fontSize: 14,
    fontFamily: 'Kufam-SemiBold',
    color: '#2C94CB',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    fontFamily: 'Kufam-SemiBold',
    color: '#000',
    marginBottom: 20,
    lineHeight: 24,
  },
  answerButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAnswer: {
    backgroundColor: '#2C94CB',
    borderColor: '#2C94CB',
  },
  answerText: {
    fontSize: 15,
    fontFamily: 'Kufam-Regular',
    color: '#333',
  },
  selectedAnswerText: {
    color: '#fff',
    fontFamily: 'Kufam-SemiBold',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Kufam-SemiBold',
    color: '#2C94CB',
  },
  resultsScroll: {
    flex: 1,
    padding: 20,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resultQuestionLabel: {
    fontSize: 13,
    fontFamily: 'Kufam-SemiBold',
    color: '#2C94CB',
    marginBottom: 8,
  },
  resultQuestion: {
    fontSize: 15,
    fontFamily: 'Kufam-Regular',
    color: '#000',
    marginBottom: 12,
  },
  resultAnswer: {
    borderRadius: 8,
    padding: 12,
  },
  correctAnswer: {
    backgroundColor: '#007260',
  },
  wrongAnswer: {
    backgroundColor: '#C62828',
  },
  resultAnswerText: {
    fontSize: 14,
    fontFamily: 'Kufam-SemiBold',
    color: '#fff',
  },
  feedbackSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  feedbackItem: {
    marginBottom: 15,
  },
  feedbackLabel: {
    fontSize: 15,
    fontFamily: 'Kufam-Bold',
    color: '#2C94CB',
    marginBottom: 5,
  },
  feedbackLabelWeak: {
    fontSize: 15,
    fontFamily: 'Kufam-Bold',
    color: '#C62828',
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 14,
    fontFamily: 'Kufam-Regular',
    color: '#666',
    lineHeight: 20,
  },
  restartButton: {
    backgroundColor: '#F9690E',
    borderRadius: 8,
    paddingVertical: 5,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#F9690E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  restartButtonText: {
    fontSize: 18,
    fontFamily: 'Kufam-Bold',
    color: '#fff',
  },
});

export default QuizScreen;