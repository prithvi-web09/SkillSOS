package com.skillsos.controller;

import com.skillsos.dto.StatsResponseDto;
import com.skillsos.service.HelpRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final HelpRequestService helpRequestService;

    @Autowired
    public StatsController(HelpRequestService helpRequestService) {
        this.helpRequestService = helpRequestService;
    }

    @GetMapping
    public ResponseEntity<StatsResponseDto> getStats() {
        StatsResponseDto stats = helpRequestService.getPlatformStats();
        return ResponseEntity.ok(stats);
    }
}
