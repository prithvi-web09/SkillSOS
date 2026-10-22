package com.skillsos.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.credentials-path:}")
    private String credentialsPath;

    @Value("${firebase.project-id:}")
    private String projectId;

    private boolean initialized = false;
    private String statusMessage = "Uninitialized";

    @Bean
    public Firestore firestore() {
        try {
            // Check if already initialized in JVM
            if (!FirebaseApp.getApps().isEmpty()) {
                FirebaseApp app = FirebaseApp.getInstance();
                this.initialized = true;
                this.statusMessage = "Firebase Admin SDK initialized successfully (existing instance).";
                log.info("Using existing FirebaseApp instance: {}", app.getName());
                return FirestoreClient.getFirestore();
            }

            // Determine credentials file path from properties or environment
            String resolvedPath = credentialsPath;
            if (resolvedPath == null || resolvedPath.trim().isEmpty()) {
                resolvedPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
            }

            if (resolvedPath == null || resolvedPath.trim().isEmpty()) {
                this.initialized = false;
                this.statusMessage = "GOOGLE_APPLICATION_CREDENTIALS is not set. Service account JSON file is required for Firestore access.";
                log.warn("Firebase credentials not configured: {}", this.statusMessage);
                return null;
            }

            File credFile = new File(resolvedPath.trim());
            if (!credFile.exists() || !credFile.isFile()) {
                this.initialized = false;
                this.statusMessage = "Service account credentials file not found at path: " + credFile.getAbsolutePath();
                log.warn("{}", this.statusMessage);
                return null;
            }

            try (InputStream serviceAccount = new FileInputStream(credFile)) {
                FirebaseOptions.Builder optionsBuilder = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount));

                if (projectId != null && !projectId.trim().isEmpty()) {
                    optionsBuilder.setProjectId(projectId.trim());
                }

                FirebaseApp.initializeApp(optionsBuilder.build());
                this.initialized = true;
                this.statusMessage = "Firebase Admin SDK initialized successfully with service account.";
                log.info("{}", this.statusMessage);
                return FirestoreClient.getFirestore();
            }
        } catch (Exception e) {
            this.initialized = false;
            this.statusMessage = "Failed to initialize Firebase: " + e.getMessage();
            log.error("Firebase initialization failed: {}", e.getMessage(), e);
            return null;
        }
    }

    public boolean isInitialized() {
        return initialized && !FirebaseApp.getApps().isEmpty();
    }

    public String getStatusMessage() {
        return statusMessage;
    }
}
