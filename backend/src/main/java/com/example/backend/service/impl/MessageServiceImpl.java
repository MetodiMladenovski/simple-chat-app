package com.example.backend.service.impl;

import com.example.backend.model.Message;
import com.example.backend.model.MessageRequestResponse;
import com.example.backend.model.UserEntity;
import com.example.backend.repository.MessageRepository;
import com.example.backend.service.MessageService;
import com.example.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MessageServiceImpl implements MessageService {

    private SimpMessagingTemplate simpMessagingTemplate;
    private MessageRepository messageRepository;
    private ModelMapper modelMapper;
    private UserService userService;

    @Override
    public MessageRequestResponse sendMessage(MessageRequestResponse message) {
        UUID receiverId = message.getReceiverId();
        simpMessagingTemplate.convertAndSendToUser(receiverId.toString(),
                "/private", message);
        saveMessage(message);
        return message;
    }

    public void saveMessage(MessageRequestResponse message) {
        UserEntity sender = userService.findById(message.getSenderId());
        UserEntity receiver = userService.findById(message.getReceiverId());
        Message m = new Message();
        m.setSender(sender);
        m.setReceiver(receiver);
        m.setMessage(message.getMessage());
        m.setStatus(message.getStatus());
        messageRepository.save(m);
    }

    @Override
    public List<MessageRequestResponse> findAllByReceiverIdAndSenderId(UUID receiverId, UUID senderId) {
        List<Message> messages = messageRepository.findAllByReceiver_IdAndSender_IdOrReceiver_IdAndSender_Id(receiverId, senderId, senderId, receiverId);
        List<MessageRequestResponse> mappedMessages = messages
                .stream()
                .map(m -> modelMapper.map(m, MessageRequestResponse.class))
                .collect(Collectors.toList());
        return mappedMessages;
    }

}
