package com.skillsos.dto;

import com.skillsos.model.HelpRequest;

import java.util.Date;

public class HelpRequestResponseDto {
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

    public HelpRequestResponseDto() {
    }

    public static HelpRequestResponseDto fromEntity(HelpRequest entity) {
        if (entity == null) return null;
        HelpRequestResponseDto dto = new HelpRequestResponseDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setCategory(entity.getCategory());
        dto.setPriority(entity.getPriority());
        dto.setStatus(entity.getStatus());
        dto.setRequesterName(entity.getRequesterName());
        dto.setRequesterEmail(entity.getRequesterEmail());
        dto.setCampusLocation(entity.getCampusLocation());
        dto.setDeadline(entity.getDeadline());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setResolvedAt(entity.getResolvedAt());
        dto.setVolunteerCount(entity.getVolunteerCount());
        dto.setDemoSeeded(entity.isDemoSeeded());
        return dto;
    }

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
}
