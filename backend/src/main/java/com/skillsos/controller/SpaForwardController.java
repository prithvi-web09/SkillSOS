package com.skillsos.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller to forward SPA client-side routes to index.html
 * so the frontend web interface can be served directly by Spring Boot on http://localhost:8080.
 */
@Controller
public class SpaForwardController {

    @GetMapping(value = {
            "/",
            "/requests",
            "/requests/**",
            "/create",
            "/activity",
            "/how-it-works",
            "/campus-resources"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
