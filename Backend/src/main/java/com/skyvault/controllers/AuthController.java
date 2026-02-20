package com.skyvault.controllers;

import com.skyvault.dto.AuthResponse;
import com.skyvault.dto.LoginRequest;
import com.skyvault.dto.RegisterRequest;
import com.skyvault.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow requests from React frontend
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authService.register(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String otp = request.get("otp");
        
        if (authService.verifyUser(userId, otp)) {
            return ResponseEntity.ok(Map.of("success", true, "message", "OTP Verified Successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid OTP"));
        }
    }
}
