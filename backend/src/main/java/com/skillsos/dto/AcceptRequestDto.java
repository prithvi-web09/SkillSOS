package com.skillsos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AcceptRequestDto {

    @NotBlank(message = "Volunteer name is required")
    @Size(min = 2, max = 60, message = "Volunteer name must be between 2 and 60 characters")
    private String volunteerName;

    @NotBlank(message = "Volunteer email is required")
    @Email(message = "Please provide a valid email address")
    private String volunteerEmail;

    public AcceptRequestDto() {
    }

    public AcceptRequestDto(String volunteerName, String volunteerEmail) {
        this.volunteerName = volunteerName;
        this.volunteerEmail = volunteerEmail;
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
}
