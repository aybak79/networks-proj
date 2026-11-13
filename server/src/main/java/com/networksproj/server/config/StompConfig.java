package com.networksproj.server.config;

import com.networksproj.server.service.JwtService;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class StompConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwt;

    // Spring injects JwtService because it is a @Service bean
    public StompConfig(JwtService jwt) {
        this.jwt = jwt;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-stomp")
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }

    // Runs on every frame the client sends; we only act on CONNECT.
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {

                    // The token travels in a STOMP header: Authorization: Bearer <jwt>
                    String header = accessor.getFirstNativeHeader("Authorization");
                    String token = (header != null && header.startsWith("Bearer "))
                            ? header.substring(7) : null;

                    String username = (token == null) ? null : jwt.validateAndGetUsername(token);

                    if (username == null) {
                        // Rejects the connection: the client receives a STOMP ERROR frame
                        throw new MessageDeliveryException("Invalid or missing token");
                    }

                    // This becomes the Principal for the whole session
                    accessor.setUser(() -> username);
                }
                return message;
            }
        });
    }
}