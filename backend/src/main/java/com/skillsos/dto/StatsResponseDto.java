package com.skillsos.dto;

public class StatsResponseDto {
    private long totalRequests;
    private long openRequests;
    private long acceptedRequests;
    private long resolvedRequests;
    private long uniqueVolunteers;
    private double resolutionPercentage;

    public StatsResponseDto() {
    }

    public StatsResponseDto(long totalRequests, long openRequests, long acceptedRequests,
                            long resolvedRequests, long uniqueVolunteers, double resolutionPercentage) {
        this.totalRequests = totalRequests;
        this.openRequests = openRequests;
        this.acceptedRequests = acceptedRequests;
        this.resolvedRequests = resolvedRequests;
        this.uniqueVolunteers = uniqueVolunteers;
        this.resolutionPercentage = resolutionPercentage;
    }

    public long getTotalRequests() {
        return totalRequests;
    }

    public void setTotalRequests(long totalRequests) {
        this.totalRequests = totalRequests;
    }

    public long getOpenRequests() {
        return openRequests;
    }

    public void setOpenRequests(long openRequests) {
        this.openRequests = openRequests;
    }

    public long getAcceptedRequests() {
        return acceptedRequests;
    }

    public void setAcceptedRequests(long acceptedRequests) {
        this.acceptedRequests = acceptedRequests;
    }

    public long getResolvedRequests() {
        return resolvedRequests;
    }

    public void setResolvedRequests(long resolvedRequests) {
        this.resolvedRequests = resolvedRequests;
    }

    public long getUniqueVolunteers() {
        return uniqueVolunteers;
    }

    public void setUniqueVolunteers(long uniqueVolunteers) {
        this.uniqueVolunteers = uniqueVolunteers;
    }

    public double getResolutionPercentage() {
        return resolutionPercentage;
    }

    public void setResolutionPercentage(double resolutionPercentage) {
        this.resolutionPercentage = resolutionPercentage;
    }
}
