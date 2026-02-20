package com.skyvault.repositories;

import com.skyvault.models.OTP;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Repository to talk to the OTP database table
@Repository
public interface OtpRepository extends MongoRepository<OTP, String> {

    // Find OTP by userId
    // Often we want the latest one, but for simplicity let's just find one
    Optional<OTP> findByUserId(String userId);

}
