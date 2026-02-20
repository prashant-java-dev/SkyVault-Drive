package com.skyvault.repositories;

import com.skyvault.models.FileMetadata;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends MongoRepository<FileMetadata, String> {

    // Find all files belonging to a user that are NOT deleted
    List<FileMetadata> findByUploadedByAndIsDeletedFalse(String uploadedBy);

    // Find files in trash
    List<FileMetadata> findByUploadedByAndIsDeletedTrue(String uploadedBy);
    
    Optional<FileMetadata> findByIdAndUploadedBy(String id, String uploadedBy);

    Optional<FileMetadata> findByPublicToken(String publicToken);

    List<FileMetadata> findByOriginalNameAndUploadedByAndIsDeletedFalse(String originalName, String uploadedBy);
}
