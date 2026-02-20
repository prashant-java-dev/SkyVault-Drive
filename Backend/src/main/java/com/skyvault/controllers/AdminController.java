package com.skyvault.controllers;

import com.skyvault.models.User;
import com.skyvault.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*") // Allow requests from React frontend
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        // Return all users for admin panel
        // In real app, check if requester is ADMIN
        return ResponseEntity.ok(userRepository.findAll());
    }
}
