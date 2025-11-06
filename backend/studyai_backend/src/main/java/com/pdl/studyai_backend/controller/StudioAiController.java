package com.pdl.studyai_backend.controller;

import com.pdl.studyai_backend.model.User;
import com.pdl.studyai_backend.service.StudioAiService;

import io.jsonwebtoken.Claims;

import java.util.Optional;

import org.checkerframework.checker.units.qual.C;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class StudioAiController {

    private final StudioAiService studioAiService;

    public StudioAiController(StudioAiService studioAiService) {
        this.studioAiService = studioAiService;
    }

    @GetMapping("/ask")
    // public String ask(@RequestParam String prompt) {
    public ResponseEntity<?> ask(HttpServletRequest request, @RequestParam String prompt) {
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            if (claims == null) {
                return ResponseEntity.status(401).body("Token manquant ou invalide");
            }
            return ResponseEntity.ok(studioAiService.ask(prompt));
            // return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
        // return studioAiService.ask(prompt);
    }
}
