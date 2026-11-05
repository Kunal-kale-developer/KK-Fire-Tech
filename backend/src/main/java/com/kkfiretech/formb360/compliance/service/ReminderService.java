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

@Slf4j
@Service
@RequiredArgsConstructor
public class ReminderService {

    private final ComplianceCycleRepository cycleRepository;
    private final NotificationRepository notificationRepository;

    /**
     * Ek org ke liye reminders banata hai.
     * Miss hue reminder bhi bante hain (backend band tha to jab chalu ho tab).
     * Ek building ke liye sirf sabse najdeeki stage banta hai. Duplicate nahi banta.
     */
    @Transactional
    public int generateForOrg(Long orgId) {
        LocalDate today = LocalDate.now(CycleService.IST);
        List<DashboardRow> rows = cycleRepository.findCurrentCycleRows(orgId, today);
        int created = 0;

        for (DashboardRow r : rows) {
            long days = ChronoUnit.DAYS.between(today, r.dueDate());
            String stage = stageFor(days);
            if (stage == null) continue;

            if (r.submittedOn() != null) continue; // Form B submit ho chuka, reminder nahi
            Long cycleId = r.cycleId();

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

    /** Abhi ke bache hue dino ke hisaab se kaunsa stage chal raha hai */
    private String stageFor(long days) {
        if (days < 0) return "OVERDUE";
        if (days <= 1) return "D1";
        if (days <= 7) return "D7";
        if (days <= 15) return "D15";
        if (days <= 29) return "D30";
        return null; // 30+ din: abhi reminder ka time nahi aaya
    }

    private String messageFor(String building, long days) {
        if (days < 0) return building + ": Form B is overdue by " + Math.abs(days) + " days";
        if (days == 0) return building + ": Form B is due today";
        if (days == 1) return building + ": Form B is due tomorrow";
        return building + ": Form B is due in " + days + " days";
    }
}