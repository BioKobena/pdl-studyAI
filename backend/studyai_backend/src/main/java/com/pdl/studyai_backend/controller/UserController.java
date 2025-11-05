package com.pdl.studyai_backend.controller;

import com.pdl.studyai_backend.model.User;
import com.pdl.studyai_backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Route protégée qui renvoie les informations de l'utilisateur connecté.
     * Le token JWT doit être envoyé dans le header "Authorization: Bearer <token>".
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        try {
            Claims claims = (Claims) request.getAttribute("claims");
            if (claims == null) {
                return ResponseEntity.status(401).body("Token manquant ou invalide");
            }

            String userId = claims.get("id", String.class);
            Optional<User> user = userRepository.findById(userId);

            if (user.isEmpty()) {
                return ResponseEntity.status(404).body("Utilisateur introuvable");
            }

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }
}

