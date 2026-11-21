package com.networksproj.server.service;

import com.networksproj.server.dto.ConversationSummary;
import com.networksproj.server.model.Message;
import com.networksproj.server.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
//import java.util.LinkedHashMap;
import java.util.Map;

@Service 
public class ChatService {
    private final MessageRepository repo;
    public ChatService(MessageRepository repo) {this.repo = repo;}

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
        Map<String, ConversationSummary> latest = new LinkedHashMap<>();
        for (Message m : repo.findAllInvolving(user)) {
            String peer = user.equals(m.getFrom()) ? m.getTo() : m.getFrom();
            latest.putIfAbsent(peer, new ConversationSummary(
                    peer, m.getBody(), m.getId(), m.getFrom(), m.getTimestamp()));
        }
        return List.copyOf(latest.values());
    }
}