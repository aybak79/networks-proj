package com.networksproj.server.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import com.networksproj.server.model.Message;
import com.networksproj.server.model.MessageType;
import com.networksproj.server.service.ChatService;
import com.networksproj.server.service.MetricsService;
import java.util.UUID;

@Controller 
public class ChatController {
    private final ChatService chatService;
    private final SimpMessagingTemplate messaging;
    private final MetricsService metrics;

    public ChatController(ChatService chatService, SimpMessagingTemplate messaging, MetricsService metrics) {
        this.chatService = chatService;
        this.messaging = messaging;
        this.metrics = metrics;
    }

    @MessageMapping("/chat.send")
    public void send(@Payload Message msg, Principal principal) {
        if (principal == null) return;
        String sender = principal.getName();

        if (msg.getId() == null || msg.getTo() == null) {
            sendError(sender, "id and to are required");
            return;
        }

        if (msg.getBody() != null && msg.getBody().length() > 2000) {
            sendError(sender, "Message too long (max 2000 characters)");
            return;
        }

        // The recipient must be a registered user.
        if (!chatService.userExists(msg.getTo())) {
            sendError(sender, "User not found: " + msg.getTo());
            return;
        }

        msg.setFrom(sender);
        msg.setType(MessageType.CHAT);

        Message saved = chatService.saveIfNew(msg);
        if (saved != null) {
            metrics.messageProcessed();
            messaging.convertAndSendToUser(saved.getTo(), "/queue/messages", saved);
        }

        messaging.convertAndSendToUser(sender, "/queue/messages",
                new Message(UUID.randomUUID().toString(), MessageType.ACK, "server", sender,
                        msg.getId(), System.currentTimeMillis()));
    }

    private void sendError(String user, String reason) {
        messaging.convertAndSendToUser(user, "/queue/messages",
                new Message(UUID.randomUUID().toString(), MessageType.ERROR, "server", user,
                        reason, System.currentTimeMillis()));
    }

    @MessageMapping("/chat.delivered")
    public void delivered(@Payload Message msg, Principal principal) {
        if (principal == null || msg.getBody() == null) return;
        String receiver = principal.getName();

        Message original = chatService.markDelivered(msg.getBody(), receiver);
        if (original == null) return;

        messaging.convertAndSendToUser(original.getFrom(), "/queue/messages",
                new Message(UUID.randomUUID().toString(), MessageType.DELIVERED,
                        receiver, original.getFrom(), original.getId(), System.currentTimeMillis()));
    }
}
