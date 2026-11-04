package com.networksproj.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private String id; 
    private MessageType type;
    private String from;    //sender
    private String to;      //recepient
    private String body;    
    private long timestamp;     //time sent
}
