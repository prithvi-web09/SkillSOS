package com.skillsos.controller;

import com.skillsos.dto.LoginRequestDto;
import com.skillsos.dto.UserDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // Predefined simple student accounts for demonstration
    private static final Map<String, String> PASSWORDS = new HashMap<>();
    private static final Map<String, UserDto> USERS = new HashMap<>();

    static {
        // User 1: Rohan Sharma (Computer Engineering)
        PASSWORDS.put("rohan", "123");
        USERS.put("rohan", new UserDto("usr-rohan-01", "rohan", "Rohan Sharma", "rohan@campus.edu", "Computer Engineering (Sem III)"));

        // User 2: Priya Patel (Electronics Engineering)
        PASSWORDS.put("priya", "123");
        USERS.put("priya", new UserDto("usr-priya-02", "priya", "Priya Patel", "priya@campus.edu", "Electronics Engineering (Sem III)"));

        // User 3: Aryan Deshmukh (Information Technology)
        PASSWORDS.put("aryan", "123");
        USERS.put("aryan", new UserDto("usr-aryan-03", "aryan", "Aryan Deshmukh", "aryan@campus.edu", "Information Technology (Sem V)"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto loginDto) {
        String username = loginDto.getUsername() != null ? loginDto.getUsername().trim().toLowerCase() : "";
        String password = loginDto.getPassword() != null ? loginDto.getPassword().trim() : "";

        if (PASSWORDS.containsKey(username) && PASSWORDS.get(username).equals(password)) {
            UserDto user = USERS.get(username);
            return ResponseEntity.ok(user);
        }

        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", new Date());
        error.put("status", HttpStatus.UNAUTHORIZED.value());
        error.put("error", "INVALID_CREDENTIALS");
        error.put("message", "Invalid username or password. Please use 'rohan', 'priya', or 'aryan' with password '123'.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getDemoUsers() {
        return ResponseEntity.ok(new ArrayList<>(USERS.values()));
    }
}
