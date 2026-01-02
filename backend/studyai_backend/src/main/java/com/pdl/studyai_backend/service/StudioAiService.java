package com.pdl.studyai_backend.service;

import org.springframework.stereotype.Service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
// import com.google.genai.types.GenerateContentResponse;

@Service
public class StudioAiService {


    public String ask(String prompt) {
        GenerateContentResponse response;
        try ( 
                Client client = new Client()) {
                    response = client.models.generateContent(
                        "gemini-2.5-flash",
                        prompt,
                        null
                );
                // GenerateContentResponse res = client.models.gene
            }
        // GenerateContentResponse res = client.models.gene
        return response.text();
    }
}
