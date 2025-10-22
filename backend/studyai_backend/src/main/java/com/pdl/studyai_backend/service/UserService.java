package com.pdl.studyai_backend.service;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.pdl.studyai_backend.model.User;
import com.pdl.studyai_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.crypto.password.PasswordEncoder;


@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;

    // @Autowired
    // private PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User create(User user) {
        // Hachage du mot de passe avant de le sauvegarder
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
