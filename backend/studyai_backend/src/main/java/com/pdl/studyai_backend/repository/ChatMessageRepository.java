package com.pdl.studyai_backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.pdl.studyai_backend.model.ChatMessage;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByChatSessionIdOrderByTimestampAsc(String chatSessionId);
}