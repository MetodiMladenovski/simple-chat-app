package com.example.backend.exception;

public class WrongPasswordOrEmailException extends RuntimeException{
    public WrongPasswordOrEmailException(String message) {
        super(message);
    }
}
