package com.networksproj.server.controller;

import com.networksproj.server.dto.ConversationSummary;
import com.networksproj.server.handler.RawChatWebSocketHandler;
import com.networksproj.server.model.Message;
import com.networksproj.server.model.MessageType;
import com.networksproj.server.security.CurrentUser;
import com.networksproj.server.service.ChatService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ConversationController {

    private final ChatService chat;
    private final RawChatWebSocketHandler rawHandler;
    private final SimpMessagingTemplate messaging;

    public ConversationController(ChatService chat, RawChatWebSocketHandler rawHandler,
                                  SimpMessagingTemplate messaging) {
        this.chat = chat;
        this.rawHandler = rawHandler;
        this.messaging = messaging;
    }

    @GetMapping("/conversations")
    public List<ConversationSummary> conversations(Principal principal,
                                                   @RequestParam(required = false) String user) {
        return chat.conversations(CurrentUser.resolve(principal, user));
    }

    // Called when the user opens a chat: marks the friend's messages as read and tells the friend.
    @PostMapping("/conversations/{friend}/read")
    public void markRead(Principal principal, @PathVariable String friend) {
        String me = CurrentUser.resolve(principal, null);
        int changed = chat.markRead(me, friend);

        if (changed > 0) {
            Message receipt = new Message(UUID.randomUUID().toString(), MessageType.READ,
                    me, friend, me, System.currentTimeMillis());
            rawHandler.notifyUser(friend, receipt);
            messaging.convertAndSendToUser(friend, "/queue/messages", receipt);
        }
    }
}