package com.networksproj.server.service;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Set;

@Service 
public class InMemorySessionService implements SessionService{

    // Notebook 1: username -> their connection (used to SEND a message to someone)
    private final Map<String, WebSocketSession> usersToSessions = new ConcurrentHashMap<>();

    // Notebook 2: session id -> username (used when a connection CLOSES, to know who it was)
    private final Map<String, String> sessionsToUsers = new ConcurrentHashMap<>();

    @Override
    public void register(String username, WebSocketSession session) {
        WebSocketSession oldSession = usersToSessions.put(username, session);
        if (oldSession != null && !oldSession.getId().equals(session.getId())) {
            sessionsToUsers.remove(oldSession.getId());
        }
        sessionsToUsers.put(session.getId(), username);
    }

    @Override 
    public String remove(WebSocketSession session){
        String user = sessionsToUsers.remove(session.getId());
        if (user==null) return null;
        else{
            usersToSessions.remove(user, session);
        }
        return user;
    }

    @Override 
    public WebSocketSession getSession(String username){
        return usersToSessions.get(username);
    }

    @Override
    public boolean isOnline(String username) {
        WebSocketSession session = getSession(username);
        return session != null && session.isOpen();
    }

    @Override
    public Set<String> getOnlineUsers() {
        return Set.copyOf(usersToSessions.keySet());
    }

}
