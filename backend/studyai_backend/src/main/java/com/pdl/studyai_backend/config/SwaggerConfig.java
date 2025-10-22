package com.pdl.studyai_backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI studyAIAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("StudyAI API")
                        .description("API documentation for StudyAI project")
                        .version("1.0.0"));
    }
}
