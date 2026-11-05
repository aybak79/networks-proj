package com.networksproj.server.handler;

import com.networksproj.server.service.MetricsService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class RawChatWebSocketHandler extends TextWebSocketHandler {
    private final MetricsService metrics;

    public RawChatWebSocketHandler(MetricsService metrics) {
        this.metrics = metrics;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println("Connected: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        session.sendMessage(new TextMessage("echo: " + message.getPayload()));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        System.out.println("Closed: " + session.getId());
    }
}