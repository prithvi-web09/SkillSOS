package com.skillsos.dto;

import java.util.Date;

public class HealthResponseDto {
    private String status; // UP, DEGRADED, DOWN
    private boolean backendProcess;
    private boolean firebaseInitialized;
    private boolean firestoreConnected;
    private String message;
    private Date timestamp;

    public HealthResponseDto() {
        this.timestamp = new Date();
    }

    public HealthResponseDto(String status, boolean backendProcess, boolean firebaseInitialized,
                             boolean firestoreConnected, String message) {
        this();
        this.status = status;
        this.backendProcess = backendProcess;
        this.firebaseInitialized = firebaseInitialized;
        this.firestoreConnected = firestoreConnected;
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isBackendProcess() {
        return backendProcess;
    }

    public void setBackendProcess(boolean backendProcess) {
        this.backendProcess = backendProcess;
    }

    public boolean isFirebaseInitialized() {
        return firebaseInitialized;
    }

    public void setFirebaseInitialized(boolean firebaseInitialized) {
        this.firebaseInitialized = firebaseInitialized;
    }

    public boolean isFirestoreConnected() {
        return firestoreConnected;
    }

    public void setFirestoreConnected(boolean firestoreConnected) {
        this.firestoreConnected = firestoreConnected;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }
}
