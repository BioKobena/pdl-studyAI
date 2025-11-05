package com.pdl.studyai_backend.controller;

import com.pdl.studyai_backend.service.StudioAiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StudioAiController {

    private final StudioAiService studioAiService;

    public StudioAiController(StudioAiService studioAiService) {
        this.studioAiService = studioAiService;
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String prompt) {
        return studioAiService.ask(prompt);
    }
}
