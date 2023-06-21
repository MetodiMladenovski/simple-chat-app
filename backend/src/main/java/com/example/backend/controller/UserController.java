package com.example.backend.controller;

import com.example.backend.model.LoginRequest;
import com.example.backend.model.RegisterRequest;
import com.example.backend.model.UserEntity;
import com.example.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Boolean> registerUser(@RequestBody RegisterRequest registerRequest) {
        boolean result = userService.register(registerRequest);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<UserEntity> loginUser(@RequestBody LoginRequest loginRequest) {
        UserEntity user = userService.login(loginRequest);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<UserEntity>> getAllUsers(){
        List<UserEntity> users = userService.getAll();
        return ResponseEntity.ok(users);
    }
}
