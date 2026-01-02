package com.pdl.studyai_backend.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pdl.studyai_backend.model.Resume;
import com.pdl.studyai_backend.repository.ResumeRepository;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    public Resume create(Resume resume) {
        return resumeRepository.save(resume);
    }

    public List<Resume> findAll() {
        return resumeRepository.findAll();
    }

    public Resume getResumeById(String id) {
        return resumeRepository.findById(id).orElse(null);
    }

    public Resume updateResume(String id, Resume resume) {
        Resume existingResume = resumeRepository.findById(id).orElse(null);
        if (existingResume != null) {
            existingResume.setSubjectId(resume.getSubjectId());
            existingResume.setTexteResume(resume.getTexteResume());
            return resumeRepository.save(existingResume);
        }
        return null;
    }

    public void deleteResume(String id) {
        resumeRepository.deleteById(id);
    }  

    public List<Resume> getResumesBySubjectId(String subjectId) {
        return resumeRepository.findBySubjectId(subjectId);
    }

    public List<Resume> getLastResumesBySubjectId(String subjectId, int n) {
        List<Resume> resumes = resumeRepository.findBySubjectId(subjectId);
        resumes.sort((r1, r2) -> r2.getCreatedAt().compareTo(r1.getCreatedAt()));
        return resumes.stream().limit(n).toList();
    }

    public Resume getActiveResumeBySubjectId(String subjectId) {
        List<Resume> resumes = resumeRepository.findBySubjectId(subjectId);
        return resumes.stream()
                .max((r1, r2) -> r1.getCreatedAt().compareTo(r2.getCreatedAt()))
                .orElse(null);
    }
}
