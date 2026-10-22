# SkillSOS — REST API Specification & Endpoint Documentation

The SkillSOS backend exposes a standard REST API rooted at `/api`. All JSON responses use UTF-8 encoding and standard HTTP status codes.

---

## 1. Health Probe Endpoint

### `GET /api/health`
Checks the backend runtime health, Firebase Admin SDK initialization, and executes a bounded non-destructive connectivity check against Cloud Firestore.

- **Status Code:** `200 OK` (when fully connected) or `503 Service Unavailable` (when unconfigured or degraded)
- **Response Example (Connected):**
  ```json
  {
    "status": "UP",
    "backendProcess": true,
    "firebaseInitialized": true,
    "firestoreConnected": true,
    "message": "SkillSOS Backend process is running. Firebase Admin SDK initialized and Firestore connectivity verified.",
    "timestamp": "2026-10-22T22:15:00.000+00:00"
  }
  ```
- **Response Example (Pending Configuration):**
  ```json
  {
    "status": "DEGRADED",
    "backendProcess": true,
    "firebaseInitialized": false,
    "firestoreConnected": false,
    "message": "SkillSOS Backend process is running. Firebase Admin SDK is NOT initialized: GOOGLE_APPLICATION_CREDENTIALS is not set...",
    "timestamp": "2026-10-22T22:15:00.000+00:00"
  }
  ```

---

## 2. Help Request Endpoints

### `GET /api/requests`
Retrieves a filtered, sorted list of student help requests.

- **Query Parameters:**
  - `search` (optional): Filter keyword matching title, description, or campus location.
  - `category` (optional): `ACADEMIC_HELP`, `NOTES_AND_STUDY_MATERIAL`, `BORROW_OR_LEND`, `LOST_AND_FOUND`, `CAMPUS_NAVIGATION`, `PROGRAMMING_HELP`, `OTHER`.
  - `priority` (optional): `LOW`, `NORMAL`, `HIGH`.
  - `status` (optional): `OPEN`, `ACCEPTED`, `RESOLVED`.
  - `sortBy` (optional): `newest` (default), `priority`, `oldest`.
- **Status Code:** `200 OK`
- **Response Example:**
  ```json
  [
    {
      "id": "doc_9831fa",
      "title": "Need Scientific Calculator FX-991EX for Practical",
      "description": "Urgent calculator needed before 10 AM practical exam in Room 304.",
      "category": "BORROW_OR_LEND",
      "priority": "HIGH",
      "status": "OPEN",
      "requesterName": "Rohan Sharma",
      "requesterEmail": "rohan@campus.edu",
      "campusLocation": "Engineering Block B, Room 304",
      "deadline": "10:00 AM Today",
      "createdAt": "2026-10-22T22:10:00.000+00:00",
      "updatedAt": "2026-10-22T22:10:00.000+00:00",
      "resolvedAt": null,
      "volunteerCount": 0,
      "demoSeeded": false
    }
  ]
  ```

---

### `GET /api/requests/{id}`
Retrieves complete details of a single help request by its Firestore document ID.

- **Path Parameters:**
  - `id`: Firestore document ID.
- **Status Codes:** `200 OK`, `404 Not Found`
- **Error Response (404):**
  ```json
  {
    "timestamp": "2026-10-22T22:12:00.000+00:00",
    "status": 404,
    "error": "NOT_FOUND",
    "message": "Campus help request not found with ID: doc_xyz",
    "path": "/api/requests/doc_xyz"
  }
  ```

---

### `POST /api/requests`
Creates a new campus help request in Firestore. Automatically initializes status to `OPEN` and `volunteerCount` to `0`.

- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "title": "Java OOP Inheritance Doubts for Mini-Project",
    "description": "Need 20 minutes with a senior student to review dynamic method dispatch and abstract class design.",
    "category": "PROGRAMMING_HELP",
    "priority": "NORMAL",
    "requesterName": "Aryan Deshmukh",
    "requesterEmail": "aryan.d@campus.edu",
    "campusLocation": "Central Library Ground Floor Study Zone",
    "deadline": "Today after 4 PM"
  }
  ```
- **Status Codes:** `201 Created`, `400 Bad Request` (Bean Validation failure)

---

### `PATCH /api/requests/{id}/accept`
Registers volunteer assistance on an `OPEN` request. Enforces atomic Firestore transaction, increments `volunteerCount`, and transitions status to `ACCEPTED`.

- **Validation / Business Rules Enforced:**
  - Only `OPEN` requests can be accepted.
  - Creator cannot volunteer for their own request (`400 Bad Request`).
  - Same volunteer cannot volunteer twice for the same request (`409 Conflict`).
- **Request Body:**
  ```json
  {
    "volunteerName": "Priya Sharma",
    "volunteerEmail": "priya.s@campus.edu"
  }
  ```
- **Status Codes:** `200 OK`, `400 Bad Request`, `409 Conflict`
- **Response:**
  ```json
  {
    "id": "doc_9831fa_priya_s_campus_edu",
    "requestId": "doc_9831fa",
    "volunteerName": "Priya Sharma",
    "volunteerEmail": "priya.s@campus.edu",
    "createdAt": "2026-10-22T22:14:00.000+00:00"
  }
  ```

---

### `PATCH /api/requests/{id}/resolve`
Marks an `ACCEPTED` request as `RESOLVED`. Records completion timestamp.

- **Validation / Business Rules Enforced:**
  - A request cannot be resolved before it has been accepted (`409 Conflict`).
  - Only the request creator or a registered volunteer can resolve it (`400 Bad Request`).
- **Request Body:**
  ```json
  {
    "resolverEmail": "rohan@campus.edu"
  }
  ```
- **Status Codes:** `200 OK`, `400 Bad Request`, `409 Conflict`

---

### `PATCH /api/requests/{id}/reopen`
Reopens a `RESOLVED` request, returning its status to `OPEN`.

- **Validation / Business Rules Enforced:**
  - Only `RESOLVED` requests can be reopened (`409 Conflict`).
  - Only the original creator can reopen the request (`400 Bad Request`).
- **Request Body:**
  ```json
  {
    "requesterEmail": "rohan@campus.edu"
  }
  ```
- **Status Codes:** `200 OK`, `400 Bad Request`, `409 Conflict`

---

### `GET /api/requests/{id}/volunteers`
Lists all registered volunteer participations for a specific request.

- **Status Code:** `200 OK`

---

## 3. Student Activity Endpoint

### `GET /api/activity?email={email}`
Demonstration lookup displaying requests created and volunteered for by a student email address.

- **Status Code:** `200 OK`
- **Response Example:**
  ```json
  {
    "email": "rohan@campus.edu",
    "createdRequests": [ ... ],
    "volunteeredRequests": [ ... ],
    "disclaimer": "DEMONSTRATION LOOKUP ONLY: This view looks up public request and volunteer records matching this email address..."
  }
  ```

---

## 4. Platform Statistics Endpoint

### `GET /api/stats`
Computes platform metrics directly from stored Firestore records with zero-division safety.

- **Status Code:** `200 OK`
- **Response Example:**
  ```json
  {
    "totalRequests": 12,
    "openRequests": 4,
    "acceptedRequests": 3,
    "resolvedRequests": 5,
    "uniqueVolunteers": 7,
    "resolutionPercentage": 41.7
  }
  ```

---

## 5. Campus Resources Endpoint (Java Lab Syllabus DOM Demo)

### `GET /api/resources`
Parses and returns campus facilities from `campus-resources.xml` using Java DOM APIs (`DocumentBuilderFactory`).

- **Status Code:** `200 OK`
- **Response Example:**
  ```json
  [
    {
      "id": "res-01",
      "name": "Advanced Computing & Java Lab",
      "category": "LABORATORY",
      "building": "Engineering Block B",
      "floor": "Third Floor (Room 304)",
      "contact": "cse-lab@campus.edu",
      "timings": "08:30 AM - 05:30 PM",
      "description": "Equipped with high-performance workstations, JDK 21..."
    }
  ]
  ```
