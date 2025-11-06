package com.pdl.studyai_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pdl.studyai_backend.dto.ResumeRequest;
import com.pdl.studyai_backend.model.Resume;
import com.pdl.studyai_backend.model.Subject;
import com.pdl.studyai_backend.service.ResumeService;
import com.pdl.studyai_backend.service.SubjectService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins="http://localhost:3000")
@RequestMapping("api/resume")
public class ResumeController {

    private final ResumeService resumeService;
    private final SubjectService subjectService;

    public ResumeController(ResumeService service, SubjectService subjectService) {
        this.resumeService = service;
        this.subjectService = subjectService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createResume(HttpServletRequest request, @RequestBody ResumeRequest reqResume) {
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            if (claims == null) {
                return ResponseEntity.status(401).body("Token manquant ou invalide");
            }
            Subject subject = this.subjectService.getSubjectById(reqResume.getSubjectId()).orElse(null);
            if (subject == null) {
                return ResponseEntity.status(404).body("Sujet non trouvé");
            }
            Resume r = new Resume(reqResume.getSubjectId(), subject.getExtractText());
            Resume resume = this.resumeService.create(r);

            return ResponseEntity.ok(Map.of("message", "Résumé créé avec succès !", "resume", resume));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResume(@PathVariable String id) {
        try {
            Resume resume = resumeService.getResumeById(id);
            if (resume != null) {
                return ResponseEntity.ok(resume);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<?> getResumesBySubjectId(@PathVariable String subjectId) {
        try {
            List<Resume> resumes = resumeService.getResumesBySubjectId(subjectId);
            if (!resumes.isEmpty()) {
                return ResponseEntity.ok(resumes);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }

    @GetMapping("/subject/{subjectId}/last/{n}")
    public ResponseEntity<?> getLastResumesBySubjectId(@PathVariable String subjectId, @PathVariable int n) {
        try {
            List<Resume> resumes = resumeService.getLastResumesBySubjectId(subjectId, n);
            if (!resumes.isEmpty()) {
                return ResponseEntity.ok(resumes);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }

    @GetMapping("/subject/{subjectId}/active")
    public ResponseEntity<?> getActiveResumeBySubjectId(@PathVariable String subjectId) {
        try {
            Resume resume = resumeService.getActiveResumeBySubjectId(subjectId);
            if (resume != null) {
                return ResponseEntity.ok(resume);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable String id) {
        try {
            resumeService.deleteResume(id);
            return ResponseEntity.ok(Map.of("message", "Résumé supprimé avec succès !"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }  



}
