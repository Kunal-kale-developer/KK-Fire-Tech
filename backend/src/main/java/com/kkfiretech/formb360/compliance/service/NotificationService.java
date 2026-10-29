package com.kkfiretech.formb360.compliance.service;

import com.kkfiretech.formb360.auth.security.CurrentUser;
import com.kkfiretech.formb360.compliance.dto.NotificationResponse;
import com.kkfiretech.formb360.compliance.entity.Notification;
import com.kkfiretech.formb360.compliance.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final ReminderService reminderService;
    private final CurrentUser currentUser;

    @Transactional(readOnly = true)
    public NotificationResponse.Summary list() {
        Long orgId = currentUser.orgId();
        List<NotificationResponse> items = notificationRepository
                .findByOrgIdOrderByCreatedAtDesc(orgId, PageRequest.of(0, 20))
                .stream().map(NotificationResponse::of).toList();
        return new NotificationResponse.Summary(
                notificationRepository.countByOrgIdAndSeenFalse(orgId), items);
    }

    @Transactional
    public void markSeen(Long id) {
        Notification n = notificationRepository.findByIdAndOrgId(id, currentUser.orgId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));
        n.setSeen(true);
    }

    @Transactional
    public void markAllSeen() {
        notificationRepository.findByOrgIdOrderByCreatedAtDesc(currentUser.orgId(), PageRequest.of(0, 200))
                .forEach(n -> n.setSeen(true));
    }

    /** Test button: reminders abhi turant check karo */
    public int checkNow() {
        return reminderService.generateForOrg(currentUser.orgId());
    }
}