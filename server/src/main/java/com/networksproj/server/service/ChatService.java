package com.networksproj.server.service;

import com.networksproj.server.model.Message;
import com.networksproj.server.repository.MessageRepository;
import org.springframework.stereotype.Service;
import java.util.List;

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
}
