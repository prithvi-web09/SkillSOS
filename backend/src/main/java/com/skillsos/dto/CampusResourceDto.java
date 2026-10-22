package com.skillsos.dto;

public class CampusResourceDto {
    private String id;
    private String name;
    private String category;
    private String building;
    private String floor;
    private String contact;
    private String timings;
    private String description;

    public CampusResourceDto() {
    }

    public CampusResourceDto(String id, String name, String category, String building,
                             String floor, String contact, String timings, String description) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.building = building;
        this.floor = floor;
        this.contact = contact;
        this.timings = timings;
        this.description = description;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getTimings() {
        return timings;
    }

    public void setTimings(String timings) {
        this.timings = timings;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
