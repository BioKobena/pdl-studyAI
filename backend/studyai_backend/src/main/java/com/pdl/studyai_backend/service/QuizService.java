package com.pdl.studyai_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pdl.studyai_backend.repository.QuizRepository;
import com.pdl.studyai_backend.model.Quiz;

@Service
public class QuizService {
    @Autowired
    private QuizRepository quizRepository;
    public Quiz create(Quiz quiz) {
        return quizRepository.save(quiz);
    }
    public Quiz getQuizById(String id) {
        return quizRepository.findById(id).orElse(null);
    }
    public List<Quiz> findAll() {
        return quizRepository.findAll();
    }
    public List<Quiz> getQuizBySubjectId(String subjectId) {
        return quizRepository.findBySubjectId(subjectId);
    }
    public Quiz updateQuiz(String id, Quiz quiz) {
        Quiz existingQuiz = quizRepository.findById(id).orElse(null);
        if (existingQuiz != null) {
            existingQuiz.setSubjectId(quiz.getSubjectId());
            existingQuiz.setQuestions(quiz.getQuestions());
            return quizRepository.save(existingQuiz);
        }
        return null;
    }
    public void deleteQuiz(String id) {
        quizRepository.deleteById(id);
    }  
    public List <Quiz> getLastQuizBySubjectId(String subjectId, int n) {
        List<Quiz> quizzes = quizRepository.findBySubjectId(subjectId);
        quizzes.sort((q1, q2) -> q2.getCreatedAt().compareTo(q1.getCreatedAt()));
        return quizzes.stream().limit(n).toList();
    }

    public Quiz getActiveQuizBySubjectId(String subjectId) {
        List<Quiz> quizzes = quizRepository.findBySubjectId(subjectId);
        return quizzes.stream()
                .max((q1, q2) -> q1.getCreatedAt().compareTo(q2.getCreatedAt()))
                .orElse(null);
    }
}
