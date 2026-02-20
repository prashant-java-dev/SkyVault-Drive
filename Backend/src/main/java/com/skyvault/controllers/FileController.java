package com.skyvault.controllers;

import com.skyvault.models.FileMetadata;
import com.skyvault.models.User;
import com.skyvault.repositories.UserRepository;
import com.skyvault.services.FileService;
import com.skyvault.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    @Autowired
    private FileService fileService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, 
                                        @RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            FileMetadata newFile = fileService.storeFile(file, user.getId(), user.getName());
            return ResponseEntity.ok(newFile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Upload failed: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<FileMetadata>> getAllFiles(@RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        return ResponseEntity.ok(fileService.getAllFiles(user.getId()));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable String id) {
        fileService.deleteFile(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/bulk-delete")
    public ResponseEntity<?> deleteFiles(@RequestBody Map<String, List<String>> request) {
        List<String> ids = request.get("ids");
        if (ids != null) {
            for (String id : ids) {
                fileService.deleteFile(id);
            }
        }
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PutMapping("/{id}/star")
    public ResponseEntity<FileMetadata> toggleStar(@PathVariable String id) {
        return ResponseEntity.ok(fileService.toggleStar(id));
    }

    @PatchMapping("/{id}/metadata")
    public ResponseEntity<FileMetadata> updateMetadata(@PathVariable String id, @RequestBody Map<String, Object> metadata) {
        return ResponseEntity.ok(fileService.updateMetadata(id, metadata));
    }
}
