package com.example.backend.model;

import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class MessageRequestResponse implements Serializable {
    private UUID senderId;
    private UUID receiverId;
    private String message;
    private String date;
    private Status status;
}
