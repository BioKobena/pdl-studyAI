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
import com.pdl.studyai_backend.service.security.JwtUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins="http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;

    public AuthController(UserService svc, JwtUtil jwtUtil) {
        this.userService = svc;
        this.jwtUtil = jwtUtil;
    }

    @Operation(
        summary = "User registration",
        description = "Allows a new user to register with their name, email, and password. The password is automatically hashed before being stored."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User successfully created"),
        @ApiResponse(responseCode = "400", description = "Invalid input or user already exists")
    })
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req) {
        if (userService.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email déjà utilisé"));
        }
        // FIX : hasher le mot de passe (bcrypt) avant save
        User u = new User(req.getFullName(), req.getEmail(), passwordEncoder.encode(req.getPassword()));
        userService.create(u);
        return ResponseEntity.ok(Map.of("message", "Utilisateur créé"));
    }

    @Operation(
        summary = "User login",
        description = "Authenticates a user using their email and password. Returns a JWT token upon successful authentication."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User successfully authenticated"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials or user not found")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        return userService.findByEmail(req.getEmail())
            .map(u -> {
                // FIX : remplacer par comparaison bcrypt
                if (passwordEncoder.matches(req.getPassword(), u.getPassword())) {
                // if (u.getPassword().equals(req.getPassword())) {
                    Map<String,Object> payload = new HashMap<>();
                    payload.put("id", u.getId());
                    payload.put("email", u.getEmail());
                    payload.put("fullName", u.getFullName());

                    // FIX : générer JWT ici
                    String token = jwtUtil.generateToken(payload);
                    payload.put("token", token);
                    return ResponseEntity.ok(payload);
                } else {
                    return ResponseEntity.status(401).body(Map.of("error", "Credentiels invalides"));
                }
            })
            .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Utilisateur introuvable")));
    }

    // @Operation(summary = "Refresh JWT Token", description = "Regenerate a valid JWT token for an authenticated user.")
    // @ApiResponses(value = {
    //         @ApiResponse(responseCode = "200", description = "Token successfully refreshed"),
    //         @ApiResponse(responseCode = "401", description = "Invalid or expired token")
    // })
    // @PostMapping("/refresh-token")
    // public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String authHeader) {
    //     if (authHeader == null || !authHeader.startsWith("Bearer ")) {
    //         return ResponseEntity.status(401).body(Map.of("error", "Missing or invalid Authorization header"));
    //     }

    //     String oldToken = authHeader.substring(7);
    //     if (!jwtUtil.isTokenValid(oldToken)) {
    //         return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
    //     }

    //     String email = jwtUtil.extractEmail(oldToken);
    //     Optional<User> user = userRepository.findByEmail(email);

    //     if (user.isEmpty()) {
    //         return ResponseEntity.status(401).body(Map.of("error", "User not found"));
    //     }

    //     String newToken = jwtService.generateToken(user.get());
    //     return ResponseEntity.ok(Map.of("token", newToken));
    // }
}
