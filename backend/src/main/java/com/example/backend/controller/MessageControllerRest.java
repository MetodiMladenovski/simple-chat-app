package com.example.backend.controller;


import com.example.backend.model.Message;
import com.example.backend.model.MessageRequestResponse;
import com.example.backend.service.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/rest/messages")
@AllArgsConstructor
public class MessageControllerRest {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<String> getMessages(){
        return ResponseEntity.ok(("Got messages"));
    }

    @GetMapping("/{receiverId}/{senderId}")
    public ResponseEntity<List<MessageRequestResponse>> getMessagesForUser(@PathVariable UUID receiverId,
                                                                           @PathVariable UUID senderId){
        return ResponseEntity.ok(messageService.findAllByReceiverIdAndSenderId(receiverId, senderId));
    }
}
