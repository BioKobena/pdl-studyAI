package com.pdl.studyai_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pdl.studyai_backend.model.User;
import com.pdl.studyai_backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    // private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        // this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User create(User user) {
        // user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
