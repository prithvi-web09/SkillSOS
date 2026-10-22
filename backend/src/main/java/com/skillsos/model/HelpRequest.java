package com.skillsos.model;

import com.google.cloud.firestore.annotation.DocumentId;
import com.google.cloud.firestore.annotation.IgnoreExtraProperties;

import java.util.Date;

/**
 * Entity representing a student campus help request.
 * Compatible with Google Cloud Firestore POJO serialization.
 */
@IgnoreExtraProperties
public class HelpRequest {

    @DocumentId
    private String id;
    private String title;
    private String description;
    private String category;
    private String priority;
    private String status;
    private String requesterName;
    private String requesterEmail;
    private String campusLocation;
    private String deadline;
    private Date createdAt;
    private Date updatedAt;
    private Date resolvedAt;
    private int volunteerCount;
    private boolean demoSeeded;

    // No-arg constructor required by Firestore serialization
    public HelpRequest() {
        this.status = RequestStatus.OPEN.name();
        this.priority = PriorityLevel.NORMAL.name();
        this.category = RequestCategory.OTHER.name();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.volunteerCount = 0;
        this.demoSeeded = false;
    }

    // Parameterized constructor demonstrating OOP encapsulation and constructor overloading
    public HelpRequest(String title, String description, RequestCategory category,
                       PriorityLevel priority, String requesterName, String requesterEmail,
                       String campusLocation, String deadline) {
        this();
        this.title = title;
        this.description = description;
        this.category = category != null ? category.name() : RequestCategory.OTHER.name();
        this.priority = priority != null ? priority.name() : PriorityLevel.NORMAL.name();
        this.requesterName = requesterName;
        this.requesterEmail = requesterEmail;
        this.campusLocation = campusLocation;
        this.deadline = deadline;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRequesterName() {
        return requesterName;
    }

    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
    }

    public String getRequesterEmail() {
        return requesterEmail;
    }

    public void setRequesterEmail(String requesterEmail) {
        this.requesterEmail = requesterEmail;
    }

    public String getCampusLocation() {
        return campusLocation;
    }

    public void setCampusLocation(String campusLocation) {
        this.campusLocation = campusLocation;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Date getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(Date resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public int getVolunteerCount() {
        return volunteerCount;
    }

    public void setVolunteerCount(int volunteerCount) {
        this.volunteerCount = volunteerCount;
    }

    public boolean isDemoSeeded() {
        return demoSeeded;
    }

    public void setDemoSeeded(boolean demoSeeded) {
        this.demoSeeded = demoSeeded;
    }

    // Helper methods for typed enums
    public RequestStatus getStatusEnum() {
        try {
            return status != null ? RequestStatus.valueOf(status) : RequestStatus.OPEN;
        } catch (IllegalArgumentException e) {
            return RequestStatus.OPEN;
        }
    }

    public RequestCategory getCategoryEnum() {
        try {
            return category != null ? RequestCategory.valueOf(category) : RequestCategory.OTHER;
        } catch (IllegalArgumentException e) {
            return RequestCategory.OTHER;
        }
    }

    public PriorityLevel getPriorityEnum() {
        try {
            return priority != null ? PriorityLevel.valueOf(priority) : PriorityLevel.NORMAL;
        } catch (IllegalArgumentException e) {
            return PriorityLevel.NORMAL;
        }
    }
}
