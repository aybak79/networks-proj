package com.networksproj.server.security;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;


public final class CurrentUser {

    private CurrentUser() {}

    /**
     * @param principal   the authenticated caller
     * @param claimedUser optional "user" query parameter; if present it must equal the caller
     * @return the caller's username
     */
    public static String resolve(Principal principal, String claimedUser) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        String me = principal.getName();
        if (claimedUser != null && !claimedUser.isBlank() && !claimedUser.equals(me)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only read your own chats");
        }
        return me;
    }
}