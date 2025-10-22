package com.pdl.studyai_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "resumes")

public class Resume {
    @Id
    private String id;
    private String subjectId;
    private String texteResume;

    public Resume() {
    }

    public Resume(String subjectId, String texteResume) {
        this.subjectId = subjectId;
        this.texteResume = texteResume;
    }

    public String getId() {
        return id;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public String getTexteResume() {
        return texteResume;
    }

    public void setTexteResume(String texteResume) {
        this.texteResume = texteResume;
    }
}
