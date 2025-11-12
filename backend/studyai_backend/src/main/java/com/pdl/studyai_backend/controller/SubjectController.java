package com.pdl.studyai_backend.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pdl.studyai_backend.dto.SubjectRequest;
import com.pdl.studyai_backend.model.Quiz;
import com.pdl.studyai_backend.model.Resume;
import com.pdl.studyai_backend.model.Subject;
import com.pdl.studyai_backend.service.ResumeService;
import com.pdl.studyai_backend.service.QuizService;
import com.pdl.studyai_backend.service.SubjectService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/api/subjects")
public class SubjectController {
    
    private final SubjectService subjectService;
    private final ResumeService resumeService;
    private final QuizService quizService;

    public SubjectController(SubjectService subjectService, ResumeService resumeService, QuizService quizService) {
        this.subjectService = subjectService;
        this.resumeService = resumeService;
        this.quizService = quizService;
    }

    @PostMapping("/create")
    @CrossOrigin
    public ResponseEntity<?> createSubject(@Valid @RequestBody SubjectRequest req) {
        System.out.println("Received Subject Creation Request: " + req);
        try {
            if (req.getTitle() == null || req.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le titre ne peut pas être vide");
            }
            if (req.getExtractText() == null || req.getExtractText().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le texte extrait ne peut pas être vide");
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
        // Implémentation de la création de sujet
        Subject subject = new Subject(req.getUserId(), req.getTitle(), req.getExtractText());
        Subject payload = this.subjectService.createSubject(subject);

        return ResponseEntity.ok(Map.of("message", "Sujet créé", "subject", payload));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSubject(@PathVariable String id) {
        Optional<Subject> subject = subjectService.getSubjectById(id);
        if (subject != null) {
            return ResponseEntity.ok(subject);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getSubjectsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(subjectService.getSubjectsByUserId(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable String id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.ok(Map.of("message", "Sujet supprimé"));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSubject(@PathVariable String id, @Valid @RequestBody SubjectRequest req) {
        Optional<Subject> response = subjectService.getSubjectById(id);
        if (response.isPresent()) {
            Subject subject = response.get();
            subject.setTitle(req.getTitle());
            subject.setExtractText(req.getExtractText());
            subject = subjectService.updateSubject(subject);
            return ResponseEntity.ok(subject);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchSubjects(@RequestParam String query) {
        try {
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le paramètre de requête ne peut pas être vide");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
        return ResponseEntity.ok(subjectService.searchSubjects(query));
    }

    @GetMapping("/{subjectId}/resume")
    public ResponseEntity<?> getResumesBySubjectId(@PathVariable String subjectId) {
        try {
            Resume resume = this.resumeService.getActiveResumeBySubjectId(subjectId);
            if (resume != null) {
                return ResponseEntity.ok(Map.of("message", "Résumé actif trouvé", "resume", resume));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }
    
    @GetMapping("/{subjectId}/quiz")
    public ResponseEntity<?> getQuizzesBySubjectId(@PathVariable String subjectId) {
        try {
            Quiz quiz = this.quizService.getActiveQuizBySubjectId(subjectId);
            if (quiz != null) {
                return ResponseEntity.ok(quiz);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }

    @GetMapping("/{subjectId}/chat")
    public ResponseEntity<?> getChatBySubjectId(@PathVariable String subjectId) {
        try {
            Subject subject = this.subjectService.getSubjectById(subjectId).orElse(null);
            if (subject != null) {
                // TODO: Implement Chat retrieval logic
                return ResponseEntity.ok(Map.of("message", "Chat trouvé"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }

}
