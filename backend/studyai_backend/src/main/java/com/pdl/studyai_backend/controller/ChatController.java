package com.pdl.studyai_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pdl.studyai_backend.model.ChatMessage;
import com.pdl.studyai_backend.model.Subject;
import com.pdl.studyai_backend.service.ChatService;
import com.pdl.studyai_backend.service.SubjectService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/chat")
@Tag(name = "Chat API", description = "Endpoints pour le chat Gemini")
public class ChatController {

    private final ChatService chatService;
    private final SubjectService subjectService;

    public ChatController(ChatService chatService, SubjectService subjectService) {
        this.chatService = chatService;
        this.subjectService = subjectService;
    }

    @Operation(summary = "Récupère la conversation pour un utilisateur et document donnés")
    @GetMapping("/conversation")
    public ResponseEntity<?> getConversation(@RequestParam String userId, @RequestParam String subjectId) {
        try {
            Subject subject = this.subjectService.getSubjectById(subjectId).orElse(null);
            if (subject == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Sujet non trouvé"));
            }
            List<ChatMessage> messages = chatService.getConversation(userId, subjectId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Erreur interne : " + e.getMessage()));
        }
    }

    @Operation(summary = "Envoie un message et reçoit la réponse du modèle")
    @PostMapping("/message")
    public Mono<ResponseEntity<Map<String, String>>> sendMessage(@RequestParam String userId,
                                    @RequestParam String subjectId,
                                    @RequestBody String message) {
        Subject subject = this.subjectService.getSubjectById(subjectId).orElse(null);
        if (subject == null) {
            return Mono.just(ResponseEntity.status(404).body(Map.of("error", "Sujet non trouvé")));
        }

        String contextPrompt = "Voici le contexte du document : \n" + subject.getExtractText() + 
                             "\n\nRéponds à la question suivante en te basant sur ce contexte : " + message;

        return chatService.sendMessage(userId, subjectId, contextPrompt)
                .map(response -> ResponseEntity.ok(Map.of("response", response)))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(500)
                        .body(Map.of("error", "Erreur lors de l'envoi du message : " + e.getMessage()))));
    }
}