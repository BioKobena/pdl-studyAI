package com.pdl.studyai_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.pdl.studyai_backend.model.Subject;
import java.util.List;

public interface SubjectRepository extends MongoRepository<Subject, String> {
    List<Subject> findByUserId(String userId);
    List<Subject> findByTitleContaining(String keyword);
}
