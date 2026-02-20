package com.skyvault.services;

import com.skyvault.models.FileMetadata;
import com.skyvault.repositories.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    @Value("${file.upload.path}")
    private String uploadDir; 

    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!");
        }
    }

    public FileMetadata storeFile(MultipartFile file, String userId, String userName) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        
        try {
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Invalid path sequence " + originalFileName);
            }

            String storedFileName = UUID.randomUUID().toString() + "_" + originalFileName;
            Path targetLocation = Paths.get(uploadDir).resolve(storedFileName);
            
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            FileMetadata fileMetadata = new FileMetadata();
            fileMetadata.setOriginalName(originalFileName);
            fileMetadata.setFilePath(targetLocation.toString());
            fileMetadata.setMimetype(file.getContentType());
            fileMetadata.setSize(file.getSize());
            fileMetadata.setUploadedBy(userId);
            fileMetadata.setUploaderName(userName);
            fileMetadata.setDeleted(false); // Ensure logic explicit
            fileMetadata.setUploadDate(new java.util.Date()); // Set upload date
            
            return fileRepository.save(fileMetadata);
            
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    public FileMetadata getFile(String fileId) {
        return fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found with id " + fileId));
    }

    // Get all files for a user (My Files)
    public List<FileMetadata> getAllFiles(String userId) {
        return fileRepository.findByUploadedByAndIsDeletedFalse(userId);
    }
    
    public void deleteFile(String fileId) {
        FileMetadata file = getFile(fileId);
        file.setDeleted(true);
        fileRepository.save(file);
    }

    public FileMetadata toggleStar(String fileId) {
        FileMetadata file = getFile(fileId);
        file.setStarred(!file.isStarred());
        return fileRepository.save(file);
    }

    public FileMetadata updateMetadata(String fileId, java.util.Map<String, Object> updates) {
        FileMetadata file = getFile(fileId);
        
        if (updates.containsKey("isPublic")) {
            file.setPublic((Boolean) updates.get("isPublic"));
        }
        
        // Update generic metadata map
        if (file.getMetadata() == null) {
            file.setMetadata(new java.util.HashMap<>());
        }
        
        updates.forEach((key, value) -> {
            if (!key.equals("isPublic")) {
                 file.getMetadata().put(key, value);
            }
        });
        
        return fileRepository.save(file);
    }
}
