package com.kkfiretech.formb360.compliance.service;

import com.kkfiretech.formb360.compliance.entity.Notification;
import com.kkfiretech.formb360.compliance.repository.ComplianceCycleRepository;
import com.kkfiretech.formb360.compliance.repository.DashboardRow;
import com.kkfiretech.formb360.compliance.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReminderService {

    // Due date se itne din pehle reminder banega
    private static final Set<Long> REMIND_DAYS = Set.of(30L, 15L, 7L, 1L);

    private final ComplianceCycleRepository cycleRepository;
    private final NotificationRepository notificationRepository;

    /** Ek org ke liye reminders banata hai. Dobara chalane pe duplicate nahi banta. */
    @Transactional
    public int generateForOrg(Long orgId) {
        LocalDate today = LocalDate.now(CycleService.IST);
        List<DashboardRow> rows = cycleRepository.findCurrentCycleRows(orgId, today);
        int created = 0;

        for (DashboardRow r : rows) {
            long days = ChronoUnit.DAYS.between(today, r.dueDate());
            String stage = stageFor(days);
            if (stage == null) continue;

            Long cycleId = cycleRepository
                    .findByBuildingIdAndYearAndHalf(r.buildingId(), r.year(), r.half())
                    .map(c -> c.getId())
                    .orElse(null);
            if (cycleId == null) continue;

            if (notificationRepository.existsByCycleIdAndStage(cycleId, stage)) continue;

            notificationRepository.save(Notification.builder()
                    .orgId(orgId)
                    .buildingId(r.buildingId())
                    .cycleId(cycleId)
                    .stage(stage)
                    .message(messageFor(r.buildingName(), days))
                    .dueDate(r.dueDate())
                    .seen(false)
                    .build());
            created++;
        }
        log.info("Reminders created for org {}: {}", orgId, created);
        return created;
    }

    private String stageFor(long days) {
        if (days < 0) return "OVERDUE";
        if (REMIND_DAYS.contains(days)) return "D" + days;
        return null;
    }

    private String messageFor(String building, long days) {
        if (days < 0) return building + ": Form B is overdue by " + Math.abs(days) + " days";
        if (days == 1) return building + ": Form B is due tomorrow";
        return building + ": Form B is due in " + days + " days";
    }
}