package com.pdl.studyai_backend.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.pdl.studyai_backend.model.Resume;

public interface ResumeRepository extends MongoRepository<Resume, String> {
    // Optional<Resume> findByOptional(String idResume);

    // boolean existsByIdResume(String idResume);
}
