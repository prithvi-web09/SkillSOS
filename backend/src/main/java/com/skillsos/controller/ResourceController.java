package com.skillsos.controller;

import com.skillsos.dto.CampusResourceDto;
import com.skillsos.service.XmlResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final XmlResourceService xmlResourceService;

    @Autowired
    public ResourceController(XmlResourceService xmlResourceService) {
        this.xmlResourceService = xmlResourceService;
    }

    @GetMapping
    public ResponseEntity<List<CampusResourceDto>> getCampusResources() {
        List<CampusResourceDto> resources = xmlResourceService.parseCampusResources();
        return ResponseEntity.ok(resources);
    }
}
