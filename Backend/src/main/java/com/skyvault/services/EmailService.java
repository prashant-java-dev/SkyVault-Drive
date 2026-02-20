package com.skyvault.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

// Service to send emails (OTP, Notifications)
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Send a simple email
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("security@skyvault.com"); // Usually set to your verified sender
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to: " + to + ". Error: " + e.getMessage());
            // In production, we might want to retry or log this better
        }
    }
}
