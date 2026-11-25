package com.networksproj.server.dto;

/**
 * @param friend
 * @param lastMessage
 * @param lastMessageId
 * @param lastFrom
 * @param timestamp
 * @param unread
 */
public record ConversationSummary(
        String friend,
        String lastMessage,
        String lastMessageId,
        String lastFrom,
        long timestamp,
        int unread) {
}
