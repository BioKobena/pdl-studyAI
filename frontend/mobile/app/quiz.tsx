import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 375;
const isMediumScreen = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
const isLargeScreen = SCREEN_WIDTH >= 768;

// Fonction pour adapter les tailles de police
const scale = (size: number) => {
  if (isSmallScreen) return size * 0.9;
  if (isLargeScreen) return size * 1.1;
  return size;
};

// Fonction pour adapter les espacements
const verticalScale = (size: number) => {
  if (isSmallScreen) return size * 0.85;
  if (isLargeScreen) return size * 1.15;
  return size;
};

const QuizScreen = () => {
  const router = useRouter();
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();

  const [questions, setQuestions] = useState<UiQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**Load quiz depuis l'API */
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

      //remettre la sélection de la question suivante (si l'utilisateur revient plus tard)
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2C94CB" />
          <Text style={styles.loadingText}>Chargement du quiz…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!questions.length) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Aucune question</Text>
          <Text style={styles.emptyText}>
            Aucun quiz n'a été généré pour ce sujet.
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

        <ScrollView 
          style={styles.resultsScroll} 
          contentContainerStyle={styles.resultsScrollContent}
          showsVerticalScrollIndicator={false}
        >
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
          <Ionicons name="arrow-back" size={scale(24)} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>QUIZ</Text>
          <Text style={styles.headerSubtitle}>{questions.length} Questions</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
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
            style={[styles.nextButton, !selectedAnswer && styles.nextButtonDisabled]}
            onPress={handleNextQuestion}
            activeOpacity={0.8}
            disabled={!selectedAnswer}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex === questions.length - 1 ? "Terminer" : "Prochaine question"}
            </Text>
            <Ionicons name="arrow-forward" size={scale(20)} color="#2C94CB" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: verticalScale(12),
    paddingHorizontal: '5%',
  },
  loadingText: {
    fontFamily: 'Kufam-SemiBold',
    color: "#666",
    fontSize: scale(14),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: '10%',
  },
  emptyTitle: {
    fontFamily: "Kufam-Bold",
    color: "#2C94CB",
    fontSize: scale(18),
    marginBottom: verticalScale(8),
  },
  emptyText: {
    color: "#666",
    fontSize: scale(14),
    textAlign: "center",
    lineHeight: scale(20),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: verticalScale(15),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    justifyContent: "center",
    minHeight: verticalScale(60),
  },
  backButton: {
    position: 'absolute',
    left: '5%',
    padding: 8,
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: scale(14),
    fontFamily: 'Kufam-Bold',
    color: '#000',
    marginBottom: verticalScale(5),
  },
  headerSubtitle: {
    fontSize: scale(12),
    fontFamily: 'Kufam-Regular',
    color: '#666',
  },
  scoreText: {
    fontSize: scale(14),
    fontFamily: 'Kufam-Regular',
    color: '#000',
  },
  scoreValue: {
    fontFamily: 'Kufam-Bold',
    color: '#F9690E',
    fontSize: scale(16),
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: '5%',
    paddingVertical: verticalScale(20),
    paddingBottom: verticalScale(40),
  },
  quizInfo: {
    marginBottom: verticalScale(25),
  },
  quizTitle: {
    fontSize: scale(16),
    fontFamily: 'Kufam-Bold',
    color: '#2C94CB',
    marginBottom: verticalScale(10),
    lineHeight: scale(22),
  },
  quizDescription: {
    fontSize: scale(13),
    fontFamily: 'Kufam-Regular',
    color: '#666',
    lineHeight: scale(20),
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: verticalScale(15),
    padding: '5%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    ...Platform.select({
      android: {
        borderWidth: 1,
        borderColor: '#F0F0F0',
      },
    }),
  },
  questionLabel: {
    fontSize: scale(13),
    fontFamily: 'Kufam-SemiBold',
    color: '#2C94CB',
    marginBottom: verticalScale(10),
  },
  questionText: {
    fontSize: scale(15),
    fontFamily: 'Kufam-SemiBold',
    color: '#000',
    marginBottom: verticalScale(20),
    lineHeight: scale(22),
  },
  answerButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: verticalScale(10),
    padding: verticalScale(15),
    marginBottom: verticalScale(12),
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: verticalScale(50),
    justifyContent: 'center',
  },
  selectedAnswer: {
    backgroundColor: '#2C94CB',
    borderColor: '#2C94CB',
  },
  answerText: {
    fontSize: scale(14),
    fontFamily: 'Kufam-Regular',
    color: '#333',
    lineHeight: scale(20),
  },
  selectedAnswerText: {
    color: '#fff',
    fontFamily: 'Kufam-SemiBold',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(20),
    gap: 8,
    paddingVertical: verticalScale(10),
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonText: {
    fontSize: scale(15),
    fontFamily: 'Kufam-SemiBold',
    color: '#2C94CB',
  },
  resultsScroll: {
    flex: 1,
  },
  resultsScrollContent: {
    paddingHorizontal: '5%',
    paddingVertical: verticalScale(20),
    paddingBottom: verticalScale(40),
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: verticalScale(12),
    padding: '5%',
    marginBottom: verticalScale(15),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    ...Platform.select({
      android: {
        borderWidth: 1,
        borderColor: '#F0F0F0',
      },
    }),
  },
  resultQuestionLabel: {
    fontSize: scale(12),
    fontFamily: 'Kufam-SemiBold',
    color: '#2C94CB',
    marginBottom: verticalScale(8),
  },
  resultQuestion: {
    fontSize: scale(14),
    fontFamily: 'Kufam-Regular',
    color: '#000',
    marginBottom: verticalScale(12),
    lineHeight: scale(20),
  },
  resultAnswer: {
    borderRadius: verticalScale(8),
    padding: verticalScale(12),
  },
  correctAnswer: {
    backgroundColor: '#007260',
  },
  wrongAnswer: {
    backgroundColor: '#C62828',
  },
  resultAnswerText: {
    fontSize: scale(13),
    fontFamily: 'Kufam-SemiBold',
    color: '#fff',
    lineHeight: scale(19),
  },
  restartButton: {
    backgroundColor: '#F9690E',
    borderRadius: verticalScale(10),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
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
    fontSize: scale(16),
    fontFamily: 'Kufam-Bold',
    color: '#fff',
  },
});

export default QuizScreen;