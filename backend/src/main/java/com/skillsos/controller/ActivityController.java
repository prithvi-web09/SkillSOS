package com.skillsos.controller;

import com.skillsos.dto.ActivityResponseDto;
import com.skillsos.service.HelpRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    private final HelpRequestService helpRequestService;

    @Autowired
    public ActivityController(HelpRequestService helpRequestService) {
        this.helpRequestService = helpRequestService;
    }

    @GetMapping
    public ResponseEntity<ActivityResponseDto> getActivity(@RequestParam String email) {
        ActivityResponseDto activity = helpRequestService.getActivityForEmail(email);
        return ResponseEntity.ok(activity);
    }
}
