package com.pdl.studyai_backend.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "chat_sessions")
public class ChatSession {

    @Id
    private String id;
    private String userId;
    private String subjectId;
    private Instant createdAt = Instant.now();

    public ChatSession() {
    }

    public ChatSession(String subjectId) {
        this.subjectId = subjectId;
        this.createdAt = Instant.now();
    }

    public ChatSession(String id, String userId, String subjectId, Instant createdAt) {
        this.id = id;
        this.userId = userId;
        this.subjectId = subjectId;
        this.createdAt = createdAt == null ? Instant.now() : createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "ChatSession{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", subjectId='" + subjectId + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
