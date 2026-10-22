package com.skillsos.dto;

import java.util.Date;

public class VolunteerResponseDto {
    private String id;
    private String requestId;
    private String volunteerName;
    private String volunteerEmail;
    private Date createdAt;

    public VolunteerResponseDto() {
    }

    public VolunteerResponseDto(String id, String requestId, String volunteerName, String volunteerEmail, Date createdAt) {
        this.id = id;
        this.requestId = requestId;
        this.volunteerName = volunteerName;
        this.volunteerEmail = volunteerEmail;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getVolunteerName() {
        return volunteerName;
    }

    public void setVolunteerName(String volunteerName) {
        this.volunteerName = volunteerName;
    }

    public String getVolunteerEmail() {
        return volunteerEmail;
    }

    public void setVolunteerEmail(String volunteerEmail) {
        this.volunteerEmail = volunteerEmail;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
