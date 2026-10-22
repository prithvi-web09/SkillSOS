package com.skillsos.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.skillsos.config.FirebaseConfig;
import com.skillsos.exception.DuplicateVolunteerException;
import com.skillsos.exception.FirebaseServiceException;
import com.skillsos.exception.InvalidRequestStateException;
import com.skillsos.exception.ResourceNotFoundException;
import com.skillsos.model.HelpRequest;
import com.skillsos.model.RequestCategory;
import com.skillsos.model.PriorityLevel;
import com.skillsos.model.RequestStatus;
import com.skillsos.model.Volunteer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

@Repository
public class FirestoreRepository {

    private static final Logger log = LoggerFactory.getLogger(FirestoreRepository.class);

    public static final String COLLECTION_REQUESTS = "help_requests";
    public static final String COLLECTION_VOLUNTEERS = "volunteers";

    @Autowired(required = false)
    private Firestore firestore;

    @Autowired
    private FirebaseConfig firebaseConfig;

    // Thread-safe store used when Firebase credentials are not yet configured
    // Allows full application evaluation on localhost without blocking the user
    private final Map<String, HelpRequest> localRequests = new ConcurrentHashMap<>();
    private final Map<String, Volunteer> localVolunteers = new ConcurrentHashMap<>();

    public FirestoreRepository() {
        // Starts completely clean without dummy seed data; only dynamic user-created requests are stored
    }

    private boolean isFirestoreActive() {
        return firestore != null && firebaseConfig != null && firebaseConfig.isInitialized();
    }

