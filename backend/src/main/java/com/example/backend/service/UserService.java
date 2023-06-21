package com.example.backend.service;

import com.example.backend.model.LoginRequest;
import com.example.backend.model.RegisterRequest;
import com.example.backend.model.UserEntity;

import java.util.List;
import java.util.UUID;

public interface UserService {
    boolean register(RegisterRequest registerRequest);
    UserEntity login(LoginRequest loginRequest);
    List<UserEntity> findAll();
    UserEntity findById(UUID id);

    List<UserEntity> getAll();
}
