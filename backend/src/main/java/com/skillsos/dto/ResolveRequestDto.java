package com.skillsos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ResolveRequestDto {

    @NotBlank(message = "Resolver email is required to verify participant action")
    @Email(message = "Please provide a valid email address")
    private String resolverEmail;

    public ResolveRequestDto() {
    }

    public ResolveRequestDto(String resolverEmail) {
        this.resolverEmail = resolverEmail;
    }

    public String getResolverEmail() {
        return resolverEmail;
    }

    public void setResolverEmail(String resolverEmail) {
        this.resolverEmail = resolverEmail;
    }
}
