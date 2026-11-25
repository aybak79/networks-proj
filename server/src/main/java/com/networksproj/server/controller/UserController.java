package com.networksproj.server.controller;

import com.networksproj.server.model.User;
import com.networksproj.server.repository.UserRepository;
import com.networksproj.server.security.CurrentUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository users;

    public UserController(UserRepository users) {
        this.users = users;
    }

    @GetMapping("/users")
    public List<String> search(Principal principal,
                               @RequestParam(defaultValue = "") String search) {
        String me = CurrentUser.resolve(principal, null);
        return users.findTop20ByUsernameContainingIgnoreCaseAndUsernameNot(search.trim(), me)
                .stream()
                .map(User::getUsername)
                .toList();
    }
}