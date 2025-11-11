package com.pdl.studyai_backend.model;

import java.time.Instant;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "quizzes")
public class Quiz {
    @Id
    private String id;
    private String subjectId;
    private List<Question> questions;
    private Instant createdAt = Instant.now();

    public Quiz() {}

    //constructors
    public Quiz(String subjectId, List<Question> questions) {
        this.subjectId = subjectId;
        this.questions = questions;
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

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public Quiz(String subjectId) {
        this.subjectId = subjectId;
    }

    // public void addQuestion(String question, String answer) {
    //     this.questions.add(question);
    //     this.answers.add(answer);
    // }

    // public void removeQuestion(String question) {
    //     int index = this.questions.indexOf(question);
    //     if (index != -1) {
    //         this.questions.remove(index);
    //         this.answers.remove(index);
    //     }
    // }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
