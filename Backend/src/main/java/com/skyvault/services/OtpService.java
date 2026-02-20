package com.skyvault.services;

import com.skyvault.models.OTP;
import com.skyvault.repositories.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.Random;

// Service to handle OTP generation and verification
@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Generate a 6-digit OTP
    public String generateOtp(String userId, String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        // Save to DB (hashed)
        OTP otpEntity = new OTP();
        otpEntity.setUserId(userId);
        otpEntity.setOtpHash(passwordEncoder.encode(otp)); // Hash the OTP!
        otpEntity.setExpiryTime(new Date(System.currentTimeMillis() + 1000 * 60 * 10)); // 10 minutes
        otpRepository.save(otpEntity);
        
        // Send email
        emailService.sendEmail(email, "Your SkyVault OTP", "Your verification code is: " + otp);
        
        return otp;
    }

    // Verify OTP
    public boolean verifyOtp(String userId, String otpInput) {
        Optional<OTP> otpOptional = otpRepository.findByUserId(userId);
        
        if (otpOptional.isPresent()) {
            OTP otpEntity = otpOptional.get();
            
            // Check expiry
            if (otpEntity.getExpiryTime().before(new Date())) {
                return false; // Expired
            }
            
            // Check hash match
            if (passwordEncoder.matches(otpInput, otpEntity.getOtpHash())) {
                // Determine if we should clear OTP here or allow subsequent use (usually clear)
                otpRepository.delete(otpEntity);
                return true;
            }
        }
        return false;
    }
}
