package com.skyvault.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

// This class represents a User in our database
@Data // Lombok automatically generates getters, setters, toString, equals, hashcode
@Document(collection = "users") // MongoDB collection name
public class User {

    @Id
    private String id; // Unique ID for every user

    private String name;
    private String email;
    private String password; // This will be encrypted!

    private Role role; // ADMIN or USER

    private boolean isVerified; // Has the user verified their email?
    
    private Date createdAt; // When did they sign up?

    // Default constructor
    public User() {
        this.createdAt = new Date();
        this.role = Role.USER;
        this.isVerified = false;
    }
}
