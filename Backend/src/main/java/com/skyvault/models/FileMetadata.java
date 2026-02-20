package com.skyvault.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.Map;

// This class represents a File uploaded to SkyVault
@Data
@Document(collection = "files")
public class FileMetadata {

    @Id
    private String id;

    private String originalName; // Was fileName
    private String filePath; 
    private String mimetype; // Was fileType
    private long size; // Was fileSize
    private String uploadedBy; // Was ownerId
    private String uploaderName; // New field for UI
    
    private Map<String, Object> metadata;

    private int version;
    
    private boolean isPublic;
    private String publicToken;
    
    private boolean isStarred;
    private boolean isDeleted;
    
    private Date uploadDate; // Was createdAt

    public FileMetadata() {
        this.uploadDate = new Date();
        this.version = 1;
        this.isDeleted = false;
        this.isStarred = false;
        this.isPublic = false;
    }
}
