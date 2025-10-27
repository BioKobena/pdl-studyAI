package com.pdl.studyai_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pdl.studyai_backend.dto.LoginRequest;
import com.pdl.studyai_backend.dto.SignupRequest;
import com.pdl.studyai_backend.model.User;
import com.pdl.studyai_backend.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins="http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UserService svc) {
        this.userService = svc;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req) {
        if (userService.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email déjà utilisé"));
        }
        // TODO : hasher le mot de passe (bcrypt) avant save
        User u = new User(req.getFullName(), req.getEmail(), passwordEncoder.encode(req.getPassword()));
        userService.create(u);
        return ResponseEntity.ok(Map.of("message", "Utilisateur créé"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        return userService.findByEmail(req.getEmail())
            .map(u -> {
                // TODO : remplacer par comparaison bcrypt
                if (passwordEncoder.matches(req.getPassword(), u.getPassword())) {
                // if (u.getPassword().equals(req.getPassword())) {
                    Map<String,Object> payload = new HashMap<>();
                    payload.put("id", u.getId());
                    payload.put("email", u.getEmail());
                    payload.put("fullName", u.getFullName());
                    // TODO : générer JWT ici
                    return ResponseEntity.ok(payload);
                } else {
                    return ResponseEntity.status(401).body(Map.of("error", "Credentiels invalides"));
                }
            })
            .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Utilisateur introuvable")));
    }
}
