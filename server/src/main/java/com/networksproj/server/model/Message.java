package com.networksproj.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "messages")
public class Message {

    @Id
    private String id;

    @Enumerated(EnumType.STRING)
    private MessageType type;

    @Column(name = "sender")
    private String from;

    @Column(name = "recipient")
    private String to;

    @Column(length = 2000)
    private String body;

    @Column(name = "sent_at")
    private long timestamp;

    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean delivered;

    @Column(name = "is_read", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean read;
    
    public Message(String id, MessageType type, String from, String to, String body, long timestamp) {
        this(id, type, from, to, body, timestamp, false, false);
    }

    
}