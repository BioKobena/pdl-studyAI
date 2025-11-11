package com.pdl.studyai_backend.model;

import org.springframework.data.annotation.Id;

public class Reponse {
    @Id
    private String id;
    private String content;
    private boolean isCorrect;
    private boolean isSelected;

    public Reponse() {}
    public Reponse(String content, boolean isCorrect) {
        this.content = content;
        this.isCorrect = isCorrect;
        this.isSelected = false;
    }
    //getters
    public String getId() {
        return id;
    }
    public String getContent() {
        return content;
    }
    public boolean isSelected() {

        return isSelected;
    }
    
    public boolean isCorrect() {
        return isCorrect;
    }

    //setters
    public void setContent(String content) {
        this.content = content;
    }

    public void setCorrect(boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
    public void setSelected(boolean isSelected) {
        this.isSelected = isSelected;
    }
}