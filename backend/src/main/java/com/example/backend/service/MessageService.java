package com.example.backend.service;

import com.example.backend.model.Message;
import com.example.backend.model.MessageRequestResponse;

import java.util.List;
import java.util.UUID;

public interface MessageService {
    MessageRequestResponse sendMessage(MessageRequestResponse message);
    void saveMessage(MessageRequestResponse message);

    List<MessageRequestResponse> findAllByReceiverIdAndSenderId(UUID receiverId, UUID senderId);
}
