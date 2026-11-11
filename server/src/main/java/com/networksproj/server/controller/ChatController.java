package com.networksproj.server.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import com.networksproj.server.model.Message;
import com.networksproj.server.model.MessageType;
import com.networksproj.server.service.ChatService;
import java.util.UUID;

@Controller 
public class ChatController {
    private final ChatService chatService;
    private final SimpMessagingTemplate messaging;

    public ChatController(ChatService chatService, SimpMessagingTemplate messaging) {
        this.chatService = chatService;
        this.messaging = messaging;
    }

    @MessageMapping("/chat.send")
    public void send(@Payload Message msg, Principal principal) {
        if (principal == null) return;
        String sender = principal.getName();
        if (msg.getId() == null || msg.getTo() == null) {
            messaging.convertAndSendToUser(sender, "/queue/messages",
                    new Message(UUID.randomUUID().toString(), MessageType.ERROR, "server", sender,
                            "id and to are required", System.currentTimeMillis()));
            return;
        }
        msg.setFrom(sender);
        msg.setType(MessageType.CHAT);

        Message saved = chatService.saveIfNew(msg);
        if (saved != null) {
            messaging.convertAndSendToUser(saved.getTo(), "/queue/messages", saved);
        }
        messaging.convertAndSendToUser(sender, "/queue/messages",
        new Message(UUID.randomUUID().toString(), MessageType.ACK, "server", sender,
                msg.getId(), System.currentTimeMillis()));
    }
}
