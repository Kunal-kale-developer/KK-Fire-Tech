package com.kkfiretech.formb360.compliance.service;

import com.kkfiretech.formb360.compliance.entity.ComplianceBuilding;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import jakarta.persistence.EntityManager;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReminderScheduler {

    private final ReminderService reminderService;
    private final EntityManager entityManager;

    /** Roz subah 9 baje (IST) */
    @Scheduled(cron = "0 0 9 * * *", zone = "Asia/Kolkata")
    public void daily() {
        runAll();
    }

    /** Backend start hote hi ek baar, taaki 9 baje band hone pe bhi reminder na chhute */
    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        runAll();
    }

    public void runAll() {
        List<Long> orgIds = entityManager
                .createQuery("select distinct b.orgId from ComplianceBuilding b", Long.class)
                .getResultList();
        for (Long orgId : orgIds) {
            reminderService.generateForOrg(orgId);
        }
    }
}