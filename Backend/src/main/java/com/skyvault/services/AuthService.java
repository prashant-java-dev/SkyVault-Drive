package com.skyvault.services;

import com.skyvault.dto.AuthResponse;
import com.skyvault.dto.LoginRequest;
import com.skyvault.dto.RegisterRequest;
import com.skyvault.models.User;
import com.skyvault.repositories.UserRepository;
import com.skyvault.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private OtpService otpService;

    // Register a new user
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already taken!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        userRepository.save(user);

        // Send OTP
        String otp = otpService.generateOtp(user.getId(), user.getEmail());

        return new AuthResponse(null, user.getId(), "USER", "User registered. Please verify OTP sent to email.");
    }

    // Login user
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isVerified()) {
            throw new RuntimeException("User not verified. Please verify OTP.");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token, user.getId(), user.getRole().toString(), "Login successful");
    }
    
    // Verify OTP
    public boolean verifyUser(String userId, String otp) {
        boolean isValid = otpService.verifyOtp(userId, otp);
        if (isValid) {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            user.setVerified(true);
            userRepository.save(user);
        }
        return isValid;
    }
}
