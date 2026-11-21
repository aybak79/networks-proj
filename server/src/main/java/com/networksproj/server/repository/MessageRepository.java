package com.networksproj.server.repository;

import com.networksproj.server.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
}