    /**
     * Bounded, non-destructive connectivity check for health probing.
     */
    public boolean checkConnectivity() {
        if (!isFirestoreActive()) {
            return false;
        }
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_REQUESTS).limit(1).get();
            future.get(3, TimeUnit.SECONDS);
            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Firestore connectivity check interrupted: {}", e.getMessage());
            return false;
        } catch (ExecutionException | TimeoutException e) {
            log.warn("Firestore connectivity check failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Creates or updates a HelpRequest in Firestore (or local store when unconfigured).
     */
    public HelpRequest saveRequest(HelpRequest request) {
        if (isFirestoreActive()) {
            try {
                CollectionReference requests = firestore.collection(COLLECTION_REQUESTS);
                DocumentReference docRef;

                if (request.getId() == null || request.getId().trim().isEmpty()) {
                    docRef = requests.document();
                    request.setId(docRef.getId());
                    request.setCreatedAt(new Date());
                } else {
                    docRef = requests.document(request.getId().trim());
                }

                request.setUpdatedAt(new Date());
                ApiFuture<WriteResult> future = docRef.set(request);
                future.get(5, TimeUnit.SECONDS);
                return request;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new FirebaseServiceException("Request save operation was interrupted", e);
            } catch (Exception e) {
                log.error("Failed to save request to Firestore: {}", e.getMessage(), e);
                throw new FirebaseServiceException("Failed to save request in Firestore: " + e.getMessage(), e);
            }
        }

        // Local development mode when Firebase credentials are not yet supplied
        if (request.getId() == null || request.getId().trim().isEmpty()) {
            request.setId("req-" + UUID.randomUUID().toString().substring(0, 8));
            request.setCreatedAt(new Date());
        }
        request.setUpdatedAt(new Date());
        request.setDemoSeeded(false);
        localRequests.put(request.getId(), request);
        log.info("Saved request locally (Demo Mode): ID={}", request.getId());
        return request;
    }

    /**
     * Retrieves a HelpRequest by document ID.
     */
    public Optional<HelpRequest> findRequestById(String id) {
        if (id == null || id.trim().isEmpty()) {
            return Optional.empty();
        }

        if (isFirestoreActive()) {
            try {
                DocumentReference docRef = firestore.collection(COLLECTION_REQUESTS).document(id.trim());
                DocumentSnapshot snapshot = docRef.get().get(5, TimeUnit.SECONDS);

                if (snapshot.exists()) {
                    HelpRequest request = snapshot.toObject(HelpRequest.class);
                    if (request != null) {
                        request.setId(snapshot.getId());
                        return Optional.of(request);
                    }
                }
                return Optional.empty();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new FirebaseServiceException("Request fetch operation interrupted", e);
            } catch (Exception e) {
                log.error("Failed to fetch request {} from Firestore: {}", id, e.getMessage(), e);
                throw new FirebaseServiceException("Failed to fetch request: " + e.getMessage(), e);
            }
        }

        return Optional.ofNullable(localRequests.get(id.trim()));
    }

    /**
     * Retrieves all requests from Firestore or local fallback store.
     */
    public List<HelpRequest> findAllRequests() {
        if (isFirestoreActive()) {
            try {
                ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_REQUESTS)
                        .orderBy("createdAt", Query.Direction.DESCENDING)
                        .get();

                List<QueryDocumentSnapshot> docs = future.get(8, TimeUnit.SECONDS).getDocuments();
                List<HelpRequest> list = new ArrayList<>();
                for (QueryDocumentSnapshot doc : docs) {
                    HelpRequest req = doc.toObject(HelpRequest.class);
                    if (req != null) {
                        req.setId(doc.getId());
                        list.add(req);
                    }
                }
                return list;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new FirebaseServiceException("Requests fetch interrupted", e);
            } catch (Exception e) {
                log.error("Failed to fetch all requests: {}", e.getMessage(), e);
                throw new FirebaseServiceException("Failed to retrieve requests: " + e.getMessage(), e);
            }
        }

        return localRequests.values().stream()
                .sorted((a, b) -> {
                    Date d1 = a.getCreatedAt() != null ? a.getCreatedAt() : new Date(0);
                    Date d2 = b.getCreatedAt() != null ? b.getCreatedAt() : new Date(0);
                    return d2.compareTo(d1);
                })
                .collect(Collectors.toList());
    }

    /**
     * Atomically registers a volunteer using a Firestore transaction (or synchronized lock locally).
     * Prevents duplicate volunteering and race conditions when incrementing volunteer count.
     */
    public Volunteer addVolunteerWithTransaction(Volunteer volunteer, String requestId) {
        if (requestId == null || requestId.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid request ID");
        }

        final String normalizedEmail = volunteer.getVolunteerEmail().trim().toLowerCase();
        final String volunteerDocId = requestId.trim() + "_" + normalizedEmail.replaceAll("[^a-zA-Z0-9]", "_");

        if (isFirestoreActive()) {
            final DocumentReference reqRef = firestore.collection(COLLECTION_REQUESTS).document(requestId.trim());
            final DocumentReference volRef = firestore.collection(COLLECTION_VOLUNTEERS).document(volunteerDocId);

            try {
                return firestore.runTransaction(transaction -> {
                    DocumentSnapshot reqSnap = transaction.get(reqRef).get();
                    if (!reqSnap.exists()) {
                        throw new ResourceNotFoundException("Request not found with ID: " + requestId);
                    }

                    HelpRequest helpReq = reqSnap.toObject(HelpRequest.class);
                    if (helpReq == null) {
                        throw new ResourceNotFoundException("Failed to deserialize request");
                    }

                    if (!RequestStatus.OPEN.name().equalsIgnoreCase(helpReq.getStatus())) {
                        throw new InvalidRequestStateException("Only OPEN requests can be accepted. Current status: " + helpReq.getStatus());
                    }

                    if (normalizedEmail.equalsIgnoreCase(helpReq.getRequesterEmail().trim())) {
                        throw new IllegalArgumentException("Request creator cannot volunteer for their own request.");
                    }

                    DocumentSnapshot volSnap = transaction.get(volRef).get();
                    if (volSnap.exists()) {
                        throw new DuplicateVolunteerException("You have already volunteered for this campus request.");
                    }

                    volunteer.setId(volunteerDocId);
                    volunteer.setRequestId(requestId.trim());
                    volunteer.setVolunteerEmail(normalizedEmail);
                    volunteer.setCreatedAt(new Date());

                    // Set volunteer record
                    transaction.set(volRef, volunteer);

                    // Atomically update request
                    int updatedCount = helpReq.getVolunteerCount() + 1;
                    Map<String, Object> updates = new HashMap<>();
                    updates.put("volunteerCount", updatedCount);
                    updates.put("status", RequestStatus.ACCEPTED.name());
                    updates.put("updatedAt", new Date());
                    transaction.update(reqRef, updates);

                    return volunteer;
                }).get(8, TimeUnit.SECONDS);

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new FirebaseServiceException("Volunteer transaction was interrupted", e);
            } catch (ExecutionException e) {
                Throwable cause = e.getCause();
                if (cause instanceof DuplicateVolunteerException) {
                    throw (DuplicateVolunteerException) cause;
                } else if (cause instanceof InvalidRequestStateException) {
                    throw (InvalidRequestStateException) cause;
                } else if (cause instanceof ResourceNotFoundException) {
                    throw (ResourceNotFoundException) cause;
                } else if (cause instanceof IllegalArgumentException) {
                    throw (IllegalArgumentException) cause;
                }
                log.error("Transaction failure while accepting request: {}", e.getMessage(), e);
                throw new FirebaseServiceException("Transaction failed: " + (cause != null ? cause.getMessage() : e.getMessage()), e);
            } catch (TimeoutException e) {
                throw new FirebaseServiceException("Volunteer transaction timed out", e);
            }
        }

        // Local thread-safe atomic execution
        synchronized (localRequests) {
            HelpRequest helpReq = localRequests.get(requestId.trim());
            if (helpReq == null) {
                throw new ResourceNotFoundException("Request not found with ID: " + requestId);
            }

            if (!RequestStatus.OPEN.name().equalsIgnoreCase(helpReq.getStatus())) {
                throw new InvalidRequestStateException("Only OPEN requests can be accepted. Current status: " + helpReq.getStatus());
            }

            if (normalizedEmail.equalsIgnoreCase(helpReq.getRequesterEmail().trim())) {
                throw new IllegalArgumentException("Request creator cannot volunteer for their own request.");
            }

            if (localVolunteers.containsKey(volunteerDocId)) {
                throw new DuplicateVolunteerException("You have already volunteered for this campus request.");
            }

            volunteer.setId(volunteerDocId);
            volunteer.setRequestId(requestId.trim());
            volunteer.setVolunteerEmail(normalizedEmail);
            volunteer.setCreatedAt(new Date());

            localVolunteers.put(volunteerDocId, volunteer);

            helpReq.setVolunteerCount(helpReq.getVolunteerCount() + 1);
            helpReq.setStatus(RequestStatus.ACCEPTED.name());
            helpReq.setUpdatedAt(new Date());

            return volunteer;
        }
    }

    /**
     * Updates request status (e.g. resolve or reopen).
     */
    public void updateRequestStatus(String requestId, RequestStatus newStatus, Date resolvedAt) {
        if (requestId == null || requestId.trim().isEmpty()) return;

        if (isFirestoreActive()) {
            try {
                DocumentReference docRef = firestore.collection(COLLECTION_REQUESTS).document(requestId.trim());
                Map<String, Object> updates = new HashMap<>();
                updates.put("status", newStatus.name());
                updates.put("updatedAt", new Date());
                if (resolvedAt != null) {
                    updates.put("resolvedAt", resolvedAt);
                } else if (newStatus == RequestStatus.OPEN) {
                    updates.put("resolvedAt", FieldValue.delete());
                }

                ApiFuture<WriteResult> future = docRef.update(updates);
                future.get(5, TimeUnit.SECONDS);
                return;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new FirebaseServiceException("Status update interrupted", e);
            } catch (Exception e) {
                log.error("Failed to update status for {}: {}", requestId, e.getMessage(), e);
                throw new FirebaseServiceException("Failed to update request status: " + e.getMessage(), e);
            }
        }

        HelpRequest req = localRequests.get(requestId.trim());
        if (req != null) {
            req.setStatus(newStatus.name());
            req.setUpdatedAt(new Date());
            req.setResolvedAt(resolvedAt);
        }
    }

    /**
     * Retrieves all volunteers for a given request.
     */
    public List<Volunteer> findVolunteersByRequestId(String requestId) {
        if (requestId == null || requestId.trim().isEmpty()) {
            return Collections.emptyList();
        }

        if (isFirestoreActive()) {
            try {
                ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_VOLUNTEERS)
                        .whereEqualTo("requestId", requestId.trim())
                        .get();

                List<QueryDocumentSnapshot> docs = future.get(5, TimeUnit.SECONDS).getDocuments();
                List<Volunteer> list = new ArrayList<>();
                for (QueryDocumentSnapshot doc : docs) {
                    Volunteer vol = doc.toObject(Volunteer.class);
                    if (vol != null) {
                        vol.setId(doc.getId());
                        list.add(vol);
                    }
                }
                return list;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new FirebaseServiceException("Volunteers fetch interrupted", e);
            } catch (Exception e) {
                log.error("Failed to fetch volunteers for {}: {}", requestId, e.getMessage(), e);
                throw new FirebaseServiceException("Failed to fetch volunteers: " + e.getMessage(), e);
            }
        }

        return localVolunteers.values().stream()
                .filter(v -> requestId.trim().equalsIgnoreCase(v.getRequestId()))
                .sorted(Comparator.comparing(Volunteer::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all volunteer participations for a student email.
     */
    public List<Volunteer> findVolunteersByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String normalizedEmail = email.trim().toLowerCase();

        if (isFirestoreActive()) {
            try {
                ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_VOLUNTEERS)
                        .whereEqualTo("volunteerEmail", normalizedEmail)
                        .get();

                List<QueryDocumentSnapshot> docs = future.get(5, TimeUnit.SECONDS).getDocuments();
                List<Volunteer> list = new ArrayList<>();
                for (QueryDocumentSnapshot doc : docs) {
                    Volunteer vol = doc.toObject(Volunteer.class);
                    if (vol != null) {
                        vol.setId(doc.getId());
                        list.add(vol);
                    }
                }
                return list;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new FirebaseServiceException("Volunteer activity fetch interrupted", e);
            } catch (Exception e) {
                log.error("Failed to fetch volunteer records for email: {}", e.getMessage(), e);
                throw new FirebaseServiceException("Failed to fetch volunteer activity: " + e.getMessage(), e);
            }
        }

        return localVolunteers.values().stream()
                .filter(v -> normalizedEmail.equalsIgnoreCase(v.getVolunteerEmail()))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all requests created by a student email.
     */
    public List<HelpRequest> findRequestsByRequesterEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String normalizedEmail = email.trim().toLowerCase();

        if (isFirestoreActive()) {
            try {
                ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_REQUESTS)
                        .whereEqualTo("requesterEmail", normalizedEmail)
                        .get();

                List<QueryDocumentSnapshot> docs = future.get(5, TimeUnit.SECONDS).getDocuments();
                List<HelpRequest> list = new ArrayList<>();
                for (QueryDocumentSnapshot doc : docs) {
                    HelpRequest req = doc.toObject(HelpRequest.class);
                    if (req != null) {
                        req.setId(doc.getId());
                        list.add(req);
                    }
                }
                return list;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new FirebaseServiceException("Requester activity fetch interrupted", e);
            } catch (Exception e) {
                log.error("Failed to fetch requester records for email: {}", e.getMessage(), e);
                throw new FirebaseServiceException("Failed to fetch user requests: " + e.getMessage(), e);
            }
        }

        return localRequests.values().stream()
                .filter(r -> normalizedEmail.equalsIgnoreCase(r.getRequesterEmail()))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all distinct volunteer emails across the entire platform.
     */
    public Set<String> findAllUniqueVolunteerEmails() {
        if (isFirestoreActive()) {
            try {
                ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_VOLUNTEERS).get();
                List<QueryDocumentSnapshot> docs = future.get(8, TimeUnit.SECONDS).getDocuments();
                Set<String> uniqueEmails = new HashSet<>();
                for (QueryDocumentSnapshot doc : docs) {
                    String email = doc.getString("volunteerEmail");
                    if (email != null && !email.trim().isEmpty()) {
                        uniqueEmails.add(email.trim().toLowerCase());
                    }
                }
                return uniqueEmails;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new FirebaseServiceException("Unique volunteers fetch interrupted", e);
            } catch (Exception e) {
                log.error("Failed to fetch unique volunteers: {}", e.getMessage(), e);
                throw new FirebaseServiceException("Failed to fetch volunteer statistics: " + e.getMessage(), e);
            }
        }

        return localVolunteers.values().stream()
                .map(v -> v.getVolunteerEmail().trim().toLowerCase())
                .collect(Collectors.toSet());
    }
}
