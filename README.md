# SkillSOS — Campus Emergency Help & Peer Support Network

> **A Complete Full-Stack Java Mini-Project with Google Firebase Cloud Firestore**  
> Developed for Semester III Computer Engineering Mini-Project & Viva Demonstration.

[![Java](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Firebase](https://img.shields.io/badge/Firebase-Admin%20SDK%209.3.0-yellow.svg)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Academic-lightgrey.svg)]()

---

### 🌐 How to View the Interactive Website

> [!IMPORTANT]
> This GitHub page is the **source code repository** and shows code and project documentation.  
> To view and use the **actual interactive web application UI**:
>
> 1. **Run Locally in Browser (Recommended):**
>    - Open **[http://localhost:5173](http://localhost:5173)** in your web browser (when services are running).
>    - Or open **[http://localhost:8080](http://localhost:8080)** (Spring Boot embedded full-stack server).
> 2. **Live GitHub Pages URL:**
>    - **[https://prithvi-web09.github.io/SkillSOS/](https://prithvi-web09.github.io/SkillSOS/)** (Once enabled in repository Settings -> Pages -> GitHub Actions).

---

## 1. Project Overview

**SkillSOS** is a student-to-student campus assistance platform designed to solve daily academic and logistical micro-emergencies on college campuses:
- Borrowing a scientific calculator (FX-991EX) right before a practical exam.
- Finding Java handwritten practical notes or viva questions.
- Explaining OOP inheritance, exception handling, or pointers.
- Reporting or recovering a lost student ID card, journal, or keys.
- Finding classrooms, laboratories, or seminar halls.

### Important Distinction
SkillSOS is strictly for **routine peer assistance and academic convenience**. It is **not** an emergency response system for medical, fire, or police services. A prominent safety disclaimer is displayed throughout the application.

---

## 2. Key Features

- **Priority-Aware Request Board:** Categorized requests (`ACADEMIC_HELP`, `BORROW_OR_LEND`, `NOTES_AND_STUDY_MATERIAL`, `LOST_AND_FOUND`, `PROGRAMMING_HELP`, `CAMPUS_NAVIGATION`, `OTHER`) with urgency levels (`LOW`, `NORMAL`, `HIGH`).
- **Atomic Volunteering:** Instant "I'll Help" action with atomic concurrency control via Google Cloud Firestore transactions.
- **Strict Request Lifecycle:** State transitions strictly enforced on the server: `OPEN` -> `ACCEPTED` -> `RESOLVED` (with creator reopen capability).
- **No Self-Volunteering & Duplicate Prevention:** Request creators cannot volunteer for their own requests, and the same student cannot volunteer twice.
- **Real Platform Statistics:** Live dashboard computing total requests, open requests, accepted, resolved, unique student volunteers, and resolution percentage from stored Firestore data (with division-by-zero safeguards).
- **Student Activity Lookup:** Demonstration view allowing students to query requests they created or volunteered for.
- **XML / DOM Lab Syllabus Demonstration:** Server-side XML DOM parser (`DocumentBuilderFactory`) reading and exposing campus facility directories from `campus-resources.xml`.
- **Health Probing (`/api/health`):** Granular diagnostics checking backend process health, Firebase Admin SDK initialization, and non-destructive Firestore connectivity.

---

## 3. Technology Stack

### Frontend
- **Framework:** React 19 + Vite 6
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Design System:** Dark navy theme (`#0a0e17`), electric blue accents (`#3b82f6`), status color-coding, responsive layout for mobile and desktop.
- **Port:** `http://localhost:5173` (with `/api` proxy to Spring Boot)

### Backend
- **Language & Runtime:** Java 21 LTS
- **Framework:** Spring Boot 3.3.4 (Maven)
- **Persistence:** Google Cloud Firestore (using official `firebase-admin` 9.3.0 SDK)
- **Validation:** Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Email`, `@Size`)
- **Testing:** JUnit 5 + Mockito (17 automated unit and integration tests)
- **Port:** `http://localhost:8080`

---

## 4. Project Directory Structure

```
skillsos/
├── README.md                      # Comprehensive project guide
├── .gitignore                     # Git ignore protecting service accounts & builds
├── start-backend.ps1              # PowerShell script to launch Spring Boot backend
├── start-frontend.ps1             # PowerShell script to launch React frontend
├── start-both.ps1                 # Master launcher running both services in parallel
├── docs/
│   ├── FIREBASE_SETUP.md          # Step-by-step Firebase & service account guide
│   ├── API_DOCUMENTATION.md       # Complete REST API specification
│   └── VIVA_PREPARATION.md        # OOP breakdown, viva questions, 2-min demo script
├── frontend/                      # React + Vite application
│   ├── package.json
│   ├── vite.config.js             # Vite config with backend proxy
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles/index.css       # Full custom CSS design system
│       ├── services/api.js        # Centralized REST API client
│       ├── components/
│       │   ├── Navbar.jsx         # Sticky navigation with live health badge
│       │   ├── DisclaimerBanner.jsx # Emergency vs peer help notice
│       │   ├── RequestCard.jsx    # Card with badges and volunteer trigger
│       │   ├── StatCard.jsx       # Metric cards
│       │   ├── FilterBar.jsx      # Search, multi-category & status filters
│       │   ├── VolunteerModal.jsx # "I'll Help" registration dialog
│       │   ├── ResolveModal.jsx   # Request completion dialog
│       │   └── ReopenModal.jsx    # Request reopen dialog
│       └── pages/
│           ├── Dashboard.jsx      # Live stats, urgent requests, recent activity
│           ├── ExploreRequests.jsx # Search & filter request board
│           ├── CreateRequest.jsx  # Form with strict client-side validation
│           ├── RequestDetails.jsx # Request timeline & lifecycle actions
│           ├── MyActivity.jsx     # Demonstration student activity lookup
│           ├── HowItWorks.jsx     # Workflow & community guidelines
│           └── CampusResources.jsx # XML / DOM syllabus demonstration
└── backend/                       # Spring Boot 3 Java backend
    ├── pom.xml
    └── src/
        ├── main/
        │   ├── java/com/skillsos/
        │   │   ├── SkillSOSApplication.java
        │   │   ├── config/
        │   │   │   ├── FirebaseConfig.java   # Admin SDK singleton configuration
        │   │   │   └── WebConfig.java        # CORS configuration
        │   │   ├── controller/               # REST API Controllers
        │   │   ├── service/                  # Business Logic & XML DOM parser
        │   │   ├── repository/               # Firestore DAO & Transactions
        │   │   ├── model/                    # Firestore POJO entities
        │   │   ├── dto/                      # Request & Response DTOs
        │   │   └── exception/                # Centralized @RestControllerAdvice
        │   └── resources/
        │       ├── application.properties
        │       └── campus-resources.xml      # Lab syllabus XML database
        └── test/java/com/skillsos/           # JUnit 5 & Mockito test suite
```

---

## 5. Prerequisites

Before running the application, ensure the following are installed:
1. **Java Development Kit (JDK):** Version 17 or 21 LTS (`java -version`).
2. **Node.js & npm:** Node.js v18+ and npm v9+ (`node -v`, `npm -v`).
3. **Apache Maven:** Version 3.8+ (`mvn -v`).

---

## 6. Firebase Cloud Firestore Configuration

SkillSOS persists all data to **Firebase Cloud Firestore** using the official Java Admin SDK.

### Step 1: Obtain Service Account Credentials
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create or open your project.
2. In the left sidebar, navigate to **Build** -> **Firestore Database** and create a Firestore database.
3. Open **Project Settings** (gear icon) -> **Service accounts**.
4. Select **Java** and click **Generate new private key**.
5. Save the downloaded JSON file locally (e.g. `C:\Users\shett\.keys\skillsos-service-account.json`).

> **Security Warning:** Never commit this JSON file to Git. Place it outside the project directory.

### Step 2: Set the Environment Variable
On Windows PowerShell:
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\Users\shett\.keys\skillsos-service-account.json"
```

On macOS / Linux:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/skillsos-service-account.json"
```

*For detailed screenshots and troubleshooting, see [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md).*

---

## 7. How to Run Locally

### Option A: Automated Master Launcher (Recommended)
Open a PowerShell terminal in the `skillsos` folder and run:
```powershell
.\start-both.ps1
```
This opens two independent windows running the backend and frontend simultaneously.

### Option B: Running in Separate Terminals

#### Terminal 1 — Backend:
```powershell
cd backend
mvn spring-boot:run
```
Backend will start on: **`http://localhost:8080`**  
Health Check: **`http://localhost:8080/api/health`**

#### Terminal 2 — Frontend:
```powershell
cd frontend
npm run dev
```
Frontend will be accessible at: **`http://localhost:5173`**

---

## 8. Automated Testing

To run the backend test suite (Spring Boot test, health checks, all 15 business rules, and XML DOM parser):

```powershell
cd backend
mvn clean test
```

### Test Suite Summary:
- `SkillSOSApplicationTests`: 3 tests (Context loading, Health check UP & DEGRADED reports)
- `HelpRequestServiceTests`: 13 tests (Request creation, illegal character validation, multi-key sorting, atomic volunteering, duplicate volunteer prevention, creator self-volunteering rejection, resolution lifecycle, zero-division stats safety)
- `XmlResourceServiceTests`: 1 test (DOM XML parsing of `campus-resources.xml`)
- **Total: 17 Tests, 0 Failures, 0 Errors (100% Passing)**

---

## 9. Viva & Demonstration Walkthrough

When presenting this project to faculty or examiners, refer to [docs/VIVA_PREPARATION.md](docs/VIVA_PREPARATION.md).

### Recommended Demonstration Sequence:
1. **Dashboard Overview:** Point out real metrics and the live API health badge in the navbar.
2. **Publish a Request:** Create a High-Priority request under `Borrow or Lend` (e.g., *Calculator needed for Room 304*).
3. **Atomic Volunteering:** Browse to the request and click *"I'll Help"*. Show how the status transitions from `OPEN` to `ACCEPTED`.
4. **Business Rule Enforcement:** Try to volunteer again with the same email or as the creator, demonstrating server-side validation.
5. **Resolution:** Mark the request as `RESOLVED`. Demonstrate that it can be reopened by the original creator if needed.
6. **XML / DOM Lab Syllabus:** Navigate to the **Directory** tab, demonstrating Java's W3C DOM parser extracting campus facilities from XML.

---

## 10. Limitations & Future Work

- **Demonstration Identity Model:** For academic demonstration purposes, student identification uses email entry rather than full JWT/OAuth2 session authentication.
- **Future Improvements:** Integrate Firebase Authentication for Google SSO and WebSockets for real-time live request board updates.
