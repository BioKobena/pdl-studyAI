package com.pdl.studyai_backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.pdl.studyai_backend.model.Quiz;

public interface  QuizRepository extends MongoRepository<Quiz, String>{
    List<Quiz> findBySubjectId(String subjectId);
    // rechercher la liste des questions du quiz
    // List<Questions> findByQuestionId(String questionId);
}
