package com.skyvault.repositories;

import com.skyvault.models.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repository to talk to the Activity Log database
@Repository
public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {

    // Get logs for a specific user
    List<ActivityLog> findByUserIdOrderByTimestampDesc(String userId);

}
