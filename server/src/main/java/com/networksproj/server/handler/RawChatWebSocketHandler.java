package com.networksproj.server.handler;

import com.networksproj.server.model.Message;
import com.networksproj.server.model.MessageType;
import com.networksproj.server.service.SessionService;
import com.networksproj.server.service.ChatService;
import com.networksproj.server.service.MetricsService;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import tools.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Component
public class RawChatWebSocketHandler extends TextWebSocketHandler {
    private final MetricsService metrics;
    private final SessionService sessions;
    private final ChatService chat;
    private final ObjectMapper mapper;
    
    public RawChatWebSocketHandler(MetricsService metrics, SessionService sessions, ChatService chat, ObjectMapper mapper) {
        this.metrics = metrics;
        this.sessions = sessions;
        this.chat = chat;
        this.mapper = mapper;
    }
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println("Connected: " + session.getId());
    }

    // Handles incoming messages.
    @Override
    protected void handleTextMessage(
            WebSocketSession session, TextMessage message) throws Exception {

        String payload = message.getPayload();

        metrics.messageProcessed();
        metrics.bytesProcessed(
                payload.getBytes(StandardCharsets.UTF_8).length
        );

        Message msg;

        // Convert JSON into a Message object.
        try {
            msg = mapper.readValue(payload, Message.class);
        } catch (Exception e) {
            sendError(session, null, "Invalid JSON");
            return;
        }

        if (msg.getType() == null || msg.getFrom() == null) {
            sendError(session, null, "Type and sender are required");
            return;
        }

        // Handle the message according to its type.
        if (msg.getType() == MessageType.JOIN) {
            handleJoin(session, msg);
         } 
        else if (msg.getType() == MessageType.CHAT) {
             handleChat(session, msg);
         } 
        else 
        {sendError(session, msg.getFrom(), "Invalid message type"); }

        }

    // Registers a user and retrieves their missed messages.
    private void handleJoin(WebSocketSession session, Message msg)
            throws Exception {

        if (msg.getFrom().isBlank()) {
            sendError(session, null, "Username cannot be empty");
            return;
        }

        sessions.register(msg.getFrom(), session);

        send(session, new Message(UUID.randomUUID().toString(),MessageType.ACK, "server",msg.getFrom(),"JOIN successful",System.currentTimeMillis()));

        // Get the timestamp of the last received message.
        long since = 0;

        if (msg.getBody() != null) {
            try {
                since = Long.parseLong(msg.getBody());
            } catch (NumberFormatException e) {
                sendError(session, msg.getFrom(), "Invalid timestamp");
                return;
            }
        }

        // Retrieve messages missed while offline.
        for (Message missed : chat.missedMessages(msg.getFrom(), since)) {

            Message syncMessage = new Message(missed.getId(),MessageType.SYNC,missed.getFrom(), missed.getTo(),missed.getBody(),missed.getTimestamp());

            send(session, syncMessage);
        }
    }

    // Saves and delivers a chat message.
    private void handleChat(WebSocketSession session, Message msg)
            throws Exception {

        if (sessions.getSession(msg.getFrom()) != session) {
            sendError(session, msg.getFrom(), "Please JOIN first");
            return;
        }

        if (msg.getId() == null || msg.getTo() == null || msg.getBody() == null) {
            sendError(session, msg.getFrom(),
                    "CHAT requires an ID, recipient and body");
            return;
        }

        // Save the message before delivering it.
        Message saved = chat.saveIfNew(msg);

        if (saved == null) {
            sendError(session, msg.getFrom(), "Duplicate message");
            return;
        }

        // Check whether the recipient is online.
        WebSocketSession recipient = sessions.getSession(saved.getTo());

        if (recipient != null && recipient.isOpen()) {
            send(recipient, saved);
        }

        // Confirm that the server accepted the message.
        send(session, new Message(
                UUID.randomUUID().toString(),MessageType.ACK,"server",msg.getFrom(), msg.getId(), System.currentTimeMillis() ));
    }

    // Creates an ERROR message.
    private void sendError(
            WebSocketSession session, String username, String reason)
            throws Exception {

        send(session, new Message( UUID.randomUUID().toString(),MessageType.ERROR, "server",username,reason,System.currentTimeMillis()));
    }

    // Converts a Message object into JSON and sends it.
    // Catches errors so one closed connection doesn't affect the server.
    private void send(WebSocketSession session, Message msg) {

        try {
            String json = mapper.writeValueAsString(msg);

            synchronized (session) {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(json));
                }
            }

        } catch (Exception e) {
            System.out.println("Could not send message: " + e.getMessage());
        }
    }
    // Removes a user when their connection closes.
    @Override
    public void afterConnectionClosed(
            WebSocketSession session, CloseStatus status) {

        sessions.remove(session);
        metrics.connectionClosed();
    }
}
    
    
