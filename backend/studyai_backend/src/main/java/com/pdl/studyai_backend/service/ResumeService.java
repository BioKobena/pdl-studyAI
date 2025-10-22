package com.pdl.studyai_backend.service;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.pdl.studyai_backend.model.Resume;
import com.pdl.studyai_backend.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    // @Autowired
    // private PasswordEncoder passwordEncoder;

    // public ResumeRepository(ResumeRepository resumeRepository) {
    //     this.resumeRepository = resumeRepository;
    // }

    public Resume create(Resume resume) {
        return resumeRepository.save(resume);
    }

    // public Optional<resume> findByEmail(String email) {
    //     return ResumeRepository.findByEmail(email);
    // }

    public List<Resume> findAll() {
        return resumeRepository.findAll();
    }

    // public boolean existsByEmail(String email) {
    //     return resumeRepository.existsByEmail(email);
    // }
}
