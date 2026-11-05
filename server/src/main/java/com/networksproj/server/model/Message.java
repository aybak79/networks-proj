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

    private String body;

    @Column(name = "sent_at")
    private long timestamp;
}