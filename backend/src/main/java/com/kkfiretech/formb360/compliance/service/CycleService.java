package com.kkfiretech.formb360.compliance.service;

import com.kkfiretech.formb360.compliance.entity.ComplianceBuilding;
import com.kkfiretech.formb360.compliance.entity.ComplianceCycle;
import com.kkfiretech.formb360.compliance.repository.ComplianceCycleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class CycleService {

    public static final ZoneId IST = ZoneId.of("Asia/Kolkata");

    private final ComplianceCycleRepository cycleRepository;

    /** Chalu half ka cycle banata hai. Pehle se hai toh wahi return karta hai (double nahi banta). */
    @Transactional
    public ComplianceCycle ensureCurrentCycle(ComplianceBuilding building) {
        LocalDate today = LocalDate.now(IST);
        int year = today.getYear();
        short half = (short) (today.getMonthValue() <= 6 ? 1 : 2);

        return cycleRepository.findByBuildingIdAndYearAndHalf(building.getId(), year, half)
                .orElseGet(() -> {
                    LocalDate start = half == 1 ? LocalDate.of(year, 1, 1) : LocalDate.of(year, 7, 1);
                    LocalDate end = half == 1 ? LocalDate.of(year, 6, 30) : LocalDate.of(year, 12, 31);
                    LocalDate due = half == 1 ? LocalDate.of(year, 7, 31) : LocalDate.of(year + 1, 1, 31);

                    return cycleRepository.save(ComplianceCycle.builder()
                            .orgId(building.getOrgId())
                            .buildingId(building.getId())
                            .year(year)
                            .half(half)
                            .periodStart(start)
                            .periodEnd(end)
                            .dueDate(due)
                            .build());
                });
    }
}