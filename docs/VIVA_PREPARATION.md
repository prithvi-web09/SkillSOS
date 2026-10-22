# SkillSOS — Semester III Java Full-Stack Viva Preparation Guide

This comprehensive guide is designed to prepare you for faculty evaluation, external examiner questioning, and project demonstrations for your **Semester III Computer Engineering Full Stack Java Mini-Project**.

---

## 1. Problem Statement & Project Objectives

### The Problem
On college campuses, students routinely encounter micro-emergencies and practical hurdles:
- Needing a scientific calculator (FX-991EX) 15 minutes before an offline practical exam.
- Looking for Java lab programs or handwritten notes for an upcoming viva.
- Seeking an explanation of an OOP concept like dynamic method dispatch or custom exceptions.
- Finding a lost student ID card, bus pass, or laboratory manual.
- Finding specific campus facilities or lab locations.

Traditional campus WhatsApp groups become noisy and disorganized. Requests get buried, response tracking is non-existent, and there is no accountability or visibility into whether help was actually rendered.

### Project Objectives
1. **Priority-Aware Assistance:** Provide a structured request board where students publish academic and peer assistance requests with categories, locations, and urgency priorities.
2. **One-Click Atomic Volunteering:** Enable peer helpers to accept requests with a single click, using atomic concurrency controls to prevent duplicate volunteer assignments.
3. **Transparent Lifecycle:** Enforce strict state transitions (`OPEN` -> `ACCEPTED` -> `RESOLVED`, with creator-reopen capability).
4. **Cloud Persistence with Firebase Cloud Firestore:** Persist requests and volunteer records in a real cloud database using the official **Firebase Admin SDK for Java**.
5. **Demonstrate Core Java Syllabus Concepts:** Apply OOP principles (encapsulation, interfaces, enums, custom exceptions), Spring Boot architecture, REST APIs, and XML/DOM manipulation.

---

## 2. Why Firebase & Why Cloud Firestore (NoSQL)?

### Why Firebase?
- **Cloud-Native & Serverless:** Eliminates the complexity of hosting and maintaining relational database servers locally.
- **Enterprise-Grade SDKs:** The official Google Cloud / Firebase Admin SDK for Java integrates cleanly with modern Java 17/21 backends.
- **Real persistence across restarts:** Unlike in-memory databases (like H2), student requests and volunteer records persist across server reboots.

### Why Firestore is NoSQL
- **Document-Collection Model:** Data is stored as JSON-like BSON documents grouped into collections (`help_requests`, `volunteers`).
- **Flexible Schema:** Fields such as optional deadlines, resolution timestamps, and volunteer arrays can be handled without rigid SQL table migrations.
- **Horizontal Scalability:** Firestore partitions and scales collections across distributed Google Cloud infrastructure seamlessly.

---

## 3. Architecture & Layered Design

```
+-------------------------------------------------------------+
|                     React Frontend (Vite)                   |
|   Dashboard | Explore Board | Request Details | My Activity |
+-------------------------------------------------------------+
                              |
                     HTTP JSON REST API
                              |
+-------------------------------------------------------------+
|                Spring Boot 3 Backend (Java 21)              |
|                                                             |
|  [Controllers]   -> RequestController, HealthController...   |
|         |                                                   |
|    [DTOs / Bean Validation] -> @Valid, @NotBlank, @Email    |
|         |                                                   |
|   [Services]     -> HelpRequestServiceImpl (Business Rules) |
|         |                                                   |
|  [Repositories]  -> FirestoreRepository (Admin SDK DAO)     |
|         |                                                   |
|  [XML Service]   -> XmlResourceService (DOM Parser)         |
+-------------------------------------------------------------+
                              |
                    gRPC / HTTPS Admin SDK
                              |
+-------------------------------------------------------------+
|                 Google Cloud Firestore                      |
|      Collections: `help_requests` and `volunteers`          |
+-------------------------------------------------------------+
```

### Layer Responsibilities
- **Controller Layer (`com.skillsos.controller`):** Exposes REST endpoints, validates HTTP request DTOs with `@Valid`, maps HTTP status codes (`200`, `201`, `400`, `404`, `409`, `503`).
- **Service Layer (`com.skillsos.service`):** Contains pure business logic, verifies domain constraints (e.g. self-volunteering guard, state transitions), and computes platform statistics.
- **Repository / DAO Layer (`com.skillsos.repository`):** Directly interfaces with Google Cloud Firestore via `FirestoreClient.getFirestore()`, executes transactions, and performs bounded health pings.
- **Model Layer (`com.skillsos.model`):** Encapsulated Java POJOs mapped to Firestore documents (`HelpRequest`, `Volunteer`).
- **DTO Layer (`com.skillsos.dto`):** Decouples external API representations from internal database models and applies input validation.
- **Exception Layer (`com.skillsos.exception`):** Centralized `@RestControllerAdvice` converting application exceptions into consistent JSON error envelopes without leaking stack traces.

