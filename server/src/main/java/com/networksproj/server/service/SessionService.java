package com.networksproj.server.service;

import org.springframework.web.socket.WebSocketSession;
import java.util.Set;

public interface SessionService {
    public void register(String username, WebSocketSession session);
    public String remove(WebSocketSession session);
    public WebSocketSession getSession(String username);
    public boolean isOnline(String username);
    public Set<String> getOnlineUsers();
}
