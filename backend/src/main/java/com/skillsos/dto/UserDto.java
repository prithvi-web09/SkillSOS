package com.skillsos.dto;

public class UserDto {
    private String id;
    private String username;
    private String name;
    private String email;
    private String department;
    private String avatarInitial;

    public UserDto() {
    }

    public UserDto(String id, String username, String name, String email, String department) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.department = department;
        this.avatarInitial = (name != null && !name.isEmpty()) ? String.valueOf(name.charAt(0)).toUpperCase() : "U";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAvatarInitial() {
        return avatarInitial;
    }

    public void setAvatarInitial(String avatarInitial) {
        this.avatarInitial = avatarInitial;
    }
}
