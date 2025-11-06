package com.pdl.studyai_backend.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.pdl.studyai_backend.model.Resume;
import java.util.List;
// import java.time.Instant;

public interface ResumeRepository extends MongoRepository<Resume, String> {
    List<Resume> findBySubjectId(String subjectId);
    // List<Resume> findByTexteResumeContaining(String keyword);
    // List<Resume> findByCreatedAtAfter(Instant date);
}
