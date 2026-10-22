package com.skillsos.dto;

import java.util.List;

public class ActivityResponseDto {
    private String email;
    private List<HelpRequestResponseDto> createdRequests;
    private List<HelpRequestResponseDto> volunteeredRequests;
    private String disclaimer;

    public ActivityResponseDto() {
        this.disclaimer = "DEMONSTRATION LOOKUP ONLY: This view looks up public request and volunteer records matching this email address. It does not provide authenticated session security.";
    }

    public ActivityResponseDto(String email, List<HelpRequestResponseDto> createdRequests, List<HelpRequestResponseDto> volunteeredRequests) {
        this();
        this.email = email;
        this.createdRequests = createdRequests;
        this.volunteeredRequests = volunteeredRequests;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<HelpRequestResponseDto> getCreatedRequests() {
        return createdRequests;
    }

    public void setCreatedRequests(List<HelpRequestResponseDto> createdRequests) {
        this.createdRequests = createdRequests;
    }

    public List<HelpRequestResponseDto> getVolunteeredRequests() {
        return volunteeredRequests;
    }

    public void setVolunteeredRequests(List<HelpRequestResponseDto> volunteeredRequests) {
        this.volunteeredRequests = volunteeredRequests;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }
}
