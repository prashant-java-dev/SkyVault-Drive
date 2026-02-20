package com.skyvault.repositories;

import com.skyvault.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Repository to talk to the User database table
@Repository
public interface UserRepository extends MongoRepository<User, String> {

    // Find a user by their email address
    Optional<User> findByEmail(String email);

    // Check if an email already exists
    boolean existsByEmail(String email);
    
}

