package com.skyvault.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String userId;
    private String role;
    private String message;

    public AuthResponse(String token, String userId, String role, String message) {
        this.token = token;
        this.userId = userId;
        this.role = role;
        this.message = message;
    }
}
