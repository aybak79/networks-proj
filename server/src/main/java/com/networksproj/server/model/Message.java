package com.networksproj.server.model;

public class Message {
    private String id; 
    private MessageType type;
    private String from;    //sender
    private String to;      //recepient
    private String body;    
    private long timestamp;     //time sent

    public Message(){}
    
    public Message(String id, MessageType type, String from, String to, String body, long timestamp) {
        this.id = id;
        this.type = type;
        this.from = from;
        this.to = to;
        this.body = body;
        this.timestamp = timestamp;
    }

    public String getId() 
        {return id;}
    public void setId(String id)
        {this.id = id;}

    public MessageType getMessageType() 
        {return type;}
    public void setMessageType(MessageType type)
        {this.type = type;}

    public String getFrom() 
        {return from;}
    public void setFrom(String from)
        {this.from = from;}

    public String getTo() 
        {return to;}
    public void setTo(String to)
        {this.to = to;}

    public String getBody() 
        {return body;}
    public void setBody(String body)
        {this.body = body;}

    public long getTimestamp() 
        {return timestamp;}
    public void setTimestamp(long timestamp)
        {this.timestamp = timestamp;}
}
