package com.kkfiretech.formb360.compliance.controller;

import com.kkfiretech.formb360.compliance.dto.NotificationResponse;
import com.kkfiretech.formb360.compliance.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public NotificationResponse.Summary list() {
        return notificationService.list();
    }

    @PostMapping("/{id}/seen")
    public Map<String, Boolean> seen(@PathVariable Long id) {
        notificationService.markSeen(id);
        return Map.of("ok", true);
    }

    @PostMapping("/seen-all")
    public Map<String, Boolean> seenAll() {
        notificationService.markAllSeen();
        return Map.of("ok", true);
    }

    @PostMapping("/check-now")
    public Map<String, Integer> checkNow() {
        return Map.of("created", notificationService.checkNow());
    }
}