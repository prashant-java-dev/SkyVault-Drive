package com.skyvault;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

// Simple main class for starting the Spring Boot application
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class SkyVaultApplication {

    public static void main(String[] args) {
        System.out.println("Starting SkyVault Drive Backend...");
        SpringApplication.run(SkyVaultApplication.class, args);
        System.out.println("SkyVault Drive Backend Started Successfully!");
    }

}
