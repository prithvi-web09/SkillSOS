package com.skillsos.service;

import com.skillsos.dto.*;
import com.skillsos.exception.InvalidRequestStateException;
import com.skillsos.exception.ResourceNotFoundException;
import com.skillsos.exception.UnauthorizedActionException;
import com.skillsos.model.*;
import com.skillsos.repository.FirestoreRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class HelpRequestServiceImpl implements HelpRequestService {

    private static final Logger log = LoggerFactory.getLogger(HelpRequestServiceImpl.class);

    private final FirestoreRepository firestoreRepository;

    @Autowired
    public HelpRequestServiceImpl(FirestoreRepository firestoreRepository) {
        this.firestoreRepository = firestoreRepository;
    }

    @Override
    public HelpRequestResponseDto createRequest(CreateRequestDto dto) {
        validateIdString(dto.getRequesterEmail(), "Requester email");

        HelpRequest request = new HelpRequest();
        request.setTitle(dto.getTitle().trim());
        request.setDescription(dto.getDescription().trim());
        request.setCategory(dto.getCategory().name());
        request.setPriority(dto.getPriority().name());
        request.setStatus(RequestStatus.OPEN.name());
        request.setRequesterName(dto.getRequesterName().trim());
        request.setRequesterEmail(dto.getRequesterEmail().trim().toLowerCase());
        request.setCampusLocation(dto.getCampusLocation().trim());
        request.setDeadline(dto.getDeadline() != null ? dto.getDeadline().trim() : "");
        request.setCreatedAt(new Date());
        request.setUpdatedAt(new Date());
        request.setVolunteerCount(0);
        request.setDemoSeeded(false);

        HelpRequest saved = firestoreRepository.saveRequest(request);
        log.info("Created help request with ID: {}", saved.getId());
        return HelpRequestResponseDto.fromEntity(saved);
    }

    @Override
    public HelpRequestResponseDto getRequestById(String id) {
        validateIdString(id, "Request ID");
        HelpRequest request = firestoreRepository.findRequestById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campus help request not found with ID: " + id));
        return HelpRequestResponseDto.fromEntity(request);
    }

    @Override
    public List<HelpRequestResponseDto> getRequests(String search, RequestCategory category,
                                                    PriorityLevel priority, RequestStatus status,
                                                    String sortBy) {
        List<HelpRequest> allRequests = firestoreRepository.findAllRequests();

        return allRequests.stream()
                .filter(req -> {
                    if (search == null || search.trim().isEmpty()) return true;
                    String q = search.trim().toLowerCase();
                    boolean titleMatches = req.getTitle() != null && req.getTitle().toLowerCase().contains(q);
                    boolean descMatches = req.getDescription() != null && req.getDescription().toLowerCase().contains(q);
                    boolean locMatches = req.getCampusLocation() != null && req.getCampusLocation().toLowerCase().contains(q);
                    return titleMatches || descMatches || locMatches;
                })
                .filter(req -> category == null || category.name().equalsIgnoreCase(req.getCategory()))
                .filter(req -> priority == null || priority.name().equalsIgnoreCase(req.getPriority()))
                .filter(req -> status == null || status.name().equalsIgnoreCase(req.getStatus()))
                .sorted((a, b) -> {
                    if ("priority".equalsIgnoreCase(sortBy)) {
                        int pA = getPriorityWeight(a.getPriority());
                        int pB = getPriorityWeight(b.getPriority());
                        if (pA != pB) return Integer.compare(pB, pA); // High priority first
                    } else if ("oldest".equalsIgnoreCase(sortBy)) {
                        Date d1 = a.getCreatedAt() != null ? a.getCreatedAt() : new Date(0);
                        Date d2 = b.getCreatedAt() != null ? b.getCreatedAt() : new Date(0);
                        return d1.compareTo(d2);
                    }
                    // Default newest first
                    Date d1 = a.getCreatedAt() != null ? a.getCreatedAt() : new Date(0);
                    Date d2 = b.getCreatedAt() != null ? b.getCreatedAt() : new Date(0);
                    return d2.compareTo(d1);
                })
                .map(HelpRequestResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public VolunteerResponseDto acceptRequest(String requestId, AcceptRequestDto acceptDto) {
        validateIdString(requestId, "Request ID");
        String normalizedEmail = acceptDto.getVolunteerEmail().trim().toLowerCase();

        HelpRequest request = firestoreRepository.findRequestById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Campus help request not found with ID: " + requestId));

        // Rule 5: Request creator cannot volunteer for own request
        if (normalizedEmail.equalsIgnoreCase(request.getRequesterEmail().trim())) {
            throw new UnauthorizedActionException("You cannot volunteer for your own request.");
        }

        // Rule 3: Only OPEN requests can be accepted
        if (!RequestStatus.OPEN.name().equalsIgnoreCase(request.getStatus())) {
            throw new InvalidRequestStateException("Only OPEN requests can be accepted. Current status: " + request.getStatus());
        }

        Volunteer volunteer = new Volunteer(requestId, acceptDto.getVolunteerName().trim(), normalizedEmail);
        Volunteer saved = firestoreRepository.addVolunteerWithTransaction(volunteer, requestId);

        return new VolunteerResponseDto(saved.getId(), saved.getRequestId(), saved.getVolunteerName(), saved.getVolunteerEmail(), saved.getCreatedAt());
    }

    @Override
    public HelpRequestResponseDto resolveRequest(String requestId, ResolveRequestDto resolveDto) {
        validateIdString(requestId, "Request ID");
        String normalizedResolverEmail = resolveDto.getResolverEmail().trim().toLowerCase();

        HelpRequest request = firestoreRepository.findRequestById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Campus help request not found with ID: " + requestId));

        // Rule 6 & 7: A request cannot be resolved before it has been accepted; only accepted requests can be resolved
        if (!RequestStatus.ACCEPTED.name().equalsIgnoreCase(request.getStatus())) {
            throw new InvalidRequestStateException("A request can only be resolved once it has been accepted. Current status: " + request.getStatus());
        }

        // Verify resolver identity
        List<Volunteer> volunteers = firestoreRepository.findVolunteersByRequestId(requestId);
        boolean isCreator = normalizedResolverEmail.equalsIgnoreCase(request.getRequesterEmail().trim());
        boolean isVolunteer = volunteers.stream().anyMatch(v -> normalizedResolverEmail.equalsIgnoreCase(v.getVolunteerEmail()));

        if (!isCreator && !isVolunteer) {
            throw new UnauthorizedActionException("Only the request creator or a participating volunteer can mark this request as resolved.");
        }

        Date resolvedAt = new Date();
        firestoreRepository.updateRequestStatus(requestId, RequestStatus.RESOLVED, resolvedAt);

        request.setStatus(RequestStatus.RESOLVED.name());
        request.setResolvedAt(resolvedAt);
        request.setUpdatedAt(resolvedAt);
        return HelpRequestResponseDto.fromEntity(request);
    }

    @Override
    public HelpRequestResponseDto reopenRequest(String requestId, ReopenRequestDto reopenDto) {
        validateIdString(requestId, "Request ID");
        String normalizedEmail = reopenDto.getRequesterEmail().trim().toLowerCase();

        HelpRequest request = firestoreRepository.findRequestById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Campus help request not found with ID: " + requestId));

        // Rule 8: Reopening a resolved request returns it to OPEN
        if (!RequestStatus.RESOLVED.name().equalsIgnoreCase(request.getStatus())) {
            throw new InvalidRequestStateException("Only RESOLVED requests can be reopened. Current status: " + request.getStatus());
        }

        if (!normalizedEmail.equalsIgnoreCase(request.getRequesterEmail().trim())) {
            throw new UnauthorizedActionException("Only the original request creator can reopen this request.");
        }

        firestoreRepository.updateRequestStatus(requestId, RequestStatus.OPEN, null);

        request.setStatus(RequestStatus.OPEN.name());
        request.setResolvedAt(null);
        request.setUpdatedAt(new Date());
        return HelpRequestResponseDto.fromEntity(request);
    }

    @Override
    public List<VolunteerResponseDto> getVolunteersForRequest(String requestId) {
        validateIdString(requestId, "Request ID");
        List<Volunteer> volunteers = firestoreRepository.findVolunteersByRequestId(requestId);
        return volunteers.stream()
                .map(v -> new VolunteerResponseDto(v.getId(), v.getRequestId(), v.getVolunteerName(), v.getVolunteerEmail(), v.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public ActivityResponseDto getActivityForEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email address is required for activity lookup");
        }
        String normalizedEmail = email.trim().toLowerCase();

        List<HelpRequest> created = firestoreRepository.findRequestsByRequesterEmail(normalizedEmail);
        List<Volunteer> participations = firestoreRepository.findVolunteersByEmail(normalizedEmail);

        List<HelpRequest> volunteeredRequests = new ArrayList<>();
        for (Volunteer v : participations) {
            firestoreRepository.findRequestById(v.getRequestId()).ifPresent(volunteeredRequests::add);
        }

        List<HelpRequestResponseDto> createdDtos = created.stream()
                .map(HelpRequestResponseDto::fromEntity)
                .collect(Collectors.toList());

        List<HelpRequestResponseDto> volunteeredDtos = volunteeredRequests.stream()
                .map(HelpRequestResponseDto::fromEntity)
                .collect(Collectors.toList());

        return new ActivityResponseDto(normalizedEmail, createdDtos, volunteeredDtos);
    }

    @Override
    public StatsResponseDto getPlatformStats() {
        List<HelpRequest> all = firestoreRepository.findAllRequests();

        long total = all.size();
        long open = all.stream().filter(r -> RequestStatus.OPEN.name().equalsIgnoreCase(r.getStatus())).count();
        long accepted = all.stream().filter(r -> RequestStatus.ACCEPTED.name().equalsIgnoreCase(r.getStatus())).count();
        long resolved = all.stream().filter(r -> RequestStatus.RESOLVED.name().equalsIgnoreCase(r.getStatus())).count();

        Set<String> uniqueVolunteerEmails = firestoreRepository.findAllUniqueVolunteerEmails();
        long uniqueVolunteers = uniqueVolunteerEmails.size();

        // Division by zero guard
        double resolutionPercentage = 0.0;
        if (total > 0) {
            resolutionPercentage = Math.round(((double) resolved / total) * 1000.0) / 10.0;
        }

        return new StatsResponseDto(total, open, accepted, resolved, uniqueVolunteers, resolutionPercentage);
    }

    private int getPriorityWeight(String priority) {
        if (PriorityLevel.HIGH.name().equalsIgnoreCase(priority)) return 3;
        if (PriorityLevel.NORMAL.name().equalsIgnoreCase(priority)) return 2;
        if (PriorityLevel.LOW.name().equalsIgnoreCase(priority)) return 1;
        return 0;
    }

    private void validateIdString(String val, String fieldName) {
        if (val == null || val.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " cannot be null or empty.");
        }
        if (val.contains("..") || val.contains("/") || val.contains("\\")) {
            throw new IllegalArgumentException(fieldName + " contains illegal path characters.");
        }
    }
}
