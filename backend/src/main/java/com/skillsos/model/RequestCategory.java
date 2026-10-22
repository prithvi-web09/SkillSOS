package com.skillsos.model;

/**
 * Standard categories of peer campus assistance.
 */
public enum RequestCategory {
    ACADEMIC_HELP("Academic Help"),
    NOTES_AND_STUDY_MATERIAL("Notes & Study Material"),
    BORROW_OR_LEND("Borrow or Lend"),
    LOST_AND_FOUND("Lost & Found"),
    CAMPUS_NAVIGATION("Campus Navigation"),
    PROGRAMMING_HELP("Programming Help"),
    OTHER("Other");

    private final String displayName;

    RequestCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
