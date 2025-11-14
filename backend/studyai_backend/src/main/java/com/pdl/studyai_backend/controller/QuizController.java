package com.pdl.studyai_backend.controller;

import java.util.Map;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pdl.studyai_backend.dto.QuizRequest;
import com.pdl.studyai_backend.model.Question;
import com.pdl.studyai_backend.model.Quiz;
import com.pdl.studyai_backend.model.Subject;
import com.pdl.studyai_backend.service.QuizService;
import com.pdl.studyai_backend.service.StudioAiService;
import com.pdl.studyai_backend.service.SubjectService;

import jakarta.servlet.http.HttpServletRequest;
import io.jsonwebtoken.Claims;

@RestController
@CrossOrigin(origins="http://localhost:3000")
public class QuizController {
    
    private final QuizService quizService;
    private final SubjectService subjectService;
    private final StudioAiService studioAiService;
    private final String promptHeader = "Génère un quiz au format JSON avec des questions, le nombre de reponse correcte sera aléatoire\n\n";
    //constructor
    public QuizController(QuizService quizService, SubjectService subjectService, StudioAiService studioAiService) {
        this.quizService = quizService;
        this.subjectService = subjectService;
        this.studioAiService = studioAiService;
    }

    @PostMapping("quiz/create")
    public ResponseEntity<?> createQuiz(HttpServletRequest request, @RequestBody QuizRequest reqQuiz) {
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            if (claims == null) {
                return ResponseEntity.status(401).body("Token manquant ou invalide");
            }
            Subject subject = this.subjectService.getSubjectById(reqQuiz.getSubjectId()).orElse(null);
            if (subject == null) {
                return ResponseEntity.status(404).body("Sujet non trouvé");
            }
            String generatedQuiz = this.studioAiService.ask(this.promptHeader + subject.getExtractText());
            ObjectMapper mapper = new ObjectMapper();
            List<Question> questions = mapper.readValue(generatedQuiz, new TypeReference<List<Question>>() {});
            Quiz q = new Quiz(reqQuiz.getSubjectId(), questions);
            Quiz quiz = this.quizService.create(q);
            return ResponseEntity.ok(Map.of("message", "Quiz créé avec succès !", "quiz", quiz));
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuiz(@PathVariable String id) {
        try {
            Quiz quiz = quizService.getQuizById(id);
            if (quiz != null) {
                return ResponseEntity.ok(quiz);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }

    @GetMapping("/quiz/subject/{subjectId}")  
    public ResponseEntity<?> getQuizBySubjectId(@PathVariable String subjectId) {
        try {
            List<Quiz> quizzes = quizService.getQuizBySubjectId(subjectId);
            if (quizzes != null && !quizzes.isEmpty()) {
                return ResponseEntity.ok(quizzes);
            } else {
                return ResponseEntity.status(404).body("Aucun quiz trouvé pour ce sujet");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }

    @GetMapping("quiz/subject/{subjectId}/last/{n}")
    public ResponseEntity<?> getLastQuizBySubjectId(@PathVariable String subjectId, @PathVariable int n) {
        try {
            List<Quiz> quizzes = quizService.getLastQuizBySubjectId(subjectId, n);
            if (quizzes != null && !quizzes.isEmpty()) {
                return ResponseEntity.ok(quizzes);
            } else {
                return ResponseEntity.status(404).body("Aucun quiz trouvé pour ce sujet");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }

    @GetMapping("quiz/subject/{subjectId}/active")
    public ResponseEntity<?> getActiveQuizBySubjectId(@PathVariable String subjectId) {
        try {
            Quiz quiz = quizService.getActiveQuizBySubjectId(subjectId);
            if (quiz != null) {
                return ResponseEntity.ok(quiz);
            } else {
                return ResponseEntity.status(404).body("Aucun quiz actif trouvé pour ce sujet");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuiz(@PathVariable String id) {
        try {
            Quiz quiz = quizService.getQuizById(id);
            if (quiz != null) {
                quizService.deleteQuiz(id);
                return ResponseEntity.ok(Map.of("message", "Quiz supprimé avec succès !"));
            } else {
                return ResponseEntity.status(404).body("Quiz non trouvé");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }
}