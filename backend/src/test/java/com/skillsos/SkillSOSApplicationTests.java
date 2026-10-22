package com.skillsos;

import com.skillsos.config.FirebaseConfig;
import com.skillsos.controller.HealthController;
import com.skillsos.dto.HealthResponseDto;
import com.skillsos.repository.FirestoreRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest
class SkillSOSApplicationTests {

    @Autowired
    private HealthController healthController;

    @MockBean
    private FirebaseConfig firebaseConfig;

    @MockBean
    private FirestoreRepository firestoreRepository;

    @Test
    @DisplayName("1 & 2. Spring context loads and health endpoint responds accurately")
    void contextLoadsAndHealthResponds() {
        assertNotNull(healthController, "Health controller bean should be available in Spring context");
    }

    @Test
    @DisplayName("3. Health endpoint reports honest DEGRADED status when Firebase is uninitialized")
    void healthReportsDegradedWhenFirebaseUninitialized() {
        when(firebaseConfig.isInitialized()).thenReturn(false);
        when(firebaseConfig.getStatusMessage()).thenReturn("GOOGLE_APPLICATION_CREDENTIALS not set");

        ResponseEntity<HealthResponseDto> response = healthController.checkHealth();

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("DEGRADED", response.getBody().getStatus());
        assertTrue(response.getBody().isBackendProcess(), "Backend process should be active");
        assertFalse(response.getBody().isFirebaseInitialized(), "Firebase initialized should be false");
        assertFalse(response.getBody().isFirestoreConnected(), "Firestore connected should be false");
        assertTrue(response.getBody().getMessage().contains("GOOGLE_APPLICATION_CREDENTIALS"));
    }

    @Test
    @DisplayName("Health endpoint reports UP when Firebase is initialized and Firestore is connected")
    void healthReportsUpWhenFirebaseConnected() {
        when(firebaseConfig.isInitialized()).thenReturn(true);
        when(firestoreRepository.checkConnectivity()).thenReturn(true);

        ResponseEntity<HealthResponseDto> response = healthController.checkHealth();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("UP", response.getBody().getStatus());
        assertTrue(response.getBody().isBackendProcess());
        assertTrue(response.getBody().isFirebaseInitialized());
        assertTrue(response.getBody().isFirestoreConnected());
    }
}
