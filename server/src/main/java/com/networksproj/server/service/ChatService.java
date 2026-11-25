package com.networksproj.server.service;

import com.networksproj.server.dto.ConversationSummary;
import com.networksproj.server.model.Message;
import com.networksproj.server.repository.MessageRepository;
import org.springframework.stereotype.Service;
import com.networksproj.server.repository.UserRepository;

import java.util.LinkedHashMap;
import java.util.List;
//import java.util.LinkedHashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@Service 
public class ChatService {
    private final MessageRepository repo;
    private final UserRepository users;

    public ChatService(MessageRepository repo, UserRepository users) {
        this.repo = repo;
        this.users = users;
    }

    public boolean userExists(String username) {
        return users.existsByUsername(username);
    }

    public Message saveIfNew (Message message){
        if (repo.existsById(message.getId()))
            return null;
        message.setTimestamp(System.currentTimeMillis());
        return repo.save(message);
    }

    public List<Message> missedMessages(String user, long timestamp){
        return repo.findByToAndTimestampGreaterThanOrderByTimestampAsc(user, timestamp);
    }

    public List<Message> history(String user, String peer, long since) {
        return repo.findConversation(user, peer, since);
    }


    public List<ConversationSummary> conversations(String user) {
        Map<String, Message> latest = new LinkedHashMap<>();
        Map<String, Integer> unread = new HashMap<>();

        for (Message m : repo.findAllInvolving(user)) {
            String peer = user.equals(m.getFrom()) ? m.getTo() : m.getFrom();
            latest.putIfAbsent(peer, m);
            if (user.equals(m.getTo()) && !m.isRead()) {
                unread.merge(peer, 1, Integer::sum);
            }
        }

        List<ConversationSummary> result = new ArrayList<>();
        for (Map.Entry<String, Message> e : latest.entrySet()) {
            Message m = e.getValue();
            result.add(new ConversationSummary(e.getKey(), m.getBody(), m.getId(),
                    m.getFrom(), m.getTimestamp(), unread.getOrDefault(e.getKey(), 0)));
        }
        return result;
    }

    public Message markDelivered(String messageId, String receiver) {
        Message m = repo.findById(messageId).orElse(null);
        if (m == null || !receiver.equals(m.getTo())) return null;
        if (!m.isDelivered()) {
            m.setDelivered(true);
            repo.save(m);
        }
        return m;
    }

    public int markRead(String user, String friend) {
        return repo.markRead(user, friend);
    }
}