---

## 4. Java OOP Concepts Implemented in SkillSOS

| OOP Concept | How & Where Implemented |
|---|---|
| **Classes & Objects** | `HelpRequest`, `Volunteer`, and `CampusResourceDto` encapsulate campus entity state and behaviors. |
| **Encapsulation** | Private instance variables in models and DTOs with validated public getters and setters. |
| **Constructor Overloading** | `HelpRequest` provides both a no-argument constructor (required for Firestore serialization) and a parameterized constructor initializing title, category, priority, and timestamps. |
| **Interfaces & Polymorphism** | `HelpRequestService` interface defines the business contract; `HelpRequestServiceImpl` provides the concrete implementation, allowing easy mocking in unit tests (`HelpRequestServiceTests`). |
| **Enums** | Type-safe enums (`RequestStatus`: `OPEN`, `ACCEPTED`, `RESOLVED`; `PriorityLevel`: `LOW`, `NORMAL`, `HIGH`; `RequestCategory`: 7 campus categories) eliminate hardcoded magic strings. |
| **Inheritance & Hierarchy** | Custom unchecked exceptions (`ResourceNotFoundException`, `InvalidRequestStateException`, `DuplicateVolunteerException`) inherit from Java's `RuntimeException`. |
| **Collections Framework** | `List<HelpRequest>`, `Set<String>` (for unique volunteer email computation), `Map<String, Object>` (for Firestore partial updates), and Java Streams for declarative filtering and sorting. |
| **W3C DOM XML Parsing** | `XmlResourceService` demonstrates `DocumentBuilderFactory`, `Document`, `NodeList`, and `Element` traversal for campus resources. |

---

## 5. Concurrency Controls & Atomic Transactions

### The Problem
If two students concurrently click "I'll Help" for the same calculator request at the exact same millisecond:
1. In a naive read-modify-write pattern, both could read `volunteerCount = 0`, both would create volunteer records, and both would write `volunteerCount = 1`, resulting in a race condition and incorrect metrics.
2. The same volunteer could accidentally double-submit and get recorded twice.

### The Solution: Firestore Atomic Transactions
In `FirestoreRepository.java`:
```java
firestore.runTransaction(transaction -> {
    DocumentSnapshot reqSnap = transaction.get(reqRef).get();
    // 1. Verify request still OPEN
    // 2. Deterministic doc ID check: requestId + "_" + volunteerEmail
    // 3. Atomically write volunteer document
    // 4. Atomically increment volunteerCount and transition status to ACCEPTED
    transaction.set(volRef, volunteer);
    transaction.update(reqRef, updates);
    return volunteer;
});
```
This guarantees atomicity: if another write conflicts with the transaction, Firestore automatically retries the operation, ensuring complete consistency.

---

## 6. Ten Likely Viva Questions & Model Answers

### Q1: Why did you choose Spring Boot instead of plain Servlets/JSP?
> **Answer:** Spring Boot provides a production-grade, convention-over-configuration framework with an embedded Tomcat web server. It offers dependency injection, declarative validation (`jakarta.validation`), structured REST controllers, and seamless integration with third-party cloud SDKs like Google Firebase Admin. This separates concerns cleanly between presentation, business rules, and persistence.

### Q2: How does your Spring Boot backend communicate with Firebase Firestore?
> **Answer:** We use the official **Firebase Admin Java SDK** (`com.google.firebase:firebase-admin`). The application initializes a singleton `FirebaseApp` using service account credentials referenced by the `GOOGLE_APPLICATION_CREDENTIALS` environment variable. Data access is managed through the `Firestore` client bean via asynchronous `ApiFuture` calls and transactions.

### Q3: What is the difference between Firebase Client SDK and Firebase Admin SDK?
> **Answer:** The Firebase Client SDK (used in frontend apps) runs in untrusted user environments and is restricted by Firestore Security Rules. The **Firebase Admin SDK** runs in our trusted Spring Boot server environment with privileged service account credentials. Because the Admin SDK bypasses client security rules, our Spring Boot service layer strictly validates every incoming request, state transition, and user action.

### Q4: Why did you not use Spring Data JPA or Hibernate?
> **Answer:** Spring Data JPA and Hibernate are Object-Relational Mapping (ORM) tools designed specifically for relational SQL databases (like PostgreSQL or MySQL). Cloud Firestore is a NoSQL document database. Using the native Google Cloud Firestore SDK allows us to leverage native document snapshot mapping, atomic cloud transactions, and serverless scalability without the overhead of an incompatible relational ORM.

