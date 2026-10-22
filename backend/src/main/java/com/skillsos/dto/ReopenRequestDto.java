package com.skillsos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ReopenRequestDto {

    @NotBlank(message = "Requester email is required to verify reopening")
    @Email(message = "Please provide a valid email address")
    private String requesterEmail;

    public ReopenRequestDto() {
    }

    public ReopenRequestDto(String requesterEmail) {
        this.requesterEmail = requesterEmail;
    }

    public String getRequesterEmail() {
        return requesterEmail;
    }

    public void setRequesterEmail(String requesterEmail) {
        this.requesterEmail = requesterEmail;
    }
}
