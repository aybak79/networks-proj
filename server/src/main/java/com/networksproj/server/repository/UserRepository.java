package com.networksproj.server.repository;

import com.networksproj.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    List<User> findTop20ByUsernameContainingIgnoreCaseAndUsernameNot(String search, String me);
}