### Q5: How did you prevent duplicate volunteers and race conditions?
> **Answer:** We implemented a two-part strategy:
> 1. **Deterministic Document IDs:** Each volunteer document is keyed by `{requestId}_{volunteerEmail}` in the `volunteers` collection.
> 2. **Firestore Transactions:** The volunteer creation and request status update happen inside an atomic `firestore.runTransaction()`. If the document already exists or another thread modified the request status, the transaction enforces consistency.

### Q6: Can a student volunteer for their own request? How is this prevented?
> **Answer:** No. Rule 5 of our business rules prohibits self-volunteering. In `HelpRequestServiceImpl.java`, the volunteer's normalized email is compared against `request.getRequesterEmail()`. If they match, an `UnauthorizedActionException` is thrown, returning an HTTP `400 Bad Request`.

### Q7: Explain the request lifecycle state machine.
> **Answer:**
> - A new request starts at **`OPEN`** (`volunteerCount = 0`).
> - When a peer helper volunteers, the status transitions to **`ACCEPTED`**. Only `OPEN` requests can be accepted.
> - Once the assistance is completed, either the requester or a registered volunteer can mark the request as **`RESOLVED`**. Unaccepted requests cannot be resolved directly.
> - If necessary, the original requester can **`reopen`** a resolved request, returning it to **`OPEN`**.

### Q8: How did you implement DOM XML parsing for your lab syllabus requirement?
> **Answer:** In `XmlResourceService.java`, we utilized Java's standard `javax.xml.parsers.DocumentBuilderFactory` and `org.w3c.dom.Document`. The parser reads `campus-resources.xml`, normalizes the XML tree, extracts elements by tag name (`<resource>`, `<name>`, `<building>`), and maps them to `CampusResourceDto` objects. We also disabled external DTD entities to prevent XXE (XML External Entity) attacks.

### Q9: How does the frontend communicate with the backend? Did you configure CORS or a proxy?
> **Answer:** The React frontend uses a centralized `api.js` module. During development, Vite's dev server proxies `/api` requests to `http://localhost:8080`, preventing CORS issues. In addition, `WebConfig.java` in Spring Boot configures explicit CORS mappings allowing `http://localhost:5173` for cross-origin requests.

### Q10: How do you handle errors and exceptions without exposing internal server details?
> **Answer:** We implemented a centralized `GlobalExceptionHandler` annotated with `@RestControllerAdvice`. It intercepts specific exceptions (`ResourceNotFoundException` -> 404, `InvalidRequestStateException` -> 409, `DuplicateVolunteerException` -> 409, `MethodArgumentNotValidException` -> 400) and formats them into a standard `ErrorResponseDto` JSON envelope containing timestamp, status code, error code, and user-friendly message, while masking internal stack traces.

---

## 7. Two-Minute Project Demonstration Script

**[0:00 - 0:30] Introduction & Problem:**
> "Good morning faculty. Our mini-project is **SkillSOS — Campus Emergency Help & Peer Support Network**. On campus, students often face micro-emergencies such as needing a calculator right before a practical, looking for Java notes, or finding a lost student ID. Traditional chat groups are disorganized. SkillSOS provides a priority-aware, real-time campus assistance platform with verified peer volunteering and cloud persistence in Firebase Cloud Firestore."

**[0:30 - 1:00] Dashboard & Live Architecture:**
> "Here on the Dashboard, all statistics—Total Requests, Open Requests, In-Progress, and Resolution Rate—are dynamically computed from our backend. Notice the API status badge in the navbar: it probes our Spring Boot health endpoint at `/api/health`, verifying backend process health and Firestore connectivity."

**[1:00 - 1:30] Publishing & Atomic Volunteering:**
> "Let's demonstrate a real workflow: A student, Rohan, posts a High-Priority request: *'Need Scientific Calculator FX-991EX for 10 AM practical'*. The request is saved in Firestore with status `OPEN`. Now, browsing the board as another student, Priya, we click *'I'll Help'*. Our backend executes an atomic Firestore transaction, recording Priya in the `volunteers` collection and updating the request to `ACCEPTED`. If Priya tries to volunteer again, our transaction detects the duplicate and rejects it."

**[1:30 - 2:00] Resolution & Lab Syllabus Integration:**
> "Once the practical is finished, either Rohan or Priya can mark the request as `RESOLVED`, recording the completion timestamp. Finally, under the *'Directory'* tab, we demonstrate our Java Lab XML/DOM syllabus requirement: the backend uses Java's W3C DOM parser (`DocumentBuilderFactory`) to parse `campus-resources.xml` and render campus laboratories and facilities. Thank you, and we welcome your questions."
