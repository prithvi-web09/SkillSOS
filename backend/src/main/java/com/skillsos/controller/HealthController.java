package com.skillsos.controller;

import com.skillsos.config.FirebaseConfig;
import com.skillsos.dto.HealthResponseDto;
import com.skillsos.repository.FirestoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final FirebaseConfig firebaseConfig;
    private final FirestoreRepository firestoreRepository;

    @Autowired
    public HealthController(FirebaseConfig firebaseConfig, FirestoreRepository firestoreRepository) {
        this.firebaseConfig = firebaseConfig;
        this.firestoreRepository = firestoreRepository;
    }

    @GetMapping
    public ResponseEntity<HealthResponseDto> checkHealth() {
        boolean backendProcess = true;
        boolean firebaseInitialized = firebaseConfig.isInitialized();
        boolean firestoreConnected = false;
        String message;

        if (firebaseInitialized) {
            firestoreConnected = firestoreRepository.checkConnectivity();
            if (firestoreConnected) {
                message = "SkillSOS Backend process is running. Firebase Admin SDK initialized and Firestore connectivity verified.";
                return ResponseEntity.ok(new HealthResponseDto("UP", backendProcess, true, true, message));
            } else {
                message = "SkillSOS Backend process is running. Firebase SDK is initialized, but Firestore connectivity check failed or timed out.";
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(new HealthResponseDto("DEGRADED", backendProcess, true, false, message));
            }
        } else {
            message = "SkillSOS Backend process is running. Firebase Admin SDK is NOT initialized: " + firebaseConfig.getStatusMessage();
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new HealthResponseDto("DEGRADED", backendProcess, false, false, message));
        }
    }
}
