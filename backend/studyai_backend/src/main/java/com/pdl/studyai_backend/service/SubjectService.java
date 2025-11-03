package com.pdl.studyai_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import com.pdl.studyai_backend.model.Subject;
import com.pdl.studyai_backend.repository.SubjectRepository;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    public Optional<Subject> getSubjectById(String id) {
        return subjectRepository.findById(id);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public List<Subject> getSubjectsByUserId(String userId) {
        return subjectRepository.findByUserId(userId);
    }

    public List<Subject> searchSubjects(String keyword) {
        return subjectRepository.findByTitleContaining(keyword);
    }

    public void deleteSubject(String id) {
        subjectRepository.deleteById(id);
    }

    public Subject updateSubject(Subject subject) {
        return subjectRepository.save(subject);
    }
}
