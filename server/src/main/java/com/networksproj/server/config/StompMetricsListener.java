package com.networksproj.server.config;

import com.networksproj.server.service.MetricsService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;


@Component
public class StompMetricsListener {

    private final MetricsService metrics;

    public StompMetricsListener(MetricsService metrics) {
        this.metrics = metrics;
    }

    @EventListener
    public void onConnect(SessionConnectedEvent event) {
        metrics.connectionOpened();
    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        metrics.connectionClosed();
    }
}