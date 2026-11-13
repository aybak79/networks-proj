package com.networksproj.server.config;

import com.networksproj.server.handler.RawChatWebSocketHandler;
import com.networksproj.server.security.JwtHandshakeInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class RawWebSocketConfig implements WebSocketConfigurer {

    private final RawChatWebSocketHandler handler;
    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;

    // Spring injects both beans because both classes are marked @Component
    public RawWebSocketConfig(RawChatWebSocketHandler handler,
                              JwtHandshakeInterceptor jwtHandshakeInterceptor) {
        this.handler = handler;
        this.jwtHandshakeInterceptor = jwtHandshakeInterceptor;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(handler, "/ws-raw")
                .addInterceptors(jwtHandshakeInterceptor)
                .setAllowedOriginPatterns("*");
    }
}