package com.pdl.studyai_backend.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "quizzes")
public class Quiz {
    @Id
    private String id;
    private String subjectId;
    private List<String> questions;
    private List<String> answers;

    public Quiz() {}

    // Getters et setters
    public String getId() {
        return id;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public List<String> getQuestions() {
        return questions;
    }

    public void setQuestions(List<String> questions) {
        this.questions = questions;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }

    public Quiz(String subjectId, List<String> questions, List<String> answers) {
        this.subjectId = subjectId;
        this.questions = questions;
        this.answers = answers;
    }

    public void addQuestion(String question, String answer) {
        this.questions.add(question);
        this.answers.add(answer);
    }

    public void removeQuestion(String question) {
        int index = this.questions.indexOf(question);
        if (index != -1) {
            this.questions.remove(index);
            this.answers.remove(index);
        }
    }
}
