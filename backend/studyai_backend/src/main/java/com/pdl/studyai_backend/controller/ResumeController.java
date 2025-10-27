package com.pdl.studyai_backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pdl.studyai_backend.dto.ResumeRequest;
import com.pdl.studyai_backend.model.Resume;
import com.pdl.studyai_backend.service.ResumeService;

@RestController
@RequestMapping("api/resume")
public class ResumeController {
    private ResumeService resumeService;

    public ResumeController(ResumeService service) {
        this.resumeService = service;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createResume(@RequestBody ResumeRequest reqResume) {

        Resume r = new Resume(reqResume.getSubjectId(), reqResume.getTextResume());
        resumeService.create(r);

        return ResponseEntity.ok(Map.of("message", "Résumé créé avec succès !"));
    }

}
