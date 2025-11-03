package com.pdl.studyai_backend.model;

import java.time.Instant;
// import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "subjects")
public class Subject {

    @Id
    private String id;  

    private String userId; 
    
    // private String typeSubject;
     
    private String title;
    
    private Instant createdAt = Instant.now();
    
    private String extractText;

    public Subject() {}

    public Subject(String userId, String title, String extractText) {
        this.userId = userId;
        // this.typeSubject = typeSubject;
        this.title = title;
        this.extractText = extractText;
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    // public String getTypeSubject() {
    //     return typeSubject;
    // }

    // public void setTypeSubject(String typeSubject) {
    //     this.typeSubject = typeSubject;
    // }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getExtractText() {
        return extractText;
    }

    public void setExtractText(String extractText) {
        this.extractText = extractText;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
