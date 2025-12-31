package com.pdl.studyai_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pdl.studyai_backend.model.ChatMessage;
import com.pdl.studyai_backend.service.ChatService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/chat")
@Tag(name = "Chat API", description = "Endpoints pour le chat Gemini")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @Operation(summary = "Récupère la conversation pour un utilisateur et document donnés")
    @GetMapping("/conversation")
    public List<ChatMessage> getConversation(@RequestParam String userId, @RequestParam String subjectId) {
        return chatService.getConversation(userId, subjectId);
    }

    @Operation(summary = "Envoie un message et reçoit la réponse du modèle")
    @PostMapping("/message")
    public Mono<String> sendMessage(@RequestParam String userId,
                                    @RequestParam String subjectId,
                                    @RequestBody String message) {
        return chatService.sendMessage(userId, subjectId, message);
    }
}
