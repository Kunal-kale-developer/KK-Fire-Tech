package com.kkfiretech.formb360.compliance.dto;

import com.kkfiretech.formb360.compliance.entity.Notification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record NotificationResponse(Long id, Long buildingId, String stage, String message,
                                   LocalDate dueDate, boolean seen, LocalDateTime createdAt) {

    public static NotificationResponse of(Notification n) {
        return new NotificationResponse(n.getId(), n.getBuildingId(), n.getStage(),
                n.getMessage(), n.getDueDate(), n.isSeen(), n.getCreatedAt());
    }

    public record Summary(long unread, List<NotificationResponse> items) {
    }
}