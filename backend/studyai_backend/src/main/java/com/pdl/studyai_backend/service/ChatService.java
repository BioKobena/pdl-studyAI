package com.pdl.studyai_backend.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.pdl.studyai_backend.model.ChatMessage;
import com.pdl.studyai_backend.model.ChatSession;
import com.pdl.studyai_backend.repository.ChatMessageRepository;
import com.pdl.studyai_backend.repository.ChatSessionRepository;

import reactor.core.publisher.Mono;

@Service
public class ChatService {

    private final ChatSessionRepository chatSessionRepo;
    private final ChatMessageRepository chatMessageRepo;

    public ChatService(ChatSessionRepository chatSessionRepo, ChatMessageRepository chatMessageRepo) {
        this.chatSessionRepo = chatSessionRepo;
        this.chatMessageRepo = chatMessageRepo;
    }

    public List<ChatMessage> getConversation(String userId, String subjectId) {
        ChatSession session = chatSessionRepo.findByUserIdAndSubjectId(userId, subjectId);
        if (session == null) {
            session = new ChatSession(subjectId);
            session.setUserId(userId);
            session.setSubjectId(subjectId);
            session.setCreatedAt(Instant.now());
            chatSessionRepo.save(session);
        }
        return chatMessageRepo.findByChatSessionIdOrderByTimestampAsc(session.getId());
    }

    public Mono<String> sendMessage(String userId, String subjectId, String userMessage) {
        ChatSession sessionInit = chatSessionRepo.findByUserIdAndSubjectId(userId, subjectId);
        if (sessionInit == null) {
            sessionInit = new ChatSession(subjectId);
            sessionInit.setUserId(userId);
            sessionInit.setSubjectId(subjectId);
            sessionInit.setCreatedAt(Instant.now());
            chatSessionRepo.save(sessionInit);
        }

        final ChatSession session = sessionInit;

        ChatMessage msgUser = new ChatMessage();
        msgUser.setChatSessionId(session.getId());
        msgUser.setRole("user");
        msgUser.setContent(userMessage);
        msgUser.setTimestamp(Instant.now());
        chatMessageRepo.save(msgUser);

        List<ChatMessage> history = chatMessageRepo.findByChatSessionIdOrderByTimestampAsc(session.getId());

        final String prompt = history.stream()
                .map(m -> (m.getRole().equals("user") ? "User: " : "Assistant: ") + m.getContent())
                .collect(Collectors.joining("\n")) + "\nUser: " + userMessage + "\nAssistant:";

        return Mono.fromCallable(() -> {
            try (Client client = new Client()) {
                GenerateContentResponse response = client.models.generateContent(
                        "gemini-2.5-flash",
                        prompt,
                        null);
                String assistantText = response.text();

                // Sauvegarde du message assistant
                ChatMessage msgAssistant = new ChatMessage();
                msgAssistant.setChatSessionId(session.getId());
                msgAssistant.setRole("assistant");
                msgAssistant.setContent(assistantText);
                msgAssistant.setTimestamp(Instant.now());
                chatMessageRepo.save(msgAssistant);

                return assistantText;
            }
        });
    }

}
