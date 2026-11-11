package com.networksproj.server.model;

public enum MessageType {
    JOIN, //client announces its presence, body =  timestamp of the last message received
    CHAT, //a message sent by the client to the receiver, saved by the server
    ACK, //server confirms that it got the CHAT, body= CHAT id
    SYNC, //server resends any missing messages sent since client was offline
    ERROR //server tells the client that there's a problem, body=reason
}
