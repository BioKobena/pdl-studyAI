package com.pdl.studyai_backend.dto;

import jakarta.validation.constraints.NotBlank;

public class SubjectRequest {
    @NotBlank
    private String userId;
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotBlank
    private String extractText;
    
    // getters / setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getExtractText() { return extractText; }
    public void setExtractText(String extractText) { this.extractText = extractText; }
}
