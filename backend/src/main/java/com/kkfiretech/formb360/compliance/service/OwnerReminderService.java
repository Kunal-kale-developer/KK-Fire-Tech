package com.kkfiretech.formb360.compliance.service;

import com.kkfiretech.formb360.compliance.entity.ComplianceBuilding;
import com.kkfiretech.formb360.compliance.entity.Notification;
import com.kkfiretech.formb360.compliance.messaging.OwnerMessenger;
import com.kkfiretech.formb360.compliance.repository.ComplianceBuildingRepository;
import com.kkfiretech.formb360.compliance.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class OwnerReminderService {

    // D30 pe owner ko nahi bhejte, spam na lage
    private static final Set<String> OWNER_STAGES = Set.of("D15", "D7", "D1", "OVERDUE");

    private final NotificationRepository notificationRepository;
    private final ComplianceBuildingRepository buildingRepository;
    private final OwnerMessenger messenger;

    @Transactional
    public int notifyOwners() {
        List<Notification> pending = notificationRepository.findByOwnerNotifiedFalseAndStageIn(OWNER_STAGES);
        int sent = 0;

        for (Notification n : pending) {
            ComplianceBuilding b = buildingRepository.findById(n.getBuildingId()).orElse(null);
            if (b == null) continue;

            String phone = b.getOwnerPhone();
            if (phone == null || phone.isBlank()) {
                n.setOwnerNotified(true); // number hi nahi hai, baar baar try nahi karna
                continue;
            }

            String owner = (b.getOwnerName() == null || b.getOwnerName().isBlank()) ? "Sir/Madam" : b.getOwnerName();
            String text = "Dear " + owner + ", " + n.getMessage()
                    + ". Please contact KK Fire Tech for Form B renewal.";

            if (messenger.send(phone.trim(), text)) {
                n.setOwnerNotified(true);
                sent++;
            }
        }
        log.info("Owner reminders sent: {}", sent);
        return sent;
    }
}