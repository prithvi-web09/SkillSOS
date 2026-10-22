package com.skillsos.model;

import com.google.cloud.firestore.annotation.DocumentId;
import com.google.cloud.firestore.annotation.IgnoreExtraProperties;

import java.util.Date;

/**
 * Entity representing a student volunteer offering assistance on a request.
 */
@IgnoreExtraProperties
public class Volunteer {

    @DocumentId
    private String id;
    private String requestId;
    private String volunteerName;
    private String volunteerEmail;
    private Date createdAt;

    public Volunteer() {
        this.createdAt = new Date();
    }

    public Volunteer(String requestId, String volunteerName, String volunteerEmail) {
        this();
        this.requestId = requestId;
        this.volunteerName = volunteerName;
        this.volunteerEmail = volunteerEmail != null ? volunteerEmail.trim().toLowerCase() : null;
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
        this.volunteerEmail = volunteerEmail != null ? volunteerEmail.trim().toLowerCase() : null;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
