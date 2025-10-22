package com.pdl.studyai_backend.controller;

import java.util.HashMap;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pdl.studyai_backend.dto.LoginRequest;
import com.pdl.studyai_backend.dto.SignupRequest;
import com.pdl.studyai_backend.model.User;
import com.pdl.studyai_backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthController(UserService svc) {
        this.userService = svc;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req) {
        if (userService.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email déjà utilisé"));
        }
        // hasher le mot de passe (bcrypt) avant save
        User u = new User(req.getFullName(), req.getEmail(), passwordEncoder.encode(req.getPassword()));

        userService.create(u);
        return ResponseEntity.ok(Map.of("message", "Utilisateur créé"));
    }

    // @PostMapping("/login")
    // public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
    //     return userService.findByEmail(req.getEmail())
    //         .map(u -> {
    //             boolean matches = passwordEncoder.matches(req.getPassword(), u.getPassword());
    //             if (matches) {
    //                 Map<String,Object> payload = new HashMap<>();
    //                 payload.put("id", u.getId());
    //                 payload.put("email", u.getEmail());
    //                 payload.put("fullName", u.getFullName());
    //                 // TODO : générer JWT ici
    //                 return ResponseEntity.ok(payload);
    //             } else {
    //                 return ResponseEntity.status(401).body(Map.of("error", "Identifiants invalides"));
    //             }
    //         })
    //         .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Utilisateur introuvable")));
    // }
}
