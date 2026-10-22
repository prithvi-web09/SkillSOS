package com.skillsos.service;

import com.skillsos.dto.*;
import com.skillsos.model.PriorityLevel;
import com.skillsos.model.RequestCategory;
import com.skillsos.model.RequestStatus;

import java.util.List;

public interface HelpRequestService {

    HelpRequestResponseDto createRequest(CreateRequestDto createDto);

    HelpRequestResponseDto getRequestById(String id);

    List<HelpRequestResponseDto> getRequests(String search, RequestCategory category,
                                            PriorityLevel priority, RequestStatus status,
                                            String sortBy);

    VolunteerResponseDto acceptRequest(String requestId, AcceptRequestDto acceptDto);

    HelpRequestResponseDto resolveRequest(String requestId, ResolveRequestDto resolveDto);

    HelpRequestResponseDto reopenRequest(String requestId, ReopenRequestDto reopenDto);

    List<VolunteerResponseDto> getVolunteersForRequest(String requestId);

    ActivityResponseDto getActivityForEmail(String email);

    StatsResponseDto getPlatformStats();
}
