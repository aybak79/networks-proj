package com.networksproj.server.controller;

import com.networksproj.server.dto.AuthRequest;
import com.networksproj.server.dto.AuthResponse;
import com.networksproj.server.model.User;
import com.networksproj.server.repository.UserRepository;
import com.networksproj.server.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest req) {
        if (users.existsByUsername(req.username())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already taken");
        }
        users.save(new User(req.username(), encoder.encode(req.password())));
        return ResponseEntity.ok(new AuthResponse(jwt.generateToken(req.username()), req.username()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest req) {
        Optional<User> user = users.findByUsername(req.username());
        if (user.isEmpty() || !encoder.matches(req.password(), user.get().getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
        return ResponseEntity.ok(new AuthResponse(jwt.generateToken(req.username()), req.username()));
    }
}
