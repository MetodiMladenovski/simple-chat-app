package com.example.backend.repository;

import com.example.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    List<Message> findAllByReceiver_IdAndSender_IdOrReceiver_IdAndSender_Id(UUID receiver, UUID sender, UUID receiver2, UUID sender2);
}
