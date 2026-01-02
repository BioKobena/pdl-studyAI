package com.pdl.studyai_backend.dto;

import jakarta.validation.constraints.NotBlank;;

public class ResumeRequest {
    @NotBlank
    private String subjectId;

    // @NotBlank
    // private String texteResume;

    public String getSubjectId() {
        return subjectId;
    }

    // public String getTextResume() {
    //     return texteResume;
    // }

    // public void setTextResume(String textResume) {
    //     this.texteResume = textResume;
    // }
}
