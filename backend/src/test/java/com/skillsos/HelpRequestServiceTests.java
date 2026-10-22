package com.skillsos;

import com.skillsos.dto.*;
import com.skillsos.exception.DuplicateVolunteerException;
import com.skillsos.exception.InvalidRequestStateException;
import com.skillsos.exception.ResourceNotFoundException;
import com.skillsos.exception.UnauthorizedActionException;
import com.skillsos.model.*;
import com.skillsos.repository.FirestoreRepository;
import com.skillsos.service.HelpRequestServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HelpRequestServiceTests {

    @Mock
    private FirestoreRepository firestoreRepository;

    private HelpRequestServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new HelpRequestServiceImpl(firestoreRepository);
    }

    @Test
    @DisplayName("4. Valid request creation sets status to OPEN and volunteerCount to 0")
    void testCreateRequest_Success() {
        CreateRequestDto dto = new CreateRequestDto();
        dto.setTitle("Need Scientific Calculator FX-991EX");
        dto.setDescription("Urgent calculator needed before 10 AM practical exam in Room 304");
        dto.setCategory(RequestCategory.BORROW_OR_LEND);
        dto.setPriority(PriorityLevel.HIGH);
        dto.setRequesterName("Rohan Sharma");
        dto.setRequesterEmail("rohan@campus.edu");
        dto.setCampusLocation("Block B Room 304");
        dto.setDeadline("10:00 AM Today");

        when(firestoreRepository.saveRequest(any(HelpRequest.class))).thenAnswer(invocation -> {
            HelpRequest req = invocation.getArgument(0);
            req.setId("doc-123");
            return req;
        });

        HelpRequestResponseDto response = service.createRequest(dto);

        assertNotNull(response);
        assertEquals("doc-123", response.getId());
        assertEquals(RequestStatus.OPEN.name(), response.getStatus());
        assertEquals(0, response.getVolunteerCount());
        assertEquals("rohan@campus.edu", response.getRequesterEmail());
        verify(firestoreRepository, times(1)).saveRequest(any(HelpRequest.class));
    }

    @Test
    @DisplayName("5. Invalid request rejection on illegal path characters in request ID")
    void testGetRequestById_InvalidIdRejected() {
        assertThrows(IllegalArgumentException.class, () -> service.getRequestById("../malicious/path"));
        assertThrows(IllegalArgumentException.class, () -> service.getRequestById(""));
    }

    @Test
    @DisplayName("6. Request listing and sorting by priority and newest")
    void testGetRequests_ListingAndSorting() {
        HelpRequest req1 = new HelpRequest("High Need", "Desc", RequestCategory.ACADEMIC_HELP, PriorityLevel.HIGH, "A", "a@c.edu", "Loc", null);
        req1.setId("1");
        req1.setStatus(RequestStatus.OPEN.name());
        req1.setCreatedAt(new Date(1000));

        HelpRequest req2 = new HelpRequest("Normal Need", "Desc", RequestCategory.ACADEMIC_HELP, PriorityLevel.NORMAL, "B", "b@c.edu", "Loc", null);
        req2.setId("2");
        req2.setStatus(RequestStatus.OPEN.name());
        req2.setCreatedAt(new Date(2000));

        when(firestoreRepository.findAllRequests()).thenReturn(List.of(req1, req2));

        // Priority sort: req1 (HIGH) should be first
        List<HelpRequestResponseDto> prioritySorted = service.getRequests(null, null, null, null, "priority");
        assertEquals("1", prioritySorted.get(0).getId());

        // Newest sort: req2 (newer date 2000) should be first
        List<HelpRequestResponseDto> newestSorted = service.getRequests(null, null, null, null, "newest");
        assertEquals("2", newestSorted.get(0).getId());
    }

    @Test
    @DisplayName("7. Request detail retrieval successfully returns existing entity")
    void testGetRequestById_Success() {
        HelpRequest req = new HelpRequest();
        req.setId("req-456");
        req.setTitle("Java Practical Assistance");
        req.setStatus(RequestStatus.OPEN.name());
        when(firestoreRepository.findRequestById("req-456")).thenReturn(Optional.of(req));

        HelpRequestResponseDto response = service.getRequestById("req-456");
        assertNotNull(response);
        assertEquals("req-456", response.getId());
        assertEquals("Java Practical Assistance", response.getTitle());
    }

    @Test
    @DisplayName("8. Acceptance of an open request registers volunteer")
    void testAcceptRequest_Success() {
        HelpRequest req = new HelpRequest();
        req.setId("req-789");
        req.setRequesterEmail("creator@campus.edu");
        req.setStatus(RequestStatus.OPEN.name());
        when(firestoreRepository.findRequestById("req-789")).thenReturn(Optional.of(req));

        Volunteer savedVol = new Volunteer("req-789", "Aarav Patel", "aarav@campus.edu");
        savedVol.setId("vol-1");
        when(firestoreRepository.addVolunteerWithTransaction(any(Volunteer.class), eq("req-789"))).thenReturn(savedVol);

        AcceptRequestDto acceptDto = new AcceptRequestDto("Aarav Patel", "aarav@campus.edu");
        VolunteerResponseDto result = service.acceptRequest("req-789", acceptDto);

        assertNotNull(result);
        assertEquals("vol-1", result.getId());
        assertEquals("aarav@campus.edu", result.getVolunteerEmail());
        verify(firestoreRepository, times(1)).addVolunteerWithTransaction(any(Volunteer.class), eq("req-789"));
    }

    @Test
    @DisplayName("9. Duplicate volunteer prevention throws DuplicateVolunteerException")
    void testAcceptRequest_DuplicateVolunteerThrows() {
        HelpRequest req = new HelpRequest();
        req.setId("req-789");
        req.setRequesterEmail("creator@campus.edu");
        req.setStatus(RequestStatus.OPEN.name());
        when(firestoreRepository.findRequestById("req-789")).thenReturn(Optional.of(req));

        when(firestoreRepository.addVolunteerWithTransaction(any(Volunteer.class), eq("req-789")))
                .thenThrow(new DuplicateVolunteerException("You have already volunteered for this campus request."));

        AcceptRequestDto acceptDto = new AcceptRequestDto("Aarav Patel", "aarav@campus.edu");
        assertThrows(DuplicateVolunteerException.class, () -> service.acceptRequest("req-789", acceptDto));
    }

    @Test
    @DisplayName("10. Creator volunteering prevention throws UnauthorizedActionException")
    void testAcceptRequest_CreatorCannotVolunteerForSelf() {
        HelpRequest req = new HelpRequest();
        req.setId("req-789");
        req.setRequesterEmail("student@campus.edu");
        req.setStatus(RequestStatus.OPEN.name());
        when(firestoreRepository.findRequestById("req-789")).thenReturn(Optional.of(req));

        AcceptRequestDto acceptDto = new AcceptRequestDto("Student Self", "student@campus.edu");
        assertThrows(UnauthorizedActionException.class, () -> service.acceptRequest("req-789", acceptDto));
    }

    @Test
    @DisplayName("11. Resolution of an accepted request succeeds")
    void testResolveRequest_Success() {
        HelpRequest req = new HelpRequest();
        req.setId("req-888");
        req.setRequesterEmail("creator@campus.edu");
        req.setStatus(RequestStatus.ACCEPTED.name());
        when(firestoreRepository.findRequestById("req-888")).thenReturn(Optional.of(req));

        Volunteer v = new Volunteer("req-888", "Volunteer Helper", "helper@campus.edu");
        when(firestoreRepository.findVolunteersByRequestId("req-888")).thenReturn(List.of(v));

        ResolveRequestDto resolveDto = new ResolveRequestDto("creator@campus.edu");
        HelpRequestResponseDto resolved = service.resolveRequest("req-888", resolveDto);

        assertEquals(RequestStatus.RESOLVED.name(), resolved.getStatus());
        assertNotNull(resolved.getResolvedAt());
        verify(firestoreRepository, times(1)).updateRequestStatus(eq("req-888"), eq(RequestStatus.RESOLVED), any(Date.class));
    }

    @Test
    @DisplayName("12. Rejection of invalid state transitions: cannot resolve an OPEN unaccepted request")
    void testResolveRequest_FailsWhenNotAccepted() {
        HelpRequest req = new HelpRequest();
        req.setId("req-999");
        req.setStatus(RequestStatus.OPEN.name());
        when(firestoreRepository.findRequestById("req-999")).thenReturn(Optional.of(req));

        ResolveRequestDto resolveDto = new ResolveRequestDto("anyone@campus.edu");
        assertThrows(InvalidRequestStateException.class, () -> service.resolveRequest("req-999", resolveDto));
    }

    @Test
    @DisplayName("13. Reopening a resolved request returns status to OPEN")
    void testReopenRequest_Success() {
        HelpRequest req = new HelpRequest();
        req.setId("req-777");
        req.setRequesterEmail("original@campus.edu");
        req.setStatus(RequestStatus.RESOLVED.name());
        when(firestoreRepository.findRequestById("req-777")).thenReturn(Optional.of(req));

        ReopenRequestDto reopenDto = new ReopenRequestDto("original@campus.edu");
        HelpRequestResponseDto reopened = service.reopenRequest("req-777", reopenDto);

        assertEquals(RequestStatus.OPEN.name(), reopened.getStatus());
        assertNull(reopened.getResolvedAt());
        verify(firestoreRepository, times(1)).updateRequestStatus("req-777", RequestStatus.OPEN, null);
    }

    @Test
    @DisplayName("14. Acceptance rejected if request is already ACCEPTED or RESOLVED")
    void testAcceptRequest_FailsWhenAlreadyAccepted() {
        HelpRequest req = new HelpRequest();
        req.setId("req-555");
        req.setRequesterEmail("student@campus.edu");
        req.setStatus(RequestStatus.ACCEPTED.name());
        when(firestoreRepository.findRequestById("req-555")).thenReturn(Optional.of(req));

        AcceptRequestDto acceptDto = new AcceptRequestDto("New Helper", "new@campus.edu");
        assertThrows(InvalidRequestStateException.class, () -> service.acceptRequest("req-555", acceptDto));
    }

    @Test
    @DisplayName("15. Statistics calculation calculates counts and avoids division by zero")
    void testPlatformStats_CalculationAndZeroDivisionSafety() {
        // Test empty database
        when(firestoreRepository.findAllRequests()).thenReturn(Collections.emptyList());
        when(firestoreRepository.findAllUniqueVolunteerEmails()).thenReturn(Collections.emptySet());

        StatsResponseDto emptyStats = service.getPlatformStats();
        assertEquals(0, emptyStats.getTotalRequests());
        assertEquals(0, emptyStats.getOpenRequests());
        assertEquals(0.0, emptyStats.getResolutionPercentage());

        // Test with records
        HelpRequest r1 = new HelpRequest();
        r1.setStatus(RequestStatus.OPEN.name());
        HelpRequest r2 = new HelpRequest();
        r2.setStatus(RequestStatus.ACCEPTED.name());
        HelpRequest r3 = new HelpRequest();
        r3.setStatus(RequestStatus.RESOLVED.name());
        HelpRequest r4 = new HelpRequest();
        r4.setStatus(RequestStatus.RESOLVED.name());

        when(firestoreRepository.findAllRequests()).thenReturn(List.of(r1, r2, r3, r4));
        when(firestoreRepository.findAllUniqueVolunteerEmails()).thenReturn(Set.of("v1@c.edu", "v2@c.edu"));

        StatsResponseDto populatedStats = service.getPlatformStats();
        assertEquals(4, populatedStats.getTotalRequests());
        assertEquals(1, populatedStats.getOpenRequests());
        assertEquals(1, populatedStats.getAcceptedRequests());
        assertEquals(2, populatedStats.getResolvedRequests());
        assertEquals(2, populatedStats.getUniqueVolunteers());
        assertEquals(50.0, populatedStats.getResolutionPercentage());
    }

    @Test
    @DisplayName("16. ResourceNotFoundException thrown when request ID does not exist")
    void testMissingRequestThrowsException() {
        when(firestoreRepository.findRequestById("non-existent-id")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.getRequestById("non-existent-id"));
    }
}
