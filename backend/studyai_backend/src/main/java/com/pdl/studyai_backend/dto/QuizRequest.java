package com.pdl.studyai_backend.dto;

import jakarta.validation.constraints.NotBlank;

public class QuizRequest {
    @NotBlank
    private String subjectId;

    public String getSubjectId() {
        return subjectId;
    }
}
