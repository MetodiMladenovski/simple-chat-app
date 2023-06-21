package com.example.backend.service.impl;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.UserAlreadyExistsException;
import com.example.backend.exception.WrongPasswordOrEmailException;
import com.example.backend.model.LoginRequest;
import com.example.backend.model.RegisterRequest;
import com.example.backend.model.UserEntity;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;


    @Override
    public boolean register(RegisterRequest registerRequest) {
        if(userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new UserAlreadyExistsException("User already exists with that email");
        }
        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(registerRequest.getEmail());
        userEntity.setName(registerRequest.getName());
        userEntity.setLastname(registerRequest.getLastname());
        userEntity.setPassword(registerRequest.getPassword());
        userRepository.save(userEntity);
        return true;
    }

    @Override
    public UserEntity login(LoginRequest loginRequest) {;
        UserEntity user = findByEmail(loginRequest.getEmail());
        if(user.getPassword().equals(loginRequest.getPassword())){
            return user;
        } else {
            throw new WrongPasswordOrEmailException("Wrong password");
        }
    }

    @Override
    public List<UserEntity> findAll() {
        return userRepository.findAll();
    }

    @Override
    public UserEntity findById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User doesn't exist"));
    }

    @Override
    public List<UserEntity> getAll() {
        return userRepository.findAll();
    }

    private UserEntity findByEmail(String email){
        return userRepository.findUserEntityByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User doesn't exist"));
    }
}
