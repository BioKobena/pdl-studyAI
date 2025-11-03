package com.pdl.studyai_backend.controller;

import jakarta.validation.Valid;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pdl.studyai_backend.dto.SubjectRequest;
import com.pdl.studyai_backend.model.Subject;
import com.pdl.studyai_backend.service.SubjectService;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
    
    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createSubject(@Valid @RequestBody SubjectRequest req) {
        // Implémentation de la création de sujet
        Subject subject = new Subject(req.getUserId(), req.getTitle(), req.getExtractText());
        subjectService.createSubject(subject);

        return ResponseEntity.ok(Map.of("message", "Utilisateur créé"));
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
}
