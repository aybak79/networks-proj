package com.networksproj.server.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class MetricsService {

    private final AtomicInteger activeConnections = new AtomicInteger(0);
    private final AtomicLong totalConnections = new AtomicLong(0);

    private final AtomicLong totalMessages = new AtomicLong(0);
    private long lastSampleTotal = 0;
    private volatile double messagesPerSecond = 0;
    private volatile double peakMessagesPerSecond = 0;

    private final Instant startedAt = Instant.now();

    public void connectionOpened() {
        activeConnections.incrementAndGet();
        totalConnections.incrementAndGet();
    }

    public void connectionClosed() {
        activeConnections.updateAndGet(c -> Math.max(0, c - 1));
    }

    public void messageProcessed() {
        totalMessages.incrementAndGet();
    }

    @Scheduled(fixedRate = 1000)
    void sampleRate() {
        long now = totalMessages.get();
        messagesPerSecond = now - lastSampleTotal;
        lastSampleTotal = now;
        if (messagesPerSecond > peakMessagesPerSecond) {
            peakMessagesPerSecond = messagesPerSecond;
        }
    }

    public MetricsSnapshot snapshot() {
        return new MetricsSnapshot(
                activeConnections.get(),
                totalConnections.get(),
                totalMessages.get(),
                messagesPerSecond,
                peakMessagesPerSecond,
                java.time.Duration.between(startedAt, Instant.now()).getSeconds());
    }

    public record MetricsSnapshot(
            int activeConnections,
            long totalConnections,
            long totalMessages,
            double messagesPerSecond,
            double peakMessagesPerSecond,
            long uptimeSeconds) {}
}
