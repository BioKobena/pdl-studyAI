package com.pdl.studyai_backend.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Représente un utilisateur (document MongoDB).
 */
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String fullName;
    private String email;
    private String password; // pour l'instant stocké en clair — à remplacer par hash (bcrypt)
    // private List<String> roles = new ArrayList<>();
    private Instant createdAt = Instant.now();

    public User() {}

    public User(String fullName, String email, String password) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        // this.roles.add("USER");
    }

    // getters & setters (ou utilise Lombok @Data)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    // public List<String> getRoles() { return roles; }
    // public void setRoles(List<String> roles) { this.roles = roles; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
