package com.pdl.studyai_backend.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "subjects")
public class Subject {

    @Id
    private String id;  

    private String userId; 
    
    private String typeSubject;
    
    private Date dateCreation; 
    
    private String extractText;

    public Subject() {}

    public Subject(String userId, String typeSubject, Date dateCreation, String extractText) {
        this.userId = userId;
        this.typeSubject = typeSubject;
        this.dateCreation = dateCreation;
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

    public String getTypeSubject() {
        return typeSubject;
    }

    public void setTypeSubject(String typeSubject) {
        this.typeSubject = typeSubject;
    }

    public Date getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getExtractText() {
        return extractText;
    }

    public void setExtractText(String extractText) {
        this.extractText = extractText;
    }
}
