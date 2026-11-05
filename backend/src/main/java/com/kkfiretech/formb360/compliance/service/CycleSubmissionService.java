package com.kkfiretech.formb360.compliance.service;

import com.kkfiretech.formb360.auth.security.CurrentUser;
import com.kkfiretech.formb360.compliance.entity.ComplianceCycle;
import com.kkfiretech.formb360.compliance.repository.ComplianceCycleRepository;
import com.kkfiretech.formb360.compliance.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class CycleSubmissionService {

    private final ComplianceCycleRepository cycleRepository;
    private final NotificationRepository notificationRepository;
    private final CurrentUser currentUser;

    @Transactional
    public void submit(Long cycleId) {
        ComplianceCycle c = find(cycleId);
        c.setSubmittedOn(LocalDate.now(CycleService.IST));
        // Is cycle ke purane reminders hata do
        notificationRepository.deleteByCycleId(cycleId);
    }

    @Transactional
    public void undo(Long cycleId) {
        find(cycleId).setSubmittedOn(null);
    }

    private ComplianceCycle find(Long cycleId) {
        return cycleRepository.findByIdAndOrgId(cycleId, currentUser.orgId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cycle not found"));
    }
}