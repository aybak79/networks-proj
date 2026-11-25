package com.networksproj.server.repository;

import com.networksproj.server.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, String> {
    List<Message> findByToAndTimestampGreaterThanOrderByTimestampAsc(String to, long since);
  
    @Query(value = "SELECT * FROM messages "
            + "WHERE ((sender = :a AND recipient = :b) OR (sender = :b AND recipient = :a)) "
            + "AND sent_at > :since "
            + "ORDER BY sent_at ASC, id ASC", nativeQuery = true)
    List<Message> findConversation(@Param("a") String a,
                                   @Param("b") String b,
                                   @Param("since") long since);

    // Every message a user sent or received, newest first (used to build the list of conversations).
    @Query(value = "SELECT * FROM messages "
            + "WHERE sender = :user OR recipient = :user "
            + "ORDER BY sent_at DESC, id DESC", nativeQuery = true)
    List<Message> findAllInvolving(@Param("user") String user);

        // Marks every unread message from friend to user as read (and delivered).
    @Modifying
    @Transactional
    @Query(value = "UPDATE messages SET is_read = TRUE, delivered = TRUE "
            + "WHERE sender = :friend AND recipient = :user AND is_read = FALSE", nativeQuery = true)
    int markRead(@Param("user") String user, @Param("friend") String friend);
}
