package com.skillsos.controller;

import com.skillsos.dto.*;
import com.skillsos.model.PriorityLevel;
import com.skillsos.model.RequestCategory;
import com.skillsos.model.RequestStatus;
import com.skillsos.service.HelpRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final HelpRequestService helpRequestService;

    @Autowired
    public RequestController(HelpRequestService helpRequestService) {
        this.helpRequestService = helpRequestService;
    }

    @GetMapping
    public ResponseEntity<List<HelpRequestResponseDto>> getAllRequests(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) RequestCategory category,
            @RequestParam(required = false) PriorityLevel priority,
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false, defaultValue = "newest") String sortBy) {

        List<HelpRequestResponseDto> requests = helpRequestService.getRequests(search, category, priority, status, sortBy);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HelpRequestResponseDto> getRequestById(@PathVariable String id) {
        HelpRequestResponseDto request = helpRequestService.getRequestById(id);
        return ResponseEntity.ok(request);
    }

    @PostMapping
    public ResponseEntity<HelpRequestResponseDto> createRequest(@Valid @RequestBody CreateRequestDto createDto) {
        HelpRequestResponseDto created = helpRequestService.createRequest(createDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/accept")
    public ResponseEntity<VolunteerResponseDto> acceptRequest(
            @PathVariable String id,
            @Valid @RequestBody AcceptRequestDto acceptDto) {
        VolunteerResponseDto response = helpRequestService.acceptRequest(id, acceptDto);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<HelpRequestResponseDto> resolveRequest(
            @PathVariable String id,
            @Valid @RequestBody ResolveRequestDto resolveDto) {
        HelpRequestResponseDto resolved = helpRequestService.resolveRequest(id, resolveDto);
        return ResponseEntity.ok(resolved);
    }

    @PatchMapping("/{id}/reopen")
    public ResponseEntity<HelpRequestResponseDto> reopenRequest(
            @PathVariable String id,
            @Valid @RequestBody ReopenRequestDto reopenDto) {
        HelpRequestResponseDto reopened = helpRequestService.reopenRequest(id, reopenDto);
        return ResponseEntity.ok(reopened);
    }

    @GetMapping("/{id}/volunteers")
    public ResponseEntity<List<VolunteerResponseDto>> getVolunteers(@PathVariable String id) {
        List<VolunteerResponseDto> volunteers = helpRequestService.getVolunteersForRequest(id);
        return ResponseEntity.ok(volunteers);
    }
}
