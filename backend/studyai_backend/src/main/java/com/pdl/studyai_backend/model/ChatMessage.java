package com.pdl.studyai_backend.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "chat_messages")
public class ChatMessage {

    @Id
    private String id;
    private String chatSessionId;
    private String role;
    private String content;
    private Instant timestamp = Instant.now();

    public ChatMessage() {
    }

    public ChatMessage(String chatSessionId, String role, String content, Instant timestamp) {
        this.chatSessionId = chatSessionId;
        this.role = role;
        this.content = content;
        this.timestamp = timestamp;
    }

    public ChatMessage(String id, String chatSessionId, String role, String content, Instant timestamp) {
        this.id = id;
        this.chatSessionId = chatSessionId;
        this.role = role;
        this.content = content;
        this.timestamp = timestamp == null ? Instant.now() : timestamp;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getChatSessionId() {
        return chatSessionId;
    }

    public void setChatSessionId(String chatSessionId) {
        this.chatSessionId = chatSessionId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "id='" + id + '\'' +
                ", chatSessionId='" + chatSessionId + '\'' +
                ", role='" + role + '\'' +
                ", content='" + content + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
