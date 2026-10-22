# SkillSOS — Firebase Cloud Firestore Setup & Configuration Guide

This guide walks you through setting up **Firebase Cloud Firestore** and generating the service account credentials needed by the Spring Boot backend.

SkillSOS uses the official **Firebase Admin SDK for Java** (`com.google.firebase:firebase-admin`), which provides privileged, server-side access directly to Firestore.

---

## 1. Prerequisites

1. A Google Account.
2. Access to the [Firebase Console](https://console.firebase.google.com/).

---

## 2. Step-by-Step Firebase Project Setup

### Step 2.1: Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Enter a project name, e.g., `skillsos-campus` or `skillsos-demoproject`.
4. (Optional) Disable Google Analytics for this mini-project to speed up setup.
5. Click **Create project** and wait for the initialization to complete.

### Step 2.2: Create the Cloud Firestore Database
1. In the left navigation menu, navigate to **Build** -> **Firestore Database**.
2. Click **Create database**.
3. Choose a Firestore location close to your region (e.g., `asia-south1` for Mumbai, or `us-central1`).
4. Select **Start in test mode** for initial development or **Start in production mode**.
   > **Note on Security Rules:** The Spring Boot backend connects via the **Firebase Admin SDK**, which authenticates using service account credentials. The Admin SDK communicates through Google Cloud IAM permissions and bypasses client-side Firestore Security Rules. All validation and security rules are enforced in the Spring Boot service layer.
5. Click **Create** and wait for the database to provision.

---

## 3. Generating Service Account Private Key

1. In the Firebase Console, click the **Gear icon (Project settings)** in the top left next to *Project Overview*.
2. Select the **Service accounts** tab.
3. Verify that **Firebase Admin SDK** is selected with the **Java** snippet option.
4. Click the button labeled **Generate new private key**.
5. A warning modal will appear: *"Generate private key? Anyone who has access to this key will have full access to your Firebase project."*
6. Click **Generate key**.
7. A JSON file will be downloaded to your computer (e.g., `skillsos-campus-firebase-adminsdk-xxxxx.json`).

---

## 4. Securing and Storing Credentials Locally

> [!CAUTION]
> **NEVER** commit this JSON file to GitHub, git repositories, or public storage.
> **NEVER** place this file inside the React frontend source tree.

### Recommended Local Storage:
Place the JSON file in a secure directory outside your Git repository:

- **Windows:** `C:\Users\<YourUsername>\.keys\skillsos-service-account.json`
- **macOS / Linux:** `~/.keys/skillsos-service-account.json`

The root `.gitignore` in this project is pre-configured with patterns (`*serviceAccountKey*.json`, `*service-account*.json`, `*firebase*.json`) to prevent accidental commits.

---

## 5. Configuring the Environment Variable

The Spring Boot backend discovers the credentials via the standard Google Cloud environment variable:

```
GOOGLE_APPLICATION_CREDENTIALS
```

### On Windows PowerShell (Current Session):
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\Users\shett\.keys\skillsos-service-account.json"
```

### On Windows PowerShell (Permanent User Environment Variable):
```powershell
[System.Environment]::SetEnvironmentVariable('GOOGLE_APPLICATION_CREDENTIALS', 'C:\Users\shett\.keys\skillsos-service-account.json', [System.EnvironmentVariableTarget]::User)
```

### On macOS / Linux (Terminal / bash / zsh):
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/Users/yourname/.keys/skillsos-service-account.json"
```

---

## 6. Verifying the Connection

1. Start the Spring Boot backend:
   ```powershell
   .\start-backend.ps1
   ```
2. Open your browser or run curl to test the health probe:
   ```
   http://localhost:8080/api/health
   ```
3. When correctly configured, the response will be:
   ```json
   {
     "status": "UP",
     "backendProcess": true,
     "firebaseInitialized": true,
     "firestoreConnected": true,
     "message": "SkillSOS Backend process is running. Firebase Admin SDK initialized and Firestore connectivity verified.",
     "timestamp": "2026-10-22T..."
   }
   ```

4. If credentials have not yet been provided, the backend starts gracefully and reports:
   ```json
   {
     "status": "DEGRADED",
     "backendProcess": true,
     "firebaseInitialized": false,
     "firestoreConnected": false,
     "message": "SkillSOS Backend process is running. Firebase Admin SDK is NOT initialized: GOOGLE_APPLICATION_CREDENTIALS is not set...",
     "timestamp": "2026-10-22T..."
   }
   ```

---

## 7. Firestore Collections Overview

When requests and volunteers are created through the application, the following two collections will appear in Firestore:

1. **`help_requests`**: Stores each student peer request document (ID, title, description, category, priority, status, requesterName, requesterEmail, campusLocation, volunteerCount, createdAt, resolvedAt).
2. **`volunteers`**: Stores participation documents linking volunteers to requests with deterministic IDs (`{requestId}_{volunteerEmail}`) to enforce uniqueness and prevent duplicate volunteering.
