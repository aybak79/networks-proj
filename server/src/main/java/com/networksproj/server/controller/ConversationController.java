package com.networksproj.server.controller;

import com.networksproj.server.dto.ConversationSummary;
import com.networksproj.server.security.CurrentUser;
import com.networksproj.server.service.ChatService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ConversationController {

    private final ChatService chat;

    public ConversationController(ChatService chat) {
        this.chat = chat;
    }

    @GetMapping("/conversations")
    public List<ConversationSummary> conversations(Principal principal,
                                                   @RequestParam(required = false) String user) {
        return chat.conversations(CurrentUser.resolve(principal, user));
    }
}