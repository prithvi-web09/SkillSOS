package com.skillsos.dto;

import com.skillsos.model.PriorityLevel;
import com.skillsos.model.RequestCategory;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateRequestDto {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 120, message = "Title must be between 5 and 120 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1500, message = "Description must be between 10 and 1500 characters")
    private String description;

    @NotNull(message = "Category is required")
    private RequestCategory category;

    @NotNull(message = "Priority is required")
    private PriorityLevel priority;

    @NotBlank(message = "Requester name is required")
    @Size(min = 2, max = 60, message = "Name must be between 2 and 60 characters")
    private String requesterName;

    @NotBlank(message = "Requester email is required")
    @Email(message = "Please provide a valid campus email address")
    private String requesterEmail;

    @NotBlank(message = "Campus location is required")
    @Size(min = 2, max = 100, message = "Campus location must be between 2 and 100 characters")
    private String campusLocation;

    @Size(max = 60, message = "Deadline description cannot exceed 60 characters")
    private String deadline;

    public CreateRequestDto() {
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

    public RequestCategory getCategory() {
        return category;
    }

    public void setCategory(RequestCategory category) {
        this.category = category;
    }

    public PriorityLevel getPriority() {
        return priority;
    }

    public void setPriority(PriorityLevel priority) {
        this.priority = priority;
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
}
