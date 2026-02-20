package com.skyvault.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

// This class represents the One-Time Passwords (OTP)
@Data
@Document(collection = "otps")
public class OTP {

    @Id
    private String id;
    
    private String userId; // Links to the user
    private String otpHash; // Hashed OTP for security
    private Date expiryTime; // When does this OTP expire?
    private int attemptCount; // How many times tried?
    
    // Default constructor
    public OTP() {
        this.attemptCount = 0;
    }
}
