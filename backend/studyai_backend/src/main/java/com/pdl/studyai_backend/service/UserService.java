package com.pdl.studyai_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.pdl.studyai_backend.model.User;
import com.pdl.studyai_backend.repository.UserRepository;


@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public User create(User user) {
        return repo.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    public List<User> findAll() {
        return repo.findAll();
    }

    public boolean existsByEmail(String email) {
        return repo.existsByEmail(email);
    }
}
