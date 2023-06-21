package com.example.backend.controller;

import com.example.backend.model.Message;
import com.example.backend.model.MessageRequestResponse;
import com.example.backend.service.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class MessageControllerWebSocket {

    private MessageService messageService;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public MessageRequestResponse receiveMessage(@Payload MessageRequestResponse message){
        return message;
    }

    @MessageMapping("/private-message")
    public MessageRequestResponse recMessage(@Payload MessageRequestResponse message){
        messageService.sendMessage(message);
        return message;
    }


}
