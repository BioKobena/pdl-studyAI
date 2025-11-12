package com.pdl.studyai_backend.model;

// import org.springframework.data.annotation.Id;
import java.util.List;


public class Question {
    // @Id
    // private String id;
    private String content;
    private List<Reponse> reponses;
    public Question() {}
    public Question(String content, List<Reponse> reponses) {
        this.content = content;
        this.reponses = reponses;
    }
    // public String getId() {
    //     return id;
    // }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public List<Reponse> getReponses() {
        return reponses;
    }
    public void setReponses(List<Reponse> reponses) {
        this.reponses = reponses;
    }
}