package com.skyvault.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

// Logs important actions for security and analytics
@Data
@Document(collection = "activity_logs")
public class ActivityLog {

    @Id
    private String id;

    private String userId;
    private String action; // e.g., "LOGIN", "UPLOAD_FILE", "DELETE_FILE"
    private Date timestamp;
    private String ipAddress;

    public ActivityLog() {
        this.timestamp = new Date();
    }
    
    public ActivityLog(String userId, String action, String ipAddress) {
        this.userId = userId;
        this.action = action;
        this.ipAddress = ipAddress;
        this.timestamp = new Date();
    }
}
