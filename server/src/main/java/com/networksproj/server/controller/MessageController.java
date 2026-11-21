package com.networksproj.server.controller;

import com.networksproj.server.model.Message;
import com.networksproj.server.security.CurrentUser;
import com.networksproj.server.service.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MessageController {

    private final ChatService chat;

    public MessageController(ChatService chat) {
        this.chat = chat;
    }

    @GetMapping("/messages")
    public List<Message> history(Principal principal,
                                 @RequestParam("with") String peer,
                                 @RequestParam(required = false) String user,
                                 @RequestParam(defaultValue = "0") long since) {
        String me = CurrentUser.resolve(principal, user);
        if (peer.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "with is required");
        }
        return chat.history(me, peer, since);
    }
}