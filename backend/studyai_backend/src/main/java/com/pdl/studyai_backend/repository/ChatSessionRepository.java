package com.pdl.studyai_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.pdl.studyai_backend.model.ChatSession;

public interface ChatSessionRepository extends MongoRepository<ChatSession, String> {
    ChatSession findByUserIdAndSubjectId(String userId, String subjectId);
}

